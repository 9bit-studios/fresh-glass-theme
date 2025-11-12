// ========================================
// MOBILE MENU iOS INTERACTIONS
// iOS-specific touch handling and menu functionality
// ========================================

// Configuration for mobile menu
const MOBILE_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  ANIMATION_DURATION: 300,
  TOUCH_DEBOUNCE: 50,
  SCROLL_LOCK_CLASS: 'mobile-menu-open'
};

// State tracking
let isMobileMenuOpen = false;
let currentScrollPosition = 0;
let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
let isMobile = window.innerWidth <= MOBILE_CONFIG.MOBILE_BREAKPOINT;

// ========================================
// INITIALIZATION
// ========================================

function initMobileMenuIOS() {
  console.log('📱 Initializing iOS Mobile Menu...');
  
  // Check if we're on mobile
  if (!isMobile) {
    console.log('💻 Desktop detected, skipping mobile menu init');
    return;
  }
  
  // Setup event listeners
  setupMobileMenuEvents();
  setupResizeHandler();
  setupScrollLock();
  
  // iOS specific fixes
  if (isIOS) {
    setupIOSFixes();
  }
  
  console.log('✅ iOS Mobile Menu initialized');
}

// ========================================
// EVENT SETUP
// ========================================

function setupMobileMenuEvents() {
  // Find hamburger toggle buttons
  const toggleButtons = document.querySelectorAll('.dropdown-toggle');
  
  toggleButtons.forEach(button => {
    // Remove existing listeners to prevent conflicts
    button.replaceWith(button.cloneNode(true));
  });
  
  // Re-select after cloning to get fresh elements
  const freshToggles = document.querySelectorAll('.dropdown-toggle');
  
  freshToggles.forEach(toggle => {
    // Add touch event listeners
    toggle.addEventListener('touchstart', handleTouchStart, { passive: true });
    toggle.addEventListener('touchend', handleTouchEnd, { passive: false });
    toggle.addEventListener('click', handleMobileToggleClick, { passive: false });
  });
  
  // Setup close events
  setupCloseEvents();
}

function setupCloseEvents() {
  // Close on overlay click
  document.addEventListener('click', (e) => {
    if (isMobileMenuOpen && !e.target.closest('.mega-dropdown') && !e.target.closest('.dropdown-toggle')) {
      closeMobileMenu();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      closeMobileMenu();
    }
  });
  
  // Handle back button on mobile browsers
  window.addEventListener('popstate', () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  });
}

// ========================================
// TOUCH HANDLING
// ========================================

let touchStartTime = 0;
let touchStartY = 0;

function handleTouchStart(e) {
  touchStartTime = Date.now();
  touchStartY = e.touches[0].clientY;
  
  // Add visual feedback
  e.currentTarget.style.transform = 'scale(0.95)';
  e.currentTarget.style.opacity = '0.8';
}

function handleTouchEnd(e) {
  const touchEndTime = Date.now();
  const touchDuration = touchEndTime - touchStartTime;
  
  // Remove visual feedback
  e.currentTarget.style.transform = '';
  e.currentTarget.style.opacity = '';
  
  // Only trigger if it was a quick tap (not a long press or drag)
  if (touchDuration < 300) {
    e.preventDefault();
    setTimeout(() => {
      toggleMobileMenu(e.currentTarget);
    }, 10);
  }
}

function handleMobileToggleClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // Debounce to prevent double-clicks
  clearTimeout(handleMobileToggleClick.timeout);
  handleMobileToggleClick.timeout = setTimeout(() => {
    toggleMobileMenu(e.currentTarget);
  }, MOBILE_CONFIG.TOUCH_DEBOUNCE);
}

// ========================================
// MENU TOGGLE FUNCTIONALITY
// ========================================

function toggleMobileMenu(toggle) {
  console.log('🤓 Mobile menu toggle triggered');
  
  if (isMobileMenuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu(toggle);
  }
}

function openMobileMenu(toggle) {
  console.log('📂 Opening mobile menu...');
  
  // Find or create dropdown
  let dropdown = toggle.nextElementSibling;
  if (!dropdown || !dropdown.classList.contains('mega-dropdown')) {
    dropdown = document.querySelector('.mega-dropdown');
  }
  
  if (!dropdown) {
    console.error('❌ No dropdown found for mobile menu');
    return;
  }
  
  // Set state
  isMobileMenuOpen = true;
  
  // Lock scroll
  lockScroll();
  
  // Update toggle state
  toggle.setAttribute('aria-expanded', 'true');
  toggle.classList.add('active');
  
  // Show dropdown
  dropdown.style.display = 'grid';
  dropdown.style.opacity = '0';
  dropdown.style.transform = 'translateY(-20px)';
  
  // Force reflow
  dropdown.offsetHeight;
  
  // Animate in
  requestAnimationFrame(() => {
    dropdown.classList.add('active');
    dropdown.style.opacity = '1';
    dropdown.style.transform = 'translateY(0)';
  });
  
  // Add body class for additional styling
  document.body.classList.add(MOBILE_CONFIG.SCROLL_LOCK_CLASS);
  
  // Focus management
  setTimeout(() => {
    const firstLink = dropdown.querySelector('.dropdown-item, .glass-dropdown-item');
    if (firstLink) {
      firstLink.focus();
    }
  }, MOBILE_CONFIG.ANIMATION_DURATION);
  
  console.log('✅ Mobile menu opened');
}

function closeMobileMenu() {
  console.log('📁 Closing mobile menu...');
  
  const toggles = document.querySelectorAll('.dropdown-toggle');
  const dropdown = document.querySelector('.mega-dropdown');
  
  if (!dropdown || !isMobileMenuOpen) return;
  
  // Set state
  isMobileMenuOpen = false;
  
  // Update toggles
  toggles.forEach(toggle => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('active');
  });
  
  // Animate out
  dropdown.style.opacity = '0';
  dropdown.style.transform = 'translateY(-20px)';
  
  setTimeout(() => {
    if (!isMobileMenuOpen) {
      dropdown.classList.remove('active');
      dropdown.style.display = 'none';
    }
  }, MOBILE_CONFIG.ANIMATION_DURATION);
  
  // Unlock scroll
  unlockScroll();
  
  // Remove body class
  document.body.classList.remove(MOBILE_CONFIG.SCROLL_LOCK_CLASS);
  
  console.log('✅ Mobile menu closed');
}

// ========================================
// SCROLL LOCK FUNCTIONALITY
// ========================================

function setupScrollLock() {
  // Store original body styles
  window.originalBodyStyles = {
    position: document.body.style.position,
    top: document.body.style.top,
    left: document.body.style.left,
    right: document.body.style.right,
    overflow: document.body.style.overflow,
    width: document.body.style.width
  };
}

function lockScroll() {
  if (!isIOS) return;
  
  currentScrollPosition = window.scrollY;
  
  // Apply iOS scroll lock
  document.body.style.position = 'fixed';
  document.body.style.top = `-${currentScrollPosition}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  
  console.log('🔒 Scroll locked at position:', currentScrollPosition);
}

function unlockScroll() {
  if (!isIOS) return;
  
  // Restore original styles
  Object.keys(window.originalBodyStyles).forEach(prop => {
    document.body.style[prop] = window.originalBodyStyles[prop];
  });
  
  // Restore scroll position
  window.scrollTo(0, currentScrollPosition);
  
  console.log('🔓 Scroll unlocked, restored to:', currentScrollPosition);
}

// ========================================
// iOS SPECIFIC FIXES
// ========================================

function setupIOSFixes() {
  console.log('🍎 Applying iOS specific fixes...');
  
  // Fix iOS viewport issues
  const metaViewport = document.querySelector('meta[name="viewport"]');
  if (metaViewport) {
    metaViewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );
  }
  
  // Fix iOS Safari bottom bar issues
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
  });
  
  // Improve touch responsiveness
  document.addEventListener('touchstart', () => {}, { passive: true });
  
  console.log('✅ iOS fixes applied');
}

// ========================================
// RESPONSIVE HANDLING
// ========================================

function setupResizeHandler() {
  let resizeTimeout;
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const wasMobile = isMobile;
      isMobile = window.innerWidth <= MOBILE_CONFIG.MOBILE_BREAKPOINT;
      
      if (wasMobile !== isMobile) {
        // Mode changed
        if (isMobileMenuOpen) {
          closeMobileMenu();
        }
        
        if (isMobile) {
          console.log('📱 Switched to mobile mode');
          setupMobileMenuEvents();
        } else {
          console.log('💻 Switched to desktop mode');
        }
      }
    }, 100);
  });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Check if element is visible
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  
  return rect.width > 0 && 
         rect.height > 0 && 
         computedStyle.visibility !== 'hidden' && 
         computedStyle.opacity !== '0';
}

// Debug helper
function debugMobileMenu() {
  console.log('🔍 Mobile Menu Debug:');
  console.log('Is Mobile:', isMobile);
  console.log('Is iOS:', isIOS);
  console.log('Menu Open:', isMobileMenuOpen);
  console.log('Toggle buttons:', document.querySelectorAll('.dropdown-toggle'));
  console.log('Dropdown:', document.querySelector('.mega-dropdown'));
  console.log('Current scroll:', currentScrollPosition);
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenuIOS);
} else {
  initMobileMenuIOS();
}

// Handle Shopify theme reloads
document.addEventListener('shopify:section:load', initMobileMenuIOS);
document.addEventListener('shopify:section:reorder', initMobileMenuIOS);

// ========================================
// HEADER HIDE/REVEAL FUNCTIONALITY
// ========================================

// Header scroll behavior configuration
const HEADER_CONFIG = {
  scrollThreshold: 5,  // Reduced for faster response
  scrollSpeed: 50,     // Reduced debounce for faster response
  headerSelector: '.glass-top-header',
  hiddenClass: 'header-hidden'
};

// Three-state navigation configuration
const NAV_STATES = {
  FULL: 'full',           // Header + Nav Tabs visible
  NAV_ONLY: 'nav-only',   // Only Nav Tabs visible
  FILTERS: 'filters'      // Nav Tabs + Filters visible (header pushed up)
};

// Scroll behavior configuration
const SCROLL_CONFIG = {
  showThreshold: 20,      // Show full header within this distance from top
  hideThreshold: 40,      // Start hiding header after this distance
  filtersThreshold: 30,   // Start checking for filters very early (reduced from 100)
  revealThreshold: 120,   // How far user must scroll up to reveal header
  debounceMs: 30          // Faster response for better UX
};

// Filter detection configuration
const FILTER_CONFIG = {
  selectors: [
    '.facets-toggle__button',
    '.facets-toggle',
    '.glass-filter-bar-container',
    '.facets-container',
    '.facets-block-wrapper',
    '.collection-filters',
    '.filter-sidebar',
    '.mobile-facets',
    '.facets',
    '[data-facets]',
    '.collection-facets',
    '.filters-wrapper',
    '.product-filters',
    '.collection-filter-toggle',
    '.filter-toggle-button',
    '.facets-block',
    '.facets-wrapper'
  ],
  stickyOffset: 200,  // Increased offset for filter elements
  minVisibleHeight: 10  // Reduced minimum height for better detection
};

// Header scroll state
let lastScrollTop = 0;
let scrollTimer = null;
let isHeaderHidden = false;
let headerElement = null;

// Three-state navigation tracking
let currentNavState = NAV_STATES.FULL;
let filterElements = [];
let slidingNavElement = null;

function initHeaderScrollBehavior() {
  if (!isMobile) return;

  headerElement = document.querySelector(HEADER_CONFIG.headerSelector);
  slidingNavElement = document.querySelector('.sliding-nav-container');

  if (!headerElement) return;

  // Detect filter elements - search more thoroughly with detailed logging
  filterElements = [];
  console.log('🔍 Searching for filter elements...');

  FILTER_CONFIG.selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`🔍 Selector "${selector}" found ${elements.length} elements`);
    if (elements.length > 0) {
      elements.forEach((el, index) => {
        console.log(`  - Element ${index}: ${el.tagName}.${el.className} (${Math.round(el.getBoundingClientRect().height)}px tall)`);
      });
    }
    filterElements.push(...elements);
  });

  // Remove duplicates
  filterElements = [...new Set(filterElements)];

  // Also search for any elements with filter-related attributes
  const additionalFilters = document.querySelectorAll('[class*="filter"], [class*="facet"], [id*="filter"], [id*="facet"]');
  console.log(`🔍 Additional filter elements found: ${additionalFilters.length}`);
  additionalFilters.forEach((el, index) => {
    if (!filterElements.includes(el)) {
      console.log(`  - Additional ${index}: ${el.tagName}.${el.className || el.id}`);
      filterElements.push(el);
    }
  });

  lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Add scroll event listener
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  console.log('📜 Three-state navigation initialized');
  console.log('🔍 Total filter elements found:', filterElements.length);
  console.log('🔍 Filter elements:', filterElements.map(el => `${el.tagName}.${el.className || el.id}`));
  console.log('🔍 Header element:', headerElement ? headerElement.className : 'NOT FOUND');
  console.log('🔍 Sliding nav element:', slidingNavElement ? slidingNavElement.className : 'NOT FOUND');
}

function handleHeaderScroll() {
  if (!isMobile || !headerElement) return;

  // Clear existing timer
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }

  // Debounce scroll events
  scrollTimer = setTimeout(updateHeaderVisibility, SCROLL_CONFIG.debounceMs);
}

function updateHeaderVisibility() {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
  const scrollDistance = Math.abs(currentScrollTop - lastScrollTop);

  // Only act if scroll distance exceeds threshold
  if (scrollDistance < HEADER_CONFIG.scrollThreshold) {
    return;
  }

  // Determine if filters are prominent
  const filtersProminent = areFiltersProminent();
  const newNavState = determineNavState(currentScrollTop, scrollDirection, filtersProminent);

  console.log(`📊 Current state: ${currentNavState} -> ${newNavState}`);

  // Only update if state changes
  if (newNavState !== currentNavState) {
    transitionToState(newNavState);
  }

  lastScrollTop = currentScrollTop;
}

function areFiltersProminent() {
  if (filterElements.length === 0) {
    console.log('🔍 No filter elements found');
    return false;
  }

  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  console.log(`🔍 Checking filters at scroll: ${currentScrollTop}`);

  // Check if any filter element is visible and in the prominent zone
  const prominentFilters = filterElements.filter(filterEl => {
    const rect = filterEl.getBoundingClientRect();
    const style = window.getComputedStyle(filterEl);

    // Element must be visible (more lenient check)
    const isVisible = rect.height > FILTER_CONFIG.minVisibleHeight &&
                     style.display !== 'none' &&
                     style.visibility !== 'hidden' &&
                     style.opacity !== '0';

    // Much more lenient prominent zone - anywhere in top 60% of viewport
    const viewportHeight = window.innerHeight;
    const isInProminentZone = rect.top >= -200 && rect.top <= (viewportHeight * 0.6);

    // Also check if element is just below nav area (common for filter buttons)
    const isJustBelowNav = rect.top >= 50 && rect.top <= 300;

    const isProminent = isVisible && (isInProminentZone || isJustBelowNav);

    console.log(`🔍 Filter check:`, {
      className: filterEl.className || filterEl.id,
      tagName: filterEl.tagName,
      top: Math.round(rect.top),
      height: Math.round(rect.height),
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      visible: isVisible,
      inZone: isInProminentZone,
      justBelowNav: isJustBelowNav,
      prominent: isProminent
    });

    return isProminent;
  });

  console.log(`🔍 Prominent filters: ${prominentFilters.length} / ${filterElements.length}`);

  // For debugging - if no filters are prominent, try to force detection of any visible filter-like elements
  if (prominentFilters.length === 0) {
    console.log('🔍 No prominent filters found, scanning for any visible filter elements...');
    const anyVisibleFilters = filterElements.filter(el => {
      const rect = el.getBoundingClientRect();
      const isAnywhereVisible = rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
      if (isAnywhereVisible) {
        console.log(`🔍 Found visible filter: ${el.className || el.id} at top: ${Math.round(rect.top)}`);
      }
      return isAnywhereVisible;
    });
    console.log(`🔍 Total visible filters anywhere: ${anyVisibleFilters.length}`);
  }

  return prominentFilters.length > 0;
}

function determineNavState(scrollTop, direction, filtersProminent) {
  console.log(`🤓 State determination:`, {
    scrollTop: Math.round(scrollTop),
    direction,
    filtersProminent,
    currentState: currentNavState,
    filterElementsFound: filterElements.length,
    thresholds: {
      show: SCROLL_CONFIG.showThreshold,
      hide: SCROLL_CONFIG.hideThreshold,
      filters: SCROLL_CONFIG.filtersThreshold,
      reveal: SCROLL_CONFIG.revealThreshold
    }
  });

  // Priority 1: At very top - always show full header
  if (scrollTop <= SCROLL_CONFIG.showThreshold) {
    console.log('🤓 -> FULL (at top)');
    return NAV_STATES.FULL;
  }

  // Priority 2: If we have filter elements and user has scrolled past the filter threshold,
  // force FILTERS state to keep them visible (this prevents immediate hiding)
  if (filterElements.length > 0 && scrollTop >= SCROLL_CONFIG.filtersThreshold && scrollTop <= 200) {
    console.log('🤓 -> FILTERS (filter elements exist and in filter zone)');
    return NAV_STATES.FILTERS;
  }

  // Priority 3: Filters are explicitly prominent - show filters state
  if (filtersProminent && scrollTop >= SCROLL_CONFIG.filtersThreshold) {
    console.log('🤓 -> FILTERS (filters explicitly prominent)');
    return NAV_STATES.FILTERS;
  }

  // Priority 4: Scrolling behavior with hysteresis to prevent jitter
  if (direction === 'up' && currentNavState !== NAV_STATES.FULL) {
    // When scrolling up, require significant upward movement to reveal header
    if (scrollTop >= SCROLL_CONFIG.revealThreshold) {
      console.log('🤓 -> NAV_ONLY (scrolling up but still far from top)');
      return NAV_STATES.NAV_ONLY;
    } else if (scrollTop < SCROLL_CONFIG.hideThreshold) {
      console.log('🤓 -> FULL (scrolled up enough to reveal header)');
      return NAV_STATES.FULL;
    }
  }

  // Priority 5: Scrolled past hide threshold - nav only
  if (scrollTop >= SCROLL_CONFIG.hideThreshold) {
    console.log('🤓 -> NAV_ONLY (scrolled down, no filters in range)');
    return NAV_STATES.NAV_ONLY;
  }

  // Default: Between show and hide threshold - maintain current state for stability
  console.log(`🤓 -> ${currentNavState} (transition zone - maintaining current)`);
  return currentNavState;
}

function transitionToState(newState) {
  console.log(`🔄 Transitioning from ${currentNavState} to ${newState}`);

  // Remove previous state classes
  document.body.classList.remove(`nav-state-${currentNavState}`);
  if (headerElement) headerElement.classList.remove(`nav-state-${currentNavState}`);
  if (slidingNavElement) slidingNavElement.classList.remove(`nav-state-${currentNavState}`);

  // Apply new state
  currentNavState = newState;
  document.body.classList.add(`nav-state-${newState}`);
  if (headerElement) headerElement.classList.add(`nav-state-${newState}`);
  if (slidingNavElement) slidingNavElement.classList.add(`nav-state-${newState}`);

  // Apply state-specific behavior
  switch (newState) {
    case NAV_STATES.FULL:
      setFullState();
      break;
    case NAV_STATES.NAV_ONLY:
      setNavOnlyState();
      break;
    case NAV_STATES.FILTERS:
      setFiltersState();
      break;
  }
}

function setFullState() {
  // Header visible, nav normal position
  if (headerElement) {
    headerElement.style.transform = 'translateY(0)';
    headerElement.classList.remove(HEADER_CONFIG.hiddenClass);
  }

  if (slidingNavElement) {
    slidingNavElement.classList.remove('nav-sticky-mode');
    slidingNavElement.style.position = 'static';
    slidingNavElement.style.top = 'auto';
    slidingNavElement.style.background = '#0A0A0A';
    slidingNavElement.style.backdropFilter = 'none';
    slidingNavElement.style.borderBottom = 'none';
  }

  document.body.classList.remove(HEADER_CONFIG.hiddenClass);
  isHeaderHidden = false;
}

function setNavOnlyState() {
  // Header hidden, nav sticky at top
  if (headerElement) {
    headerElement.style.transform = 'translateY(-100%)';
    headerElement.classList.add(HEADER_CONFIG.hiddenClass);
  }

  if (slidingNavElement) {
    slidingNavElement.classList.add('nav-sticky-mode');
    slidingNavElement.style.position = 'fixed';
    slidingNavElement.style.top = '0px';
    slidingNavElement.style.left = '0';
    slidingNavElement.style.right = '0';
    slidingNavElement.style.width = '100%';
    slidingNavElement.style.zIndex = '1600';
    slidingNavElement.style.background = 'rgba(8, 4, 21, 0.9)';
    slidingNavElement.style.backdropFilter = 'blur(20px) saturate(150%)';
    slidingNavElement.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
  }

  document.body.classList.add(HEADER_CONFIG.hiddenClass);
  isHeaderHidden = true;
}

function setFiltersState() {
  console.log('🤓 Setting FILTERS state - header hidden, nav sticky, filters visible');

  // Hide header
  if (headerElement) {
    headerElement.style.transform = 'translateY(-100%)';
    headerElement.classList.add(HEADER_CONFIG.hiddenClass);
  }

  // Make nav sticky but ensure filters stay visible below it
  if (slidingNavElement) {
    slidingNavElement.classList.add('nav-sticky-mode', 'filters-mode');
    slidingNavElement.style.position = 'fixed';
    slidingNavElement.style.top = '0px';
    slidingNavElement.style.left = '0';
    slidingNavElement.style.right = '0';
    slidingNavElement.style.width = '100%';
    slidingNavElement.style.zIndex = '1600'; // High enough to stay on top
    slidingNavElement.style.background = 'rgba(8, 4, 21, 0.9)';
    slidingNavElement.style.backdropFilter = 'blur(20px) saturate(150%)';
    slidingNavElement.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
  }

  // Ensure filter elements are visible - apply styles carefully to prevent jumps
  filterElements.forEach(filterEl => {
    if (filterEl) {
      // Only apply styles that don't cause layout shifts
      filterEl.style.visibility = 'visible';
      filterEl.style.opacity = '1';
      filterEl.style.zIndex = '1520';

      // Only set position if it's not already appropriate
      const currentPosition = window.getComputedStyle(filterEl).position;
      if (currentPosition === 'absolute' || currentPosition === 'fixed') {
        filterEl.style.position = 'relative';
      }

      // Remove any transforms that might hide elements
      if (filterEl.style.transform && filterEl.style.transform !== 'none') {
        filterEl.style.transform = 'none';
      }

      console.log('🔧 Adjusted filter element:', filterEl.className || filterEl.id, 'position:', currentPosition);
    }
  });

  document.body.classList.add(HEADER_CONFIG.hiddenClass, 'filters-prominent');
  isHeaderHidden = true;

  console.log('✅ FILTERS state applied - nav sticky, filters should be visible');
}

// Legacy functions for backward compatibility
function hideHeader() {
  transitionToState(NAV_STATES.NAV_ONLY);
}

function showHeader() {
  transitionToState(NAV_STATES.FULL);
}

function disableHeaderSticky() {
  if (headerElement) {
    headerElement.style.position = 'static';
  }
  console.log('🚫 Header sticky disabled');
}

function makeHeaderAlwaysVisible() {
  if (headerElement) {
    headerElement.style.position = 'fixed';
    headerElement.style.transform = 'translateY(0)';
  }
  console.log('👀 Header always visible');
}

// Add CSS for header animations
function addHeaderAnimationStyles() {
  if (document.getElementById('header-animation-styles')) return;

  const style = document.createElement('style');
  style.id = 'header-animation-styles';
  style.textContent = `
    @media (max-width: 768px) {
      .glass-top-header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 100 !important;
        width: 100% !important;
        background: rgba(8, 4, 21, 0.95) !important;
        backdrop-filter: blur(20px) saturate(150%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      }

      .glass-top-header.header-hidden {
        transform: translateY(-100%) !important;
      }

      body {
        padding-top: 60px !important;
      }

      body.header-hidden {
        padding-top: 60px !important; /* Keep padding for sticky nav */
      }
    }
  `;
  document.head.appendChild(style);
}

// Export for external use
window.MobileMenuIOS = {
  init: initMobileMenuIOS,
  open: openMobileMenu,
  close: closeMobileMenu,
  toggle: toggleMobileMenu,
  debug: debugMobileMenu,
  isOpen: () => isMobileMenuOpen,

  // Header control functions
  hideHeader: hideHeader,
  showHeader: showHeader,
  disableSticky: disableHeaderSticky,
  alwaysVisible: makeHeaderAlwaysVisible,
  isHeaderHidden: () => isHeaderHidden
};

// Initialize header behavior after mobile menu with multiple attempts
setTimeout(() => {
  addHeaderAnimationStyles();
  initHeaderScrollBehavior();
}, 100);

// Re-initialize after a longer delay to catch dynamically loaded content
setTimeout(() => {
  console.log('🔄 Re-initializing filter detection for dynamic content...');
  if (isMobile && filterElements.length === 0) {
    initHeaderScrollBehavior();
  }
}, 2000);

// Also re-initialize on any Shopify theme changes
document.addEventListener('shopify:section:load', () => {
  setTimeout(() => {
    console.log('🔄 Shopify section loaded, re-initializing filters...');
    if (isMobile) {
      initHeaderScrollBehavior();
    }
  }, 500);
});

console.log('📱 Mobile Menu iOS module loaded');