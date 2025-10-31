/**
 * SafeNest Enterprise Animations Module
 * Implements advanced animations and micro-interactions for enhanced UX
 */

class EnterpriseAnimations {
  constructor() {
    this.config = {
      enableAnimations: true,
      enableMicroInteractions: true,
      enableScrollAnimations: true,
      enableGestures: true,
      enableParallax: true,
      enableMorphing: true,
      enableParticleEffects: true,
      enableAnimatedTransitions: true,
      reduceMotion: false
    };
    
    this.settings = this.loadSettings();
    this.init();
  }
  
  init() {
    // Apply settings
    this.applySettings();
    
    // Initialize animation systems
    this.setupMicroInteractions();
    this.setupScrollAnimations();
    this.setupGestureAnimations();
    this.setupParallaxEffects();
    this.setupMorphingAnimations();
    this.setupParticleEffects();
    this.setupAnimatedTransitions();
    
    // Initialize animation controllers
    this.initializeAnimationControllers();
    
    console.log('Enterprise Animations initialized');
  }
  
  /**
   * Load saved settings
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('enterprise-animations');
      return saved ? { ...this.config, ...JSON.parse(saved) } : this.config;
    } catch (error) {
      console.error('Failed to load animation settings:', error);
      return this.config;
    }
  }
  
  /**
   * Save settings
   */
  saveSettings() {
    try {
      localStorage.setItem('enterprise-animations', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save animation settings:', error);
    }
  }
  
  /**
   * Apply settings
   */
  applySettings() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.settings.reduceMotion = true;
    }
    
    // Apply reduced motion
    if (this.settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    // Enable/disable animations based on settings
    if (!this.settings.enableAnimations) {
      document.documentElement.classList.add('disable-animations');
    }
  }
  
  /**
   * Setup micro-interactions
   */
  setupMicroInteractions() {
    if (!this.settings.enableMicroInteractions) return;
    
    // Button hover effects
    this.setupButtonMicroInteractions();
    
    // Card hover effects
    this.setupCardMicroInteractions();
    
    // Form field interactions
    this.setupFormMicroInteractions();
    
    // Link hover effects
    this.setupLinkMicroInteractions();
    
    // Progress bar animations
    this.setupProgressBarAnimations();
  }
  
  /**
   * Setup button micro-interactions
   */
  setupButtonMicroInteractions() {
    const buttons = document.querySelectorAll('.enterprise-btn');
    
    buttons.forEach(button => {
      // Ripple effect
      this.addRippleEffect(button);
      
      // Pulse effect on hover
      button.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          button.classList.add('pulse-hover');
        }
      });
      
      button.addEventListener('mouseleave', () => {
        button.classList.remove('pulse-hover');
      });
      
      // Transform on click
      button.addEventListener('mousedown', () => {
        if (!this.settings.reduceMotion) {
          button.style.transform = 'scale(0.95)';
        }
      });
      
      button.addEventListener('mouseup', () => {
        button.style.transform = '';
      });
      
      // Reset transform on mouse leave
      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }
  
  /**
   * Add ripple effect to buttons
   */
  addRippleEffect(button) {
    button.addEventListener('click', function(e) {
      if (this.settings.reduceMotion) return;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }.bind(this));
  }
  
  /**
   * Setup card micro-interactions
   */
  setupCardMicroInteractions() {
    const cards = document.querySelectorAll('.enterprise-card, .enterprise-section-card, .enterprise-device-card');
    
    cards.forEach(card => {
      // Lift effect on hover
      card.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          card.classList.add('lift-hover');
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('lift-hover');
      });
      
      // Shadow pulse on active
      card.addEventListener('mousedown', () => {
        if (!this.settings.reduceMotion) {
          card.classList.add('shadow-pulse');
        }
      });
      
      card.addEventListener('mouseup', () => {
        card.classList.remove('shadow-pulse');
      });
    });
  }
  
  /**
   * Setup form micro-interactions
   */
  setupFormMicroInteractions() {
    const formControls = document.querySelectorAll('.enterprise-form-control');
    
    formControls.forEach(control => {
      // Float label effect
      this.setupFloatingLabel(control);
      
      // Input glow on focus
      control.addEventListener('focus', () => {
        if (!this.settings.reduceMotion) {
          control.classList.add('input-glow');
        }
      });
      
      control.addEventListener('blur', () => {
        control.classList.remove('input-glow');
        
        // Validate on blur
        this.validateField(control);
      });
      
      // Character counter for text inputs
      if (control.tagName === 'TEXTAREA' || control.type === 'text') {
        this.setupCharacterCounter(control);
      }
    });
  }
  
  /**
   * Setup floating label effect
   */
  setupFloatingLabel(control) {
    const label = control.previousElementSibling;
    if (!label || !label.classList.contains('enterprise-form-label')) return;
    
    // Check if input has value
    const updateLabel = () => {
      if (control.value) {
        label.classList.add('float');
      } else {
        label.classList.remove('float');
      }
    };
    
    // Initialize
    updateLabel();
    
    // Update on input
    control.addEventListener('input', updateLabel);
  }
  
  /**
   * Setup character counter
   */
  setupCharacterCounter(control) {
    const maxLength = control.getAttribute('maxlength');
    if (!maxLength) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `0 / ${maxLength}`;
    
    control.parentNode.appendChild(counter);
    
    const updateCounter = () => {
      const length = control.value.length;
      counter.textContent = `${length} / ${maxLength}`;
      
      // Change color when approaching limit
      if (length > maxLength * 0.8) {
        counter.classList.add('warning');
      } else {
        counter.classList.remove('warning');
      }
    };
    
    control.addEventListener('input', updateCounter);
    updateCounter();
  }
  
  /**
   * Setup link micro-interactions
   */
  setupLinkMicroInteractions() {
    const links = document.querySelectorAll('.enterprise-nav-link, .enterprise-footer-link');
    
    links.forEach(link => {
      // Underline animation on hover
      link.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          link.classList.add('underline-animation');
        }
      });
      
      link.addEventListener('mouseleave', () => {
        link.classList.remove('underline-animation');
      });
    });
  }
  
  /**
   * Setup progress bar animations
   */
  setupProgressBarAnimations() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
      // Animate on load
      setTimeout(() => {
        if (!this.settings.reduceMotion) {
          bar.classList.add('animate-progress');
        }
      }, 100);
      
      // Animate on value change
      const observer = new MutationObserver(() => {
        bar.classList.remove('animate-progress');
        void bar.offsetWidth; // Trigger reflow
        bar.classList.add('animate-progress');
      });
      
      observer.observe(bar, { attributes: true, attributeFilter: ['style'] });
    });
  }
  
  /**
   * Setup scroll animations
   */
  setupScrollAnimations() {
    if (!this.settings.enableScrollAnimations) return;
    
    // Setup intersection observer for scroll animations
    this.setupIntersectionObserver();
    
    // Setup scroll-triggered animations
    this.setupScrollTriggeredAnimations();
    
    // Setup parallax scrolling
    this.setupParallaxScrolling();
  }
  
  /**
   * Setup intersection observer for scroll animations
   */
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Add animation class based on data attribute
          const animation = element.getAttribute('data-scroll-animation');
          if (animation && !this.settings.reduceMotion) {
            element.classList.add(`animate-${animation}`);
            
            // Remove observer after animation
            observer.unobserve(element);
          }
        }
      });
    }, options);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[data-scroll-animation]');
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  /**
   * Setup scroll-triggered animations
   */
  setupScrollTriggeredAnimations() {
    // Navbar scroll effect
    const navbar = document.querySelector('.enterprise-navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 50) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
        
        // Parallax effect for navbar
        if (this.settings.enableParallax) {
          navbar.style.transform = `translateY(${scrollTop * 0.1}px)`;
        }
      });
    }
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.enterprise-hero');
    if (heroSection) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrollTop < heroHeight) {
          const yPos = -(scrollTop * 0.5);
          heroSection.style.backgroundPosition = `center ${yPos}px`;
        }
      });
    }
  }
  
  /**
   * Setup parallax scrolling
   */
  setupParallaxScrolling() {
    if (!this.settings.enableParallax) return;
    
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax-speed') || 0.5;
        const yPos = -(scrolled * speed);
        
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
  
  /**
   * Setup gesture animations
   */
  setupGestureAnimations() {
    if (!this.settings.enableGestures) return;
    
    // Setup swipe gestures
    this.setupSwipeAnimations();
    
    // Setup pinch gestures
    this.setupPinchAnimations();
    
    // Setup long press animations
    this.setupLongPressAnimations();
  }
  
  /**
   * Setup swipe animations
   */
  setupSwipeAnimations() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipeAnimation(touchStartX, touchEndX);
    }, { passive: true });
  }
  
  /**
   * Handle swipe animations
   */
  handleSwipeAnimation(startX, endX) {
    const diff = startX - endX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      const swipeElements = document.querySelectorAll('.swipeable');
      
      swipeElements.forEach(element => {
        if (diff > 0) {
          // Swipe left
          element.classList.add('swipe-left');
          setTimeout(() => {
            element.classList.remove('swipe-left');
          }, 600);
        } else {
          // Swipe right
          element.classList.add('swipe-right');
          setTimeout(() => {
            element.classList.remove('swipe-right');
          }, 600);
        }
      });
    }
  }
  
  /**
   * Setup pinch animations
   */
  setupPinchAnimations() {
    let initialDistance = 0;
    let currentScale = 1;
    
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = this.getPinchDistance(e.touches);
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        
        const currentDistance = this.getPinchDistance(e.touches);
        const scale = currentDistance / initialDistance;
        
        this.applyPinchAnimation(scale);
      }
    }, { passive: false });
  }
  
  /**
   * Get pinch distance
   */
  getPinchDistance(touches) {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Apply pinch animation
   */
  applyPinchAnimation(scale) {
    const pinchableElements = document.querySelectorAll('.pinchable');
    
    pinchableElements.forEach(element => {
      element.style.transform = `scale(${scale})`;
    });
  }
  
  /**
   * Setup long press animations
   */
  setupLongPressAnimations() {
    let pressTimer;
    const longPressDelay = 500;
    
    document.addEventListener('touchstart', (e) => {
      pressTimer = setTimeout(() => {
        this.handleLongPressAnimation(e.target);
      }, longPressDelay);
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
    }, { passive: true });
    
    document.addEventListener('touchmove', () => {
      clearTimeout(pressTimer);
    }, { passive: true });
  }
  
  /**
   * Handle long press animation
   */
  handleLongPressAnimation(element) {
    element.classList.add('long-press-active');
    
    setTimeout(() => {
      element.classList.remove('long-press-active');
    }, 1000);
  }
  
  /**
   * Setup morphing animations
   */
  setupMorphingAnimations() {
    if (!this.settings.enableMorphing) return;
    
    // Setup shape morphing
    this.setupShapeMorphing();
    
    // Setup color morphing
    this.setupColorMorphing();
    
    // Setup text morphing
    this.setupTextMorphing();
  }
  
  /**
   * Setup shape morphing
   */
  setupShapeMorphing() {
    const morphElements = document.querySelectorAll('[data-morph-shape]');
    
    morphElements.forEach(element => {
      const targetShape = element.getAttribute('data-morph-shape');
      
      element.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          element.classList.add(`morph-to-${targetShape}`);
        }
      });
      
      element.addEventListener('mouseleave', () => {
        element.classList.remove(`morph-to-${targetShape}`);
      });
    });
  }
  
  /**
   * Setup color morphing
   */
  setupColorMorphing() {
    const colorElements = document.querySelectorAll('[data-morph-color]');
    
    colorElements.forEach(element => {
      const targetColor = element.getAttribute('data-morph-color');
      
      element.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          element.style.transition = 'background-color 0.6s ease';
          element.style.backgroundColor = targetColor;
        }
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.backgroundColor = '';
      });
    });
  }
  
  /**
   * Setup text morphing
   */
  setupTextMorphing() {
    const textElements = document.querySelectorAll('[data-morph-text]');
    
    textElements.forEach(element => {
      const targetText = element.getAttribute('data-morph-text');
      const originalText = element.textContent;
      
      element.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          this.morphText(element, originalText, targetText);
        }
      });
      
      element.addEventListener('mouseleave', () => {
        this.morphText(element, targetText, originalText);
      });
    });
  }
  
  /**
   * Morph text with animation
   */
  morphText(element, fromText, toText) {
    const duration = 600;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Calculate morphed text
      const morphedText = this.interpolateText(fromText, toText, easeProgress);
      element.textContent = morphedText;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * Interpolate between two texts
   */
  interpolateText(text1, text2, progress) {
    const maxLength = Math.max(text1.length, text2.length);
    const result = [];
    
    for (let i = 0; i < maxLength; i++) {
      const char1 = text1[i] || '';
      const char2 = text2[i] || '';
      
      if (char1 === char2) {
        result.push(char1);
      } else if (progress < 0.5) {
        result.push(char1);
      } else {
        result.push(char2);
      }
    }
    
    return result.join('');
  }
  
  /**
   * Setup particle effects
   */
  setupParticleEffects() {
    if (!this.settings.enableParticleEffects) return;
    
    // Setup hover particles
    this.setupHoverParticles();
    
    // Setup click particles
    this.setupClickParticles();
    
    // Setup background particles
    this.setupBackgroundParticles();
  }
  
  /**
   * Setup hover particles
   */
  setupHoverParticles() {
    const hoverElements = document.querySelectorAll('.particle-hover');
    
    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.createParticle(e, element, 'hover');
      });
    });
  }
  
  /**
   * Setup click particles
   */
  setupClickParticles() {
    const clickElements = document.querySelectorAll('.particle-click');
    
    clickElements.forEach(element => {
      element.addEventListener('click', (e) => {
        this.createParticle(e, element, 'click');
      });
    });
  }
  
  /**
   * Setup background particles
   */
  setupBackgroundParticles() {
    const container = document.querySelector('.particle-background');
    if (!container) return;
    
    // Create multiple particles
    for (let i = 0; i < 20; i++) {
      this.createBackgroundParticle(container);
    }
  }
  
  /**
   * Create particle effect
   */
  createParticle(event, element, type) {
    if (this.settings.reduceMotion) return;
    
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const particle = document.createElement('div');
    particle.className = `particle particle-${type}`;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    element.appendChild(particle);
    
    // Animate particle
    setTimeout(() => {
      particle.classList.add('particle-animate');
    }, 10);
    
    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
  
  /**
   * Create background particle
   */
  createBackgroundParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'background-particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation duration
    const duration = Math.random() * 20 + 10;
    particle.style.animationDuration = duration + 's';
    
    container.appendChild(particle);
  }
  
  /**
   * Setup animated transitions
   */
  setupAnimatedTransitions() {
    if (!this.settings.enableAnimatedTransitions) return;
    
    // Setup page transitions
    this.setupPageTransitions();
    
    // Setup modal transitions
    this.setupModalTransitions();
    
    // Setup notification transitions
    this.setupNotificationTransitions();
  }
  
  /**
   * Setup page transitions
   */
  setupPageTransitions() {
    // Add transition to main content
    const mainContent = document.querySelector('.enterprise-main-content');
    if (mainContent) {
      mainContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
    
    // Simulate page transition
    window.addEventListener('beforeunload', () => {
      const mainContent = document.querySelector('.enterprise-main-content');
      if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
      }
    });
  }
  
  /**
   * Setup modal transitions
   */
  setupModalTransitions() {
    const modals = document.querySelectorAll('.enterprise-modal');
    
    modals.forEach(modal => {
      // Setup entrance animation
      modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      // Setup exit animation
      modal.addEventListener('animationend', (e) => {
        if (e.animationName === 'modalExit') {
          modal.style.display = 'none';
        }
      });
    });
  }
  
  /**
   * Setup notification transitions
   */
  setupNotificationTransitions() {
    const notificationContainer = document.getElementById('notification-root');
    if (!notificationContainer) return;
    
    notificationContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }
  
  /**
   * Initialize animation controllers
   */
  initializeAnimationControllers() {
    // Setup animation timeline controller
    this.setupTimelineController();
    
    // Setup animation sequence controller
    this.setupSequenceController();
    
    // Setup animation state controller
    this.setupStateController();
  }
  
  /**
   * Setup timeline controller
   */
  setupTimelineController() {
    const timelineElements = document.querySelectorAll('[data-timeline]');
    
    timelineElements.forEach(element => {
      const timeline = element.getAttribute('data-timeline');
      const delay = element.getAttribute('data-delay') || 0;
      
      // Animate based on timeline
      setTimeout(() => {
        if (!this.settings.reduceMotion) {
          element.classList.add('timeline-animate');
        }
      }, parseInt(delay));
    });
  }
  
  /**
   * Setup sequence controller
   */
  setupSequenceController() {
    const sequenceElements = document.querySelectorAll('[data-sequence]');
    
    sequenceElements.forEach((element, index) => {
      const sequence = element.getAttribute('data-sequence');
      const delay = index * 100; // 100ms delay between elements
      
      // Animate in sequence
      setTimeout(() => {
        if (!this.settings.reduceMotion) {
          element.classList.add('sequence-animate');
        }
      }, delay);
    });
  }
  
  /**
   * Setup state controller
   */
  setupStateController() {
    const stateElements = document.querySelectorAll('[data-state]');
    
    stateElements.forEach(element => {
      const state = element.getAttribute('data-state');
      
      // Animate based on state
      element.addEventListener('stateChange', (e) => {
        if (e.detail.state !== state) return;
        
        if (!this.settings.reduceMotion) {
          element.classList.add('state-animate');
        }
      });
    });
  }
  
  /**
   * Validate form field
   */
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    const pattern = field.pattern;
    
    // Reset classes
    field.classList.remove('input-error', 'input-success');
    
    // Check required
    if (required && !value) {
      field.classList.add('input-error');
      return false;
    }
    
    // Check pattern
    if (pattern && value) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        field.classList.add('input-error');
        return false;
      }
    }
    
    // Check email
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.classList.add('input-error');
        return false;
      }
    }
    
    // Mark as valid
    field.classList.add('input-success');
    return true;
  }
  
  /**
   * Create animation keyframes dynamically
   */
  createKeyframes(name, keyframes) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${name} {
        ${keyframes}
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Create custom animation
   */
  createCustomAnimation(name, duration, timingFunction, keyframes) {
    this.createKeyframes(name, keyframes);
    
    return {
      name,
      duration: `${duration}ms`,
      timingFunction,
      fillMode: 'both'
    };
  }
  
  /**
   * Apply animation to element
   */
  animateElement(element, animation) {
    if (this.settings.reduceMotion) return;
    
    element.style.animation = `${animation.name} ${animation.duration} ${animation.timingFunction} ${animation.fillMode}`;
    
    // Remove animation class when done
    element.addEventListener('animationend', () => {
      element.style.animation = '';
    }, { once: true });
  }
}

// Initialize animations module when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.enterpriseAnimations = new EnterpriseAnimations();
  });
} else {
  window.enterpriseAnimations = new EnterpriseAnimations();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnterpriseAnimations;
}