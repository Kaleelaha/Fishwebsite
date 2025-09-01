// Checkout page specific functionality

let checkoutData = null;

// Initialize checkout page
function initCheckoutPage() {
    loadCheckoutData();
    renderCheckoutItems();
    renderCheckoutSummary();
    initCheckoutForm();
}

// Load checkout data from localStorage
function loadCheckoutData() {
    const saved = localStorage.getItem('checkoutData');
    if (saved) {
        checkoutData = JSON.parse(saved);
        
        // Check if data is not too old (24 hours)
        const now = Date.now();
        if (now - checkoutData.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('checkoutData');
            checkoutData = null;
        }
    }
    
    // If no valid checkout data, redirect to cart
    if (!checkoutData || checkoutData.items.length === 0) {
        showToast('No items to checkout. Redirecting to cart...', 'error');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
        return;
    }
}

// Render checkout items
function renderCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (!checkoutItemsContainer || !checkoutData) return;
    
    checkoutItemsContainer.innerHTML = checkoutData.items.map(item => `
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}" class="checkout-item-image" loading="lazy">
            <div class="checkout-item-info">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-details">
                    ${item.quantity} kg × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}
                </div>
            </div>
        </div>
    `).join('');
}

// Render checkout summary
function renderCheckoutSummary() {
    if (!checkoutData) return;
    
    const totalItemsElement = document.getElementById('checkout-total-items');
    const totalWeightElement = document.getElementById('checkout-total-weight');
    const totalAmountElement = document.getElementById('checkout-total-amount');
    
    if (totalItemsElement) {
        totalItemsElement.textContent = checkoutData.totalItems;
    }
    
    if (totalWeightElement) {
        totalWeightElement.textContent = `${checkoutData.totalWeight} kg`;
    }
    
    if (totalAmountElement) {
        totalAmountElement.textContent = formatPrice(checkoutData.total);
    }
}

// Initialize checkout form
function initCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Load saved customer info if available
    loadCustomerInfo();
}

// Load saved customer information
function loadCustomerInfo() {
    const saved = localStorage.getItem('customerInfo');
    if (saved) {
        const info = JSON.parse(saved);
        
        const nameField = document.getElementById('customer-name');
        const phoneField = document.getElementById('customer-phone');
        const addressField = document.getElementById('customer-address');
        
        if (nameField && info.name) nameField.value = info.name;
        if (phoneField && info.phone) phoneField.value = info.phone;
        if (addressField && info.address) addressField.value = info.address;
    }
}

// Save customer information
function saveCustomerInfo(formData) {
    const customerInfo = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!checkoutData) {
        showToast('Checkout data not found', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    const customerInfo = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        deliveryTime: formData.get('deliveryTime'),
        instructions: formData.get('instructions')
    };
    
    // Validate required fields
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate phone number
    if (!/^\d{10}$/.test(customerInfo.phone)) {
        showToast('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    // Save customer info for future use
    saveCustomerInfo(formData);
    
    // Generate WhatsApp message
    const message = generateOrderMessage(customerInfo);
    
    // Send WhatsApp message
    sendWhatsAppMessage(message);
    
    // Clear cart and checkout data
    cartManager.clearCart();
    localStorage.removeItem('checkoutData');
    
    // Show success modal
    showSuccessModal();
}

// Generate order message for WhatsApp
function generateOrderMessage(customerInfo) {
    let message = `🐟 *New Fish Order* 🐟\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerInfo.name}\n`;
    message += `Phone: ${customerInfo.phone}\n`;
    message += `Address: ${customerInfo.address}\n`;
    message += `Preferred Delivery: ${getDeliveryTimeText(customerInfo.deliveryTime)}\n\n`;
    
    message += `*Order Details:*\n`;
    checkoutData.items.forEach(item => {
        message += `${item.name} - ${item.quantity} kg (${formatPrice(item.price * item.quantity)})\n`;
    });
    
    message += `\n*Order Summary:*\n`;
    message += `Total Items: ${checkoutData.totalItems}\n`;
    message += `Total Weight: ${checkoutData.totalWeight} kg\n`;
    message += `*Total Amount: ${formatPrice(checkoutData.total)}*\n`;
    
    if (customerInfo.instructions) {
        message += `\n*Special Instructions:*\n${customerInfo.instructions}\n`;
    }
    
    message += `\nPlease confirm availability and delivery details.`;
    
    return message;
}

// Get delivery time text
function getDeliveryTimeText(timeValue) {
    switch (timeValue) {
        case 'morning':
            return 'Morning (9 AM - 12 PM)';
        case 'afternoon':
            return 'Afternoon (12 PM - 4 PM)';
        case 'evening':
            return 'Evening (4 PM - 8 PM)';
        default:
            return 'Morning (9 AM - 12 PM)';
    }
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeSuccessModal();
        }, 5000);
    }
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
        window.location.href = 'shop.html';
    }
}

// Add loading state to form submission
function addFormLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 3000);
    }
}

// Enhanced form submission with loading state
document.addEventListener('submit', (e) => {
    if (e.target.id === 'checkout-form') {
        addFormLoadingState(e.target);
    }
});

// Add delivery date calculation
function calculateDeliveryDate() {
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
    
    return deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add delivery estimate to checkout page
function addDeliveryEstimateToCheckout() {
    const orderSummary = document.querySelector('.order-summary');
    if (orderSummary && !document.getElementById('checkout-delivery-estimate')) {
        const estimateElement = document.createElement('div');
        estimateElement.id = 'checkout-delivery-estimate';
        estimateElement.style.cssText = `
            background: #e8f4fd;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
            border-left: 4px solid var(--primary-blue);
        `;
        estimateElement.innerHTML = `
            <h4 style="margin: 0 0 8px 0; color: var(--primary-blue); display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-truck"></i> Estimated Delivery
            </h4>
            <p style="margin: 0; color: #666; line-height: 1.5;">
                Your fresh fish will be delivered on <strong>${calculateDeliveryDate()}</strong>
            </p>
        `;
        
        orderSummary.appendChild(estimateElement);
    }
}

// Export functions to global scope
window.closeSuccessModal = closeSuccessModal;

// Initialize checkout page
function initFullCheckoutPage() {
    initCheckoutPage();
    addDeliveryEstimateToCheckout();
    
    // Add form auto-save functionality
    const form = document.getElementById('checkout-form');
    if (form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                // Auto-save form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                localStorage.setItem('checkoutFormData', JSON.stringify(data));
            });
        });
        
        // Load saved form data
        const savedFormData = localStorage.getItem('checkoutFormData');
        if (savedFormData) {
            const data = JSON.parse(savedFormData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFullCheckoutPage);
} else {
    initFullCheckoutPage();
}

// Clean up form data after successful order
window.addEventListener('beforeunload', () => {
    if (checkoutData === null) {
        localStorage.removeItem('checkoutFormData');
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('success-modal');
    if (e.target === modal) {
        closeSuccessModal();
    }
});