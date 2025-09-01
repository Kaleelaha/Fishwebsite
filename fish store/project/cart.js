// Cart page specific functionality

// Initialize cart page
function initCartPage() {
    renderCartItems();
    renderCartSummary();
    
    // Update display every second to handle any external changes
    setInterval(() => {
        renderCartItems();
        renderCartSummary();
    }, 1000);
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return;
    
    if (cartManager.cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    cartItemsContainer.innerHTML = cartManager.cart.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">${formatPrice(item.price)}/kg</p>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="0.1" step="0.1" 
                           onchange="updateQuantityFromInput(${item.id}, this.value)">
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <span class="item-total">${formatPrice(item.price * item.quantity)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render cart summary
function renderCartSummary() {
    const totalItemsElement = document.getElementById('total-items');
    const totalWeightElement = document.getElementById('total-weight');
    const totalAmountElement = document.getElementById('total-amount');
    
    if (totalItemsElement) {
        totalItemsElement.textContent = cartManager.getTotalItems();
    }
    
    if (totalWeightElement) {
        totalWeightElement.textContent = `${cartManager.getTotalWeight()} kg`;
    }
    
    if (totalAmountElement) {
        totalAmountElement.textContent = formatPrice(cartManager.getTotal());
    }
}

// Quantity management functions
function increaseQuantity(itemId) {
    const item = cartManager.cart.find(item => item.id === itemId);
    if (item) {
        cartManager.updateQuantity(itemId, item.quantity + 0.5);
        showToast('Quantity updated', 'success');
        renderCartItems();
        renderCartSummary();
    }
}

function decreaseQuantity(itemId) {
    const item = cartManager.cart.find(item => item.id === itemId);
    if (item) {
        const newQuantity = Math.max(0.5, item.quantity - 0.5);
        cartManager.updateQuantity(itemId, newQuantity);
        showToast('Quantity updated', 'success');
        renderCartItems();
        renderCartSummary();
    }
}

function updateQuantityFromInput(itemId, value) {
    const quantity = parseFloat(value);
    if (quantity > 0) {
        cartManager.updateQuantity(itemId, quantity);
        showToast('Quantity updated', 'success');
        renderCartItems();
        renderCartSummary();
    } else {
        showToast('Please enter a valid quantity', 'error');
        renderCartItems(); // Reset the input to previous value
    }
}

function removeFromCart(itemId) {
    const item = cartManager.cart.find(item => item.id === itemId);
    if (item && confirm(`Remove ${item.name} from cart?`)) {
        cartManager.removeItem(itemId);
        showToast('Item removed from cart', 'success');
        renderCartItems();
        renderCartSummary();
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartManager.cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    // Store cart data for checkout page
    localStorage.setItem('checkoutData', JSON.stringify({
        items: cartManager.cart,
        total: cartManager.getTotal(),
        totalItems: cartManager.getTotalItems(),
        totalWeight: cartManager.getTotalWeight(),
        timestamp: Date.now()
    }));
    
    window.location.href = 'checkout.html';
}

// Clear cart functionality
function clearCart() {
    if (cartManager.cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cartManager.clearCart();
        showToast('Cart cleared', 'success');
        renderCartItems();
        renderCartSummary();
    }
}

// Add clear cart button if it doesn't exist
function addClearCartButton() {
    const cartSummary = document.getElementById('cart-summary');
    if (cartSummary && !document.getElementById('clear-cart-btn')) {
        const clearButton = document.createElement('button');
        clearButton.id = 'clear-cart-btn';
        clearButton.className = 'clear-cart-button';
        clearButton.innerHTML = '<i class="fas fa-trash-alt"></i> Clear Cart';
        clearButton.onclick = clearCart;
        clearButton.style.cssText = `
            width: 100%;
            background: var(--danger);
            color: white;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.3s ease;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        `;
        
        clearButton.addEventListener('mouseenter', () => {
            clearButton.style.background = '#c82333';
        });
        
        clearButton.addEventListener('mouseleave', () => {
            clearButton.style.background = 'var(--danger)';
        });
        
        cartSummary.insertBefore(clearButton, cartSummary.firstChild);
    }
}

// Continue shopping functionality
function continueShopping() {
    window.location.href = 'shop.html';
}

// Save for later functionality (optional enhancement)
function saveForLater() {
    if (cartManager.cart.length === 0) return;
    
    localStorage.setItem('savedForLater', JSON.stringify(cartManager.cart));
    cartManager.clearCart();
    showToast('Items saved for later', 'success');
    renderCartItems();
    renderCartSummary();
}

// Load saved items
function loadSavedItems() {
    const saved = localStorage.getItem('savedForLater');
    if (saved) {
        const items = JSON.parse(saved);
        items.forEach(item => {
            cartManager.addItem(item.id, item.quantity);
        });
        localStorage.removeItem('savedForLater');
        showToast('Saved items added to cart', 'success');
        renderCartItems();
        renderCartSummary();
    }
}

// Estimate delivery time
function estimateDelivery() {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
    
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return deliveryTime.toLocaleDateString('en-IN', options);
}

// Add delivery estimate to cart summary
function addDeliveryEstimate() {
    const cartSummary = document.getElementById('cart-summary');
    if (cartSummary && cartManager.cart.length > 0 && !document.getElementById('delivery-estimate')) {
        const estimateElement = document.createElement('div');
        estimateElement.id = 'delivery-estimate';
        estimateElement.style.cssText = `
            background: #e8f4fd;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            border-left: 4px solid var(--primary-blue);
        `;
        estimateElement.innerHTML = `
            <h4 style="margin: 0 0 8px 0; color: var(--primary-blue); font-size: 14px;">
                <i class="fas fa-truck"></i> Estimated Delivery
            </h4>
            <p style="margin: 0; color: #666; font-size: 13px;">
                ${estimateDelivery()}
            </p>
        `;
        
        cartSummary.insertBefore(estimateElement, cartSummary.lastElementChild);
    }
}

// Initialize cart page with all features
function initFullCartPage() {
    initCartPage();
    addClearCartButton();
    addDeliveryEstimate();
    
    // Check for saved items
    const savedItems = localStorage.getItem('savedForLater');
    if (savedItems) {
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load Saved Items';
        loadButton.onclick = loadSavedItems;
        loadButton.className = 'cta-button';
        loadButton.style.margin = '16px 0';
        
        const emptyCart = document.getElementById('empty-cart');
        if (emptyCart) {
            emptyCart.appendChild(loadButton);
        }
    }
}

// Export functions to global scope
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.updateQuantityFromInput = updateQuantityFromInput;
window.removeFromCart = removeFromCart;
window.proceedToCheckout = proceedToCheckout;
window.clearCart = clearCart;
window.continueShopping = continueShopping;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFullCartPage);
} else {
    initFullCartPage();
}

// Handle page visibility to update cart in real-time
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        renderCartItems();
        renderCartSummary();
    }
});

// Add keyboard shortcuts for cart management
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Delete':
            case 'Backspace':
                e.preventDefault();
                clearCart();
                break;
            case 'Enter':
                e.preventDefault();
                proceedToCheckout();
                break;
        }
    }
});