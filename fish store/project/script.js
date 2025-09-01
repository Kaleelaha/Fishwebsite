// Global variables and utilities
const WHATSAPP_NUMBER = '9629864883';
const EMAIL = 'kaleela276@gmail.com';

// Fish data
const fishData = [
    {
        id: 1,
        name: 'டாம் பரை',
        price: 200,
        image: "public/images'/1.jpg",
        description: 'Premium quality Atlantic salmon, rich in omega-3 fatty acids'
    },
    {
        id: 2,
        name: 'டாம் ஷீலா',
        price: 180,
        image: "public/images'/2.jpg",
        description: 'Fresh red snapper with delicate flavor and firm texture'
    },
    {
        id: 3,
        name: 'கடல் வாவல்',
        price: 500,
        image: "public/images'/3.jpg",
        description: 'Premium king fish, perfect for grilling and frying'
    },
    {
        id: 4,
        name: 'கடல் ஐற',
        price: 250,
        image: "public/images'/4.jpg",
        description: 'Fresh sea bass with mild flavor and flaky texture'
    },
    {
        id: 5,
        name: 'கிழங்கு',
        price:  200,
        image: "public/images'/5.jpg",
        description: 'Premium tuna steaks, perfect for sashimi and grilling'
    },
    {
        id: 6,
        name: 'ஜிலேபி',
        price:  180,
        image: "public/images'/6.jpg",
        description: 'Silver pomfret with sweet taste and tender meat'
    },
    {
        id: 7,
        name: 'ஒரா மீன்',
        price: 450,
        image: "public/images'/7.jpg",
        description: 'Fresh mackerel, rich in healthy fats and protein'
    },
    {
        id: 8,
        name: 'நண்டு',
        price: 400,
        image: "public/images'/8.jpg",
        description: 'Small silver sardines, perfect for frying'
    },
    {
        id: 9,
        name: 'சபட்ட கட்ளா',
        price: 250,
        image: "public/images'/9.jpg",
        description: 'Fresh tiger prawns with sweet and succulent taste'
    },
    {
        id: 10,
        name: 'ஈரல்',
        price: 500,
        image: "public/images'/10.jpg",
        description: 'Fresh mud crab with rich and sweet meat'
    },
    {
        id: 11,
        name: 'நகர மீன்',
        price: 350,
        image: "public/images'/11.jpg",
        description: 'Premium lobster with tender and flavorful meat'
    },
    {
        id: 12,
        name: 'நெய் மீன்',
        price: 400 ,
        image: "public/images'/12.jpg",
        description: 'Fresh squid, perfect for calamari and stir-fry'
    },
    {
        id: 13,
        name: 'ஊளி',
        price: 300,
        image: "public/images'/13.jpg",
        description: 'Fresh octopus with unique texture and taste'
    },
    {
        id: 14,
        name: 'விலை மீன்',
        price: 500,
        image: "public/images'/14.jpg",
        description: 'Fresh mussels, perfect for steaming and soups'
    },
    {
        id: 15,
        name: 'மத்தி',
        price: 200,
        image: "public/images'/15.jpg",
        description: 'Fresh clams with briny flavor and tender meat'
    }
];

// Utility functions
function formatPrice(price) {
    return `₹${price}`;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Cart management
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartCount();
    }
    
    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }
    
    addItem(fishId, quantity = 1) {
        const fish = fishData.find(f => f.id === fishId);
        if (!fish) return false;
        
        const existingItem = this.cart.find(item => item.id === fishId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: fishId,
                name: fish.name,
                price: fish.price,
                image: fish.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        return true;
    }
    
    removeItem(fishId) {
        this.cart = this.cart.filter(item => item.id !== fishId);
        this.saveCart();
    }
    
    updateQuantity(fishId, quantity) {
        const item = this.cart.find(item => item.id === fishId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(fishId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }
    
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    getTotalWeight() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
    }
    
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const count = this.getTotalItems();
        cartCountElements.forEach(element => {
            if (element) {
                element.textContent = count;
                element.style.display = count > 0 ? 'inline' : 'none';
            }
        });
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    document.querySelectorAll('.fish-card, .feature-card, .cart-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// WhatsApp integration
function sendWhatsAppMessage(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Buy now functionality
function buyNow(fishId, quantity = 1) {
    const fish = fishData.find(f => f.id === fishId);
    if (!fish) return;
    
    const message = `Hello! I want to buy ${fish.name} - ${quantity} kg for ${formatPrice(fish.price * quantity)}. Please confirm availability and delivery details.`;
    sendWhatsAppMessage(message);
    showToast('Redirecting to WhatsApp...', 'success');
}

// Add to cart functionality
function addToCart(fishId, quantity = 1) {
    if (cartManager.addItem(fishId, quantity)) {
        const fish = fishData.find(f => f.id === fishId);
        showToast(`${fish.name} added to cart!`, 'success');
    } else {
        showToast('Failed to add item to cart', 'error');
    }
}

// Create fish card HTML
function createFishCard(fish, showActions = true) {
    return `
        <div class="fish-card" data-fish-id="${fish.id}">
            <img src="${fish.image}" alt="${fish.name}" class="fish-image" loading="lazy" onerror="this.src='https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg'">
            <div class="fish-info">
                <h3 class="fish-name">${fish.name}</h3>
                <p class="fish-price">${formatPrice(fish.price)}/kg</p>
                <p class="fish-description">${fish.description}</p>
                ${showActions ? `
                    <div class="fish-actions">
                        <button class="btn-primary" onclick="addToCart(${fish.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn-secondary" onclick="buyNow(${fish.id})">
                            <i class="fab fa-whatsapp"></i>
                            Buy Now
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Initialize page functionality
function initPage() {
    initNavigation();
    initSmoothScrolling();
    
    // Initialize animations after a short delay to ensure DOM is ready
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
    
    // Update cart count on page load
    cartManager.updateCartCount();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}

// Export for use in other files
window.fishData = fishData;
window.cartManager = cartManager;
window.formatPrice = formatPrice;
window.showToast = showToast;
window.sendWhatsAppMessage = sendWhatsAppMessage;
window.buyNow = buyNow;
window.addToCart = addToCart;
window.createFishCard = createFishCard;