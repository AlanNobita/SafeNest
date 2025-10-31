/**
 * SafeNest Enterprise Responsive Enhancer
 * Implements advanced responsive behaviors for all device sizes
 */

class EnterpriseResponsive {
  constructor() {
    this.breakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
      wide: 1280,
      ultrawide: 1536
    };
    
    this.currentBreakpoint = this.getCurrentBreakpoint();
    this.previousBreakpoint = null;
    
    this.config = {
      enableAdaptiveLayout: true,
      enableTouchGestures: true,
      enableResponsiveImages: true,
      enableAdaptiveNavigation: true,
      enableResponsiveTypography: true,
      enableAdaptiveGrids: true,
      enableMobileOptimizations: true,
      enableTabletOptimizations: true,
      enableDesktopOptimizations: true
    };
    
    this.init();
  }
  
  init() {
    // Initialize responsive features
    this.setupBreakpointDetection();
    this.setupResponsiveLayouts();
    this.setupTouchGestures();
    this.setupResponsiveImages();
    this.setupAdaptiveNavigation();
    this.setupResponsiveTypography();
    this.setupAdaptiveGrids();
    this.setupDeviceOptimizations();
    
    // Initialize responsive components
    this.initializeResponsiveComponents();
    
    console.log('Enterprise Responsive initialized');
  }
  
  /**
   * Setup breakpoint detection
   */
  setupBreakpointDetection() {
    // Check initial breakpoint
    this.updateBreakpoint();
    
    // Monitor window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateBreakpoint();
      }, 250);
    });
    
    // Monitor orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.updateBreakpoint();
      }, 100);
    });
    
    // Monitor device pixel ratio changes
    window.matchMedia('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)').addEventListener('change', () => {
      this.updateBreakpoint();
    });
  }
  
  /**
   * Update current breakpoint
   */
  updateBreakpoint() {
    this.previousBreakpoint = this.currentBreakpoint;
    this.currentBreakpoint = this.getCurrentBreakpoint();
    
    // Dispatch breakpoint change event
    const event = new CustomEvent('breakpointChange', {
      detail: {
        previous: this.previousBreakpoint,
        current: this.currentBreakpoint
      }
    });
    document.dispatchEvent(event);
    
    // Apply responsive changes
    this.applyResponsiveChanges();
    
    console.log(`Breakpoint changed: ${this.previousBreakpoint} → ${this.currentBreakpoint}`);
  }
  
  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width < this.breakpoints.mobile) return 'mobile';
    if (width < this.breakpoints.tablet) return 'mobile-large';
    if (width < this.breakpoints.desktop) return 'tablet';
    if (width < this.breakpoints.wide) return 'desktop';
    if (width < this.breakpoints.ultrawide) return 'wide';
    return 'ultrawide';
  }
  
  /**
   * Apply responsive changes based on current breakpoint
   */
  applyResponsiveChanges() {
    // Update body class with current breakpoint
    document.body.className = document.body.className.replace(/breakpoint-\w+/g, '');
    document.body.classList.add(`breakpoint-${this.currentBreakpoint}`);
    
    // Apply device-specific optimizations
    if (this.config.enableMobileOptimizations && this.isMobile()) {
      this.applyMobileOptimizations();
    }
    
    if (this.config.enableTabletOptimizations && this.isTablet()) {
      this.applyTabletOptimizations();
    }
    
    if (this.config.enableDesktopOptimizations && this.isDesktop()) {
      this.applyDesktopOptimizations();
    }
    
    // Update viewport meta tag for mobile devices
    this.updateViewportMeta();
  }
  
  /**
   * Setup responsive layouts
   */
  setupResponsiveLayouts() {
    if (!this.config.enableAdaptiveLayout) return;
    
    // Apply responsive classes to containers
    const containers = document.querySelectorAll('.enterprise-container, .dashboard-container');
    containers.forEach(container => {
      container.classList.add(`breakpoint-${this.currentBreakpoint}`);
    });
    
    // Setup responsive grid adjustments
    this.setupResponsiveGrids();
  }
  
  /**
   * Setup responsive grids
   */
  setupResponsiveGrids() {
    const grids = document.querySelectorAll('.enterprise-grid');
    
    grids.forEach(grid => {
      // Adjust grid columns based on breakpoint
      this.adjustGridColumns(grid);
      
      // Adjust gap sizes
      this.adjustGridGaps(grid);
    });
  }
  
  /**
   * Adjust grid columns based on breakpoint
   */
  adjustGridColumns(grid) {
    const columnClasses = {
      mobile: 'grid-cols-1',
      'mobile-large': 'grid-cols-1',
      tablet: 'grid-cols-2',
      desktop: 'grid-cols-3',
      wide: 'grid-cols-4',
      ultrawide: 'grid-cols-4'
    };
    
    // Remove existing column classes
    Object.values(columnClasses).forEach(cls => {
      grid.classList.remove(cls);
    });
    
    // Add appropriate column class
    grid.classList.add(columnClasses[this.currentBreakpoint]);
  }
  
  /**
   * Adjust grid gaps based on breakpoint
   */
  adjustGridGaps(grid) {
    const gapSizes = {
      mobile: 'gap-2',
      'mobile-large': 'gap-3',
      tablet: 'gap-4',
      desktop: 'gap-6',
      wide: 'gap-8',
      ultrawide: 'gap-8'
    };
    
    // Remove existing gap classes
    Object.values(gapSizes).forEach(cls => {
      grid.classList.remove(cls);
    });
    
    // Add appropriate gap class
    grid.classList.add(gapSizes[this.currentBreakpoint]);
  }
  
  /**
   * Setup touch gestures for mobile devices
   */
  setupTouchGestures() {
    if (!this.config.enableTouchGestures) return;
    
    // Only enable on touch devices
    if (!('ontouchstart' in window)) return;
    
    // Setup swipe gestures for navigation
    this.setupSwipeNavigation();
    
    // Setup pull-to-refresh
    this.setupPullToRefresh();
    
    // Setup pinch-to-zoom
    this.setupPinchToZoom();
    
    // Setup long press for context menu
    this.setupLongPress();
  }
  
  /**
   * Setup swipe navigation
   */
  setupSwipeNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }
  
  /**
   * Handle swipe gestures
   */
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next item
        this.dispatchEvent('swipeLeft');
      } else {
        // Swipe right - previous item
        this.dispatchEvent('swipeRight');
      }
    }
  }
  
  /**
   * Setup pull-to-refresh
   */
  setupPullToRefresh() {
    let touchStartY = 0;
    let pullDistance = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].screenY;
        isPulling = true;
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (!isPulling) return;
      
      const touchY = e.touches[0].screenY;
      pullDistance = touchY - touchStartY;
      
      if (pullDistance > 0) {
        // Pull threshold of 100px
        const pullThreshold = 100;
        const progress = Math.min(pullDistance / pullThreshold, 1);
        
        // Visual feedback
        this.showPullToRefresh(progress);
      }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
      if (!isPulling) return;
      
      isPulling = false;
      
      if (pullDistance > 100) {
        // Trigger refresh
        this.triggerRefresh();
      }
      
      // Hide pull indicator
      this.hidePullToRefresh();
      
      pullDistance = 0;
    }, { passive: true });
  }
  
  /**
   * Show pull-to-refresh indicator
   */
  showPullToRefresh(progress) {
    let indicator = document.getElementById('pull-to-refresh');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'pull-to-refresh';
      indicator.className = 'pull-to-refresh-indicator';
      indicator.innerHTML = `
        <div class="pull-icon">
          <i class="fas fa-sync-alt"></i>
        </div>
        <div class="pull-text">Pull to refresh</div>
      `;
      document.body.appendChild(indicator);
    }
    
    // Update progress
    indicator.style.transform = `translateY(${progress * 60}px)`;
    indicator.style.opacity = progress;
    
    // Rotate icon based on progress
    const icon = indicator.querySelector('.pull-icon i');
    icon.style.transform = `rotate(${progress * 360}deg)`;
  }
  
  /**
   * Hide pull-to-refresh indicator
   */
  hidePullToRefresh() {
    const indicator = document.getElementById('pull-to-refresh');
    if (indicator) {
      indicator.style.transform = 'translateY(0)';
      indicator.style.opacity = '0';
    }
  }
  
  /**
   * Trigger refresh action
   */
  triggerRefresh() {
    // Dispatch custom event
    const event = new CustomEvent('pullToRefresh', {
      detail: { timestamp: Date.now() }
    });
    document.dispatchEvent(event);
    
    // Show loading state
    this.showLoadingState();
    
    // Simulate refresh
    setTimeout(() => {
      this.hideLoadingState();
      this.announceToScreenReader('Content refreshed');
    }, 1500);
  }
  
  /**
   * Setup pinch-to-zoom
   */
  setupPinchToZoom() {
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
        
        this.applyPinchZoom(scale);
      }
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
      initialDistance = 0;
    }, { passive: true });
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
   * Apply pinch zoom
   */
  applyPinchZoom(scale) {
    const zoomableElements = document.querySelectorAll('.zoomable');
    
    zoomableElements.forEach(element => {
      element.style.transform = `scale(${scale})`;
    });
  }
  
  /**
   * Setup long press gesture
   */
  setupLongPress() {
    let pressTimer;
    const longPressDelay = 500;
    
    document.addEventListener('touchstart', (e) => {
      pressTimer = setTimeout(() => {
        this.handleLongPress(e.target);
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
   * Handle long press
   */
  handleLongPress(element) {
    // Show context menu for specific elements
    if (element.matches('.device-card, .activity-item')) {
      this.showContextMenu(element, event);
    }
  }
  
  /**
   * Show context menu
   */
  showContextMenu(element, event) {
    // Remove existing context menu
    const existingMenu = document.getElementById('context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }
    
    // Create context menu
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.className = 'context-menu';
    
    // Add menu items based on element type
    if (element.matches('.device-card')) {
      menu.innerHTML = `
        <button class="context-menu-item" data-action="view-details">
          <i class="fas fa-info-circle"></i> View Details
        </button>
        <button class="context-menu-item" data-action="edit">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="context-menu-item" data-action="delete">
          <i class="fas fa-trash"></i> Delete
        </button>
      `;
    } else if (element.matches('.activity-item')) {
      menu.innerHTML = `
        <button class="context-menu-item" data-action="view-details">
          <i class="fas fa-info-circle"></i> View Details
        </button>
        <button class="context-menu-item" data-action="share">
          <i class="fas fa-share"></i> Share
        </button>
        <button class="context-menu-item" data-action="archive">
          <i class="fas fa-archive"></i> Archive
        </button>
      `;
    }
    
    // Position menu
    const touch = event.touches[0];
    menu.style.left = `${touch.clientX}px`;
    menu.style.top = `${touch.clientY}px`;
    
    document.body.appendChild(menu);
    
    // Add event listeners
    menu.querySelectorAll('.context-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        this.handleContextAction(item.dataset.action, element);
        menu.remove();
      });
    });
    
    // Close menu on tap outside
    setTimeout(() => {
      const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('touchstart', closeMenu);
        }
      };
      
      document.addEventListener('touchstart', closeMenu, { once: true });
    }, 100);
  }
  
  /**
   * Handle context menu action
   */
  handleContextAction(action, element) {
    console.log(`Context action: ${action}`, element);
    
    // Dispatch custom event
    const event = new CustomEvent('contextAction', {
      detail: { action, element }
    });
    document.dispatchEvent(event);
    
    // Show notification
    this.showNotification(`Action: ${action}`, 'info');
  }
  
  /**
   * Setup responsive images
   */
  setupResponsiveImages() {
    if (!this.config.enableResponsiveImages) return;
    
    // Setup responsive srcset
    this.setupResponsiveSrcset();
    
    // Setup picture elements
    this.setupPictureElements();
    
    // Setup low-quality image placeholders
    this.setupLQIP();
  }
  
  /**
   * Setup responsive srcset
   */
  setupResponsiveSrcset() {
    const images = document.querySelectorAll('img[data-srcset]');
    
    images.forEach(img => {
      const srcset = img.dataset.srcset;
      if (srcset) {
        img.srcset = srcset;
      }
    });
  }
  
  /**
   * Setup picture elements
   */
  setupPictureElements() {
    const pictures = document.querySelectorAll('picture');
    
    pictures.forEach(picture => {
      // Add responsive source elements if missing
      const sources = picture.querySelectorAll('source');
      
      if (sources.length === 0) {
        const mobileSource = document.createElement('source');
        mobileSource.media = '(max-width: 768px)';
        mobileSource.srcset = '/static/images/mobile-image.jpg';
        
        const desktopSource = document.createElement('source');
        desktopSource.media = '(min-width: 769px)';
        desktopSource.srcset = '/static/images/desktop-image.jpg';
        
        picture.insertBefore(mobileSource, picture.firstChild);
        picture.insertBefore(desktopSource, picture.firstChild);
      }
    });
  }
  
  /**
   * Setup low-quality image placeholders
   */
  setupLQIP() {
    const images = document.querySelectorAll('img[data-lqip]');
    
    images.forEach(img => {
      const lqip = img.dataset.lqip;
      if (lqip) {
        // Set low-quality placeholder
        img.src = lqip;
        
        // Add loading class
        img.classList.add('loading-lqip');
        
        // Load high-quality image
        const highQualityImg = new Image();
        highQualityImg.onload = () => {
          img.src = highQualityImg.src;
          img.classList.remove('loading-lqip');
          img.classList.add('loaded-lqip');
        };
        highQualityImg.src = img.dataset.src || img.src;
      }
    });
  }
  
  /**
   * Setup adaptive navigation
   */
  setupAdaptiveNavigation() {
    if (!this.config.enableAdaptiveNavigation) return;
    
    // Setup mobile menu
    this.setupMobileMenu();
    
    // Setup responsive search
    this.setupResponsiveSearch();
    
    // Setup responsive user menu
    this.setupResponsiveUserMenu();
  }
  
  /**
   * Setup mobile menu
   */
  setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const primaryMenu = document.getElementById('primary-menu');
    
    if (!menuToggle || !primaryMenu) return;
    
    // Toggle menu on click
    menuToggle.addEventListener('click', () => {
      primaryMenu.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', primaryMenu.classList.contains('mobile-open'));
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryMenu.classList.contains('mobile-open')) {
        primaryMenu.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close menu on link click
    const menuLinks = primaryMenu.querySelectorAll('a, button');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        primaryMenu.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  /**
   * Setup responsive search
   */
  setupResponsiveSearch() {
    const searchContainer = document.querySelector('.enterprise-search-container');
    const searchInput = document.querySelector('.enterprise-search-input');
    
    if (!searchContainer || !searchInput) return;
    
    // Adjust search input width based on breakpoint
    this.adjustSearchInput(searchContainer, searchInput);
    
    // Show/hide search based on breakpoint
    this.adjustSearchVisibility(searchContainer);
  }
  
  /**
   * Adjust search input width
   */
  adjustSearchInput(container, input) {
    const inputWidths = {
      mobile: '150px',
      'mobile-large': '180px',
      tablet: '200px',
      desktop: '250px',
      wide: '300px',
      ultrawide: '350px'
    };
    
    input.style.width = inputWidths[this.currentBreakpoint];
    
    // Expand on focus
    input.addEventListener('focus', () => {
      const expandedWidths = {
        mobile: '200px',
        'mobile-large': '220px',
        tablet: '250px',
        desktop: '300px',
        wide: '350px',
        ultrawide: '400px'
      };
      
      input.style.width = expandedWidths[this.currentBreakpoint];
    });
    
    input.addEventListener('blur', () => {
      input.style.width = inputWidths[this.currentBreakpoint];
    });
  }
  
  /**
   * Adjust search visibility
   */
  adjustSearchVisibility(container) {
    if (this.isMobile()) {
      // Move search to bottom sheet on mobile
      if (!container.classList.contains('mobile-bottom-sheet')) {
        const bottomSheet = document.createElement('div');
        bottomSheet.className = 'search-bottom-sheet';
        bottomSheet.innerHTML = `
          <div class="search-header">
            <button class="search-close">
              <i class="fas fa-times"></i>
            </button>
            <h3>Search</h3>
          </div>
          <div class="search-content">
            ${container.innerHTML}
          </div>
        `;
        
        document.body.appendChild(bottomSheet);
        
        // Show bottom sheet on search button click
        const searchButton = document.querySelector('.enterprise-search-button');
        if (searchButton) {
          searchButton.addEventListener('click', () => {
            bottomSheet.classList.add('active');
          });
        }
        
        // Close bottom sheet
        const closeButton = bottomSheet.querySelector('.search-close');
        closeButton.addEventListener('click', () => {
          bottomSheet.classList.remove('active');
        });
      }
    }
  }
  
  /**
   * Setup responsive user menu
   */
  setupResponsiveUserMenu() {
    const userMenu = document.querySelector('.enterprise-user-menu');
    
    if (!userMenu) return;
    
    // Adjust user menu based on breakpoint
    if (this.isMobile()) {
      // Move user menu to bottom navigation
      this.moveToBottomNavigation(userMenu);
    } else {
      // Keep in top navigation
      this.moveToTopNavigation(userMenu);
    }
  }
  
  /**
   * Move element to bottom navigation
   */
  moveToBottomNavigation(element) {
    const bottomNav = document.getElementById('bottom-navigation');
    
    if (!bottomNav) {
      // Create bottom navigation if it doesn't exist
      const nav = document.createElement('nav');
      nav.id = 'bottom-navigation';
      nav.className = 'bottom-navigation';
      nav.innerHTML = `
        <div class="bottom-nav-container">
          ${element.outerHTML}
        </div>
      `;
      
      document.body.appendChild(nav);
    } else {
      bottomNav.querySelector('.bottom-nav-container').appendChild(element);
    }
  }
  
  /**
   * Move element to top navigation
   */
  moveToTopNavigation(element) {
    const topNav = document.querySelector('.enterprise-nav-actions');
    
    if (topNav) {
      topNav.appendChild(element);
    }
  }
  
  /**
   * Setup responsive typography
   */
  setupResponsiveTypography() {
    if (!this.config.enableResponsiveTypography) return;
    
    // Adjust font sizes based on breakpoint
    this.adjustFontSizes();
    
    // Adjust line heights
    this.adjustLineHeights();
    
    // Adjust letter spacing
    this.adjustLetterSpacing();
  }
  
  /**
   * Adjust font sizes based on breakpoint
   */
  adjustFontSizes() {
    const fontSizes = {
      '.enterprise-heading-1': {
        mobile: '1.75rem',
        'mobile-large': '2rem',
        tablet: '2.5rem',
        desktop: '3rem',
        wide: '3.5rem',
        ultrawide: '4rem'
      },
      '.enterprise-heading-2': {
        mobile: '1.5rem',
        'mobile-large': '1.75rem',
        tablet: '2rem',
        desktop: '2.5rem',
        wide: '3rem',
        ultrawide: '3.5rem'
      },
      '.enterprise-heading-3': {
        mobile: '1.25rem',
        'mobile-large': '1.5rem',
        tablet: '1.75rem',
        desktop: '2rem',
        wide: '2.5rem',
        ultrawide: '3rem'
      },
      '.enterprise-body-text': {
        mobile: '0.875rem',
        'mobile-large': '1rem',
        tablet: '1rem',
        desktop: '1.125rem',
        wide: '1.125rem',
        ultrawide: '1.25rem'
      }
    };
    
    Object.entries(fontSizes).forEach(([selector, sizes]) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.fontSize = sizes[this.currentBreakpoint];
      });
    });
  }
  
  /**
   * Adjust line heights based on breakpoint
   */
  adjustLineHeights() {
    const lineHeights = {
      '.enterprise-body-text': {
        mobile: '1.5',
        'mobile-large': '1.6',
        tablet: '1.6',
        desktop: '1.7',
        wide: '1.7',
        ultrawide: '1.8'
      }
    };
    
    Object.entries(lineHeights).forEach(([selector, heights]) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.lineHeight = heights[this.currentBreakpoint];
      });
    });
  }
  
  /**
   * Adjust letter spacing based on breakpoint
   */
  adjustLetterSpacing() {
    const letterSpacings = {
      '.enterprise-heading-1': {
        mobile: '0',
        'mobile-large': '-0.02em',
        tablet: '-0.02em',
        desktop: '-0.03em',
        wide: '-0.03em',
        ultrawide: '-0.04em'
      },
      '.enterprise-heading-2': {
        mobile: '0',
        'mobile-large': '-0.01em',
        tablet: '-0.01em',
        desktop: '-0.02em',
        wide: '-0.02em',
        ultrawide: '-0.03em'
      }
    };
    
    Object.entries(letterSpacings).forEach(([selector, spacings]) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.letterSpacing = spacings[this.currentBreakpoint];
      });
    });
  }
  
  /**
   * Setup adaptive grids
   */
  setupAdaptiveGrids() {
    if (!this.config.enableAdaptiveGrids) return;
    
    // Setup responsive dashboard grid
    this.setupDashboardGrid();
    
    // Setup responsive device grid
    this.setupDeviceGrid();
    
    // Setup responsive chart grid
    this.setupChartGrid();
  }
  
  /**
   * Setup responsive dashboard grid
   */
  setupDashboardGrid() {
    const dashboardGrid = document.querySelector('.enterprise-grid.enterprise-grid-2');
    
    if (!dashboardGrid) return;
    
    // Adjust grid columns based on breakpoint
    const columnConfigs = {
      mobile: 'grid-cols-1',
      'mobile-large': 'grid-cols-1',
      tablet: 'grid-cols-2',
      desktop: 'grid-cols-2',
      wide: 'grid-cols-3',
      ultrawide: 'grid-cols-4'
    };
    
    // Remove existing column classes
    Object.values(columnConfigs).forEach(cls => {
      dashboardGrid.classList.remove(cls);
    });
    
    // Add appropriate column class
    dashboardGrid.classList.add(columnConfigs[this.currentBreakpoint]);
  }
  
  /**
   * Setup responsive device grid
   */
  setupDeviceGrid() {
    const deviceGrid = document.querySelector('.enterprise-device-grid');
    
    if (!deviceGrid) return;
    
    // Adjust grid columns based on breakpoint
    const columnConfigs = {
      mobile: 'grid-cols-1',
      'mobile-large': 'grid-cols-2',
      tablet: 'grid-cols-2',
      desktop: 'grid-cols-3',
      wide: 'grid-cols-4',
      ultrawide: 'grid-cols-4'
    };
    
    // Remove existing column classes
    Object.values(columnConfigs).forEach(cls => {
      deviceGrid.classList.remove(cls);
    });
    
    // Add appropriate column class
    deviceGrid.classList.add(columnConfigs[this.currentBreakpoint]);
  }
  
  /**
   * Setup responsive chart grid
   */
  setupChartGrid() {
    const chartGrid = document.querySelector('.enterprise-charts-grid');
    
    if (!chartGrid) return;
    
    // Adjust grid columns based on breakpoint
    const columnConfigs = {
      mobile: 'grid-cols-1',
      'mobile-large': 'grid-cols-1',
      tablet: 'grid-cols-1',
      desktop: 'grid-cols-2',
      wide: 'grid-cols-3',
      ultrawide: 'grid-cols-4'
    };
    
    // Remove existing column classes
    Object.values(columnConfigs).forEach(cls => {
      chartGrid.classList.remove(cls);
    });
    
    // Add appropriate column class
    chartGrid.classList.add(columnConfigs[this.currentBreakpoint]);
  }
  
  /**
   * Setup device-specific optimizations
   */
  setupDeviceOptimizations() {
    // Apply mobile optimizations
    if (this.isMobile()) {
      this.applyMobileOptimizations();
    }
    
    // Apply tablet optimizations
    if (this.isTablet()) {
      this.applyTabletOptimizations();
    }
    
    // Apply desktop optimizations
    if (this.isDesktop()) {
      this.applyDesktopOptimizations();
    }
  }
  
  /**
   * Apply mobile optimizations
   */
  applyMobileOptimizations() {
    // Reduce animations
    document.body.classList.add('reduce-animations');
    
    // Simplify navigation
    this.simplifyNavigation();
    
    // Optimize touch targets
    this.optimizeTouchTargets();
    
    // Enable swipe gestures
    this.enableSwipeGestures();
  }
  
  /**
   * Simplify navigation for mobile
   */
  simplifyNavigation() {
    const navMenu = document.querySelector('.enterprise-nav-menu');
    if (navMenu) {
      // Show only essential navigation items
      const essentialItems = navMenu.querySelectorAll('.enterprise-nav-link[href="/"], .enterprise-nav-link[href="/dashboard/"]');
      const allItems = navMenu.querySelectorAll('.enterprise-nav-link, .enterprise-nav-dropdown');
      
      allItems.forEach(item => {
        if (!essentialItems.includes(item)) {
          item.style.display = 'none';
        }
      });
    }
  }
  
  /**
   * Optimize touch targets for mobile
   */
  optimizeTouchTargets() {
    const touchTargets = document.querySelectorAll('button, a, [role="button"], [role="link"]');
    
    touchTargets.forEach(target => {
      // Ensure minimum touch target size
      target.style.minHeight = '44px';
      target.style.minWidth = '44px';
      
      // Add touch feedback
      target.addEventListener('touchstart', () => {
        target.style.opacity = '0.8';
      }, { passive: true });
      
      target.addEventListener('touchend', () => {
        target.style.opacity = '1';
      }, { passive: true });
    });
  }
  
  /**
   * Enable swipe gestures for mobile
   */
  enableSwipeGestures() {
    // Swipe to go back
    let touchStartX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      
      if (diff > 100 && window.history.length > 1) {
        // Swipe left - go back
        window.history.back();
      }
    }, { passive: true });
  }
  
  /**
   * Apply tablet optimizations
   */
  applyTabletOptimizations() {
    // Adjust sidebar width
    this.adjustSidebarWidth();
    
    // Optimize for two-handed use
    this.optimizeForTwoHands();
  }
  
  /**
   * Adjust sidebar width for tablet
   */
  adjustSidebarWidth() {
    const sidebar = document.querySelector('.enterprise-sidebar');
    if (sidebar) {
      sidebar.style.width = '280px';
    }
  }
  
  /**
   * Optimize for two-handed use on tablet
   */
  optimizeForTwoHands() {
    // Adjust padding for grip areas
    const mainContent = document.querySelector('.enterprise-main-content');
    if (mainContent) {
      mainContent.style.paddingLeft = '60px';
      mainContent.style.paddingRight = '60px';
    }
  }
  
  /**
   * Apply desktop optimizations
   */
  applyDesktopOptimizations() {
    // Enable hover effects
    document.body.classList.remove('disable-hover');
    
    // Enable multi-window features
    this.enableMultiWindowFeatures();
    
    // Optimize for mouse input
    this.optimizeForMouse();
  }
  
  /**
   * Enable multi-window features for desktop
   */
  enableMultiWindowFeatures() {
    // Enable drag and drop
    this.enableDragAndDrop();
    
    // Enable window snapping
    this.enableWindowSnapping();
  }
  
  /**
   * Enable drag and drop
   */
  enableDragAndDrop() {
    const draggableElements = document.querySelectorAll('.draggable');
    
    draggableElements.forEach(element => {
      element.draggable = true;
      
      element.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', element.outerHTML);
        element.classList.add('dragging');
      });
      
      element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
      });
    });
  }
  
  /**
   * Enable window snapping
   */
  enableWindowSnapping() {
    // This would implement window snapping functionality
    // For demo purposes, we'll just log the action
    console.log('Window snapping enabled');
  }
  
  /**
   * Optimize for mouse input
   */
  optimizeForMouse() {
    // Enable hover effects
    document.body.classList.add('mouse-mode');
    
    // Add hover states
    const hoverElements = document.querySelectorAll('button, a, .enterprise-card');
    
    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-2px)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
      });
    });
  }
  
  /**
   * Initialize responsive components
   */
  initializeResponsiveComponents() {
    // Initialize responsive charts
    this.initializeResponsiveCharts();
    
    // Initialize responsive modals
    this.initializeResponsiveModals();
    
    // Initialize responsive notifications
    this.initializeResponsiveNotifications();
  }
  
  /**
   * Initialize responsive charts
   */
  initializeResponsiveCharts() {
    const chartContainers = document.querySelectorAll('.enterprise-chart-container');
    
    chartContainers.forEach(container => {
      // Adjust chart size based on breakpoint
      this.adjustChartSize(container);
      
      // Adjust chart data based on breakpoint
      this.adjustChartData(container);
    });
  }
  
  /**
   * Adjust chart size based on breakpoint
   */
  adjustChartSize(container) {
    const chartCanvas = container.querySelector('canvas');
    if (!chartCanvas) return;
    
    const sizes = {
      mobile: { width: '100%', height: '200px' },
      'mobile-large': { width: '100%', height: '250px' },
      tablet: { width: '100%', height: '300px' },
      desktop: { width: '100%', height: '350px' },
      wide: { width: '100%', height: '400px' },
      ultrawide: { width: '100%', height: '450px' }
    };
    
    const size = sizes[this.currentBreakpoint];
    chartCanvas.style.width = size.width;
    chartCanvas.style.height = size.height;
  }
  
  /**
   * Adjust chart data based on breakpoint
   */
  adjustChartData(container) {
    // This would adjust chart data based on available space
    // For demo purposes, we'll just log the action
    console.log(`Adjusting chart data for ${this.currentBreakpoint}`);
  }
  
  /**
   * Initialize responsive modals
   */
  initializeResponsiveModals() {
    const modals = document.querySelectorAll('.enterprise-modal');
    
    modals.forEach(modal => {
      // Adjust modal size based on breakpoint
      this.adjustModalSize(modal);
      
      // Adjust modal position based on breakpoint
      this.adjustModalPosition(modal);
    });
  }
  
  /**
   * Adjust modal size based on breakpoint
   */
  adjustModalSize(modal) {
    const sizes = {
      mobile: { width: '95%', maxWidth: '400px' },
      'mobile-large': { width: '90%', maxWidth: '500px' },
      tablet: { width: '80%', maxWidth: '600px' },
      desktop: { width: '70%', maxWidth: '800px' },
      wide: { width: '60%', maxWidth: '1000px' },
      ultrawide: { width: '50%', maxWidth: '1200px' }
    };
    
    const size = sizes[this.currentBreakpoint];
    modal.style.width = size.width;
    modal.style.maxWidth = size.maxWidth;
  }
  
  /**
   * Adjust modal position based on breakpoint
   */
  adjustModalPosition(modal) {
    if (this.isMobile()) {
      // Center modal on mobile
      modal.style.top = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
    } else {
      // Keep default position for larger screens
      modal.style.top = 'auto';
      modal.style.transform = 'none';
    }
  }
  
  /**
   * Initialize responsive notifications
   */
  initializeResponsiveNotifications() {
    const notificationContainer = document.getElementById('notification-root');
    
    if (!notificationContainer) return;
    
    // Adjust notification position based on breakpoint
    this.adjustNotificationPosition(notificationContainer);
    
    // Adjust notification size based on breakpoint
    this.adjustNotificationSize(notificationContainer);
  }
  
  /**
   * Adjust notification position based on breakpoint
   */
  adjustNotificationPosition(container) {
    if (this.isMobile()) {
      // Position notifications at bottom on mobile
      container.style.top = 'auto';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.left = '20px';
    } else {
      // Position notifications at top right on larger screens
      container.style.top = '100px';
      container.style.bottom = 'auto';
      container.style.right = '20px';
      container.style.left = 'auto';
    }
  }
  
  /**
   * Adjust notification size based on breakpoint
   */
  adjustNotificationSize(container) {
    const sizes = {
      mobile: { maxWidth: '100%', width: 'auto' },
      'mobile-large': { maxWidth: '90%', width: 'auto' },
      tablet: { maxWidth: '400px', width: 'auto' },
      desktop: { maxWidth: '400px', width: 'auto' },
      wide: { maxWidth: '450px', width: 'auto' },
      ultrawide: { maxWidth: '500px', width: 'auto' }
    };
    
    const size = sizes[this.currentBreakpoint];
    container.style.maxWidth = size.maxWidth;
    container.style.width = size.width;
  }
  
  /**
   * Update viewport meta tag
   */
  updateViewportMeta() {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (!viewportMeta) return;
    
    if (this.isMobile()) {
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    } else {
      viewportMeta.content = 'width=device-width, initial-scale=1.0';
    }
  }
  
  /**
   * Check if current device is mobile
   */
  isMobile() {
    return ['mobile', 'mobile-large'].includes(this.currentBreakpoint);
  }
  
  /**
   * Check if current device is tablet
   */
  isTablet() {
    return this.currentBreakpoint === 'tablet';
  }
  
  /**
   * Check if current device is desktop
   */
  isDesktop() {
    return ['desktop', 'wide', 'ultrawide'].includes(this.currentBreakpoint);
  }
  
  /**
   * Dispatch custom event
   */
  dispatchEvent(eventName) {
    const event = new CustomEvent(eventName, {
      detail: { breakpoint: this.currentBreakpoint }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // This would show a notification using the notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
  
  /**
   * Announce to screen reader
   */
  announceToScreenReader(message) {
    // This would announce the message to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }
  
  /**
   * Show loading state
   */
  showLoadingState() {
    document.body.classList.add('loading');
  }
  
  /**
   * Hide loading state
   */
  hideLoadingState() {
    document.body.classList.remove('loading');
  }
}

// Initialize responsive module when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.enterpriseResponsive = new EnterpriseResponsive();
  });
} else {
  window.enterpriseResponsive = new EnterpriseResponsive();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnterpriseResponsive;
}