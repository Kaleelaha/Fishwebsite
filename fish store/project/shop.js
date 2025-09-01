// Shop page specific functionality

let currentSortOrder = 'name';
let filteredFishData = [...fishData];

// Initialize shop page
function initShop() {
    renderFishGrid();
    initFilters();
}

// Render fish grid
function renderFishGrid(fishArray = fishData) {
    const fishGrid = document.getElementById('shop-fish-grid');
    if (!fishGrid) return;
    
    fishGrid.innerHTML = fishArray.map(fish => createFishCard(fish, true)).join('');
    
    // Add staggered animation
    const cards = fishGrid.querySelectorAll('.fish-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
        card.style.opacity = '0';
        card.style.animation = 'slideInUp 0.6s ease-out forwards';
    });
}

// Initialize filters and sorting
function initFilters() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
}

// Handle sort change
function handleSortChange(e) {
    const sortValue = e.target.value;
    let sortedData = [...fishData];
    
    switch (sortValue) {
        case 'name':
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sortedData.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedData.sort((a, b) => b.price - a.price);
            break;
        default:
            break;
    }
    
    renderFishGrid(sortedData);
}

// Add quantity selector for shop items
function addToCartWithQuantity(fishId) {
    // Create a simple prompt for quantity
    const quantity = prompt('Enter quantity (kg):', '1');
    const qty = parseFloat(quantity);
    
    if (qty && qty > 0) {
        addToCart(fishId, qty);
    } else if (quantity !== null) {
        showToast('Please enter a valid quantity', 'error');
    }
}

// Buy now with quantity
function buyNowWithQuantity(fishId) {
    const quantity = prompt('Enter quantity (kg):', '1');
    const qty = parseFloat(quantity);
    
    if (qty && qty > 0) {
        buyNow(fishId, qty);
    } else if (quantity !== null) {
        showToast('Please enter a valid quantity', 'error');
    }
}

// Override the global functions for shop page
window.addToCart = function(fishId, quantity = null) {
    if (quantity === null) {
        addToCartWithQuantity(fishId);
    } else {
        if (cartManager.addItem(fishId, quantity)) {
            const fish = fishData.find(f => f.id === fishId);
            showToast(`${fish.name} (${quantity}kg) added to cart!`, 'success');
        } else {
            showToast('Failed to add item to cart', 'error');
        }
    }
};

window.buyNow = function(fishId, quantity = null) {
    if (quantity === null) {
        buyNowWithQuantity(fishId);
    } else {
        const fish = fishData.find(f => f.id === fishId);
        if (!fish) return;
        
        const message = `Hello! I want to buy ${fish.name} - ${quantity} kg for ${formatPrice(fish.price * quantity)}. Please confirm availability and delivery details.`;
        sendWhatsAppMessage(message);
        showToast('Redirecting to WhatsApp...', 'success');
    }
};

// Initialize search functionality (optional enhancement)
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search fish...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 12px 16px;
        border: 2px solid var(--light-blue);
        border-radius: 8px;
        font-family: inherit;
        width: 250px;
        transition: border-color 0.3s ease;
    `;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = fishData.filter(fish => 
            fish.name.toLowerCase().includes(searchTerm) ||
            fish.description.toLowerCase().includes(searchTerm)
        );
        renderFishGrid(filtered);
    });
    
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = 'var(--primary-blue)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = 'var(--light-blue)';
    });
    
    // Add search input to filters
    const filtersContainer = document.querySelector('.shop-filters');
    if (filtersContainer) {
        const searchGroup = document.createElement('div');
        searchGroup.className = 'filter-group';
        searchGroup.innerHTML = '<label>Search:</label>';
        searchGroup.appendChild(searchInput);
        filtersContainer.appendChild(searchGroup);
    }
}

// Initialize page
function initShopPage() {
    initShop();
    initSearch();
    
    // Add loading animation
    const fishGrid = document.getElementById('shop-fish-grid');
    if (fishGrid) {
        fishGrid.style.opacity = '0';
        fishGrid.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            fishGrid.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fishGrid.style.opacity = '1';
            fishGrid.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShopPage);
} else {
    initShopPage();
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
            e.preventDefault();
            e.target.click();
        }
    }
});

// Add loading state for buttons
function addLoadingState(button, duration = 2000) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, duration);
}

// Enhanced button click handlers
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-primary')) {
        const button = e.target.closest('.btn-primary');
        addLoadingState(button, 1000);
    } else if (e.target.closest('.btn-secondary')) {
        const button = e.target.closest('.btn-secondary');
        addLoadingState(button, 1500);
    }
});