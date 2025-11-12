

class GlassFilterIntegration {
  constructor() {
    this.sidebar = null;
    this.overlay = null;
    this.navigationButton = null;
    this.isInitialized = false;
    
    // New properties for complete integration
    this.viewToggleGroup = null;
    this.filterBar = null;
    this.sortSelect = null;
    this.resultsCount = null;
    this.productGrid = null;
    this.currentView = 'grid';
    this.activeFilters = new Map();
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Get elements
    this.sidebar = document.getElementById('glass-filter-sidebar');
    this.overlay = document.getElementById('glass-filter-overlay');
    this.navigationButton = document.getElementById('glass-filter-toggle');
    
    // Get new elements for complete integration
    this.viewToggleGroup = document.querySelector('.view-toggle-group');
    this.filterBar = document.querySelector('.glass-filter-bar-container');
    this.sortSelect = document.querySelector('.glass-filter-select');
    this.resultsCount = document.getElementById('results-count');
    this.productGrid = document.querySelector('.product-grid, .collection-grid, #product-grid');

    if (!this.sidebar || !this.navigationButton) {
      console.warn('Glass Filter Integration: Required elements not found');
      return;
    }

    this.bindEvents();
    this.setupFacetsIntegration();
    this.setupViewToggle();
    this.setupSortControls();
    this.restoreUserPreferences();
    this.isInitialized = true;

    console.log('Glass Filter Integration: Successfully initialized with all components');
  }

  bindEvents() {
    // Navigation button click
    if (this.navigationButton) {
      this.navigationButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleSidebar();
      });
    }

    // Overlay click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.closeSidebar();
      });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isSidebarOpen()) {
        this.closeSidebar();
      }
    });

    // Close button in sidebar
    const closeButton = this.sidebar?.querySelector('.filter-sidebar-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.closeSidebar();
      });
    }

    // Apply filters button
    const applyButton = this.sidebar?.querySelector('.filter-action-button.primary');
    if (applyButton) {
      applyButton.addEventListener('click', () => {
        // On mobile, close sidebar after applying
        if (window.innerWidth <= 768) {
          this.closeSidebar();
        }
      });
    }
  }

  setupFacetsIntegration() {
    // Connect to Shopify's facets system
    const facetsForm = this.sidebar?.querySelector('facets-form-component');
    if (!facetsForm) {
      console.log('Glass Filter Integration: No facets form found, using fallback');
      return;
    }

    // Check if facets.js is loaded
    const hasFacetsJS = typeof window.FacetsFormComponent !== 'undefined' || 
                       document.querySelector('facets-form-component');
    
    if (!hasFacetsJS) {
      console.warn('Glass Filter Integration: facets.js not detected, limited functionality');
    }

    // Listen for filter updates
    document.addEventListener('filter-update', (event) => {
      this.updateFilterStatus(event.detail);
    });

    // Setup input change handlers for real-time filtering
    const filterInputs = this.sidebar?.querySelectorAll('input[type="checkbox"], input[type="number"]');
    filterInputs?.forEach(input => {
      // Debounce for number inputs (price)
      if (input.type === 'number') {
        let timeout;
        input.addEventListener('input', () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            this.handleFilterChange(input);
          }, 500);
        });
      } else {
        input.addEventListener('change', () => {
          this.handleFilterChange(input);
        });
      }
    });
    
    console.log(`Glass Filter Integration: Connected to ${filterInputs?.length || 0} filter inputs`);
  }

  handleFilterChange(input) {
    // Update the visual state immediately
    this.updateFilterVisuals();
    
    // Let the facets.js system handle the actual filtering
    const facetsForm = this.sidebar?.querySelector('facets-form-component');
    if (facetsForm && typeof facetsForm.updateFilters === 'function') {
      facetsForm.updateFilters();
    }

    console.log('Filter changed:', {
      name: input.name,
      value: input.value,
      checked: input.checked || input.value
    });
  }

  updateFilterVisuals() {
    // Update filter button to show active state
    const activeFilters = this.getActiveFiltersCount();
    
    if (this.navigationButton) {
      const filterText = this.navigationButton.querySelector('.glass-filter-text');
      if (filterText) {
        filterText.textContent = activeFilters > 0 
          ? `Filters (${activeFilters})` 
          : 'Show filters';
      }

      // Add visual indicator for active filters
      this.navigationButton.classList.toggle('has-active-filters', activeFilters > 0);
    }
  }

  getActiveFiltersCount() {
    if (!this.sidebar) return 0;

    const checkedInputs = this.sidebar.querySelectorAll('input[type="checkbox"]:checked');
    const priceInputs = this.sidebar.querySelectorAll('input[type="number"]');
    let priceFiltersActive = 0;

    priceInputs.forEach(input => {
      if (input.value && input.value.trim() !== '') {
        priceFiltersActive++;
      }
    });

    return checkedInputs.length + (priceFiltersActive > 0 ? 1 : 0);
  }

  toggleSidebar() {
    if (this.isSidebarOpen()) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    if (!this.sidebar) return;

    this.sidebar.classList.add('active');
    this.overlay?.classList.add('active');
    document.body.classList.add('filter-sidebar-open');
    
    // Prevent body scroll on mobile
    if (window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    }

    // Update button state
    this.navigationButton?.classList.add('active');

    // Focus management for accessibility
    const firstInput = this.sidebar.querySelector('input, button');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    console.log('Glass Filter Sidebar: Opened');
  }

  closeSidebar() {
    if (!this.sidebar) return;

    this.sidebar.classList.remove('active');
    this.overlay?.classList.remove('active');
    document.body.classList.remove('filter-sidebar-open');
    document.body.style.overflow = '';

    // Update button state
    this.navigationButton?.classList.remove('active');

    // Return focus to toggle button
    if (this.navigationButton) {
      this.navigationButton.focus();
    }

    console.log('Glass Filter Sidebar: Closed');
  }

  isSidebarOpen() {
    return this.sidebar?.classList.contains('active') || false;
  }

  updateFilterStatus(filterData) {
    // Update any visual indicators based on filter status
    this.updateFilterVisuals();
    
    // Could update sort dropdown state here if needed
    console.log('Filter status updated:', filterData);
  }

  // Public API methods
  clearAllFilters() {
    if (!this.sidebar) return;

    // Clear all checkboxes
    const checkboxes = this.sidebar.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // Clear all number inputs
    const numberInputs = this.sidebar.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
      input.value = '';
    });

    // Update visuals
    this.updateFilterVisuals();

    // Trigger filter update
    const facetsForm = this.sidebar.querySelector('facets-form-component');
    if (facetsForm && typeof facetsForm.updateFilters === 'function') {
      facetsForm.updateFilters();
    }

    console.log('All filters cleared');
  }

  // New method: Setup view toggle functionality
  setupViewToggle() {
    if (!this.viewToggleGroup || !this.productGrid) return;
    
    const viewButtons = this.viewToggleGroup.querySelectorAll('.view-toggle');
    
    viewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const newView = button.dataset.view;
        this.switchView(newView);
      });
    });
  }
  
  // New method: Switch between grid and list views
  switchView(newView) {
    if (this.currentView === newView || !this.productGrid) return;
    
    // Update button states
    const viewButtons = this.viewToggleGroup?.querySelectorAll('.view-toggle');
    viewButtons?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === newView);
    });
    
    // Animate view transition
    this.productGrid.classList.add('view-transitioning');
    
    // Switch layout after a brief delay for smooth animation
    requestAnimationFrame(() => {
      // Remove old view class
      this.productGrid.classList.remove(`${this.currentView}-view`, 'grid-view', 'list-view', 'row-view');
      
      // Add new view class
      this.productGrid.classList.add(`${newView}-view`);
      
      // Update current view
      this.currentView = newView;
      
      // Save preference
      localStorage.setItem('preferredView', newView);
      
      // Remove transition class after animation
      setTimeout(() => {
        this.productGrid.classList.remove('view-transitioning');
      }, 300);
    });
    
    console.log(`View switched to: ${newView}`);
  }
  
  // New method: Setup sort controls
  setupSortControls() {
    if (!this.sortSelect) return;
    
    this.sortSelect.addEventListener('change', (e) => {
      const sortValue = e.target.value;
      this.updateSort(sortValue);
    });
  }
  
  // New method: Update sort and trigger facets update
  updateSort(sortValue) {
    // Update URL with sort parameter
    const url = new URL(window.location);
    url.searchParams.set('sort_by', sortValue);
    
    // Trigger facets update if available
    const facetsForm = document.querySelector('facets-form-component');
    if (facetsForm && typeof facetsForm.updateURL === 'function') {
      facetsForm.updateURL(url.toString());
    } else {
      // Fallback: reload page with new sort
      window.location = url.toString();
    }
    
    console.log(`Sort updated to: ${sortValue}`);
  }
  
  // New method: Restore user preferences
  restoreUserPreferences() {
    // Restore view preference
    const savedView = localStorage.getItem('preferredView');
    if (savedView && savedView !== this.currentView) {
      this.switchView(savedView);
    }
    
    // Ensure product grid has initial view class
    if (this.productGrid && !this.productGrid.classList.contains(`${this.currentView}-view`)) {
      this.productGrid.classList.add(`${this.currentView}-view`);
    }
  }
  
  // Connect to global functions expected by the templates
  connectGlobalFunctions() {
    // Make functions available globally for onclick handlers
    window.toggleGlassFilters = () => this.toggleSidebar();
    window.openGlassFilters = () => this.openSidebar();
    window.closeGlassFilters = () => this.closeSidebar();
    window.openFilterSidebar = () => this.openSidebar(); // Legacy compatibility
    
    // New global functions for view and sort
    window.setViewMode = (view) => this.switchView(view);
    window.updateSort = (value) => this.updateSort(value);
    window.clearAllFilters = () => this.clearAllFilters();
    window.toggleMobileFilters = () => this.toggleSidebar();
  }
}

// Enhanced CSS for active filter states
const activeFilterStyles = `
<style>
/* Enhanced active filter states */
.glass-filter-button.has-active-filters {
  background: linear-gradient(180deg, rgba(25, 188, 254, 0.2) 0%, rgba(25, 188, 254, 0.1) 47.27%, rgba(25, 188, 254, 0.2) 100%);
  border-color: rgba(25, 188, 254, 0.5);
}

.glass-filter-button.has-active-filters .glass-filter-text {
  color: rgba(25, 188, 254, 1);
  font-weight: 500;
}

.glass-filter-button.active {
  background: linear-gradient(180deg, rgba(25, 188, 254, 0.3) 0%, rgba(25, 188, 254, 0.1) 47.27%, rgba(25, 188, 254, 0.3) 100%);
  border-color: rgba(25, 188, 254, 0.7);
  transform: translateY(-1px);
}

/* Loading states */
.glass-filter-nav-container.filtering {
  opacity: 0.8;
  pointer-events: none;
}

.glass-filter-nav-container.filtering .glass-filter-button::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid rgba(25, 188, 254, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

@keyframes spin {
  0% { transform: translateY(-50%) rotate(0deg); }
  100% { transform: translateY(-50%) rotate(360deg); }
}

/* Smooth transitions for all interactive elements */
.glass-filter-button,
.glass-sort-button,
.filter-option,
.filter-action-button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states for accessibility */
.glass-filter-button:focus,
.glass-sort-button:focus,
.filter-option:focus-within,
.filter-action-button:focus {
  outline: 2px solid rgba(25, 188, 254, 0.5);
  outline-offset: 2px;
}
</style>
`;

// Additional minimal CSS for view toggle only
const viewToggleStyles = `
<style>
/* Minimal view toggle styles - no product grid modifications */
.view-toggle-group {
  display: flex;
  gap: 4px;
}

.view-toggle {
  min-height: 44px; /* Apple HIG compliance */
  min-width: 44px;
}

.view-toggle.active {
  opacity: 1;
}

.view-toggle:not(.active) {
  opacity: 0.6;
}

/* Transition class for view switching */
.view-transitioning {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
</style>
`;

// Initialize the integration
let glassFilterIntegration;

document.addEventListener('DOMContentLoaded', function() {
  // Add enhanced styles
  document.head.insertAdjacentHTML('beforeend', activeFilterStyles);
  
  // Add minimal view toggle styles
  document.head.insertAdjacentHTML('beforeend', viewToggleStyles);
  
  // Initialize the integration system
  glassFilterIntegration = new GlassFilterIntegration();
  glassFilterIntegration.connectGlobalFunctions();
  
  // Log initialization status
  console.log('Glass Filter Integration: System ready');
  console.log('Components connected:', {
    sidebar: !!glassFilterIntegration.sidebar,
    viewToggle: !!glassFilterIntegration.viewToggleGroup,
    sortSelect: !!glassFilterIntegration.sortSelect,
    productGrid: !!glassFilterIntegration.productGrid
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlassFilterIntegration;
}

// Make available on window for debugging
window.GlassFilterIntegration = GlassFilterIntegration;