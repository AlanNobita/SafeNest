/**
 * SafeNest Enterprise Loading Optimizer
 * Implements modern loading strategies for optimal performance
 */

class EnterpriseLoadingOptimizer {
  constructor() {
    this.config = {
      preloadCritical: true,
      lazyLoadImages: true,
      lazyLoadComponents: true,
      codeSplitting: true,
      prefetchResources: true,
      cacheControl: true,
      resourceHints: true,
      criticalCSS: true,
      fontOptimization: true,
      imageOptimization: true,
      scriptOptimization: true
    };
    
    this.init();
  }
  
  init() {
    // Initialize all optimization strategies
    this.addResourceHints();
    this.optimizeFonts();
    this.optimizeImages();
    this.optimizeScripts();
    this.setupLazyLoading();
    this.setupCodeSplitting();
    this.setupCaching();
    this.preloadCriticalResources();
    
    // Monitor loading performance
    this.monitorLoadingPerformance();
    
    console.log('Enterprise Loading Optimizer initialized');
  }
  
  /**
   * Add resource hints for better performance
   */
  addResourceHints() {
    if (!this.config.resourceHints) return;
    
    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdnjs.cloudflare.com',
      'https://cdn.jsdelivr.net'
    ];
    
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      if (domain.includes('gstatic')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
    
    // DNS prefetch for domains we'll likely need
    const prefetchDomains = [
      'https://api.safenest.ai',
      'https://analytics.safenest.ai'
    ];
    
    prefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }
  
  /**
   * Optimize font loading
   */
  optimizeFonts() {
    if (!this.config.fontOptimization) return;
    
    // Load Inter font with display: swap for better perceived performance
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    fontLink.setAttribute('media', 'print');
    fontLink.setAttribute('onload', "this.media='all'");
    document.head.appendChild(fontLink);
    
    // Add font-display: swap to critical CSS
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2) format('woff2');
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Optimize images with lazy loading and responsive techniques
   */
  optimizeImages() {
    if (!this.config.imageOptimization) return;
    
    // Set up lazy loading for all images
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading support
      const images = document.querySelectorAll('img:not([loading="eager"])');
      images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
        
        // Add low-quality image placeholder (LQIP)
        if (!img.srcset) {
          const lowQualitySrc = this.getLowQualityPlaceholder(img.src);
          img.dataset.src = img.src;
          img.src = lowQualitySrc;
        }
      });
    } else {
      // Fallback for browsers without native lazy loading
      this.setupIntersectionObserverForImages();
    }
    
    // Optimize existing images in the DOM
    this.optimizeExistingImages();
  }
  
  /**
   * Setup Intersection Observer for image lazy loading fallback
   */
  setupIntersectionObserverForImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.classList.add('lazy-loaded');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    const images = document.querySelectorAll('img.lazy');
    images.forEach(img => imageObserver.observe(img));
  }
  
  /**
   * Optimize existing images in the DOM
   */
  optimizeExistingImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add responsive image attributes
      if (!img.sizes) {
        img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      }
      
      // Add lazy loading if not already set
      if (!img.loading && img.dataset.src) {
        img.loading = 'lazy';
      }
    });
  }
  
  /**
   * Get low quality image placeholder
   */
  getLowQualityPlaceholder(src) {
    // For demo purposes, return a small base64 encoded placeholder
    // In production, you'd use a proper low-quality image
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }
  
  /**
   * Optimize script loading
   */
  optimizeScripts() {
    if (!this.config.scriptOptimization) return;
    
    // Optimize all script tags
    const scripts = document.querySelectorAll('script');
    
    scripts.forEach(script => {
      // Add async to non-critical scripts
      if (!script.hasAttribute('defer') && !script.hasAttribute('async') && 
          !script.closest('body > script')) {
        script.async = true;
      }
      
      // Add defer to scripts that need to run in order
      if (script.hasAttribute('data-defer')) {
        script.defer = true;
        script.removeAttribute('async');
      }
      
      // Move non-critical scripts to the end of body
      if (!script.closest('body') && !script.hasAttribute('critical')) {
        document.body.appendChild(script);
      }
    });
    
    // Add critical inline scripts
    this.addCriticalInlineScripts();
  }
  
  /**
   * Add critical inline scripts for faster interaction
   */
  addCriticalInlineScripts() {
    const criticalScript = document.createElement('script');
    criticalScript.textContent = `
      // Critical functionality that needs to be available immediately
      (function() {
        // Theme management
        function initializeTheme() {
          const html = document.documentElement;
          const savedTheme = localStorage.getItem('enterprise-theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          html.setAttribute('data-theme', savedTheme);
        }
        
        // Initialize theme immediately
        initializeTheme();
        
        // Optimize initial render
        document.addEventListener('DOMContentLoaded', function() {
          // Remove any loading states
          document.body.classList.remove('loading');
          
          // Initialize critical components
          if (typeof window.initializeEnterpriseComponents === 'function') {
            window.initializeEnterpriseComponents();
          }
        });
      })();
    `;
    
    // Insert after the opening body tag
    document.body.insertBefore(criticalScript, document.body.firstChild);
  }
  
  /**
   * Setup lazy loading for components
   */
  setupLazyLoading() {
    if (!this.config.lazyLoadComponents) return;
    
    // Create component loader
    const componentLoader = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const component = entry.target;
          const componentId = component.getAttribute('data-component');
          
          if (componentId) {
            this.loadComponent(componentId)
              .then(() => {
                component.classList.add('component-loaded');
                componentLoader.unobserve(component);
              })
              .catch(error => {
                console.error(`Failed to load component ${componentId}:`, error);
              });
          }
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });
    
    // Observe all components with data-component attribute
    const components = document.querySelectorAll('[data-component]');
    components.forEach(component => componentLoader.observe(component));
  }
  
  /**
   * Load a component dynamically
   */
  async loadComponent(componentId) {
    // In a real implementation, this would fetch component HTML/CSS
    // For demo purposes, we'll just add a class to indicate loading
    const componentElement = document.querySelector(`[data-component="${componentId}"]`);
    
    if (componentElement) {
      componentElement.classList.add('loading');
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      componentElement.classList.remove('loading');
      componentElement.classList.add('loaded');
    }
  }
  
  /**
   * Setup code splitting for JavaScript
   */
  setupCodeSplitting() {
    if (!this.config.codeSplitting) return;
    
    // Create dynamic import registry
    window.importRegistry = {};
    
    // Function to dynamically import modules
    window.loadModule = async function(moduleName) {
      if (window.importRegistry[moduleName]) {
        return window.importRegistry[moduleName];
      }
      
      try {
        // In a real implementation, this would import from actual modules
        // For demo purposes, we'll just resolve with a mock
        const module = await new Promise(resolve => {
          setTimeout(() => {
            resolve({
              name: moduleName,
              initialized: true,
              init: function() {
                console.log(`${moduleName} module initialized`);
              }
            });
          }, 100);
        });
        
        window.importRegistry[moduleName] = module;
        module.init();
        
        return module;
      } catch (error) {
        console.error(`Failed to load module ${moduleName}:`, error);
        return null;
      }
    };
    
    // Load modules when needed
    this.setupModuleLoadingTriggers();
  }
  
  /**
   * Setup triggers for loading modules
   */
  setupModuleLoadingTriggers() {
    // Load chart module when charts are visible
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('chart-container')) {
          window.loadModule('charts').then(module => {
            if (module) {
              this.initializeCharts(entry.target);
            }
          });
          chartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all chart containers
    document.querySelectorAll('.chart-container').forEach(container => {
      chartObserver.observe(container);
    });
    
    // Load notifications module when needed
    document.addEventListener('click', function(event) {
      if (event.target.matches('[data-show-notification]')) {
        window.loadModule('notifications');
      }
    });
  }
  
  /**
   * Setup caching strategies
   */
  setupCaching() {
    if (!this.config.cacheControl) return;
    
    // Register service worker for caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/static/js/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
    
    // Setup application cache API
    this.setupAppCache();
  }
  
  /**
   * Setup application cache
   */
  setupAppCache() {
    if ('caches' in window) {
      // Cache critical resources
      this.cacheCriticalResources();
      
      // Cache API responses
      this.setupAPICaching();
    }
  }
  
  /**
   * Cache critical resources
   */
  async cacheCriticalResources() {
    try {
      const cache = await caches.open('enterprise-v1');
      
      const criticalResources = [
        '/',
        '/static/css/enterprise.css',
        '/static/css/enterprise-design-system.css',
        '/static/js/enterprise-components.js',
        '/static/images/logo.svg'
      ];
      
      await cache.addAll(criticalResources);
      console.log('Critical resources cached');
    } catch (error) {
      console.error('Failed to cache resources:', error);
    }
  }
  
  /**
   * Setup API response caching
   */
  setupAPICaching() {
    // Intercept fetch requests for caching
    const originalFetch = window.fetch;
    
    window.fetch = async function(...args) {
      const request = args[0];
      
      // Only cache GET requests
      if (typeof request === 'string' || request.method === 'GET') {
        try {
          // Try to get from cache first
          const cache = await caches.open('api-v1');
          const cachedResponse = await cache.match(request);
          
          if (cachedResponse) {
            // Return cached response
            return cachedResponse;
          }
          
          // Otherwise, fetch and cache
          const response = await originalFetch.apply(this, args);
          
          // Clone response for caching
          const clonedResponse = response.clone();
          await cache.put(request, clonedResponse);
          
          return response;
        } catch (error) {
          console.error('Cache fetch error:', error);
          return originalFetch.apply(this, args);
        }
      }
      
      return originalFetch.apply(this, args);
    };
  }
  
  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    if (!this.config.preloadCritical) return;
    
    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.href = '/static/css/critical.css';
    criticalCSS.as = 'style';
    criticalCSS.onload = function() {
      this.rel = 'stylesheet';
    };
    document.head.appendChild(criticalCSS);
    
    // Preload critical JavaScript
    const criticalJS = document.createElement('link');
    criticalJS.rel = 'preload';
    criticalJS.href = '/static/js/enterprise-components.js';
    criticalJS.as = 'script';
    document.head.appendChild(criticalJS);
    
    // Preload important images
    const importantImages = [
      '/static/images/logo.svg',
      '/static/images/hero-bg.jpg'
    ];
    
    importantImages.forEach(imageSrc => {
      const imageLink = document.createElement('link');
      imageLink.rel = 'preload';
      imageLink.href = imageSrc;
      imageLink.as = 'image';
      document.head.appendChild(imageLink);
    });
  }
  
  /**
   * Monitor loading performance
   */
  monitorLoadingPerformance() {
    // Track when the page becomes interactive
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page loaded in ${loadTime}ms`);
      
      // Send performance data
      this.sendPerformanceData({
        type: 'pageLoad',
        duration: loadTime,
        timestamp: Date.now()
      });
    });
    
    // Track first paint
    if ('PerformancePaintTiming' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          console.log(`First paint: ${entry.startTime}ms`);
          
          this.sendPerformanceData({
            type: 'firstPaint',
            time: entry.startTime,
            timestamp: Date.now()
          });
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
    
    // Track resource loading
    if ('PerformanceResourceTiming' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.duration > 1000) { // Log slow resources
            console.warn(`Slow resource: ${entry.name} (${entry.duration}ms)`);
            
            this.sendPerformanceData({
              type: 'slowResource',
              name: entry.name,
              duration: entry.duration,
              timestamp: Date.now()
            });
          }
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }
  
  /**
   * Send performance data to analytics
   */
  sendPerformanceData(data) {
    // In a real implementation, this would send to your analytics service
    console.log('Performance data:', data);
    
    // Store in localStorage for potential offline analysis
    try {
      const existingData = JSON.parse(localStorage.getItem('enterprise-perf-data') || '[]');
      existingData.push(data);
      
      // Keep only last 100 entries
      if (existingData.length > 100) {
        existingData.shift();
      }
      
      localStorage.setItem('enterprise-perf-data', JSON.stringify(existingData));
    } catch (error) {
      console.error('Failed to store performance data:', error);
    }
  }
  
  /**
   * Initialize charts when loaded
   */
  initializeCharts(container) {
    // This would initialize Chart.js or another charting library
    // For demo purposes, we'll just add a placeholder
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.classList.add('chart-initialized');
      
      // Add some basic chart data
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Simple bar chart as placeholder
        ctx.fillStyle = '#0A74DA';
        ctx.fillRect(10, 10, 50, 100);
        ctx.fillRect(70, 10, 50, 150);
        ctx.fillRect(130, 10, 50, 80);
      }
    }
  }
}

// Initialize the loading optimizer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.loadingOptimizer = new EnterpriseLoadingOptimizer();
  });
} else {
  window.loadingOptimizer = new EnterpriseLoadingOptimizer();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnterpriseLoadingOptimizer;
}