/* ========================================
   MOBILE NAVIGATION SCROLL BEHAVIOR
   Handles hide/reveal functionality for glass top header
   ======================================== */

(function() {
  'use strict';

  // Configuration
  const config = {
    scrollThreshold: 10, // Minimum scroll distance to trigger hide/reveal
    scrollSpeed: 100,    // Debounce delay in milliseconds
    headerSelector: '.glass-top-header',
    bodySelector: 'body',
    hiddenClass: 'header-hidden'
  };

  // State variables
  let lastScrollTop = 0;
  let scrollTimer = null;
  let isHeaderHidden = false;
  let isInitialized = false;

  // DOM elements
  let header = null;
  let body = null;

  /**
   * Initialize the scroll behavior
   */
  function init() {
    // Only run on mobile devices
    if (window.innerWidth > 768) {
      return;
    }

    header = document.querySelector(config.headerSelector);
    body = document.querySelector(config.bodySelector);

    if (!header || !body) {
      console.warn('Mobile navigation scroll: Required elements not found');
      return;
    }

    // Add CSS class to enable hide/reveal behavior
    header.classList.add('header-hide-on-scroll');

    // Set initial state
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    isInitialized = true;

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Add resize listener to disable/enable based on screen size
    window.addEventListener('resize', handleResize);

    console.log('Mobile navigation scroll behavior initialized');
  }

  /**
   * Handle scroll events with debouncing
   */
  function handleScroll() {
    if (!isInitialized) return;

    // Clear existing timer
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }

    // Debounce scroll events
    scrollTimer = setTimeout(function() {
      updateHeaderVisibility();
    }, config.scrollSpeed);
  }

  /**
   * Update header visibility based on scroll direction
   */
  function updateHeaderVisibility() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
    const scrollDistance = Math.abs(currentScrollTop - lastScrollTop);

    // Only act if scroll distance exceeds threshold
    if (scrollDistance < config.scrollThreshold) {
      return;
    }

    // Hide header when scrolling down, show when scrolling up
    if (scrollDirection === 'down' && currentScrollTop > 100 && !isHeaderHidden) {
      hideHeader();
    } else if (scrollDirection === 'up' && isHeaderHidden) {
      showHeader();
    }

    // Show header when at top of page
    if (currentScrollTop <= 50 && isHeaderHidden) {
      showHeader();
    }

    lastScrollTop = currentScrollTop;
  }

  /**
   * Hide the header
   */
  function hideHeader() {
    if (!header || isHeaderHidden) return;

    header.classList.add(config.hiddenClass);
    body.classList.add(config.hiddenClass);
    isHeaderHidden = true;

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('headerHidden', {
      detail: { header: header }
    }));
  }

  /**
   * Show the header
   */
  function showHeader() {
    if (!header || !isHeaderHidden) return;

    header.classList.remove(config.hiddenClass);
    body.classList.remove(config.hiddenClass);
    isHeaderHidden = false;

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('headerShown', {
      detail: { header: header }
    }));
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile && !isInitialized) {
      // Initialize if switching to mobile
      init();
    } else if (!isMobile && isInitialized) {
      // Cleanup if switching to desktop
      cleanup();
    }
  }

  /**
   * Cleanup function
   */
  function cleanup() {
    if (!isInitialized) return;

    // Remove event listeners
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);

    // Clear timer
    if (scrollTimer) {
      clearTimeout(scrollTimer);
      scrollTimer = null;
    }

    // Reset header state
    if (header) {
      header.classList.remove(config.hiddenClass, 'header-hide-on-scroll');
    }

    if (body) {
      body.classList.remove(config.hiddenClass);
    }

    // Reset state
    isInitialized = false;
    isHeaderHidden = false;
    lastScrollTop = 0;

    console.log('Mobile navigation scroll behavior cleaned up');
  }

  /**
   * Public API for manual control
   */
  window.MobileNavigationScroll = {
    init: init,
    cleanup: cleanup,
    hide: hideHeader,
    show: showHeader,
    isHidden: function() { return isHeaderHidden; },

    // Option to completely disable sticky behavior
    disableSticky: function() {
      cleanup();
      if (header) {
        header.classList.add('header-no-sticky');
      }
    },

    // Option to make header always visible
    alwaysVisible: function() {
      cleanup();
      if (header) {
        header.classList.add('header-always-visible');
      }
    }
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle page visibility changes (when user switches tabs)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden && isInitialized) {
      // Reset scroll position tracking when page becomes visible
      lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    }
  });

})();