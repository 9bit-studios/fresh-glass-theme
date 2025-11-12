

class GlassFilterIntegration {
  constructor() {
    this.sidebar = null;
    this.overlay = null;
    this.navigationButton = null;
    this.isInitialized = false;
    
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

    if (!this.sidebar || !this.navigationButton) {
      console.warn('Glass Filter Integration: Required elements not found');
      return;
    }

    this.bindEvents();
    this.setupFacetsIntegration();
    this.isInitialized = true;

    console.log('Glass Filter Integration: Successfully initialized');
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
    if (!facetsForm) return;

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

  // Connect to global functions expected by the templates
  connectGlobalFunctions() {
    // Make functions available globally for onclick handlers
    window.toggleGlassFilters = () => this.toggleSidebar();
    window.openGlassFilters = () => this.openSidebar();
    window.closeGlassFilters = () => this.closeSidebar();
    window.openFilterSidebar = () => this.openSidebar(); // Legacy compatibility
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

// Initialize the integration
let glassFilterIntegration;

document.addEventListener('DOMContentLoaded', function() {
  // Add enhanced styles
  document.head.insertAdjacentHTML('beforeend', activeFilterStyles);
  
  // Initialize the integration system
  glassFilterIntegration = new GlassFilterIntegration();
  glassFilterIntegration.connectGlobalFunctions();
  
  console.log('Glass Filter Integration: System ready');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlassFilterIntegration;
}

// Make available on window for debugging
window.GlassFilterIntegration = GlassFilterIntegration;