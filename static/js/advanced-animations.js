/**
 * SafeNest Advanced Animations Module
 * Implements cutting-edge animations and micro-interactions for premium UX
 */

class AdvancedAnimations {
  constructor() {
    this.config = {
      enableAdvancedAnimations: true,
      enablePhysicsAnimations: true,
      enableGestureAnimations: true,
      enableSmartTransitions: true,
      enableMagneticEffects: true,
      enableLiquidAnimations: true,
      enableHolographicEffects: true,
      enableNeuralTransitions: true,
      enableQuantumEffects: true,
      reduceMotion: false
    };
    
    this.settings = this.loadSettings();
    this.animationQueue = [];
    this.isAnimating = false;
    this.init();
  }
  
  init() {
    this.applySettings();
    this.initializeAdvancedSystems();
    this.setupPhysicsAnimations();
    this.setupGestureRecognition();
    this.setupSmartTransitions();
    this.setupMagneticEffects();
    this.setupLiquidAnimations();
    this.setupHolographicEffects();
    this.setupNeuralTransitions();
    this.setupQuantumEffects();
    
    console.log('Advanced Animations initialized');
  }
  
  loadSettings() {
    try {
      const saved = localStorage.getItem('advanced-animations');
      return saved ? { ...this.config, ...JSON.parse(saved) } : this.config;
    } catch (error) {
      console.error('Failed to load advanced animation settings:', error);
      return this.config;
    }
  }
  
  saveSettings() {
    try {
      localStorage.setItem('advanced-animations', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save advanced animation settings:', error);
    }
  }
  
  applySettings() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.settings.reduceMotion = true;
    }
    
    if (this.settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    if (!this.settings.enableAdvancedAnimations) {
      document.documentElement.classList.add('disable-advanced-animations');
    }
  }
  
  initializeAdvancedSystems() {
    // Initialize animation frame manager
    this.animationFrameManager = new AnimationFrameManager();
    
    // Initialize physics engine
    this.physicsEngine = new PhysicsEngine();
    
    // Initialize gesture recognizer
    this.gestureRecognizer = new GestureRecognizer();
    
    // Initialize transition coordinator
    this.transitionCoordinator = new TransitionCoordinator();
  }
  
  setupPhysicsAnimations() {
    if (!this.settings.enablePhysicsAnimations) return;
    
    // Setup spring animations
    this.setupSpringAnimations();
    
    // Setup gravity effects
    this.setupGravityEffects();
    
    // Setup collision detection
    this.setupCollisionDetection();
    
    // Setup momentum animations
    this.setupMomentumAnimations();
  }
  
  setupSpringAnimations() {
    const springElements = document.querySelectorAll('[data-spring]');
    
    springElements.forEach(element => {
      const springConfig = this.parseSpringConfig(element);
      
      element.addEventListener('click', () => {
        if (!this.settings.reduceMotion) {
          this.animateSpring(element, springConfig);
        }
      });
    });
  }
  
  parseSpringConfig(element) {
    const config = element.getAttribute('data-spring');
    if (!config) return { tension: 280, friction: 30 };
    
    try {
      return JSON.parse(config);
    } catch {
      return { tension: 280, friction: 30 };
    }
  }
  
  animateSpring(element, config) {
    const start = element.getBoundingClientRect();
    const target = { x: 0, y: 0, scale: 1 };
    
    // Create spring animation
    const spring = this.physicsEngine.createSpring({
      x: start.left,
      y: start.top,
      scale: 1
    }, target, config);
    
    const animate = () => {
      const position = spring.update();
      
      element.style.transform = `translate(${position.x}px, ${position.y}px) scale(${position.scale})`;
      
      if (!spring.isAtRest()) {
        requestAnimationFrame(animate);
      } else {
        element.style.transform = '';
      }
    };
    
    animate();
  }
  
  setupGravityEffects() {
    const gravityElements = document.querySelectorAll('[data-gravity]');
    
    gravityElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          this.applyGravityEffect(element);
        }
      });
      
      element.addEventListener('mouseleave', () => {
        this.removeGravityEffect(element);
      });
    });
  }
  
  applyGravityEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    element.addEventListener('mousemove', (e) => {
      const deltaX = (e.clientX - centerX) / 20;
      const deltaY = (e.clientY - centerY) / 20;
      
      element.style.transform = `perspective(1000px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg) translateZ(10px)`;
    });
  }
  
  removeGravityEffect(element) {
    element.style.transform = '';
    element.removeEventListener('mousemove');
  }
  
  setupCollisionDetection() {
    const collisionElements = document.querySelectorAll('[data-collision]');
    
    collisionElements.forEach(element => {
      element.dataset.collisionId = `collision-${Math.random().toString(36).substr(2, 9)}`;
    });
    
    // Check for collisions periodically
    setInterval(() => {
      this.checkCollisions();
    }, 100);
  }
  
  checkCollisions() {
    const elements = document.querySelectorAll('[data-collision]');
    
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const elem1 = elements[i];
        const elem2 = elements[j];
        
        if (this.isColliding(elem1, elem2)) {
          this.handleCollision(elem1, elem2);
        }
      }
    }
  }
  
  isColliding(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
  }
  
  handleCollision(elem1, elem2) {
    if (!this.settings.reduceMotion) {
      // Create collision effect
      elem1.classList.add('collision-effect');
      elem2.classList.add('collision-effect');
      
      // Apply bounce effect
      this.animateBounce(elem1);
      this.animateBounce(elem2);
      
      setTimeout(() => {
        elem1.classList.remove('collision-effect');
        elem2.classList.remove('collision-effect');
      }, 600);
    }
  }
  
  animateBounce(element) {
    const keyframes = [
      { transform: 'scale(1)' },
      { transform: 'scale(1.2)' },
      { transform: 'scale(0.9)' },
      { transform: 'scale(1.05)' },
      { transform: 'scale(1)' }
    ];
    
    const animation = element.animate(keyframes, {
      duration: 400,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
  }
  
  setupMomentumAnimations() {
    const momentumElements = document.querySelectorAll('[data-momentum]');
    
    momentumElements.forEach(element => {
      let velocity = { x: 0, y: 0 };
      let position = { x: 0, y: 0 };
      let lastPosition = { x: 0, y: 0 };
      let lastTime = Date.now();
      
      element.addEventListener('mousedown', (e) => {
        const startX = e.clientX;
        const startY = e.clientY;
        
        const handleMouseMove = (e) => {
          const currentTime = Date.now();
          const deltaTime = currentTime - lastTime;
          
          velocity.x = (e.clientX - startX) / deltaTime * 10;
          velocity.y = (e.clientY - startY) / deltaTime * 10;
          
          position.x += velocity.x;
          position.y += velocity.y;
          
          element.style.transform = `translate(${position.x}px, ${position.y}px)`;
          
          lastPosition = { x: e.clientX, y: e.clientY };
          lastTime = currentTime;
        };
        
        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          
          // Apply friction
          this.applyMomentum(element, velocity, position);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      });
    });
  }
  
  applyMomentum(element, velocity, position) {
    const friction = 0.95;
    const threshold = 0.1;
    
    const animate = () => {
      velocity.x *= friction;
      velocity.y *= friction;
      
      position.x += velocity.x;
      position.y += velocity.y;
      
      element.style.transform = `translate(${position.x}px, ${position.y}px)`;
      
      if (Math.abs(velocity.x) > threshold || Math.abs(velocity.y) > threshold) {
        requestAnimationFrame(animate);
      } else {
        element.style.transform = '';
      }
    };
    
    animate();
  }
  
  setupGestureRecognition() {
    if (!this.settings.enableGestureAnimations) return;
    
    // Setup swipe gestures
    this.setupAdvancedSwipeGestures();
    
    // Setup pinch gestures
    this.setupAdvancedPinchGestures();
    
    // Setup rotate gestures
    this.setupAdvancedRotateGestures();
    
    // Setup tap gestures
    this.setupAdvancedTapGestures();
  }
  
  setupAdvancedSwipeGestures() {
    let touchStart = null;
    let touchEnd = null;
    let velocity = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStart = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (touchStart) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        // Calculate swipe velocity
        const deltaX = currentX - touchStart.x;
        const deltaY = currentY - touchStart.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const time = Date.now() - touchStart.time;
        
        velocity = distance / time;
        
        // Apply swipe effect
        this.applySwipeEffect(e.target, deltaX, deltaY);
      }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      if (touchStart && touchEnd) {
        const deltaX = touchEnd.x - touchStart.x;
        const deltaY = touchEnd.y - touchStart.y;
        
        // Detect swipe direction
        if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
          this.handleAdvancedSwipe(e.target, deltaX, deltaY, velocity);
        }
      }
      
      touchStart = null;
      touchEnd = null;
      velocity = 0;
    }, { passive: true });
  }
  
  applySwipeEffect(element, deltaX, deltaY) {
    if (!this.settings.reduceMotion) {
      const intensity = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 100, 1);
      
      element.style.transform = `perspective(1000px) rotateY(${deltaX * 0.1}deg) rotateX(${-deltaY * 0.1}deg) translateZ(${intensity * 20}px)`;
    }
  }
  
  handleAdvancedSwipe(element, deltaX, deltaY, velocity) {
    const swipeThreshold = 0.5;
    const direction = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
    
    if (velocity > swipeThreshold) {
      // Create swipe trail effect
      this.createSwipeTrail(element, deltaX, deltaY);
      
      // Apply swipe animation
      this.animateSwipe(element, direction, deltaX > 0 ? 'right' : 'left');
    }
  }
  
  createSwipeTrail(element, deltaX, deltaY) {
    const trail = document.createElement('div');
    trail.className = 'swipe-trail';
    
    const rect = element.getBoundingClientRect();
    trail.style.left = rect.left + rect.width / 2 + 'px';
    trail.style.top = rect.top + rect.height / 2 + 'px';
    trail.style.width = Math.abs(deltaX) + 'px';
    trail.style.height = Math.abs(deltaY) + 'px';
    
    document.body.appendChild(trail);
    
    // Animate trail
    trail.animate([
      { opacity: 0.6, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(1.5)' }
    ], {
      duration: 600,
      easing: 'ease-out'
    }).onfinish = () => trail.remove();
  }
  
  animateSwipe(element, direction, side) {
    const keyframes = [
      { transform: 'translateX(0) translateY(0) scale(1)' },
      { transform: `translateX(${direction === 'horizontal' ? (side === 'right' ? 100 : -100) : 0}px) translateY(${direction === 'vertical' ? (side === 'down' ? 100 : -100) : 0}px) scale(0.8)` },
      { transform: 'translateX(0) translateY(0) scale(1)' }
    ];
    
    element.animate(keyframes, {
      duration: 600,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
  }
  
  setupAdvancedPinchGestures() {
    let initialDistance = 0;
    let currentScale = 1;
    let centerX = 0;
    let centerY = 0;
    
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = this.getPinchDistance(e.touches);
        centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        
        const currentDistance = this.getPinchDistance(e.touches);
        const scale = currentDistance / initialDistance;
        
        this.applyPinchEffect(e.target, scale, centerX, centerY);
      }
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
      this.removePinchEffect();
    }, { passive: true });
  }
  
  applyPinchEffect(element, scale, centerX, centerY) {
    if (!this.settings.reduceMotion) {
      const rect = element.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const deltaX = (centerX - elementCenterX) * (scale - 1);
      const deltaY = (centerY - elementCenterY) * (scale - 1);
      
      element.style.transform = `scale(${scale}) translate(${deltaX}px, ${deltaY}px)`;
      element.style.transformOrigin = 'center center';
    }
  }
  
  removePinchEffect() {
    const pinchElements = document.querySelectorAll('.pinching');
    pinchElements.forEach(element => {
      element.classList.remove('pinching');
      element.style.transform = '';
    });
  }
  
  setupAdvancedRotateGestures() {
    let startAngle = 0;
    let currentRotation = 0;
    
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        startAngle = this.getRotationAngle(e.touches);
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        
        const currentAngle = this.getRotationAngle(e.touches);
        const rotation = currentAngle - startAngle;
        
        this.applyRotationEffect(e.target, rotation);
      }
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
      this.removeRotationEffect();
    }, { passive: true });
  }
  
  getRotationAngle(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }
  
  applyRotationEffect(element, rotation) {
    if (!this.settings.reduceMotion) {
      element.classList.add('rotating');
      element.style.transform = `rotate(${rotation}deg)`;
    }
  }
  
  removeRotationEffect() {
    const rotatingElements = document.querySelectorAll('.rotating');
    rotatingElements.forEach(element => {
      element.classList.remove('rotating');
      element.style.transform = '';
    });
  }
  
  setupAdvancedTapGestures() {
    let tapTimeout;
    let tapCount = 0;
    let lastTapTime = 0;
    
    document.addEventListener('touchstart', (e) => {
      const currentTime = Date.now();
      
      if (currentTime - lastTapTime < 300) {
        tapCount++;
      } else {
        tapCount = 1;
      }
      
      lastTapTime = currentTime;
      
      clearTimeout(tapTimeout);
      
      tapTimeout = setTimeout(() => {
        this.handleTapGesture(e.target, tapCount);
        tapCount = 0;
      }, 300);
    }, { passive: true });
  }
  
  handleTapGesture(element, tapCount) {
    if (!this.settings.reduceMotion) {
      switch (tapCount) {
        case 1:
          this.animateSingleTap(element);
          break;
        case 2:
          this.animateDoubleTap(element);
          break;
        case 3:
          this.animateTripleTap(element);
          break;
      }
    }
  }
  
  animateSingleTap(element) {
    const ripple = document.createElement('div');
    ripple.className = 'tap-ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = rect.width / 2 - size / 2;
    const y = rect.height / 2 - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    ripple.animate([
      { transform: 'scale(0)', opacity: 1 },
      { transform: 'scale(2)', opacity: 0 }
    ], {
      duration: 600,
      easing: 'ease-out'
    }).onfinish = () => ripple.remove();
  }
  
  animateDoubleTap(element) {
    element.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.2)' },
      { transform: 'scale(1)' }
    ], {
      duration: 200,
      easing: 'ease-in-out'
    });
  }
  
  animateTripleTap(element) {
    const animations = [
      { transform: 'scale(1) rotate(0deg)' },
      { transform: 'scale(1.1) rotate(90deg)' },
      { transform: 'scale(1) rotate(180deg)' },
      { transform: 'scale(1.1) rotate(270deg)' },
      { transform: 'scale(1) rotate(360deg)' }
    ];
    
    element.animate(animations, {
      duration: 800,
      easing: 'ease-in-out'
    });
  }
  
  setupSmartTransitions() {
    if (!this.settings.enableSmartTransitions) return;
    
    // Setup predictive transitions
    this.setupPredictiveTransitions();
    
    // Setup context-aware transitions
    this.setupContextAwareTransitions();
    
    // Setup performance-aware transitions
    this.setupPerformanceAwareTransitions();
  }
  
  setupPredictiveTransitions() {
    const transitionElements = document.querySelectorAll('[data-smart-transition]');
    
    transitionElements.forEach(element => {
      const transitionType = element.getAttribute('data-smart-transition');
      
      element.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          this.predictTransition(element, transitionType);
        }
      });
    });
  }
  
  predictTransition(element, type) {
    const predictions = {
      'slide': () => this.predictSlideTransition(element),
      'fade': () => this.predictFadeTransition(element),
      'scale': () => this.predictScaleTransition(element),
      'rotate': () => this.predictRotateTransition(element),
      'morph': () => this.predictMorphTransition(element)
    };
    
    if (predictions[type]) {
      predictions[type]();
    }
  }
  
  predictSlideTransition(element) {
    const direction = Math.random() > 0.5 ? 'left' : 'right';
    const distance = 50 + Math.random() * 50;
    
    element.style.transform = `translateX(${direction === 'left' ? -distance : distance}px)`;
    
    setTimeout(() => {
      element.style.transform = '';
    }, 1000);
  }
  
  predictFadeTransition(element) {
    element.style.opacity = '0.3';
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, 1000);
  }
  
  predictScaleTransition(element) {
    const scale = 0.8 + Math.random() * 0.4;
    
    element.style.transform = `scale(${scale})`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 1000);
  }
  
  predictRotateTransition(element) {
    const rotation = -45 + Math.random() * 90;
    
    element.style.transform = `rotate(${rotation}deg)`;
    
    setTimeout(() => {
      element.style.transform = 'rotate(0deg)';
    }, 1000);
  }
  
  predictMorphTransition(element) {
    const shapes = ['circle', 'triangle', 'square', 'hexagon'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    element.style.borderRadius = shape === 'circle' ? '50%' : 
                                 shape === 'triangle' ? '0' : 
                                 shape === 'hexagon' ? '30%' : '0';
    
    setTimeout(() => {
      element.style.borderRadius = '';
    }, 1000);
  }
  
  setupContextAwareTransitions() {
    // Setup transitions based on user context
    this.setupDeviceAwareTransitions();
    this.setupTimeAwareTransitions();
    this.setupLocationAwareTransitions();
  }
  
  setupDeviceAwareTransitions() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Apply mobile-specific transitions
      document.querySelectorAll('.mobile-transition').forEach(element => {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    }
  }
  
  setupTimeAwareTransitions() {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    if (isDaytime) {
      // Apply daytime transitions
      document.querySelectorAll('.daytime-transition').forEach(element => {
        element.style.transition = 'all 0.4s ease-in-out';
      });
    } else {
      // Apply nighttime transitions
      document.querySelectorAll('.nighttime-transition').forEach(element => {
        element.style.transition = 'all 0.6s ease-in-out';
      });
    }
  }
  
  setupLocationAwareTransitions() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Apply location-based transitions
        this.applyLocationBasedTransitions(lat, lon);
      });
    }
  }
  
  applyLocationBasedTransitions(lat, lon) {
    // Simple example: different transitions based on hemisphere
    const isNorthernHemisphere = lat > 0;
    
    document.querySelectorAll('.hemisphere-transition').forEach(element => {
      element.style.transition = isNorthernHemisphere ? 
        'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 
        'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  }
  
  setupPerformanceAwareTransitions() {
    // Detect device performance
    const performanceLevel = this.detectPerformanceLevel();
    
    // Apply performance-appropriate transitions
    this.applyPerformanceBasedTransitions(performanceLevel);
  }
  
  detectPerformanceLevel() {
    // Simple performance detection
    const isLowEnd = navigator.hardwareConcurrency < 4 || 
                     navigator.deviceMemory < 4;
    
    return isLowEnd ? 'low' : 'high';
  }
  
  applyPerformanceBasedTransitions(level) {
    if (level === 'low') {
      // Simplified transitions for low-end devices
      document.querySelectorAll('.performance-transition').forEach(element => {
        element.style.transition = 'opacity 0.3s ease';
      });
    } else {
      // Advanced transitions for high-end devices
      document.querySelectorAll('.performance-transition').forEach(element => {
        element.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      });
    }
  }
  
  setupMagneticEffects() {
    if (!this.settings.enableMagneticEffects) return;
    
    // Setup magnetic buttons
    this.setupMagneticButtons();
    
    // Setup magnetic cards
    this.setupMagneticCards();
    
    // Setup magnetic elements
    this.setupMagneticElements();
  }
  
  setupMagneticButtons() {
    const magneticButtons = document.querySelectorAll('[data-magnetic="button"]');
    
    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        if (!this.settings.reduceMotion) {
          this.applyMagneticEffect(button, e, 20);
        }
      });
      
      button.addEventListener('mouseleave', () => {
        this.removeMagneticEffect(button);
      });
    });
  }
  
  setupMagneticCards() {
    const magneticCards = document.querySelectorAll('[data-magnetic="card"]');
    
    magneticCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (!this.settings.reduceMotion) {
          this.applyMagneticEffect(card, e, 30);
        }
      });
      
      card.addEventListener('mouseleave', () => {
        this.removeMagneticEffect(card);
      });
    });
  }
  
  setupMagneticElements() {
    const magneticElements = document.querySelectorAll('[data-magnetic="element"]');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        if (!this.settings.reduceMotion) {
          this.applyMagneticEffect(element, e, 15);
        }
      });
      
      element.addEventListener('mouseleave', () => {
        this.removeMagneticEffect(element);
      });
    });
  }
  
  applyMagneticEffect(element, event, intensity) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (event.clientX - centerX) / intensity;
    const deltaY = (event.clientY - centerY) / intensity;
    
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }
  
  removeMagneticEffect(element) {
    element.style.transform = '';
  }
  
  setupLiquidAnimations() {
    if (!this.settings.enableLiquidAnimations) return;
    
    // Setup liquid buttons
    this.setupLiquidButtons();
    
    // Setup liquid cards
    this.setupLiquidCards();
    
    // Setup liquid backgrounds
    this.setupLiquidBackgrounds();
  }
  
  setupLiquidButtons() {
    const liquidButtons = document.querySelectorAll('[data-liquid="button"]');
    
    liquidButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (!this.settings.reduceMotion) {
          this.createLiquidRipple(button);
        }
      });
    });
  }
  
  createLiquidRipple(button) {
    const ripple = document.createElement('div');
    ripple.className = 'liquid-ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = rect.width / 2 - size / 2;
    const y = rect.height / 2 - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    // Animate liquid ripple
    ripple.animate([
      { transform: 'scale(0)', borderRadius: '50%' },
      { transform: 'scale(2)', borderRadius: '20%' },
      { transform: 'scale(3)', borderRadius: '50%' }
    ], {
      duration: 1000,
      easing: 'ease-out'
    }).onfinish = () => ripple.remove();
  }
  
  setupLiquidCards() {
    const liquidCards = document.querySelectorAll('[data-liquid="card"]');
    
    liquidCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          this.applyLiquidEffect(card);
        }
      });
      
      card.addEventListener('mouseleave', () => {
        this.removeLiquidEffect(card);
      });
    });
  }
  
  applyLiquidEffect(card) {
    card.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(20px)';
    card.style.borderRadius = '20px';
  }
  
  removeLiquidEffect(card) {
    card.style.transform = '';
    card.style.borderRadius = '';
  }
  
  setupLiquidBackgrounds() {
    const liquidBackgrounds = document.querySelectorAll('[data-liquid="background"]');
    
    liquidBackgrounds.forEach(background => {
      this.createLiquidBackground(background);
    });
  }
  
  createLiquidBackground(container) {
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.1';
    
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 20 + 10
      });
    }
    
    // Animate particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 116, 218, 0.5)';
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  setupHolographicEffects() {
    if (!this.settings.enableHolographicEffects) return;
    
    // Setup holographic cards
    this.setupHolographicCards();
    
    // Setup holographic buttons
    this.setupHolographicButtons();
    
    // Setup holographic text
    this.setupHolographicText();
  }
  
  setupHolographicCards() {
    const holographicCards = document.querySelectorAll('[data-holographic="card"]');
    
    holographicCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          this.applyHolographicEffect(card);
        }
      });
      
      card.addEventListener('mouseleave', () => {
        this.removeHolographicEffect(card);
      });
    });
  }
  
  applyHolographicEffect(card) {
    card.style.transform = 'perspective(1000px) rotateY(10deg) rotateX(-10deg) translateZ(30px)';
    card.style.boxShadow = '0 20px 40px rgba(10, 116, 218, 0.5)';
    card.style.border = '2px solid rgba(10, 116, 218, 0.8)';
  }
  
  removeHolographicEffect(card) {
    card.style.transform = '';
    card.style.boxShadow = '';
    card.style.border = '';
  }
  
  setupHolographicButtons() {
    const holographicButtons = document.querySelectorAll('[data-holographic="button"]');
    
    holographicButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (!this.settings.reduceMotion) {
          this.createHolographicPulse(button);
        }
      });
    });
  }
  
  createHolographicPulse(button) {
    const pulse = document.createElement('div');
    pulse.className = 'holographic-pulse';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    pulse.style.width = pulse.style.height = size + 'px';
    pulse.style.left = '50%';
    pulse.style.top = '50%';
    pulse.style.transform = 'translate(-50%, -50%)';
    
    button.appendChild(pulse);
    
    pulse.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(2)', opacity: 0 }
    ], {
      duration: 1000,
      easing: 'ease-out'
    }).onfinish = () => pulse.remove();
  }
  
  setupHolographicText() {
    const holographicText = document.querySelectorAll('[data-holographic="text"]');
    
    holographicText.forEach(text => {
      text.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          this.applyHolographicTextEffect(text);
        }
      });
      
      text.addEventListener('mouseleave', () => {
        this.removeHolographicTextEffect(text);
      });
    });
  }
  
  applyHolographicTextEffect(text) {
    text.style.textShadow = '0 0 10px rgba(10, 116, 218, 0.8), 0 0 20px rgba(10, 116, 218, 0.6), 0 0 30px rgba(10, 116, 218, 0.4)';
    text.style.color = '#F0F6FC';
  }
  
  removeHolographicTextEffect(text) {
    text.style.textShadow = '';
    text.style.color = '';
  }
  
  setupNeuralTransitions() {
    if (!this.settings.enableNeuralTransitions) return;
    
    // Setup neural page transitions
    this.setupNeuralPageTransitions();
    
    // Setup neural element transitions
    this.setupNeuralElementTransitions();
    
    // Setup neural modal transitions
    this.setupNeuralModalTransitions();
  }
  
  setupNeuralPageTransitions() {
    const pageElements = document.querySelectorAll('[data-neural="page"]');
    
    pageElements.forEach(element => {
      element.addEventListener('click', () => {
        if (!this.settings.reduceMotion) {
          this.createNeuralPageTransition(element);
        }
      });
    });
  }
  
  createNeuralPageTransition(element) {
    const overlay = document.createElement('div');
    overlay.className = 'neural-transition-overlay';
    
    document.body.appendChild(overlay);
    
    // Create neural network effect
    this.createNeuralNetworkEffect(overlay);
    
    // Simulate page transition
    setTimeout(() => {
      overlay.remove();
    }, 1000);
  }
  
  createNeuralNetworkEffect(container) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const nodes = [];
    const connections = [];
    
    // Create nodes
    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 2
      });
    }
    
    // Create connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.7) {
          connections.push({ from: i, to: j });
        }
      }
    }
    
    // Animate neural network
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 116, 218, 0.8)';
        ctx.fill();
      });
      
      // Draw connections
      connections.forEach(conn => {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = 'rgba(10, 116, 218, 0.3)';
        ctx.stroke();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  setupNeuralElementTransitions() {
    const neuralElements = document.querySelectorAll('[data-neural="element"]');
    
    neuralElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          this.applyNeuralElementTransition(element);
        }
      });
      
      element.addEventListener('mouseleave', () => {
        this.removeNeuralElementTransition(element);
      });
    });
  }
  
  applyNeuralElementTransition(element) {
    element.style.transform = 'perspective(1000px) rotateY(10deg) rotateX(-10deg) translateZ(20px)';
    element.style.filter = 'blur(0px)';
    element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  }
  
  removeNeuralElementTransition(element) {
    element.style.transform = '';
    element.style.filter = '';
  }
  
  setupNeuralModalTransitions() {
    const neuralModals = document.querySelectorAll('[data-neural="modal"]');
    
    neuralModals.forEach(modal => {
      modal.addEventListener('click', () => {
        if (!this.settings.reduceMotion) {
          this.createNeuralModalTransition(modal);
        }
      });
    });
  }
  
  createNeuralModalTransition(modal) {
    const effect = document.createElement('div');
    effect.className = 'neural-modal-effect';
    
    const rect = modal.getBoundingClientRect();
    effect.style.left = rect.left + 'px';
    effect.style.top = rect.top + 'px';
    effect.style.width = rect.width + 'px';
    effect.style.height = rect.height + 'px';
    
    document.body.appendChild(effect);
    
    // Animate effect
    effect.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(2)', opacity: 0 }
    ], {
      duration: 800,
      easing: 'ease-out'
    }).onfinish = () => effect.remove();
  }
  
  setupQuantumEffects() {
    if (!this.settings.enableQuantumEffects) return;
    
    // Setup quantum hover effects
    this.setupQuantumHoverEffects();
    
    // Setup quantum click effects
    this.setupQuantumClickEffects();
    
    // Setup quantum loading effects
    this.setupQuantumLoadingEffects();
  }
  
  setupQuantumHoverEffects() {
    const quantumElements = document.querySelectorAll('[data-quantum="hover"]');
    
    quantumElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (!this.settings.reduceMotion) {
          this.applyQuantumHoverEffect(element);
        }
      });
      
      element.addEventListener('mouseleave', () => {
        this.removeQuantumHoverEffect(element);
      });
    });
  }
  
  applyQuantumHoverEffect(element) {
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    
    // Create quantum particles
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'quantum-particle';
      
      const size = Math.random() * 10 + 5;
      particle.style.width = particle.style.height = size + 'px';
      particle.style.borderRadius = '50%';
      particle.style.background = `rgba(10, 116, 218, ${Math.random() * 0.5 + 0.5})`;
      particle.style.position = 'absolute';
      particle.style.pointerEvents = 'none';
      
      element.appendChild(particle);
      
      // Animate particle
      const startX = Math.random() * element.offsetWidth;
      const startY = Math.random() * element.offsetHeight;
      const endX = Math.random() * element.offsetWidth;
      const endY = Math.random() * element.offsetHeight;
      
      particle.animate([
        { 
          transform: `translate(${startX}px, ${startY}px) scale(0)`,
          opacity: 0
        },
        { 
          transform: `translate(${startX}px, ${startY}px) scale(1)`,
          opacity: 1
        },
        { 
          transform: `translate(${endX}px, ${endY}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 2000 + Math.random() * 2000,
        easing: 'ease-in-out'
      }).onfinish = () => particle.remove();
    }
  }
  
  removeQuantumHoverEffect(element) {
    const particles = element.querySelectorAll('.quantum-particle');
    particles.forEach(particle => particle.remove());
  }
  
  setupQuantumClickEffects() {
    const quantumElements = document.querySelectorAll('[data-quantum="click"]');
    
    quantumElements.forEach(element => {
      element.addEventListener('click', () => {
        if (!this.settings.reduceMotion) {
          this.createQuantumClickEffect(element);
        }
      });
    });
  }
  
  createQuantumClickEffect(element) {
    const effect = document.createElement('div');
    effect.className = 'quantum-click-effect';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    effect.style.width = effect.style.height = size + 'px';
    effect.style.left = '50%';
    effect.style.top = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    
    element.appendChild(effect);
    
    // Create quantum ripple effect
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'quantum-ripple';
        
        ripple.style.width = ripple.style.height = '0px';
        ripple.style.borderRadius = '50%';
        ripple.style.border = `2px solid rgba(10, 116, 218, ${0.8 - i * 0.2})`;
        ripple.style.position = 'absolute';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        effect.appendChild(ripple);
        
        ripple.animate([
          { 
            width: '0px',
            height: '0px',
            opacity: 0.8 - i * 0.2
          },
          { 
            width: size * 2 + 'px',
            height: size * 2 + 'px',
            opacity: 0
          }
        ], {
          duration: 1000,
          easing: 'ease-out'
        }).onfinish = () => ripple.remove();
      }, i * 200);
    }
    
    setTimeout(() => effect.remove(), 2000);
  }
  
  setupQuantumLoadingEffects() {
    const quantumLoaders = document.querySelectorAll('[data-quantum="loading"]');
    
    quantumLoaders.forEach(loader => {
      this.createQuantumLoader(loader);
    });
  }
  
  createQuantumLoader(loader) {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    canvas.style.width = '100px';
    canvas.style.height = '100px';
    
    loader.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let rotation = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw quantum particles
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + rotation;
        const x = canvas.width / 2 + Math.cos(angle) * 30;
        const y = canvas.height / 2 + Math.sin(angle) * 30;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 116, 218, ${0.8 - i * 0.1})`;
        ctx.fill();
        
        // Draw connections
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(10, 116, 218, ${0.3 - i * 0.05})`;
        ctx.stroke();
      }
      
      rotation += 0.05;
      requestAnimationFrame(animate);
    };
    
    animate();
  }
}

// Helper classes for advanced animations
class AnimationFrameManager {
  constructor() {
    this.frames = [];
    this.isRunning = false;
  }
  
  addFrame(callback) {
    this.frames.push(callback);
    if (!this.isRunning) {
      this.runFrames();
    }
  }
  
  runFrames() {
    this.isRunning = true;
    
    const run = () => {
      this.frames = this.frames.filter(callback => callback());
      
      if (this.frames.length > 0) {
        requestAnimationFrame(run);
      } else {
        this.isRunning = false;
      }
    };
    
    requestAnimationFrame(run);
  }
}

class PhysicsEngine {
  constructor() {
    this.springs = [];
  }
  
  createSpring(start, end, config = { tension: 280, friction: 30 }) {
    const spring = {
      start,
      end,
      config,
      position: { ...start },
      velocity: { x: 0, y: 0 },
      isAtRest: () => false
    };
    
    this.springs.push(spring);
    return spring;
  }
  
  updateSprings() {
    this.springs = this.springs.filter(spring => {
      const { position, velocity, config, end } = spring;
      
      // Calculate spring force
      const dx = end.x - position.x;
      const dy = end.y - position.y;
      
      const forceX = dx * config.tension;
      const forceY = dy * config.tension;
      
      // Update velocity
      velocity.x += forceX;
      velocity.y += forceY;
      
      // Apply friction
      velocity.x *= (1 - config.friction / 100);
      velocity.y *= (1 - config.friction / 100);
      
      // Update position
      position.x += velocity.x;
      position.y += velocity.y;
      
      // Check if at rest
      const isAtRest = Math.abs(velocity.x) < 0.01 && Math.abs(velocity.y) < 0.01;
      spring.isAtRest = () => isAtRest;
      
      return !isAtRest;
    });
  }
}

class GestureRecognizer {
  constructor() {
    this.gestures = [];
    this.touches = [];
  }
  
  addGesture(type, callback) {
    this.gestures.push({ type, callback });
  }
  
  recognize(touches) {
    this.touches = touches;
    
    // Detect gesture types
    const gestures = [];
    
    if (touches.length === 1) {
      gestures.push('tap', 'swipe', 'drag');
    } else if (touches.length === 2) {
      gestures.push('pinch', 'rotate', 'pan');
    }
    
    // Trigger callbacks
    gestures.forEach(gesture => {
      const gestureCallbacks = this.gestures.filter(g => g.type === gesture);
      gestureCallbacks.forEach(callback => callback(touches));
    });
  }
}

class TransitionCoordinator {
  constructor() {
    this.transitions = [];
    this.isTransitioning = false;
  }
  
  addTransition(element, from, to, duration, easing) {
    this.transitions.push({
      element,
      from,
      to,
      duration,
      easing,
      startTime: performance.now()
    });
    
    if (!this.isTransitioning) {
      this.runTransitions();
    }
  }
  
  runTransitions() {
    this.isTransitioning = true;
    
    const run = (currentTime) => {
      const activeTransitions = [];
      
      this.transitions.forEach(transition => {
        const elapsed = currentTime - transition.startTime;
        const progress = Math.min(elapsed / transition.duration, 1);
        
        if (progress < 1) {
          // Apply transition
          const easedProgress = this.ease(progress, transition.easing);
          const interpolated = this.interpolate(transition.from, transition.to, easedProgress);
          
          this.applyProperties(transition.element, interpolated);
          
          activeTransitions.push(transition);
        }
      });
      
      this.transitions = activeTransitions;
      
      if (activeTransitions.length > 0) {
        requestAnimationFrame(run);
      } else {
        this.isTransitioning = false;
      }
    };
    
    requestAnimationFrame(run);
  }
  
  ease(progress, easing) {
    // Implement various easing functions
    switch (easing) {
      case 'linear':
        return progress;
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);
      case 'ease-in-out':
        return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      default:
        return progress;
    }
  }
  
  interpolate(from, to, progress) {
    const result = {};
    
    for (const key in from) {
      if (typeof from[key] === 'number') {
        result[key] = from[key] + (to[key] - from[key]) * progress;
      } else {
        result[key] = progress < 0.5 ? from[key] : to[key];
      }
    }
    
    return result;
  }
  
  applyProperties(element, properties) {
    for (const key in properties) {
      element.style[key] = properties[key];
    }
  }
}

// Initialize advanced animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.advancedAnimations = new AdvancedAnimations();
  });
} else {
  window.advancedAnimations = new AdvancedAnimations();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedAnimations;
}