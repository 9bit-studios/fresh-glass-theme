// ========================================
// FRAMER PRODUCT HUB INSPIRED MENU INTERACTIONS
// Enhanced dropdown animations and mobile menu functionality
// ========================================

// Configuration
const FRAMER_MENU_CONFIG = {
  // Animation timings (in milliseconds)
  DESKTOP_DROPDOWN_DELAY: 150,
  DESKTOP_DROPDOWN_DURATION: 350,
  MOBILE_MENU_DURATION: 400,
  HOVER_DEBOUNCE: 50,
  
  // Selectors
  DROPDOWN_TOGGLE: '.dropdown-toggle',
  MEGA_DROPDOWN: '.mega-dropdown, .glass-mega-dropdown',
  MOBILE_MENU_TOGGLE: '.mobile-menu-toggle',
  MOBILE_MENU_PANEL: '.mobile-menu-panel',
  MOBILE_MENU_OVERLAY: '.mobile-menu-overlay',
  DROPDOWN_ITEMS: '.dropdown-item, .glass-dropdown-item',
  
  // States
  ACTIVE_CLASS: 'active',
  LOADING_CLASS: 'loading',
  EXPANDED_ATTR: 'aria-expanded',
  
  // Breakpoints
  MOBILE_BREAKPOINT: 768
};

// State management
let activeDropdown = null;
let mobileMenuOpen = false;
let hoverTimeout = null;
let isDesktop = window.innerWidth > FRAMER_MENU_CONFIG.MOBILE_BREAKPOINT;

// ========================================
// INITIALIZATION
// ========================================

function initFramerMenuSystem() {
  console.log('🚀 Initializing Framer-inspired menu system...');
  
  // Initialize desktop dropdowns
  initDesktopDropdowns();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Setup responsive behavior
  setupResponsiveHandlers();
  
  // Setup accessibility
  setupAccessibility();
  
  // Setup performance optimizations
  setupPerformanceOptimizations();
  
  console.log('✅ Framer menu system initialized');
}

// ========================================
// DESKTOP DROPDOWN FUNCTIONALITY
// ========================================

function initDesktopDropdowns() {
  const toggles = document.querySelectorAll(FRAMER_MENU_CONFIG.DROPDOWN_TOGGLE);
  
  toggles.forEach(toggle => {
    const dropdown = toggle.nextElementSibling;
    if (!dropdown || !dropdown.matches(FRAMER_MENU_CONFIG.MEGA_DROPDOWN)) return;
    
    setupDropdownToggle(toggle, dropdown);
    setupDropdownHover(toggle, dropdown);
    setupDropdownItems(dropdown);
  });
}

function setupDropdownToggle(toggle, dropdown) {
  // Click handler
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isExpanded = toggle.getAttribute(FRAMER_MENU_CONFIG.EXPANDED_ATTR) === 'true';
    
    if (isExpanded) {
      closeDropdown(toggle, dropdown);
    } else {
      openDropdown(toggle, dropdown);
    }
  });
  
  // Keyboard handler
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    } else if (e.key === 'Escape') {
      closeDropdown(toggle, dropdown);
      toggle.focus();
    }
  });
}

function setupDropdownHover(toggle, dropdown) {
  if (!isDesktop) return;
  
  // Mouse enter with delay
  toggle.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      if (activeDropdown !== dropdown) {
        openDropdown(toggle, dropdown);
      }
    }, FRAMER_MENU_CONFIG.HOVER_DEBOUNCE);
  });
  
  // Mouse leave with delay
  const container = toggle.closest('.nav-dropdown') || toggle.parentElement;
  container.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      closeDropdown(toggle, dropdown);
    }, FRAMER_MENU_CONFIG.DESKTOP_DROPDOWN_DELAY);
  });
  
  // Keep open when hovering dropdown
  dropdown.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
  });
  
  dropdown.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      closeDropdown(toggle, dropdown);
    }, FRAMER_MENU_CONFIG.DESKTOP_DROPDOWN_DELAY);
  });
}

function setupDropdownItems(dropdown) {
  const items = dropdown.querySelectorAll(FRAMER_MENU_CONFIG.DROPDOWN_ITEMS);
  
  items.forEach((item, index) => {
    // Add stagger animation delay
    item.style.setProperty('--animation-delay', `${index * 0.05}s`);
    
    // Enhanced hover effects
    item.addEventListener('mouseenter', () => {
      item.style.setProperty('--hover-scale', '1.02');
      
      // Add subtle vibration effect
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.removeProperty('--hover-scale');
    });
    
    // Track current page
    if (item.href && window.location.pathname.includes(item.href)) {
      item.classList.add('current');
    }
  });
}

function openDropdown(toggle, dropdown) {
  // Close any other open dropdowns
  if (activeDropdown && activeDropdown !== dropdown) {
    closeAllDropdowns();
  }
  
  // Set state
  activeDropdown = dropdown;
  toggle.setAttribute(FRAMER_MENU_CONFIG.EXPANDED_ATTR, 'true');
  dropdown.classList.add(FRAMER_MENU_CONFIG.ACTIVE_CLASS);
  
  // Add loading state briefly for better UX
  dropdown.setAttribute('data-loading', 'true');
  setTimeout(() => {
    dropdown.removeAttribute('data-loading');
  }, 100);
  
  // Trigger animation
  requestAnimationFrame(() => {
    dropdown.style.display = 'grid';
    dropdown.offsetHeight; // Force reflow
    
    // Apply active styles
    dropdown.style.opacity = '1';
    dropdown.style.visibility = 'visible';
    dropdown.style.pointerEvents = 'auto';
  });
  
  // Focus management
  const firstItem = dropdown.querySelector(FRAMER_MENU_CONFIG.DROPDOWN_ITEMS);
  if (firstItem && document.activeElement === toggle) {
    setTimeout(() => firstItem.focus(), FRAMER_MENU_CONFIG.DESKTOP_DROPDOWN_DURATION / 2);
  }
  
  console.log('📖 Dropdown opened');
}

function closeDropdown(toggle, dropdown) {
  if (!dropdown.classList.contains(FRAMER_MENU_CONFIG.ACTIVE_CLASS)) return;
  
  // Set state
  activeDropdown = null;
  toggle.setAttribute(FRAMER_MENU_CONFIG.EXPANDED_ATTR, 'false');
  dropdown.classList.remove(FRAMER_MENU_CONFIG.ACTIVE_CLASS);
  
  // Trigger close animation
  dropdown.style.opacity = '0';
  dropdown.style.visibility = 'hidden';
  dropdown.style.pointerEvents = 'none';
  
  setTimeout(() => {
    if (!dropdown.classList.contains(FRAMER_MENU_CONFIG.ACTIVE_CLASS)) {
      dropdown.style.display = 'none';
    }
  }, FRAMER_MENU_CONFIG.DESKTOP_DROPDOWN_DURATION);
  
  console.log('📕 Dropdown closed');
}

function closeAllDropdowns() {
  const openDropdowns = document.querySelectorAll(`${FRAMER_MENU_CONFIG.MEGA_DROPDOWN}.${FRAMER_MENU_CONFIG.ACTIVE_CLASS}`);
  
  openDropdowns.forEach(dropdown => {
    const toggle = dropdown.previousElementSibling;
    if (toggle) {
      closeDropdown(toggle, dropdown);
    }
  });
}

// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================

function initMobileMenu() {
  const toggles = document.querySelectorAll(FRAMER_MENU_CONFIG.MOBILE_MENU_TOGGLE);
  const panels = document.querySelectorAll(FRAMER_MENU_CONFIG.MOBILE_MENU_PANEL);
  const overlays = document.querySelectorAll(FRAMER_MENU_CONFIG.MOBILE_MENU_OVERLAY);
  
  // Setup mobile menu toggles
  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (mobileMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  });
  
  // Setup overlay clicks
  overlays.forEach(overlay => {
    overlay.addEventListener('click', closeMobileMenu);
  });
  
  // Setup escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      closeMobileMenu();
    }
  });
  
  // Setup close buttons
  const closeButtons = document.querySelectorAll('.menu-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeMobileMenu);
  });
}

function openMobileMenu() {
  const panel = document.querySelector(FRAMER_MENU_CONFIG.MOBILE_MENU_PANEL);
  const overlay = document.querySelector(FRAMER_MENU_CONFIG.MOBILE_MENU_OVERLAY);
  const toggles = document.querySelectorAll(FRAMER_MENU_CONFIG.MOBILE_MENU_TOGGLE);
  
  if (!panel) return;
  
  mobileMenuOpen = true;
  
  // Update toggle states
  toggles.forEach(toggle => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('active');
  });
  
  // Show elements
  if (overlay) {
    overlay.style.display = 'block';
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
  }
  
  panel.style.display = 'flex';
  requestAnimationFrame(() => {
    panel.classList.add('active');
  });
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.width = '100%';
  
  // Focus first menu item
  const firstMenuItem = panel.querySelector('.menu-link');
  if (firstMenuItem) {
    setTimeout(() => firstMenuItem.focus(), FRAMER_MENU_CONFIG.MOBILE_MENU_DURATION / 2);
  }
  
  console.log('📱 Mobile menu opened');
}

function closeMobileMenu() {
  const panel = document.querySelector(FRAMER_MENU_CONFIG.MOBILE_MENU_PANEL);
  const overlay = document.querySelector(FRAMER_MENU_CONFIG.MOBILE_MENU_OVERLAY);
  const toggles = document.querySelectorAll(FRAMER_MENU_CONFIG.MOBILE_MENU_TOGGLE);
  
  if (!panel || !mobileMenuOpen) return;
  
  mobileMenuOpen = false;
  
  // Update toggle states
  toggles.forEach(toggle => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('active');
  });
  
  // Hide elements
  panel.classList.remove('active');
  
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      if (!mobileMenuOpen) overlay.style.display = 'none';
    }, FRAMER_MENU_CONFIG.MOBILE_MENU_DURATION);
  }
  
  setTimeout(() => {
    if (!mobileMenuOpen) {
      panel.style.display = 'none';
    }
  }, FRAMER_MENU_CONFIG.MOBILE_MENU_DURATION);
  
  // Restore body scroll
  const scrollY = document.body.style.top;
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
  
  console.log('📱 Mobile menu closed');
}

// ========================================
// RESPONSIVE HANDLERS
// ========================================

function setupResponsiveHandlers() {
  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });
  
  // Orientation change handler
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 200); // Delay for orientation change
  });
}

function handleResize() {
  const wasDesktop = isDesktop;
  isDesktop = window.innerWidth > FRAMER_MENU_CONFIG.MOBILE_BREAKPOINT;
  
  if (wasDesktop !== isDesktop) {
    // Mode changed - reset all menus
    closeAllDropdowns();
    closeMobileMenu();
    
    // Re-initialize for new mode
    if (isDesktop) {
      initDesktopDropdowns();
    }
    
    console.log(`🔄 Switched to ${isDesktop ? 'desktop' : 'mobile'} mode`);
  }
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

function setupAccessibility() {
  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown') && activeDropdown) {
      closeAllDropdowns();
    }
  });
  
  // Improved keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!activeDropdown) return;
    
    const items = activeDropdown.querySelectorAll(FRAMER_MENU_CONFIG.DROPDOWN_ITEMS);
    const currentIndex = Array.from(items).indexOf(document.activeElement);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[nextIndex]?.focus();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prevIndex]?.focus();
        break;
        
      case 'Home':
        e.preventDefault();
        items[0]?.focus();
        break;
        
      case 'End':
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
    }
  });
  
  // Announce menu state changes
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
  
  // Announce dropdown state changes
  document.addEventListener('dropdown:opened', () => {
    announcer.textContent = 'Menu expanded';
  });
  
  document.addEventListener('dropdown:closed', () => {
    announcer.textContent = 'Menu collapsed';
  });
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

function setupPerformanceOptimizations() {
  // Preload critical animations
  const style = document.createElement('style');
  style.textContent = `
    .mega-dropdown,
    .glass-mega-dropdown {
      transform: translateX(-50%) translateY(8px) scale(0.96) translateZ(0);
    }
  `;
  document.head.appendChild(style);
  
  // Intersection observer for performance
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.willChange = 'transform, opacity';
        } else {
          entry.target.style.willChange = 'auto';
        }
      });
    });
    
    document.querySelectorAll(FRAMER_MENU_CONFIG.MEGA_DROPDOWN).forEach(dropdown => {
      observer.observe(dropdown);
    });
  }
  
  // Passive event listeners where possible
  const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
  passiveEvents.forEach(event => {
    document.addEventListener(event, () => {}, { passive: true });
  });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is visible
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && 
         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
         rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

// Custom event dispatchers
function dispatchDropdownEvent(type, dropdown) {
  const event = new CustomEvent(`dropdown:${type}`, {
    detail: { dropdown },
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(event);
}

// ========================================
// INITIALIZATION AND CLEANUP
// ========================================

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFramerMenuSystem);
} else {
  initFramerMenuSystem();
}

// Handle Shopify section reloads
document.addEventListener('shopify:section:load', initFramerMenuSystem);
document.addEventListener('shopify:section:reorder', initFramerMenuSystem);

// Export for external use
window.FramerMenuSystem = {
  init: initFramerMenuSystem,
  openDropdown,
  closeDropdown,
  closeAllDropdowns,
  openMobileMenu,
  closeMobileMenu,
  config: FRAMER_MENU_CONFIG
};

// Debug helper
window.debugFramerMenu = function() {
  console.log('🔍 Framer Menu Debug Info:');
  console.log('Is Desktop:', isDesktop);
  console.log('Active Dropdown:', activeDropdown);
  console.log('Mobile Menu Open:', mobileMenuOpen);
  console.log('Dropdown Toggles:', document.querySelectorAll(FRAMER_MENU_CONFIG.DROPDOWN_TOGGLE));
  console.log('Mega Dropdowns:', document.querySelectorAll(FRAMER_MENU_CONFIG.MEGA_DROPDOWN));
};

console.log('✅ Framer-inspired menu system loaded');