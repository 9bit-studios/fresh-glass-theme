// ========================================
// PRODUCTION CLEAR ALL & NAVIGATION INTEGRATION
// Complete solution for Clear All -> collections/all + "All Games" tab activation
// Ready for tomorrow's demo
// ========================================

// Main integration controller
class ProductionFilterNavigation {
  constructor() {
    this.isInitialized = false;
    this.navTabSelectors = [
      '.nav-tab',
      '.glass-tab',
      '.sliding-nav-tab',
      'a[href*="/collections/"]'
    ];
    this.clearAllSelectors = [
      '.facets__clear-all',
      '.mobile-facets__clear',
      '.clear-all-filters',
      '.clear-filter',
      'button[data-facet-clear]',
      '.interactive-clear-all'
    ];
    this.allGamesSelectors = [
      'a[href="/collections"]',
      'a[href="/collections/all"]',
      '[data-collection="all"]',
      '.nav-tab[href="/collections"]',
      '.glass-tab[href="/collections"]'
    ];
    
    this.init();
  }
  
  init() {
    if (this.isInitialized) return;
    
    console.log('🦄 Initializing Production Filter Navigation...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
    
    // Handle dynamic content loading
    document.addEventListener('shopify:section:load', () => this.setup());
    document.addEventListener('shopify:section:reorder', () => this.setup());
    
    // Handle browser navigation
    window.addEventListener('popstate', () => this.handlePageNavigation());
    
    this.isInitialized = true;
  }
  
  setup() {
    try {
      console.log('🔧 Setting up production filter navigation...');
      
      // Set up Clear All functionality
      this.setupClearAllButtons();
      
      // Set up nav tab state management
      this.setupNavTabManagement();
      
      // Set up filter change monitoring
      this.setupFilterChangeMonitoring();
      
      // Initial nav state setup
      this.updateNavTabStates();
      
      console.log('✅ Production filter navigation setup complete');
      
    } catch (error) {
      console.error('❌ Error setting up production filter navigation:', error);
    }
  }
  
  // ========================================
  // CLEAR ALL FUNCTIONALITY
  // Enhanced Clear All that navigates to /collections/all
  // ========================================
  
  setupClearAllButtons() {
    console.log('🔧 Setting up Clear All buttons...');
    
    const clearAllButtons = this.findElements(this.clearAllSelectors);
    
    if (clearAllButtons.length === 0) {
      console.log('⚠️ No Clear All buttons found');
      return;
    }
    
    console.log(`✅ Found ${clearAllButtons.length} Clear All buttons`);
    
    clearAllButtons.forEach((button, index) => {
      this.enhanceClearAllButton(button, index);
    });
  }
  
  enhanceClearAllButton(button, index) {
    try {
      console.log(`🔧 Enhancing Clear All button ${index + 1}`);
      
      // Remove existing event listeners by cloning
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add production-ready click handler
      newButton.addEventListener('click', (event) => {
        this.handleClearAllClick(event, newButton);
      });
      
      // Add enhanced styling class
      newButton.classList.add('production-clear-all-enhanced');
      
      // Update button text for better UX
      this.updateClearAllButtonText(newButton);
      
      console.log(`✅ Enhanced Clear All button ${index + 1}`);
      
    } catch (error) {
      console.error(`❌ Error enhancing Clear All button ${index + 1}:`, error);
    }
  }
  
  handleClearAllClick(event, button) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🤓 Production Clear All clicked');
    
    try {
      const currentPath = window.location.pathname;
      
      // Add loading state
      button.style.opacity = '0.6';
      button.style.pointerEvents = 'none';
      
      // Clear all filters first (for immediate visual feedback)
      this.clearAllFiltersImmediate();
      
      // Navigate to ALL collections and activate "All Games" tab
      if (currentPath.includes('/collections/') && !currentPath.includes('/collections/all')) {
        this.navigateToAllCollections();
      } else {
        // Already on all collections, just clear filters and update nav
        this.clearFiltersAndUpdateNav();
      }
      
    } catch (error) {
      console.error('❌ Error handling Clear All click:', error);
      // Restore button state on error
      button.style.opacity = '';
      button.style.pointerEvents = '';
    }
  }
  
  navigateToAllCollections() {
    console.log('🦄 Navigating to ALL collections...');
    
    // Add smooth transition
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.9';
    
    // Navigate to all collections
    const targetUrl = '/collections/all';
    
    // Use pushState for better UX, then navigate
    if (window.history.pushState) {
      window.history.pushState(null, '', targetUrl);
      
      // Trigger a page reload to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      // Fallback to direct navigation
      window.location.href = targetUrl;
    }
  }
  
  clearFiltersAndUpdateNav() {
    console.log('🔄 Clearing filters and updating navigation...');
    
    // Clear all filter inputs
    this.clearAllFiltersImmediate();
    
    // Activate "All Games" nav tab
    this.activateAllGamesTab();
    
    // Update URL to remove filter parameters
    this.cleanUrl();
    
    // Restore visual state
    setTimeout(() => {
      document.body.style.opacity = '';
      document.body.style.transition = '';
    }, 300);
  }
  
  updateClearAllButtonText(button) {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/collections/') && !currentPath.includes('/collections/all')) {
      // On specific collection - show "View All Games"
      const originalText = button.textContent.trim();
      
      if (originalText.toLowerCase().includes('clear')) {
        button.innerHTML = `
          <span class="clear-all-enhanced-content">
            <span class="clear-icon">↺</span>
            <span class="clear-text">
              <span class="clear-main">View All Games</span>
              <span class="clear-sub">Clear filters</span>
            </span>
          </span>
        `;
      }
    }
  }
  
  // ========================================
  // NAVIGATION TAB STATE MANAGEMENT
  // Handle nav tab activation and deactivation
  // ========================================
  
  setupNavTabManagement() {
    console.log('🔧 Setting up navigation tab management...');
    
    // Monitor filter changes
    document.addEventListener('facets:updated', () => {
      this.handleFilterChange();
    });
    
    document.addEventListener('facets:cleared', () => {
      this.handleFilterChange();
    });
    
    // Monitor URL changes
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (lastUrl !== currentUrl) {
        lastUrl = currentUrl;
        this.handlePageNavigation();
      }
    });
    
    urlObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  updateNavTabStates() {
    try {
      const currentPath = window.location.pathname;
      const hasActiveFilters = this.hasActiveFilters();
      
      console.log(`📍 Current path: ${currentPath}, Active filters: ${hasActiveFilters}`);
      
      // Clear all active states first
      this.clearAllNavTabStates();
      
      if (hasActiveFilters) {
        // When filters are active, deactivate collection-specific tabs
        console.log('🔍 Filters active - deactivating collection tabs');
        this.deactivateCollectionTabs();
      } else {
        // No filters - set appropriate tab based on current path
        this.setActiveTabByPath(currentPath);
      }
      
    } catch (error) {
      console.error('❌ Error updating nav tab states:', error);
    }
  }
  
  setActiveTabByPath(currentPath) {
    if (currentPath === '/collections' || currentPath === '/collections/all' || currentPath === '/collections/') {
      // Activate "All Games" tab
      this.activateAllGamesTab();
    } else if (currentPath.includes('/collections/')) {
      // Activate specific collection tab
      const collectionHandle = this.extractCollectionHandle(currentPath);
      if (collectionHandle) {
        this.activateCollectionTab(collectionHandle);
      }
    }
  }
  
  activateAllGamesTab() {
    console.log('🤓 Activating All Games tab...');
    
    const allGamesTabs = this.findElements(this.allGamesSelectors);
    
    if (allGamesTabs.length === 0) {
      console.log('⚠️ No All Games tabs found');
      // Try alternative selectors
      const alternativeSelectors = [
        '.nav-tab:first-child',
        '.glass-tab:first-child',
        '[data-collection=""]'
      ];
      const alternativeTabs = this.findElements(alternativeSelectors);
      if (alternativeTabs.length > 0) {
        alternativeTabs[0].classList.add('active');
        console.log('✅ Activated alternative All Games tab');
      }
      return;
    }
    
    // Activate all matching All Games tabs
    allGamesTabs.forEach(tab => {
      tab.classList.add('active');
      tab.setAttribute('aria-current', 'page');
    });
    
    console.log(`✅ Activated ${allGamesTabs.length} All Games tabs`);
  }
  
  activateCollectionTab(collectionHandle) {
    console.log(`🤓 Activating collection tab for: ${collectionHandle}`);
    
    const collectionSelectors = [
      `a[href="/collections/${collectionHandle}"]`,
      `a[href*="/collections/${collectionHandle}"]`,
      `[data-collection="${collectionHandle}"]`,
      `.nav-tab[href="/collections/${collectionHandle}"]`,
      `.glass-tab[href="/collections/${collectionHandle}"]`
    ];
    
    const collectionTabs = this.findElements(collectionSelectors);
    
    if (collectionTabs.length === 0) {
      console.log(`⚠️ No tabs found for collection: ${collectionHandle}`);
      return;
    }
    
    // Activate matching collection tabs
    collectionTabs.forEach(tab => {
      tab.classList.add('active');
      tab.setAttribute('aria-current', 'page');
    });
    
    console.log(`✅ Activated ${collectionTabs.length} collection tabs for: ${collectionHandle}`);
  }
  
  clearAllNavTabStates() {
    const allTabs = this.findElements(this.navTabSelectors);
    
    allTabs.forEach(tab => {
      tab.classList.remove('active');
      tab.removeAttribute('aria-current');
    });
  }
  
  deactivateCollectionTabs() {
    const collectionTabs = this.findElements([
      'a[href*="/collections/"]:not([href="/collections"]):not([href="/collections/all"])',
      '[data-collection]:not([data-collection=""]):not([data-collection="all"])'
    ]);
    
    collectionTabs.forEach(tab => {
      tab.classList.remove('active');
      tab.removeAttribute('aria-current');
    });
  }
  
  // ========================================
  // FILTER CHANGE MONITORING
  // Detect when filters change to update nav states
  // ========================================
  
  setupFilterChangeMonitoring() {
    console.log('👀 Setting up filter change monitoring...');
    
    // Create mutation observer for filter changes
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || 
            (mutation.type === 'attributes' && ['checked', 'value'].includes(mutation.attributeName))) {
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        // Debounce updates
        clearTimeout(this.filterChangeTimeout);
        this.filterChangeTimeout = setTimeout(() => {
          this.handleFilterChange();
        }, 100);
      }
    });
    
    // Observe filter container
    const facetsContainer = document.querySelector('.facets, [data-facets-form]');
    if (facetsContainer) {
      observer.observe(facetsContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['checked', 'value']
      });
    }
    
    // Also listen for form submissions
    document.addEventListener('submit', (event) => {
      if (event.target.closest('.facets__form, [data-facets-form]')) {
        setTimeout(() => this.handleFilterChange(), 200);
      }
    });
  }
  
  handleFilterChange() {
    console.log('🔄 Filter change detected');
    this.updateNavTabStates();
  }
  
  handlePageNavigation() {
    console.log('📍 Page navigation detected');
    setTimeout(() => {
      this.updateNavTabStates();
    }, 100);
  }
  
  // ========================================
  // UTILITY FUNCTIONS
  // Helper functions for filter and navigation operations
  // ========================================
  
  hasActiveFilters() {
    // Check for checked filter inputs
    const checkedInputs = document.querySelectorAll('.facets input:checked');
    
    // Check for price range values
    const priceInputs = document.querySelectorAll('.facets input[type="range"], .facets input[name*="price"]');
    let hasPriceFilters = false;
    
    priceInputs.forEach(input => {
      if (input.value && input.value !== input.min && input.value !== '0') {
        hasPriceFilters = true;
      }
    });
    
    // Check URL parameters for filters
    const urlParams = new URLSearchParams(window.location.search);
    const hasUrlFilters = Array.from(urlParams.keys()).some(key => 
      key.startsWith('filter') || key.includes('price') || key.includes('availability')
    );
    
    return checkedInputs.length > 0 || hasPriceFilters || hasUrlFilters;
  }
  
  clearAllFiltersImmediate() {
    try {
      // Clear checkbox and radio inputs
      const filterInputs = document.querySelectorAll('.facets input[type="checkbox"], .facets input[type="radio"]');
      filterInputs.forEach(input => {
        if (input.checked) {
          input.checked = false;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      
      // Clear range and number inputs
      const rangeInputs = document.querySelectorAll('.facets input[type="range"], .facets input[type="number"]');
      rangeInputs.forEach(input => {
        const defaultValue = input.getAttribute('min') || input.getAttribute('data-default') || '';
        if (input.value !== defaultValue) {
          input.value = defaultValue;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      
      // Clear quick filter buttons
      const quickButtons = document.querySelectorAll('.quick-filter-button');
      quickButtons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      });
      
      // Trigger filter update events
      document.dispatchEvent(new CustomEvent('facets:cleared', { bubbles: true }));
      
    } catch (error) {
      console.error('❌ Error clearing filters:', error);
    }
  }
  
  cleanUrl() {
    try {
      const url = new URL(window.location);
      const keysToRemove = [];
      
      // Find filter-related parameters
      for (const key of url.searchParams.keys()) {
        if (key.startsWith('filter') || key.includes('price') || key.includes('availability') || key.includes('sort')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove filter parameters
      keysToRemove.forEach(key => url.searchParams.delete(key));
      
      // Update URL without page reload
      if (window.history.replaceState) {
        window.history.replaceState({}, '', url.toString());
      }
      
    } catch (error) {
      console.error('❌ Error cleaning URL:', error);
    }
  }
  
  extractCollectionHandle(path) {
    const match = path.match(/\/collections\/([^\/\?]+)/);
    return match ? match[1] : null;
  }
  
  findElements(selectors) {
    const elements = [];
    
    selectors.forEach(selector => {
      try {
        const found = document.querySelectorAll(selector);
        found.forEach(el => {
          if (!elements.includes(el)) {
            elements.push(el);
          }
        });
      } catch (error) {
        // Invalid selector, skip
      }
    });
    
    return elements;
  }
}

// ========================================
// ENHANCED "SEE X ITEMS" BUTTON SOLUTION
// Convert non-functional button to functional or hide it
// ========================================

class SeeItemsButtonManager {
  constructor() {
    this.setup();
  }
  
  setup() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.processSeeItemsButtons());
    } else {
      this.processSeeItemsButtons();
    }
    
    // Handle dynamic content
    document.addEventListener('shopify:section:load', () => this.processSeeItemsButtons());
  }
  
  processSeeItemsButtons() {
    const seeItemsButtons = document.querySelectorAll('.facets__see-results, .mobile-facets__apply, [data-see-results]');
    
    seeItemsButtons.forEach(button => {
      this.enhanceSeeItemsButton(button);
    });
  }
  
  enhanceSeeItemsButton(button) {
    try {
      // Check if button has actual functionality
      const hasClickHandler = button.onclick || button.addEventListener || button.getAttribute('onclick');
      const hasFormAction = button.closest('form');
      
      if (!hasClickHandler && !hasFormAction) {
        // Button is non-functional, make it functional or hide it
        this.makeButtonFunctional(button);
      }
      
    } catch (error) {
      console.error('❌ Error enhancing see items button:', error);
    }
  }
  
  makeButtonFunctional(button) {
    // Option 1: Make it close the filter drawer (mobile)
    if (this.isMobile() || button.closest('.mobile-facets, .facets--drawer')) {
      button.addEventListener('click', () => {
        this.closeMobileFilters();
      });
      
      button.textContent = 'Apply Filters';
      return;
    }
    
    // Option 2: Make it submit the filter form
    const filterForm = button.closest('form') || document.querySelector('.facets__form');
    if (filterForm) {
      button.addEventListener('click', () => {
        filterForm.submit();
      });
      return;
    }
    
    // Option 3: Hide the button if we can't make it functional
    button.style.display = 'none';
    console.log('ℹ️ Hid non-functional See Items button');
  }
  
  closeMobileFilters() {
    // Try to close mobile filter drawer
    const closeButtons = document.querySelectorAll('.facets-drawer__close, .mobile-facets__close, [data-close-drawer]');
    if (closeButtons.length > 0) {
      closeButtons[0].click();
    }
    
    // Or hide drawer directly
    const drawer = document.querySelector('.facets--drawer, .mobile-facets');
    if (drawer) {
      drawer.style.display = 'none';
    }
  }
  
  isMobile() {
    return window.innerWidth < 750;
  }
}

// ========================================
// INITIALIZATION AND EXPORT
// ========================================

// Initialize the production system
let productionFilterNavigation;
let seeItemsButtonManager;

document.addEventListener('DOMContentLoaded', function() {
  console.log('🦄 Initializing Production Filter System...');
  
  productionFilterNavigation = new ProductionFilterNavigation();
  seeItemsButtonManager = new SeeItemsButtonManager();
  
  console.log('✅ Production Filter System initialized');
});

// Export for external use
window.ProductionFilterNavigation = ProductionFilterNavigation;
window.SeeItemsButtonManager = SeeItemsButtonManager;

// Debug helper
window.debugProductionFilters = function() {
  console.log('🔍 Debug: Production Filter System State');
  console.log('Navigation instance:', productionFilterNavigation);
  console.log('See items manager:', seeItemsButtonManager);
  console.log('Active filters:', productionFilterNavigation?.hasActiveFilters());
  console.log('Current path:', window.location.pathname);
  console.log('Nav tabs:', document.querySelectorAll('.nav-tab, .glass-tab'));
  console.log('Clear All buttons:', document.querySelectorAll('.facets__clear-all, .clear-all-filters'));
};