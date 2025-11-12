// ========================================
// INTERACTIVE DESKTOP FACETS CONTROLS
// JavaScript functionality for enhanced desktop filter management
// Phase 11 Collection Page Enhancements
// ========================================

// Main initialization function
function initializeInteractiveDesktopFacets() {
  console.log('🚀 Initializing Interactive Desktop Facets Controls...');
  
  // Only run on desktop screens
  if (window.innerWidth < 750) {
    console.log('📱 Mobile screen detected, skipping desktop controls');
    return;
  }
  
  // Check if we're on a collection page with filters
  const facetsContainer = document.querySelector('.facets.facets--horizontal');
  if (!facetsContainer) {
    console.log('❌ No horizontal facets container found');
    return;
  }
  
  // Create and inject interactive controls
  createInteractiveControls(facetsContainer);
  
  // Initialize control functionality
  initializeControlsLogic();
  
  // Monitor filter changes
  monitorFilterChanges();
  
  console.log('✅ Interactive Desktop Facets Controls initialized');
}

// Function to create interactive controls HTML
function createInteractiveControls(facetsContainer) {
  try {
    console.log('🔧 Creating interactive controls...');
    
    // Find the filters title element to replace
    const filtersTitle = facetsContainer.querySelector('.facets--filters-title');
    const controlsWrapper = facetsContainer.querySelector('.facets-controls-wrapper');
    
    if (!controlsWrapper) {
      console.log('❌ No controls wrapper found');
      return;
    }
    
    // Create interactive controls container
    const interactiveControls = document.createElement('div');
    interactiveControls.className = 'interactive-facets-controls';
    interactiveControls.innerHTML = `
      <div class="active-filters-indicator" tabindex="0" role="status" aria-label="Active filters">
        <span class="filter-icon">🔍</span>
        <span class="filter-text">Filters:</span>
        <span class="active-filters-count zero" aria-live="polite">0</span>
        <span class="sr-only" id="filter-count-text">No active filters</span>
      </div>
      
      <div class="quick-filter-toggles" role="group" aria-label="Quick filter options">
        <button class="quick-filter-button" data-filter-type="availability" aria-pressed="false">
          <span>In Stock</span>
        </button>
        <button class="quick-filter-button" data-filter-type="price" aria-pressed="false">
          <span>On Sale</span>
        </button>
        <button class="quick-filter-button" data-filter-type="new" aria-pressed="false">
          <span>New</span>
        </button>
      </div>
      
      <details class="filter-presets-dropdown">
        <summary class="filter-presets-button" aria-expanded="false">
          <span>Quick Filters</span>
          <span class="dropdown-arrow">▼</span>
        </summary>
        <div class="filter-presets-menu" role="menu">
          <a href="#" class="filter-preset-item" role="menuitem" data-preset="popular">Popular Items</a>
          <a href="#" class="filter-preset-item" role="menuitem" data-preset="budget">Budget Friendly</a>
          <a href="#" class="filter-preset-item" role="menuitem" data-preset="premium">Premium</a>
          <a href="#" class="filter-preset-item" role="menuitem" data-preset="new-arrivals">New Arrivals</a>
        </div>
      </details>
      
      <button class="interactive-clear-all hidden" aria-label="Clear all active filters">
        <span class="clear-icon">✕</span>
        <span>Clear All</span>
      </button>
    `;
    
    // Insert the interactive controls
    if (filtersTitle) {
      // Replace the filters title
      filtersTitle.replaceWith(interactiveControls);
    } else {
      // Insert at the beginning of controls wrapper
      controlsWrapper.insertBefore(interactiveControls, controlsWrapper.firstChild);
    }
    
    console.log('✅ Interactive controls created');
    
  } catch (error) {
    console.error('❌ Error creating interactive controls:', error);
  }
}

// Function to initialize control functionality
function initializeControlsLogic() {
  try {
    console.log('🔧 Initializing controls logic...');
    
    // Initialize quick filter buttons
    initializeQuickFilters();
    
    // Initialize filter presets
    initializeFilterPresets();
    
    // Initialize clear all functionality
    initializeInteractiveClearAll();
    
    // Initialize active filters counter
    updateActiveFiltersCount();
    
    console.log('✅ Controls logic initialized');
    
  } catch (error) {
    console.error('❌ Error initializing controls logic:', error);
  }
}

// Function to initialize quick filter buttons
function initializeQuickFilters() {
  const quickFilterButtons = document.querySelectorAll('.quick-filter-button');
  
  quickFilterButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      
      const filterType = this.dataset.filterType;
      const isActive = this.getAttribute('aria-pressed') === 'true';
      
      console.log(`🎯 Quick filter clicked: ${filterType}, currently active: ${isActive}`);
      
      // Toggle button state
      const newState = !isActive;
      this.setAttribute('aria-pressed', newState);
      this.classList.toggle('active', newState);
      
      // Apply the filter
      applyQuickFilter(filterType, newState);
      
      // Update active count
      setTimeout(updateActiveFiltersCount, 100);
    });
  });
}

// Function to apply quick filters
function applyQuickFilter(filterType, isActive) {
  try {
    console.log(`🔄 Applying quick filter: ${filterType}, active: ${isActive}`);
    
    // Find relevant filter inputs based on type
    let targetInputs = [];
    
    switch (filterType) {
      case 'availability':
        targetInputs = document.querySelectorAll('input[name*="availability"], input[value*="in-stock"], input[value*="available"]');
        break;
      case 'price':
        targetInputs = document.querySelectorAll('input[name*="price"], input[name*="sale"], input[value*="sale"]');
        break;
      case 'new':
        targetInputs = document.querySelectorAll('input[value*="new"], input[value*="latest"], input[name*="tag"][value*="new"]');
        break;
      default:
        console.log(`⚠️ Unknown filter type: ${filterType}`);
        return;
    }
    
    if (targetInputs.length === 0) {
      console.log(`❌ No inputs found for filter type: ${filterType}`);
      return;
    }
    
    // Toggle the first matching input
    const firstInput = targetInputs[0];
    firstInput.checked = isActive;
    
    // Trigger change event to update filters
    firstInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log(`✅ Quick filter applied: ${filterType}`);
    
  } catch (error) {
    console.error(`❌ Error applying quick filter ${filterType}:`, error);
  }
}

// Function to initialize filter presets
function initializeFilterPresets() {
  const presetItems = document.querySelectorAll('.filter-preset-item');
  const presetDropdown = document.querySelector('.filter-presets-dropdown');
  
  presetItems.forEach(item => {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      
      const preset = this.dataset.preset;
      console.log(`🎯 Filter preset selected: ${preset}`);
      
      // Apply the preset
      applyFilterPreset(preset);
      
      // Close the dropdown
      if (presetDropdown) {
        presetDropdown.removeAttribute('open');
      }
      
      // Update active count
      setTimeout(updateActiveFiltersCount, 100);
    });
  });
  
  // Handle dropdown toggle
  if (presetDropdown) {
    const summary = presetDropdown.querySelector('summary');
    if (summary) {
      summary.addEventListener('toggle', function() {
        const isOpen = presetDropdown.hasAttribute('open');
        summary.setAttribute('aria-expanded', isOpen);
      });
    }
  }
}

// Function to apply filter presets
function applyFilterPreset(preset) {
  try {
    console.log(`🔄 Applying filter preset: ${preset}`);
    
    // Clear existing filters first
    clearAllFilters(false);
    
    // Apply preset-specific filters
    switch (preset) {
      case 'popular':
        // Apply filters for popular items (high ratings, bestsellers)
        applyPresetFilters(['popular', 'bestseller', 'featured']);
        break;
      case 'budget':
        // Apply budget-friendly filters
        applyPresetFilters(['sale', 'discount', 'budget']);
        break;
      case 'premium':
        // Apply premium filters
        applyPresetFilters(['premium', 'luxury', 'high-end']);
        break;
      case 'new-arrivals':
        // Apply new arrivals filters
        applyPresetFilters(['new', 'latest', 'recent']);
        break;
      default:
        console.log(`⚠️ Unknown preset: ${preset}`);
        return;
    }
    
    console.log(`✅ Filter preset applied: ${preset}`);
    
  } catch (error) {
    console.error(`❌ Error applying filter preset ${preset}:`, error);
  }
}

// Function to apply preset filters
function applyPresetFilters(filterValues) {
  filterValues.forEach(value => {
    const inputs = document.querySelectorAll(`input[value*="${value}"], input[data-value*="${value}"]`);
    inputs.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
}

// Function to initialize interactive clear all
function initializeInteractiveClearAll() {
  const clearAllButton = document.querySelector('.interactive-clear-all');
  
  if (clearAllButton) {
    clearAllButton.addEventListener('click', function(event) {
      event.preventDefault();
      
      console.log('🎯 Interactive Clear All clicked');
      
      // Check if we're on a collection page
      const currentPath = window.location.pathname;
      
      if (currentPath.includes('/collections/')) {
        // Navigate to all collections
        console.log('🚀 Redirecting to all collections');
        window.location.href = '/collections';
      } else {
        // Clear filters on current page
        clearAllFilters(true);
      }
    });
  }
}

// Function to clear all filters
function clearAllFilters(updateCount = true) {
  try {
    console.log('🔄 Clearing all filters...');
    
    // Clear all filter inputs
    const filterInputs = document.querySelectorAll('.facets input[type="checkbox"], .facets input[type="radio"]');
    filterInputs.forEach(input => {
      if (input.checked) {
        input.checked = false;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    // Clear range inputs
    const rangeInputs = document.querySelectorAll('.facets input[type="range"], .facets input[type="number"]');
    rangeInputs.forEach(input => {
      if (input.min !== undefined) {
        input.value = input.min;
      } else {
        input.value = '';
      }
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Reset quick filter buttons
    const quickButtons = document.querySelectorAll('.quick-filter-button');
    quickButtons.forEach(button => {
      button.setAttribute('aria-pressed', 'false');
      button.classList.remove('active');
    });
    
    if (updateCount) {
      setTimeout(updateActiveFiltersCount, 100);
    }
    
    console.log('✅ All filters cleared');
    
  } catch (error) {
    console.error('❌ Error clearing filters:', error);
  }
}

// Function to update active filters count
function updateActiveFiltersCount() {
  try {
    const countElement = document.querySelector('.active-filters-count');
    const textElement = document.getElementById('filter-count-text');
    const clearButton = document.querySelector('.interactive-clear-all');
    
    if (!countElement) return;
    
    // Count active filters
    const activeFilters = document.querySelectorAll('.facets input:checked');
    const count = activeFilters.length;
    
    // Update count display
    countElement.textContent = count;
    countElement.classList.toggle('zero', count === 0);
    
    // Update screen reader text
    if (textElement) {
      textElement.textContent = count === 0 ? 'No active filters' : `${count} active filter${count === 1 ? '' : 's'}`;
    }
    
    // Show/hide clear button
    if (clearButton) {
      clearButton.classList.toggle('hidden', count === 0);
    }
    
    console.log(`📊 Active filters count updated: ${count}`);
    
  } catch (error) {
    console.error('❌ Error updating active filters count:', error);
  }
}

// Function to monitor filter changes
function monitorFilterChanges() {
  try {
    console.log('👀 Setting up filter change monitoring...');
    
    // Create mutation observer to watch for filter changes
    const observer = new MutationObserver(function(mutations) {
      let shouldUpdate = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || 
            (mutation.type === 'attributes' && mutation.attributeName === 'checked')) {
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        setTimeout(updateActiveFiltersCount, 100);
      }
    });
    
    // Observe filter container
    const facetsContainer = document.querySelector('.facets');
    if (facetsContainer) {
      observer.observe(facetsContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['checked']
      });
    }
    
    // Also listen for custom filter events
    document.addEventListener('facets:updated', updateActiveFiltersCount);
    document.addEventListener('facets:cleared', updateActiveFiltersCount);
    
    console.log('✅ Filter change monitoring setup complete');
    
  } catch (error) {
    console.error('❌ Error setting up filter monitoring:', error);
  }
}

// Function to handle window resize
function handleResize() {
  if (window.innerWidth < 750) {
    // Remove desktop controls on mobile
    const interactiveControls = document.querySelector('.interactive-facets-controls');
    if (interactiveControls) {
      interactiveControls.style.display = 'none';
    }
  } else {
    // Restore desktop controls
    const interactiveControls = document.querySelector('.interactive-facets-controls');
    if (interactiveControls) {
      interactiveControls.style.display = 'flex';
    } else {
      // Re-initialize if controls don't exist
      initializeInteractiveDesktopFacets();
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeInteractiveDesktopFacets);

// Re-initialize on section reloads (Shopify themes)
document.addEventListener('shopify:section:load', initializeInteractiveDesktopFacets);
document.addEventListener('shopify:section:reorder', initializeInteractiveDesktopFacets);

// Handle window resize
window.addEventListener('resize', debounce(handleResize, 250));

// Utility function for debouncing
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

// Export functions for external use
window.initializeInteractiveDesktopFacets = initializeInteractiveDesktopFacets;
window.updateActiveFiltersCount = updateActiveFiltersCount;

// Debug helper
window.debugInteractiveFacets = function() {
  console.log('🔍 Debug: Interactive facets state');
  console.log('Active filters:', document.querySelectorAll('.facets input:checked'));
  console.log('Quick buttons:', document.querySelectorAll('.quick-filter-button.active'));
  console.log('Controls container:', document.querySelector('.interactive-facets-controls'));
};