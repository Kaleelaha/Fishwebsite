// Contact page specific functionality

// Initialize contact page
function initContactPage() {
    initContactForm();
    initFAQ();
    initContactAnimations();
}

// Initialize contact form
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleContactFormSubmit);
        
        // Load saved contact info if available
        loadSavedContactInfo();
        
        // Auto-save form data as user types
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', saveContactFormData);
        });
    }
}

// Load saved contact information
function loadSavedContactInfo() {
    const saved = localStorage.getItem('contactFormData');
    if (saved) {
        const data = JSON.parse(saved);
        
        Object.keys(data).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

// Save contact form data
function saveContactFormData() {
    const form = document.getElementById('contact-form');
    if (form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        localStorage.setItem('contactFormData', JSON.stringify(data));
    }
}

// Handle contact form submission
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactInfo = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validate required fields
    if (!contactInfo.name || !contactInfo.phone || !contactInfo.subject || !contactInfo.message) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate phone number
    if (!/^\d{10}$/.test(contactInfo.phone)) {
        showToast('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    // Validate email if provided
    if (contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Generate WhatsApp message
    const message = generateContactMessage(contactInfo);
    
    // Send WhatsApp message
    sendWhatsAppMessage(message);
    
    // Clear form data
    localStorage.removeItem('contactFormData');
    e.target.reset();
    
    // Show success modal
    showContactSuccessModal();
}

// Generate contact message for WhatsApp
function generateContactMessage(contactInfo) {
    let message = `📞 *Contact Form Submission* 📞\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${contactInfo.name}\n`;
    message += `Phone: ${contactInfo.phone}\n`;
    
    if (contactInfo.email) {
        message += `Email: ${contactInfo.email}\n`;
    }
    
    message += `Subject: ${getSubjectText(contactInfo.subject)}\n\n`;
    message += `*Message:*\n${contactInfo.message}\n\n`;
    message += `Please respond at your earliest convenience.`;
    
    return message;
}

// Get subject text
function getSubjectText(subjectValue) {
    const subjects = {
        'inquiry': 'General Inquiry',
        'order': 'Order Related',
        'feedback': 'Feedback',
        'complaint': 'Complaint',
        'other': 'Other'
    };
    
    return subjects[subjectValue] || 'General Inquiry';
}

// Show contact success modal
function showContactSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeModal();
        }, 5000);
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize FAQ functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => toggleFaq(question));
    });
}

// Toggle FAQ items
function toggleFaq(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Initialize contact animations
function initContactAnimations() {
    // Animate contact items on scroll
    const contactItems = document.querySelectorAll('.contact-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, {
        threshold: 0.2
    });
    
    contactItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Animate form on load
    const form = document.querySelector('.contact-form-container');
    if (form) {
        form.style.opacity = '0';
        form.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            form.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 300);
    }
}

// Add click-to-call functionality
function initClickToCall() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', () => {
            showToast('Opening dialer...', 'success');
        });
    });
}

// Add click-to-email functionality
function initClickToEmail() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', () => {
            showToast('Opening email client...', 'success');
        });
    });
}

// Add WhatsApp quick contact
function initWhatsAppQuickContact() {
    const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', () => {
            showToast('Opening WhatsApp...', 'success');
        });
    });
}

// Add form validation enhancements
function enhanceFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Add real-time validation
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(e);
    
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'tel' && value && !/^\d{10}$/.test(value)) {
        showFieldError(field, 'Please enter a valid 10-digit phone number');
        return false;
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: var(--danger);
            font-size: 12px;
            margin-top: 4px;
            animation: fadeIn 0.3s ease;
        `;
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    field.style.borderColor = 'var(--danger)';
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

// Add character counter for textarea
function addCharacterCounter() {
    const textarea = document.getElementById('message');
    if (textarea) {
        const maxLength = 500;
        textarea.setAttribute('maxlength', maxLength);
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        `;
        
        function updateCounter() {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.style.color = remaining < 50 ? 'var(--danger)' : '#666';
        }
        
        textarea.addEventListener('input', updateCounter);
        textarea.parentNode.appendChild(counter);
        updateCounter();
    }
}

// Export functions to global scope
window.toggleFaq = toggleFaq;
window.closeModal = closeModal;

// Initialize full contact page
function initFullContactPage() {
    initContactPage();
    initClickToCall();
    initClickToEmail();
    initWhatsAppQuickContact();
    enhanceFormValidation();
    addCharacterCounter();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFullContactPage);
} else {
    initFullContactPage();
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('success-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
    
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && document.activeElement.closest('form')) {
                e.preventDefault();
                submitButton.click();
            }
        }
    }
});

// Add business hours validation
function checkBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    let isOpen = false;
    
    if (day >= 1 && day <= 6) { // Monday to Saturday
        isOpen = hour >= 6 && hour < 20; // 6 AM to 8 PM
    } else if (day === 0) { // Sunday
        isOpen = hour >= 6 && hour < 18; // 6 AM to 6 PM
    }
    
    const statusElement = document.createElement('div');
    statusElement.className = 'business-status';
    statusElement.style.cssText = `
        background: ${isOpen ? 'var(--success)' : 'var(--warning)'};
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        display: inline-block;
        margin-top: 8px;
    `;
    statusElement.innerHTML = `
        <i class="fas fa-circle" style="font-size: 8px; margin-right: 6px;"></i>
        ${isOpen ? 'Currently Open' : 'Currently Closed'}
    `;
    
    const contactHours = document.querySelector('.contact-hours');
    if (contactHours) {
        contactHours.appendChild(statusElement);
    }
}

// Initialize business hours check
checkBusinessHours();