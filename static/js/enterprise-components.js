/**
 * SafeNest Enterprise JavaScript Components
 * Professional-grade interactive components and utilities
 */

(function() {
    'use strict';
    
    // Initialize all enterprise components when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeEnterpriseComponents();
        initializeAccessibilityFeatures();
        initializePerformanceMonitoring();
        initializeAnalytics();
    });
    
    /**
     * Initialize all enterprise components
     */
    function initializeEnterpriseComponents() {
        // Initialize mobile menu
        initializeMobileMenu();
        
        // Initialize search functionality
        initializeEnterpriseSearch();
        
        // Initialize theme management
        initializeEnterpriseTheme();
        
        // Initialize dropdown menus
        initializeDropdownMenus();
        
        // Initialize tooltips
        initializeTooltips();
        
        // Initialize modals
        initializeModals();
        
        // Initialize notifications
        initializeEnterpriseNotifications();
        
        // Initialize animations
        initializeEnterpriseAnimations();
        
        // Initialize form enhancements
        initializeEnterpriseForms();
        
        // Initialize charts
        initializeEnterpriseCharts();
        
        // Initialize lazy loading
        initializeLazyLoading();
        
        // Initialize clipboard functionality
        initializeClipboard();
        
        // Initialize keyboard navigation
        initializeKeyboardNavigation();
        
        console.log('SafeNest Enterprise components initialized successfully');
    }
    
    /**
     * Mobile Menu Functionality
     */
    function initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const primaryMenu = document.getElementById('primary-menu');
        
        if (!mobileMenuToggle || !primaryMenu) return;
        
        mobileMenuToggle.addEventListener('click', function() {
            const isOpen = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isOpen);
            
            if (isOpen) {
                primaryMenu.classList.remove('mobile-open');
                primaryMenu.classList.add('mobile-closed');
                // Close all dropdowns in mobile menu
                closeAllDropdowns();
            } else {
                primaryMenu.classList.remove('mobile-closed');
                primaryMenu.classList.add('mobile-open');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && 
                !primaryMenu.contains(event.target) && 
                primaryMenu.classList.contains('mobile-open')) {
                
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                primaryMenu.classList.remove('mobile-open');
                primaryMenu.classList.add('mobile-closed');
                closeAllDropdowns();
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && primaryMenu.classList.contains('mobile-open')) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                primaryMenu.classList.remove('mobile-open');
                primaryMenu.classList.add('mobile-closed');
                closeAllDropdowns();
            }
        });
    }
    
    /**
     * Enterprise Search Functionality
     */
    function initializeEnterpriseSearch() {
        const searchInputs = document.querySelectorAll('.enterprise-search-input');
        const searchButtons = document.querySelectorAll('.enterprise-search-button');
        const searchContainers = document.querySelectorAll('.enterprise-search-container');
        
        searchInputs.forEach((input, index) => {
            // Handle search input focus
            input.addEventListener('focus', function() {
                const container = this.closest('.enterprise-search-container');
                if (container) {
                    container.classList.add('enterprise-search-focused');
                }
            });
            
            // Handle search input blur
            input.addEventListener('blur', function() {
                const container = this.closest('.enterprise-search-container');
                if (container) {
                    container.classList.remove('enterprise-search-focused');
                }
            });
            
            // Handle search on Enter key
            input.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    performSearch(this.value);
                }
            });
            
            // Handle clear button click
            const clearButton = this.nextElementSibling;
            if (clearButton && clearButton.classList.contains('enterprise-search-clear')) {
                clearButton.addEventListener('click', function() {
                    input.value = '';
                    input.focus();
                });
            }
        });
        
        // Handle search button click
        searchButtons.forEach(button => {
            button.addEventListener('click', function() {
                const container = this.closest('.enterprise-search-container');
                const input = container.querySelector('.enterprise-search-input');
                if (input) {
                    performSearch(input.value);
                }
            });
        });
        
        // Perform search function
        function performSearch(query) {
            if (query && query.trim()) {
                // Dispatch custom event for search
                const searchEvent = new CustomEvent('enterpriseSearch', {
                    detail: { query: query.trim() }
                });
                document.dispatchEvent(searchEvent);
                
                // In a real application, this would navigate to search results
                // or perform an AJAX search
                console.log('Enterprise search performed for:', query.trim());
                
                // Show search notification
                showEnterpriseNotification({
                    type: 'info',
                    title: 'Search Initiated',
                    message: `Searching for: ${query.trim()}`,
                    duration: 3000
                });
            }
        }
    }
    
    /**
     * Enhanced Theme Management
     */
    function initializeEnterpriseTheme() {
        const themeToggle = document.querySelector('.enterprise-theme-toggle');
        const html = document.documentElement;
        
        if (!themeToggle) return;
        
        // Load saved theme or detect system preference
        let currentTheme = localStorage.getItem('enterprise-theme');
        
        if (!currentTheme) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            currentTheme = prefersDark ? 'dark' : 'light';
        }
        
        // Apply initial theme
        applyTheme(currentTheme);
        
        // Toggle theme on button click
        themeToggle.addEventListener('click', function() {
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            currentTheme = newTheme;
            
            // Save preference
            localStorage.setItem('enterprise-theme', newTheme);
            
            // Dispatch theme change event
            const themeEvent = new CustomEvent('enterpriseThemeChange', {
                detail: { theme: newTheme }
            });
            document.dispatchEvent(themeEvent);
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('enterprise-theme')) {
                const systemTheme = e.matches ? 'dark' : 'light';
                applyTheme(systemTheme);
                currentTheme = systemTheme;
            }
        });
        
        // Apply theme function
        function applyTheme(theme) {
            html.setAttribute('data-theme', theme);
            
            // Update theme toggle button
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
            }
            themeToggle.setAttribute('aria-pressed', theme === 'light');
            
            // Add transition effect
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        }
    }
    
    /**
     * Enhanced Dropdown Menus
     */
    function initializeDropdownMenus() {
        const dropdownToggles = document.querySelectorAll('.enterprise-nav-dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            // Handle toggle click
            toggle.addEventListener('click', function() {
                const isOpen = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isOpen);
                
                const dropdownMenu = this.nextElementSibling;
                
                if (isOpen) {
                    closeDropdown(dropdownMenu);
                } else {
                    openDropdown(this, dropdownMenu);
                }
            });
            
            // Handle hover on desktop
            if (window.innerWidth >= 1024) {
                let hoverTimeout;
                
                toggle.addEventListener('mouseenter', function() {
                    clearTimeout(hoverTimeout);
                    const isOpen = this.getAttribute('aria-expanded') === 'true';
                    
                    if (!isOpen) {
                        const dropdownMenu = this.nextElementSibling;
                        openDropdown(this, dropdownMenu);
                    }
                });
                
                toggle.addEventListener('mouseleave', function() {
                    hoverTimeout = setTimeout(() => {
                        const isOpen = this.getAttribute('aria-expanded') === 'true';
                        if (isOpen) {
                            const dropdownMenu = this.nextElementSibling;
                            closeDropdown(dropdownMenu);
                        }
                    }, 300);
                });
                
                const dropdownMenu = toggle.nextElementSibling;
                if (dropdownMenu) {
                    dropdownMenu.addEventListener('mouseenter', function() {
                        clearTimeout(hoverTimeout);
                    });
                    
                    dropdownMenu.addEventListener('mouseleave', function() {
                        hoverTimeout = setTimeout(() => {
                            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
                            if (isOpen) {
                                closeDropdown(this);
                            }
                        }, 300);
                    });
                }
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.enterprise-nav-dropdown')) {
                closeAllDropdowns();
            }
        });
        
        // Close dropdowns on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeAllDropdowns();
            }
        });
        
        // Open dropdown function
        function openDropdown(toggle, menu) {
            // Close other dropdowns
            closeAllDropdowns();
            
            // Open current dropdown
            toggle.setAttribute('aria-expanded', 'true');
            menu.classList.add('enterprise-dropdown-open');
            
            // Position dropdown to stay within viewport
            const rect = toggle.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            
            if (rect.left + menuRect.width > window.innerWidth) {
                menu.style.right = '0';
                menu.style.left = 'auto';
            }
        }
        
        // Close dropdown function
        function closeDropdown(menu) {
            const toggle = menu.previousElementSibling;
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
            menu.classList.remove('enterprise-dropdown-open');
        }
        
        // Close all dropdowns
        function closeAllDropdowns() {
            dropdownToggles.forEach(toggle => {
                const isOpen = toggle.getAttribute('aria-expanded') === 'true';
                if (isOpen) {
                    const dropdownMenu = toggle.nextElementSibling;
                    closeDropdown(dropdownMenu);
                }
            });
        }
    }
    
    /**
     * Enhanced Tooltips
     */
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltipText = element.getAttribute('data-tooltip');
            const tooltipPosition = element.getAttribute('data-tooltip-position') || 'top';
            
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = `enterprise-tooltip enterprise-tooltip-${tooltipPosition}`;
            tooltip.textContent = tooltipText;
            tooltip.setAttribute('role', 'tooltip');
            
            // Hide tooltip by default
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            
            // Add to document
            document.body.appendChild(tooltip);
            
            // Show tooltip on hover/focus
            const showTooltip = () => {
                const rect = element.getBoundingClientRect();
                
                // Position tooltip
                switch (tooltipPosition) {
                    case 'top':
                        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                        tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
                        break;
                    case 'bottom':
                        tooltip.style.top = `${rect.bottom + 10}px`;
                        tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
                        break;
                    case 'left':
                        tooltip.style.top = `${rect.top + (rect.height - tooltip.offsetHeight) / 2}px`;
                        tooltip.style.left = `${rect.left - tooltip.offsetWidth - 10}px`;
                        break;
                    case 'right':
                        tooltip.style.top = `${rect.top + (rect.height - tooltip.offsetHeight) / 2}px`;
                        tooltip.style.left = `${rect.right + 10}px`;
                        break;
                }
                
                // Show tooltip
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            };
            
            // Hide tooltip
            const hideTooltip = () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            };
            
            // Add event listeners
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
            element.addEventListener('focus', showTooltip);
            element.addEventListener('blur', hideTooltip);
            
            // Store tooltip reference
            element._tooltip = tooltip;
        });
    }
    
    /**
     * Enhanced Modal System
     */
    function initializeModals() {
        // Handle modal triggers
        const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
        
        modalTriggers.forEach(trigger => {
            const modalId = trigger.getAttribute('data-modal-trigger');
            const modal = document.getElementById(modalId);
            
            if (!modal) return;
            
            // Open modal on trigger click
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(modal);
            });
        });
        
        // Handle modal close buttons
        const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
        
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.enterprise-modal');
                if (modal) {
                    closeModal(modal);
                }
            });
        });
        
        // Close modal on background click
        const modalBackgrounds = document.querySelectorAll('.enterprise-modal-background');
        
        modalBackgrounds.forEach(background => {
            background.addEventListener('click', function() {
                const modal = this.nextElementSibling;
                if (modal) {
                    closeModal(modal);
                }
            });
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const openModals = document.querySelectorAll('.enterprise-modal.active');
                openModals.forEach(modal => {
                    closeModal(modal);
                });
            }
        });
        
        // Open modal function
        function openModal(modal) {
            // Set accessibility attributes
            modal.setAttribute('aria-hidden', 'false');
            modal.setAttribute('aria-modal', 'true');
            
            // Add active class
            modal.classList.add('active');
            
            // Add background overlay
            const background = document.createElement('div');
            background.className = 'enterprise-modal-background';
            modal.parentNode.insertBefore(background, modal);
            
            // Focus management
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
            
            // Dispatch modal open event
            const modalEvent = new CustomEvent('enterpriseModalOpen', {
                detail: { modal: modal }
            });
            document.dispatchEvent(modalEvent);
        }
        
        // Close modal function
        function closeModal(modal) {
            // Set accessibility attributes
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('aria-modal', 'false');
            
            // Remove active class
            modal.classList.remove('active');
            
            // Remove background overlay
            const background = modal.previousElementSibling;
            if (background && background.classList.contains('enterprise-modal-background')) {
                background.remove();
            }
            
            // Dispatch modal close event
            const modalEvent = new CustomEvent('enterpriseModalClose', {
                detail: { modal: modal }
            });
            document.dispatchEvent(modalEvent);
        }
    }
    
    /**
     * Enhanced Notification System
     */
    function initializeEnterpriseNotifications() {
        const notificationContainer = document.getElementById('notification-root');
        
        // Function to show notification
        window.showEnterpriseNotification = function(options) {
            const {
                type = 'info',
                title = '',
                message = '',
                duration = 5000,
                actions = []
            } = options;
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `enterprise-notification enterprise-notification-${type}`;
            notification.setAttribute('role', 'alert');
            notification.setAttribute('aria-live', 'polite');
            
            // Notification header
            const header = document.createElement('div');
            header.className = 'enterprise-notification-header';
            
            const icon = document.createElement('div');
            icon.className = 'enterprise-notification-icon';
            icon.innerHTML = getNotificationIcon(type);
            
            const titleElement = document.createElement('div');
            titleElement.className = 'enterprise-notification-title';
            titleElement.textContent = title;
            
            header.appendChild(icon);
            header.appendChild(titleElement);
            
            // Notification body
            const body = document.createElement('div');
            body.className = 'enterprise-notification-body';
            body.textContent = message;
            
            // Notification actions
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'enterprise-notification-actions';
            
            actions.forEach(action => {
                const button = document.createElement('button');
                button.className = 'enterprise-notification-action';
                button.textContent = action.text;
                button.addEventListener('click', action.onClick);
                actionsContainer.appendChild(button);
            });
            
            // Close button
            const closeButton = document.createElement('button');
            closeButton.className = 'enterprise-notification-close';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            closeButton.setAttribute('aria-label', 'Close notification');
            closeButton.addEventListener('click', () => {
                removeNotification(notification);
            });
            
            // Progress bar
            const progressBar = document.createElement('div');
            progressBar.className = 'enterprise-notification-progress';
            progressBar.style.animation = `notificationProgress ${duration}ms linear forwards`;
            
            // Assemble notification
            notification.appendChild(header);
            notification.appendChild(body);
            notification.appendChild(actionsContainer);
            notification.appendChild(closeButton);
            notification.appendChild(progressBar);
            
            // Add to container
            notificationContainer.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.add('enterprise-notification-active');
            }, 10);
            
            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    removeNotification(notification);
                }, duration);
            }
            
            return notification;
        };
        
        // Function to remove notification
        function removeNotification(notification) {
            notification.classList.remove('enterprise-notification-active');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        
        // Get notification icon
        function getNotificationIcon(type) {
            const icons = {
                info: '<i class="fas fa-info-circle"></i>',
                success: '<i class="fas fa-check-circle"></i>',
                warning: '<i class="fas fa-exclamation-triangle"></i>',
                error: '<i class="fas fa-times-circle"></i>'
            };
            return icons[type] || icons.info;
        }
    }
    
    /**
     * Enhanced Animations
     */
    function initializeEnterpriseAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add animation class based on data attribute
                    const animation = element.getAttribute('data-animation');
                    if (animation) {
                        element.classList.add(`enterprise-animate-${animation}`);
                    }
                    
                    // Unobserve after animation
                    observer.unobserve(element);
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        const animatedElements = document.querySelectorAll('[data-animation]');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        // Add parallax effect
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax-speed') || 0.5;
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -speed;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
    
    /**
     * Enhanced Form Functionality
     */
    function initializeEnterpriseForms() {
        // Enhanced form validation
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // Remove validation class on input
                input.addEventListener('input', function() {
                    this.classList.remove('enterprise-input-error');
                    this.classList.remove('enterprise-input-success');
                });
                
                // Add validation on blur
                input.addEventListener('blur', function() {
                    validateField(this);
                });
            });
            
            // Enhanced form submission
            form.addEventListener('submit', function(event) {
                let isValid = true;
                
                // Validate all fields
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });
                
                if (!isValid) {
                    event.preventDefault();
                    showEnterpriseNotification({
                        type: 'error',
                        title: 'Form Validation Error',
                        message: 'Please correct the errors in the form.',
                        duration: 5000
                    });
                }
            });
        });
        
        // Validate individual field
        function validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            const required = field.hasAttribute('required');
            const pattern = field.pattern;
            
            // Reset classes
            field.classList.remove('enterprise-input-error', 'enterprise-input-success');
            
            // Check required
            if (required && !value) {
                field.classList.add('enterprise-input-error');
                return false;
            }
            
            // Check pattern
            if (pattern && value) {
                const regex = new RegExp(pattern);
                if (!regex.test(value)) {
                    field.classList.add('enterprise-input-error');
                    return false;
                }
            }
            
            // Check email
            if (type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    field.classList.add('enterprise-input-error');
                    return false;
                }
            }
            
            // Check password strength
            if (type === 'password' && value) {
                if (value.length < 8) {
                    field.classList.add('enterprise-input-error');
                    return false;
                }
            }
            
            // Mark as valid
            field.classList.add('enterprise-input-success');
            return true;
        }
    }
    
    /**
     * Enhanced Charts
     */
    function initializeEnterpriseCharts() {
        // Initialize Chart.js if available
        if (typeof Chart !== 'undefined') {
            const chartContainers = document.querySelectorAll('.enterprise-chart-canvas');
            
            chartContainers.forEach(container => {
                const chartType = container.getAttribute('data-chart-type') || 'line';
                const chartData = JSON.parse(container.getAttribute('data-chart-data') || '{}');
                
                // Create chart
                const ctx = container.getContext('2d');
                new Chart(ctx, {
                    type: chartType,
                    data: chartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#8B949E'
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    color: 'rgba(48, 54, 61, 0.8)'
                                },
                                ticks: {
                                    color: '#8B949E'
                                }
                            },
                            y: {
                                grid: {
                                    color: 'rgba(48, 54, 61, 0.8)'
                                },
                                ticks: {
                                    color: '#8B949E'
                                }
                            }
                        }
                    }
                });
            });
        }
    }
    
    /**
     * Lazy Loading
     */
    function initializeLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading support
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            // Fallback for browsers without native lazy loading
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img.lazy');
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    /**
     * Clipboard Functionality
     */
    function initializeClipboard() {
        const clipboardButtons = document.querySelectorAll('[data-clipboard]');
        
        clipboardButtons.forEach(button => {
            button.addEventListener('click', function() {
                const text = this.getAttribute('data-clipboard');
                
                if (navigator.clipboard && window.isSecureContext) {
                    // Modern clipboard API
                    navigator.clipboard.writeText(text).then(() => {
                        showEnterpriseNotification({
                            type: 'success',
                            title: 'Copied to Clipboard',
                            message: 'Text has been copied successfully.',
                            duration: 3000
                        });
                        
                        // Update button temporarily
                        const originalContent = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            this.innerHTML = originalContent;
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        showEnterpriseNotification({
                            type: 'success',
                            title: 'Copied to Clipboard',
                            message: 'Text has been copied successfully.',
                            duration: 3000
                        });
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    }
                    
                    document.body.removeChild(textArea);
                }
            });
        });
    }
    
    /**
     * Keyboard Navigation
     */
    function initializeKeyboardNavigation() {
        // Enhanced tab navigation
        document.addEventListener('keydown', function(event) {
            // Ctrl/Cmd + K to focus search
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                const searchInput = document.querySelector('.enterprise-search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl/Cmd + / to toggle help
            if ((event.ctrlKey || event.metaKey) && event.key === '/') {
                event.preventDefault();
                const helpModal = document.getElementById('help-modal');
                if (helpModal) {
                    openModal(helpModal);
                }
            }
        });
        
        // Focus trap for modals
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('focusin', function(event) {
            const openModals = document.querySelectorAll('.enterprise-modal.active');
            
            openModals.forEach(modal => {
                if (!modal.contains(event.target)) {
                    event.stopPropagation();
                    const firstFocusable = modal.querySelector(focusableElements);
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }
            });
        });
    }
    
    /**
     * Accessibility Features
     */
    function initializeAccessibilityFeatures() {
        // Skip to main content link
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function() {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.focus();
                }
            });
        }
        
        // Announce dynamic content changes for screen readers
        function announceToScreenReader(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
        
        // Expose to global scope
        window.announceToScreenReader = announceToScreenReader;
    }
    
    /**
     * Performance Monitoring
     */
    function initializePerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // Navigation timings
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        console.log('Page load performance:', {
                            dns: entry.domainLookupEnd - entry.domainLookupStart,
                            tcp: entry.connectEnd - entry.connectStart,
                            request: entry.responseEnd - entry.requestStart,
                            dom: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                            load: entry.loadEventEnd - entry.loadEventStart,
                            total: entry.loadEventEnd - entry.startTime
                        });
                    }
                }
            });
            
            perfObserver.observe({ entryTypes: ['navigation'] });
            
            // Resource timings
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 1000) { // Log resources taking longer than 1s
                        console.warn('Slow resource:', {
                            name: entry.name,
                            type: entry.initiatorType,
                            duration: entry.duration,
                            size: entry.transferSize
                        });
                    }
                }
            });
            
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
        
        // Track core web vitals
        if ('PerformanceLongTaskTiming' in window) {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.warn('Long task detected:', {
                        name: entry.name,
                        duration: entry.duration,
                        startTime: entry.startTime
                    });
                }
            }).observe({ entryTypes: ['longtask'] });
        }
    }
    
    /**
     * Analytics
     */
    function initializeAnalytics() {
        // Track page views
        function trackPageView() {
            const pageData = {
                path: window.location.pathname,
                title: document.title,
                timestamp: new Date().toISOString(),
                referrer: document.referrer,
                userAgent: navigator.userAgent
            };
            
            console.log('Page view tracked:', pageData);
            
            // In a real implementation, this would send data to your analytics service
            // sendToAnalytics('page_view', pageData);
        }
        
        // Track click events
        function trackClick(element, category, action, label) {
            const eventData = {
                element: element.tagName.toLowerCase(),
                class: element.className,
                id: element.id,
                category: category,
                action: action,
                label: label,
                timestamp: new Date().toISOString(),
                path: window.location.pathname
            };
            
            console.log('Click tracked:', eventData);
            
            // In a real implementation, this would send data to your analytics service
            // sendToAnalytics('click', eventData);
        }
        
        // Track custom events
        window.trackEnterpriseEvent = function(eventName, eventData = {}) {
            const event = {
                name: eventName,
                data: eventData,
                timestamp: new Date().toISOString(),
                path: window.location.pathname
            };
            
            console.log('Custom event tracked:', event);
            
            // Dispatch custom event for other scripts to listen to
            const customEvent = new CustomEvent('enterpriseEventTracked', {
                detail: event
            });
            document.dispatchEvent(customEvent);
        };
        
        // Initialize tracking
        trackPageView();
        
        // Track all clicks
        document.addEventListener('click', function(event) {
            const element = event.target;
            
            // Track button clicks
            if (element.tagName === 'BUTTON') {
                trackClick(element, 'button', 'click', element.textContent.trim());
            }
            
            // Track link clicks
            if (element.tagName === 'A') {
                trackClick(element, 'link', 'click', element.href);
            }
            
            // Track CTA buttons
            if (element.classList.contains('enterprise-btn-primary')) {
                trackClick(element, 'cta', 'click', element.textContent.trim());
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', function(event) {
            const form = event.target;
            trackClick(form, 'form', 'submit', form.id || 'unknown');
        });
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                if ([25, 50, 75, 90].includes(scrollPercent)) {
                    trackEnterpriseEvent('scroll_depth', {
                        percentage: scrollPercent
                    });
                }
            }
        });
    }
    
    // Export functions to global scope
    window.initializeEnterpriseComponents = initializeEnterpriseComponents;
    window.showEnterpriseNotification = showEnterpriseNotification;
    
})();