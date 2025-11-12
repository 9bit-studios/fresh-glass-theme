// ========================================
// COLLECTION OPENING STATE MANAGER
// Handles the specific requirements for collection pages on shop.petersengames.com
// Ensures Clear All is visible and proper filters are pre-selected on page load
// ========================================

class CollectionOpeningStateManager {
  constructor() {
    this.initialized = false;
    this.collectionConfig = new Map();
    this.currentCollection = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('🤓 Setting up Collection Opening State Manager...');
    
    this.detectCurrentCollection();
    this.setupCollectionConfigurations();
    this.implementOpeningState();
    
    this.initialized = true;
    console.log('✅ Collection Opening State Manager initialized');
  }

  detectCurrentCollection() {
    const currentPath = window.location.pathname;
    
    // Map actual collection URLs to internal handles
    const collectionMappings = {
      '/collections/hyperspace-standard-edition-complete': 'hyperspace-standard',
      '/collections/sandys-games': 'sandys-games', 
      '/collections/larval-games': 'larval-games',
      '/collections/cthulhu-wars-1': 'cthulhu-wars',
      '/collections/planet-apocalypse': 'planet-apocalypse',
      '/collections/miniatures': 'miniatures',
      '/collections/all': 'all'
    };
    
    this.currentCollection = collectionMappings[currentPath] || null;
    
    if (this.currentCollection) {
      console.log(`🤓 Detected collection: ${this.currentCollection} from path: ${currentPath}`);
    } else {
      console.log(`⚠️ No specific collection mapping for path: ${currentPath}`);
    }
  }

  setupCollectionConfigurations() {
    // Configuration for each specific collection page
    this.collectionConfig.set('hyperspace-standard', {
      name: 'Hyperspace Standard Edition Complete',
      requiredTags: ['hyperspace-standard-edition', 'hyperspace'],
      gameLine: 'hyperspace',
      displayName: 'Game Line: Hyperspace Standard Edition',
      clearAllTarget: '/collections/all'
    });

    this.collectionConfig.set('sandys-games', {
      name: "Sandy's Games",
      requiredTags: ['sandys-games', 'sandy-petersen'], 
      gameLine: 'sandys-games',
      displayName: 'Game Line: Sandy\'s Games',
      clearAllTarget: '/collections/all'
    });

    this.collectionConfig.set('larval-games', {
      name: 'Larval Games',
      requiredTags: ['larval-games', 'larval'],
      gameLine: 'larval-games',
      displayName: 'Game Line: Larval Games',
      clearAllTarget: '/collections/all'
    });

    this.collectionConfig.set('cthulhu-wars', {
      name: 'Cthulhu Wars',
      requiredTags: ['cthulhu-wars', 'cthulhu'],
      gameLine: 'cthulhu-wars',
      displayName: 'Game Line: Cthulhu Wars',
      clearAllTarget: '/collections/all'
    });

    this.collectionConfig.set('planet-apocalypse', {
      name: 'Planet Apocalypse', 
      requiredTags: ['planet-apocalypse', 'apocalypse'],
      gameLine: 'planet-apocalypse',
      displayName: 'Game Line: Planet Apocalypse',
      clearAllTarget: '/collections/all'
    });

    this.collectionConfig.set('miniatures', {
      name: 'Miniatures',
      requiredTags: ['miniatures', 'mini'],
      gameLine: 'miniatures',
      displayName: 'Product Type: Miniatures',
      clearAllTarget: '/collections/all'
    });

    console.log(`✅ Set up configurations for ${this.collectionConfig.size} collections`);
  }

  implementOpeningState() {
    if (!this.currentCollection || this.currentCollection === 'all') {
      console.log('📋 No specific collection or all collections - no opening state needed');
      return;
    }

    const config = this.collectionConfig.get(this.currentCollection);
    if (!config) {
      console.log(`❌ No configuration found for collection: ${this.currentCollection}`);
      return;
    }

    console.log(`🤓 Implementing opening state for: ${config.name}`);
    
    // Step 1: Ensure Clear All button is visible immediately
    this.forceClearAllVisibility();
    
    // Step 2: Pre-select relevant filter options
    setTimeout(() => {
      this.preselectFilters(config);
    }, 100);
    
    // Step 3: Create and show the facet remove pill
    setTimeout(() => {
      this.createFacetRemovePill(config);
    }, 200);
    
    // Step 4: Update filter counts and states
    setTimeout(() => {
      this.updateFilterStates(config);
    }, 300);
  }

  forceClearAllVisibility() {
    try {
      console.log('👁️ Forcing Clear All button visibility...');
      
      const clearAllSelectors = [
        '.facets__clear-all',
        '.mobile-facets__clear', 
        '.clear-all-enhanced',
        '.interactive-clear-all',
        'button[data-facet-clear]'
      ];
      
      clearAllSelectors.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
          // Force visibility
          button.style.display = 'inline-flex';
          button.style.visibility = 'visible';
          button.style.opacity = '1';
          
          // Remove hiding classes
          button.classList.remove('hidden', 'disabled', 'd-none');
          
          // Ensure it's accessible
          button.setAttribute('tabindex', '0');
          
          console.log('✅ Made Clear All button visible:', button);
        });
      });
      
    } catch (error) {
      console.error('❌ Error forcing Clear All visibility:', error);
    }
  }

  preselectFilters(config) {
    try {
      console.log(`🤓 Pre-selecting filters for ${config.name}...`);
      
      const { requiredTags, gameLine } = config;
      let filtersSelected = 0;
      
      // Strategy 1: Find inputs by value matching
      requiredTags.forEach(tag => {
        const inputs = document.querySelectorAll(`input[value="${tag}"], input[value*="${tag}"]`);
        inputs.forEach(input => {
          if (input.type === 'checkbox' && !input.checked) {
            input.checked = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            filtersSelected++;
            console.log(`✅ Pre-selected filter: ${tag}`);
          }
        });
      });
      
      // Strategy 2: Find game line filters specifically
      const gameLineInputs = document.querySelectorAll(
        `input[name*="game"], input[name*="line"], input[data-filter*="game"]`
      );
      gameLineInputs.forEach(input => {
        if (input.value && requiredTags.some(tag => 
          input.value.toLowerCase().includes(tag.toLowerCase())
        )) {
          if (input.type === 'checkbox' && !input.checked) {
            input.checked = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            filtersSelected++;
            console.log(`✅ Pre-selected game line filter: ${input.value}`);
          }
        }
      });
      
      console.log(`✅ Pre-selected ${filtersSelected} filters for ${config.name}`);
      
    } catch (error) {
      console.error('❌ Error pre-selecting filters:', error);
    }
  }

  createFacetRemovePill(config) {
    try {
      console.log(`🏷️ Creating facet remove pill for ${config.name}...`);
      
      // Find the active facets container
      const activeFacetsContainer = document.querySelector('.active-facets, .active-facets__button-wrapper');
      if (!activeFacetsContainer) {
        console.log('❌ No active facets container found');
        return;
      }
      
      // Check if pill already exists
      const existingPill = document.querySelector(`.collection-facet-pill-${this.currentCollection}`);
      if (existingPill) {
        console.log('✅ Facet remove pill already exists');
        return;
      }
      
      // Create the facet remove pill
      const facetPill = document.createElement('facet-remove');
      facetPill.className = `active-facets__button collection-facet-pill-${this.currentCollection}`;
      facetPill.setAttribute('data-url', config.clearAllTarget);
      facetPill.setAttribute('data-collection', this.currentCollection);
      
      facetPill.innerHTML = `
        <span class="active-facets__button-inner">
          ${config.displayName}
          <span class="svg-wrapper">
            <svg class="icon icon-close" aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 18 18">
              <path d="M13.72 12.66l-1.06 1.06L9 10.06l-3.66 3.66-1.06-1.06L7.94 9 4.28 5.34l1.06-1.06L9 7.94l3.66-3.66 1.06 1.06L10.06 9l3.66 3.66z" fill="currentColor"/>
            </svg>
          </span>
        </span>
      `;
      
      // Add click handler
      facetPill.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('🤓 Collection facet remove pill clicked - redirecting to All Games');
        window.location.href = config.clearAllTarget;
      });
      
      // Insert the pill
      activeFacetsContainer.appendChild(facetPill);
      
      console.log(`✅ Created facet remove pill: ${config.displayName}`);
      
    } catch (error) {
      console.error('❌ Error creating facet remove pill:', error);
    }
  }

  updateFilterStates(config) {
    try {
      console.log(`🔄 Updating filter states for ${config.name}...`);
      
      // Update facet status components
      const statusElements = document.querySelectorAll('facet-status-component, .facets__status');
      statusElements.forEach(status => {
        if (typeof status.updateListSummary === 'function') {
          const checkedInputs = document.querySelectorAll('.facets input:checked');
          status.updateListSummary(Array.from(checkedInputs));
        }
      });
      
      // Ensure Clear All buttons stay visible
      this.forceClearAllVisibility();
      
      // Update active filters count if using interactive controls
      if (window.updateActiveFiltersCount) {
        window.updateActiveFiltersCount();
      }
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('collection:opening-state-ready', {
        detail: {
          collection: this.currentCollection,
          config: config,
          activeFilters: document.querySelectorAll('.facets input:checked').length
        }
      }));
      
      console.log(`✅ Filter states updated for ${config.name}`);
      
    } catch (error) {
      console.error('❌ Error updating filter states:', error);
    }
  }

  // Public method to refresh the opening state
  refresh() {
    console.log('🔄 Refreshing collection opening state...');
    this.detectCurrentCollection();
    this.implementOpeningState();
  }

  // Public method to get current collection info
  getCurrentCollectionInfo() {
    if (!this.currentCollection) return null;
    
    return {
      handle: this.currentCollection,
      config: this.collectionConfig.get(this.currentCollection),
      isOpeningState: true,
      activeFilters: document.querySelectorAll('.facets input:checked').length
    };
  }
}

// Initialize the opening state manager
let collectionOpeningStateManager;

document.addEventListener('DOMContentLoaded', () => {
  // Delay initialization slightly to ensure other filter systems load first
  setTimeout(() => {
    collectionOpeningStateManager = new CollectionOpeningStateManager();
  }, 200);
});

// Also initialize on section loads
document.addEventListener('shopify:section:load', () => {
  setTimeout(() => {
    if (collectionOpeningStateManager) {
      collectionOpeningStateManager.refresh();
    } else {
      collectionOpeningStateManager = new CollectionOpeningStateManager();
    }
  }, 200);
});

// Make available globally
window.CollectionOpeningStateManager = CollectionOpeningStateManager;
window.collectionOpeningStateManager = collectionOpeningStateManager;

// Export functions for external use
window.refreshCollectionOpeningState = () => {
  if (collectionOpeningStateManager) {
    collectionOpeningStateManager.refresh();
  }
};

window.getCurrentCollectionInfo = () => {
  if (collectionOpeningStateManager) {
    return collectionOpeningStateManager.getCurrentCollectionInfo();
  }
  return null;
};

// Debug helper
window.debugCollectionState = function() {
  console.log('🔍 Debug: Collection Opening State');
  const info = getCurrentCollectionInfo();
  console.log('Current collection info:', info);
  console.log('Active filters:', document.querySelectorAll('.facets input:checked'));
  console.log('Clear All buttons:', document.querySelectorAll('.facets__clear-all, .mobile-facets__clear'));
  console.log('Facet remove pills:', document.querySelectorAll('.active-facets__button'));
};

console.log('🦄 Collection Opening State Manager script loaded');