/**
 * SafeNest Enterprise Accessibility Module
 * Implements comprehensive accessibility features for WCAG 2.1 compliance
 */

class EnterpriseAccessibility {
  constructor() {
    this.config = {
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
      skipLinks: true,
      ariaLabels: true,
      colorBlind: false,
      textToSpeech: false,
      dyslexia: false
    };
    
    this.settings = this.loadSettings();
    this.init();
  }
  
  init() {
    // Apply saved settings
    this.applySettings();
    
    // Initialize accessibility features
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.setupScreenReaderAnnouncements();
    this.setupColorBlindMode();
    this.setupHighContrastMode();
    this.setupReducedMotion();
    this.setupDyslexiaMode();
    this.setupTextToSpeech();
    
    // Monitor for changes
    this.monitorAccessibilityChanges();
    
    // Create accessibility toolbar
    this.createAccessibilityToolbar();
    
    console.log('Enterprise Accessibility initialized');
  }
  
  /**
   * Load saved accessibility settings
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('enterprise-accessibility');
      return saved ? { ...this.config, ...JSON.parse(saved) } : this.config;
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
      return this.config;
    }
  }
  
  /**
   * Save accessibility settings
   */
  saveSettings() {
    try {
      localStorage.setItem('enterprise-accessibility', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }
  
  /**
   * Apply accessibility settings
   */
  applySettings() {
    // Apply high contrast mode
    if (this.settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    
    // Apply reduced motion
    if (this.settings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    // Apply color blind mode
    if (this.settings.colorBlind) {
      document.documentElement.classList.add('color-blind-mode');
    }
    
    // Apply dyslexia mode
    if (this.settings.dyslexia) {
      document.documentElement.classList.add('dyslexia-mode');
    }
  }
  
  /**
   * Setup keyboard navigation enhancements
   */
  setupKeyboardNavigation() {
    if (!this.settings.keyboardNavigation) return;
    
    // Add keyboard instructions
    this.addKeyboardInstructions();
    
    // Enhance keyboard navigation for interactive elements
    this.enhanceKeyboardNavigation();
    
    // Add keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Trap focus in modals
    this.setupFocusTrapping();
  }
  
  /**
   * Add keyboard instructions to the page
   */
  addKeyboardInstructions() {
    const instructions = document.createElement('div');
    instructions.className = 'sr-only';
    instructions.setAttribute('role', 'note');
    instructions.setAttribute('aria-live', 'polite');
    instructions.innerHTML = `
      <p>Keyboard Navigation Tips:</p>
      <ul>
        <li>Tab to navigate between elements</li>
        <li>Enter or Space to activate elements</li>
        <li>Escape to close modals and menus</li>
        <li>Ctrl/Cmd + K to focus search</li>
        <li>Ctrl/Cmd + / for help</li>
      </ul>
    `;
    
    document.body.appendChild(instructions);
  }
  
  /**
   * Enhance keyboard navigation for interactive elements
   */
  enhanceKeyboardNavigation() {
    // Add visible focus styles
    if (this.settings.focusIndicators) {
      const style = document.createElement('style');
      style.textContent = `
        *:focus {
          outline: 3px solid #0A74DA !important;
          outline-offset: 2px !important;
        }
        
        *:focus:not(:focus-visible) {
          outline: none !important;
        }
        
        *:focus-visible {
          outline: 3px solid #0A74DA !important;
          outline-offset: 2px !important;
        }
        
        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible,
        a:focus-visible {
          outline: 3px solid #0A74DA !important;
          outline-offset: 2px !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Enhance interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, input, select, textarea, a, [tabindex], [role="button"], [role="link"]'
    );
    
    interactiveElements.forEach(element => {
      // Ensure all interactive elements are focusable
      if (!element.hasAttribute('tabindex') && 
          !element.matches('input, select, textarea, button, a')) {
        element.setAttribute('tabindex', '0');
      }
      
      // Add keyboard event listeners
      element.addEventListener('keydown', this.handleKeyNavigation.bind(this));
    });
  }
  
  /**
   * Handle keyboard navigation events
   */
  handleKeyNavigation(event) {
    // Handle Enter key for elements that don't natively support it
    if (event.key === 'Enter' && 
        !event.target.matches('input, select, textarea, button, a')) {
      event.preventDefault();
      event.target.click();
    }
    
    // Handle Space key for elements that don't natively support it
    if (event.key === ' ' && 
        !event.target.matches('input, select, textarea, button, a')) {
      event.preventDefault();
      event.target.click();
    }
  }
  
  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('.enterprise-search-input');
        if (searchInput) {
          searchInput.focus();
          this.announceToScreenReader('Search input focused');
        }
      }
      
      // Ctrl/Cmd + / for help
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        const helpButton = document.querySelector('[aria-label="Help"]');
        if (helpButton) {
          helpButton.click();
          this.announceToScreenReader('Help menu opened');
        }
      }
      
      // Alt + S to skip to main content
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          this.announceToScreenReader('Skipped to main content');
        }
      }
      
      // Alt + N to navigate to next section
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        this.navigateToNextSection();
      }
      
      // Alt + P to navigate to previous section
      if (event.altKey && event.key === 'p') {
        event.preventDefault();
        this.navigateToPreviousSection();
      }
    });
  }
  
  /**
   * Setup focus management for modals and menus
   */
  setupFocusTrapping() {
    // Trap focus in open modals
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          
          if (target.classList.contains('active') || 
              target.classList.contains('enterprise-modal.active')) {
            this.trapFocus(target);
          } else {
            this.releaseFocus();
          }
        }
      });
    });
    
    // Observe modals
    const modals = document.querySelectorAll('.enterprise-modal');
    modals.forEach(modal => {
      observer.observe(modal, { attributes: true });
    });
  }
  
  /**
   * Trap focus within an element
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    // Handle Tab key
    container.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
    
    // Focus first element
    firstFocusable.focus();
  }
  
  /**
   * Release focus trapping
   */
  releaseFocus() {
    // This would be implemented based on your specific modal system
    console.log('Focus trapping released');
  }
  
  /**
   * Navigate to next section
   */
  navigateToNextSection() {
    const sections = document.querySelectorAll('main > section, main > [role="region"]');
    const current = document.activeElement;
    const currentIndex = Array.from(sections).indexOf(current.closest('section, [role="region"]'));
    
    if (currentIndex !== -1 && currentIndex < sections.length - 1) {
      sections[currentIndex + 1].focus();
      this.announceToScreenReader(`Navigated to ${sections[currentIndex + 1].ariaLabel || 'next section'}`);
    }
  }
  
  /**
   * Navigate to previous section
   */
  navigateToPreviousSection() {
    const sections = document.querySelectorAll('main > section, main > [role="region"]');
    const current = document.activeElement;
    const currentIndex = Array.from(sections).indexOf(current.closest('section, [role="region"]'));
    
    if (currentIndex > 0) {
      sections[currentIndex - 1].focus();
      this.announceToScreenReader(`Navigated to ${sections[currentIndex - 1].ariaLabel || 'previous section'}`);
    }
  }
  
  /**
   * Setup skip links for better keyboard navigation
   */
  setupSkipLinks() {
    if (!this.settings.skipLinks) return;
    
    // Create skip links if they don't exist
    if (!document.querySelector('.skip-link')) {
      const skipToMain = document.createElement('a');
      skipToMain.href = '#main-content';
      skipToMain.className = 'skip-link';
      skipToMain.textContent = 'Skip to main content';
      document.body.insertBefore(skipToMain, document.body.firstChild);
      
      skipToMain.addEventListener('click', () => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
        }
      });
    }
    
    // Add additional skip links for complex layouts
    const dashboard = document.querySelector('.enterprise-dashboard-container');
    if (dashboard) {
      const skipToStats = document.createElement('a');
      skipToStats.href = '#stats-overview';
      skipToStats.className = 'skip-link';
      skipToStats.textContent = 'Skip to statistics';
      skipToStats.style.top = '-40px';
      dashboard.insertBefore(skipToStats, dashboard.firstChild);
      
      skipToStats.addEventListener('click', () => {
        const stats = document.getElementById('stats-overview');
        if (stats) {
          stats.focus();
        }
      });
    }
  }
  
  /**
   * Setup screen reader announcements
   */
  setupScreenReaderAnnouncements() {
    // Create announcement container
    const announcements = document.createElement('div');
    announcements.setAttribute('role', 'status');
    announcements.setAttribute('aria-live', 'polite');
    announcements.setAttribute('aria-atomic', 'true');
    announcements.className = 'sr-only';
    announcements.id = 'screen-reader-announcements';
    document.body.appendChild(announcements);
    
    // Store reference for later use
    this.announcementContainer = announcements;
  }
  
  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    if (!this.announcementContainer) return;
    
    const announcement = document.createElement('div');
    announcement.textContent = message;
    this.announcementContainer.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }
  
  /**
   * Setup color blind mode
   */
  setupColorBlindMode() {
    if (!this.settings.colorBlind) return;
    
    // Apply color blind friendly colors
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --enterprise-brand-primary: #0066CC;
        --enterprise-brand-success: #00AA44;
        --enterprise-brand-warning: #FFAA00;
        --enterprise-brand-danger: #CC0000;
      }
      
      .color-blind-mode .enterprise-stat-change.positive {
        background: rgba(0, 170, 68, 0.1);
        border: 1px solid rgba(0, 170, 68, 0.2);
      }
      
      .color-blind-mode .enterprise-stat-change.negative {
        background: rgba(204, 0, 0, 0.1);
        border: 1px solid rgba(204, 0, 0, 0.2);
      }
      
      .color-blind-mode .enterprise-activity-icon.security {
        background: rgba(204, 0, 0, 0.1);
        border: 1px solid rgba(204, 0, 0, 0.2);
        color: #CC0000;
      }
      
      .color-blind-mode .enterprise-activity-icon.energy {
        background: rgba(255, 170, 0, 0.1);
        border: 1px solid rgba(255, 170, 0, 0.2);
        color: #FFAA00;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Setup high contrast mode
   */
  setupHighContrastMode() {
    if (!this.settings.highContrast) return;
    
    const style = document.createElement('style');
    style.textContent = `
      .high-contrast {
        --enterprise-bg-primary: #000000;
        --enterprise-bg-secondary: #1a1a1a;
        --enterprise-bg-tertiary: #333333;
        --enterprise-text-primary: #FFFFFF;
        --enterprise-text-secondary: #FFFFFF;
        --enterprise-border-primary: #FFFFFF;
        --enterprise-brand-primary: #FFFFFF;
      }
      
      .high-contrast .enterprise-card,
      .high-contrast .enterprise-section-card {
        border: 2px solid #FFFFFF;
        background: #000000;
      }
      
      .high-contrast .enterprise-btn {
        border: 2px solid #FFFFFF;
        color: #000000;
        background: #FFFFFF;
      }
      
      .high-contrast .enterprise-btn:hover {
        background: #CCCCCC;
      }
      
      .high-contrast .enterprise-nav-link {
        border: 1px solid #FFFFFF;
        color: #FFFFFF;
      }
      
      .high-contrast .enterprise-device-card {
        border: 2px solid #FFFFFF;
      }
      
      .high-contrast *:focus {
        outline: 3px solid #FFFF00 !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Setup reduced motion
   */
  setupReducedMotion() {
    if (!this.settings.reducedMotion) return;
    
    const style = document.createElement('style');
    style.textContent = `
      .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .reduce-motion .enterprise-float,
      .reduce-motion .enterprise-pulse,
      .reduce-motion .enterprise-slide-in {
        animation: none !important;
      }
      
      .reduce-motion .enterprise-navbar-scrolled,
      .reduce-motion .enterprise-stat-card:hover,
      .reduce-motion .enterprise-device-card:hover {
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Setup dyslexia mode
   */
  setupDyslexiaMode() {
    if (!this.settings.dyslexia) return;
    
    const style = document.createElement('style');
    style.textContent = `
      .dyslexia-mode {
        font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif !important;
        letter-spacing: 0.05em;
        line-height: 1.8;
      }
      
      .dyslexia-mode h1,
      .dyslexia-mode h2,
      .dyslexia-mode h3,
      .dyslexia-mode h4,
      .dyslexia-mode h5,
      .dyslexia-mode h6 {
        font-weight: 600;
      }
      
      .dyslexia-mode p,
      .dyslexia-mode span,
      .dyslexia-mode div {
        font-weight: 400;
      }
    `;
    document.head.appendChild(style);
    
    // Load OpenDyslexic font if available
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=OpenDyslexic&display=swap';
    document.head.appendChild(fontLink);
  }
  
  /**
   * Setup text-to-speech functionality
   */
  setupTextToSpeech() {
    if (!this.settings.textToSpeech) return;
    
    // Create speech synthesis button
    const speechButton = document.createElement('button');
    speechButton.className = 'enterprise-btn enterprise-btn-secondary';
    speechButton.setAttribute('aria-label', 'Read page content');
    speechButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    speechButton.style.position = 'fixed';
    speechButton.style.bottom = '20px';
    speechButton.style.right = '20px';
    speechButton.style.zIndex = '9999';
    
    document.body.appendChild(speechButton);
    
    speechButton.addEventListener('click', () => {
      this.toggleTextToSpeech();
    });
  }
  
  /**
   * Toggle text-to-speech
   */
  toggleTextToSpeech() {
    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        this.announceToScreenReader('Text-to-speech stopped');
      } else {
        this.readPageContent();
        this.announceToScreenReader('Text-to-speech started');
      }
    } else {
      this.announceToScreenReader('Text-to-speech not supported in this browser');
    }
  }
  
  /**
   * Read page content with speech synthesis
   */
  readPageContent() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    const text = this.extractTextForReading(mainContent);
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    speechSynthesis.speak(utterance);
  }
  
  /**
   * Extract text for reading
   */
  extractTextForReading(element) {
    const text = [];
    
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script and style content
          if (node.parentElement.tagName === 'SCRIPT' || 
              node.parentElement.tagName === 'STYLE') {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip empty text nodes
          if (!node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Accept text nodes
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    let node;
    while (node = walker.nextNode()) {
      text.push(node.textContent.trim());
    }
    
    return text.join(' ');
  }
  
  /**
   * Create accessibility toolbar
   */
  createAccessibilityToolbar() {
    // Create toolbar container
    const toolbar = document.createElement('div');
    toolbar.className = 'enterprise-accessibility-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Accessibility options');
    
    // Position toolbar
    toolbar.style.position = 'fixed';
    toolbar.style.top = '80px';
    toolbar.style.right = '20px';
    toolbar.style.zIndex = '9998';
    toolbar.style.display = 'none'; // Hidden by default
    toolbar.style.flexDirection = 'column';
    toolbar.style.gap = '10px';
    toolbar.style.padding = '10px';
    toolbar.style.background = 'rgba(22, 27, 34, 0.95)';
    toolbar.style.border = '1px solid rgba(48, 54, 61, 0.8)';
    toolbar.style.borderRadius = '0.5rem';
    toolbar.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'enterprise-btn enterprise-btn-primary';
    toggleButton.setAttribute('aria-label', 'Toggle accessibility toolbar');
    toggleButton.innerHTML = '<i class="fas fa-universal-access"></i>';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '9999';
    
    document.body.appendChild(toggleButton);
    document.body.appendChild(toolbar);
    
    // Create accessibility options
    this.createAccessibilityOptions(toolbar);
    
    // Toggle toolbar visibility
    toggleButton.addEventListener('click', () => {
      toolbar.style.display = toolbar.style.display === 'none' ? 'flex' : 'none';
      this.announceToScreenReader(
        toolbar.style.display === 'none' ? 'Accessibility toolbar closed' : 'Accessibility toolbar opened'
      );
    });
  }
  
  /**
   * Create accessibility options in toolbar
   */
  createAccessibilityOptions(toolbar) {
    // High contrast toggle
    const highContrastToggle = this.createToggleOption(
      'High Contrast',
      this.settings.highContrast,
      () => {
        this.settings.highContrast = !this.settings.highContrast;
        document.documentElement.classList.toggle('high-contrast');
        this.saveSettings();
        this.announceToScreenReader(
          `High contrast mode ${this.settings.highContrast ? 'enabled' : 'disabled'}`
        );
      }
    );
    toolbar.appendChild(highContrastToggle);
    
    // Reduced motion toggle
    const reducedMotionToggle = this.createToggleOption(
      'Reduce Motion',
      this.settings.reducedMotion,
      () => {
        this.settings.reducedMotion = !this.settings.reducedMotion;
        document.documentElement.classList.toggle('reduce-motion');
        this.saveSettings();
        this.announceToScreenReader(
          `Reduced motion ${this.settings.reducedMotion ? 'enabled' : 'disabled'}`
        );
      }
    );
    toolbar.appendChild(reducedMotionToggle);
    
    // Color blind mode toggle
    const colorBlindToggle = this.createToggleOption(
      'Color Blind Mode',
      this.settings.colorBlind,
      () => {
        this.settings.colorBlind = !this.settings.colorBlind;
        document.documentElement.classList.toggle('color-blind-mode');
        this.saveSettings();
        this.announceToScreenReader(
          `Color blind mode ${this.settings.colorBlind ? 'enabled' : 'disabled'}`
        );
      }
    );
    toolbar.appendChild(colorBlindToggle);
    
    // Dyslexia mode toggle
    const dyslexiaToggle = this.createToggleOption(
      'Dyslexia Mode',
      this.settings.dyslexia,
      () => {
        this.settings.dyslexia = !this.settings.dyslexia;
        document.documentElement.classList.toggle('dyslexia-mode');
        this.saveSettings();
        this.announceToScreenReader(
          `Dyslexia mode ${this.settings.dyslexia ? 'enabled' : 'disabled'}`
        );
      }
    );
    toolbar.appendChild(dyslexiaToggle);
    
    // Text-to-speech toggle
    const textToSpeechToggle = this.createToggleOption(
      'Text-to-Speech',
      this.settings.textToSpeech,
      () => {
        this.settings.textToSpeech = !this.settings.textToSpeech;
        this.saveSettings();
        this.announceToScreenReader(
          `Text-to-speech ${this.settings.textToSpeech ? 'enabled' : 'disabled'}`
        );
      }
    );
    toolbar.appendChild(textToSpeechToggle);
  }
  
  /**
   * Create toggle option button
   */
  createToggleOption(label, isActive, toggleFunction) {
    const button = document.createElement('button');
    button.className = 'enterprise-btn enterprise-btn-secondary';
    button.setAttribute('aria-pressed', isActive);
    button.setAttribute('aria-label', `${label} - ${isActive ? 'on' : 'off'}`);
    button.innerHTML = `
      <i class="fas ${isActive ? 'fa-check-square' : 'fa-square'}"></i>
      <span>${label}</span>
    `;
    button.style.width = '100%';
    button.style.justifyContent = 'flex-start';
    
    button.addEventListener('click', () => {
      toggleFunction();
      button.setAttribute('aria-pressed', !isActive);
      button.setAttribute('aria-label', `${label} - ${!isActive ? 'on' : 'off'}`);
      button.querySelector('i').className = isActive ? 'fa-square' : 'fa-check-square';
    });
    
    return button;
  }
  
  /**
   * Monitor accessibility changes
   */
  monitorAccessibilityChanges() {
    // Listen for system preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (!localStorage.getItem('enterprise-accessibility')) {
        this.settings.reducedMotion = e.matches;
        document.documentElement.classList.toggle('reduce-motion', e.matches);
      }
    });
    
    // Listen for system color scheme changes
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      if (!localStorage.getItem('enterprise-accessibility')) {
        this.settings.highContrast = e.matches;
        document.documentElement.classList.toggle('high-contrast', e.matches);
      }
    });
  }
  
  /**
   * Enhance form accessibility
   */
  enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add form role if missing
      if (!form.hasAttribute('role')) {
        form.setAttribute('role', 'form');
      }
      
      // Add form label if missing
      if (!form.hasAttribute('aria-label') && !form.hasAttribute('aria-labelledby')) {
        const heading = form.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
          form.setAttribute('aria-labelledby', heading.id || `form-heading-${Math.random().toString(36).substr(2, 9)}`);
          if (!heading.id) {
            heading.id = `form-heading-${Math.random().toString(36).substr(2, 9)}`;
          }
        } else {
          form.setAttribute('aria-label', 'Form');
        }
      }
    });
  }
  
  /**
   * Enhance table accessibility
   */
  enhanceTableAccessibility() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      // Add table role if missing
      if (!table.hasAttribute('role')) {
        table.setAttribute('role', 'table');
      }
      
      // Add caption if missing
      if (!table.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.className = 'sr-only';
        caption.textContent = 'Data table';
        table.insertBefore(caption, table.firstChild);
      }
      
      // Enhance header cells
      const headers = table.querySelectorAll('th');
      headers.forEach((header, index) => {
        if (!header.hasAttribute('scope')) {
          header.setAttribute('scope', 'col');
        }
        
        // Add ID for header-cell association
        if (!header.id) {
          header.id = `header-${index}`;
        }
      });
      
      // Enhance data cells
      const cells = table.querySelectorAll('td');
      cells.forEach((cell, index) => {
        const row = cell.parentElement;
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);
        
        // Add headers attribute
        if (headers.length > 0) {
          const headerIds = Array.from(headers).map(h => h.id).join(' ');
          cell.setAttribute('headers', headerIds);
        }
      });
    });
  }
  
  /**
   * Enhance image accessibility
   */
  enhanceImageAccessibility() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add alt text if missing
      if (!img.hasAttribute('alt') && img.src) {
        img.setAttribute('alt', 'Decorative image');
      }
      
      // Add decorative role if alt is empty
      if (img.getAttribute('alt') === '') {
        img.setAttribute('role', 'presentation');
      }
    });
  }
  
  /**
   * Enhance link accessibility
   */
  enhanceLinkAccessibility() {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
      // Add link role if missing
      if (!link.hasAttribute('role')) {
        link.setAttribute('role', 'link');
      }
      
      // Add descriptive text if link text is unclear
      const linkText = link.textContent.trim();
      if (linkText === 'Click here' || linkText === 'Read more' || linkText === 'Learn more') {
        const parent = link.parentElement;
        if (parent) {
          const context = parent.textContent.replace(linkText, '').trim();
          if (context) {
            link.setAttribute('aria-label', `${context} - ${linkText}`);
          }
        }
      }
    });
  }
  
  /**
   * Run accessibility audit
   */
  runAccessibilityAudit() {
    const issues = [];
    
    // Check for missing alt text
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt]):not([alt=""])');
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'error',
        message: `${imagesWithoutAlt.length} images are missing alt text`,
        elements: Array.from(imagesWithoutAlt)
      });
    }
    
    // Check for missing form labels
    const formInputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]):not([id])');
    if (formInputsWithoutLabels.length > 0) {
      issues.push({
        type: 'error',
        message: `${formInputsWithoutLabels.length} form inputs are missing labels`,
        elements: Array.from(formInputsWithoutLabels)
      });
    }
    
    // Check for color contrast issues (simplified check)
    const lowContrastElements = document.querySelectorAll('.enterprise-stat-value, .enterprise-section-title');
    if (lowContrastElements.length > 0) {
      issues.push({
        type: 'warning',
        message: 'Some elements may have insufficient color contrast',
        elements: Array.from(lowContrastElements)
      });
    }
    
    // Log issues
    if (issues.length > 0) {
      console.group('Accessibility Audit Results');
      issues.forEach(issue => {
        console[issue.type](issue.message);
        if (issue.elements.length > 0) {
          console.table(issue.elements.map(el => ({
            tag: el.tagName,
            id: el.id,
            class: el.className
          })));
        }
      });
      console.groupEnd();
    } else {
      console.log('Accessibility audit passed - no issues found');
    }
    
    return issues;
  }
}

// Initialize accessibility module when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.enterpriseAccessibility = new EnterpriseAccessibility();
  });
} else {
  window.enterpriseAccessibility = new EnterpriseAccessibility();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnterpriseAccessibility;
}