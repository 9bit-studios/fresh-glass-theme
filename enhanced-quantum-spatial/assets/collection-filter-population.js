// ========================================
// COLLECTION FILTER POPULATION
// Populates filters with collection-specific categories and options
// Shows proper filter states with pre-selected checkboxes for Planet Apocalypse, Sandy's Games, etc.
// ========================================

class CollectionFilterPopulator {
  constructor() {
    this.collectionMappings = new Map();
    this.currentCollection = null;
    this.initialized = false;
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
    console.log('🤓 Setting up collection filter population...');
    
    this.detectCurrentCollection();
    this.setupCollectionMappings();
    this.populateFiltersForCollection();
    this.setupDynamicUpdates();
    
    this.initialized = true;
    console.log('✅ Collection filter population initialized');
  }

  detectCurrentCollection() {
    try {
      const currentPath = window.location.pathname;
      
      if (currentPath.includes('/collections/')) {
        const pathParts = currentPath.split('/collections/')[1];
        const collectionHandle = pathParts ? pathParts.split('/')[0] : null;
        
        if (collectionHandle && collectionHandle !== 'all') {
          this.currentCollection = collectionHandle;
          console.log(`🤓 Detected collection: ${this.currentCollection}`);
        } else {
          this.currentCollection = 'all';
          console.log('🤓 Detected all collections view');
        }
      } else {
        console.log('🤓 Not on a collection page');
        this.currentCollection = null;
      }
      
    } catch (error) {
      console.error('❌ Error detecting current collection:', error);
      this.currentCollection = null;
    }
  }

  setupCollectionMappings() {
    console.log('🗺️ Setting up collection-specific filter mappings...');
    
    // Define collection-specific filter configurations
    this.collectionMappings.set('planet-apocalypse', {
      name: 'Planet Apocalypse',
      requiredFilters: [
        { type: 'tag', values: ['planet-apocalypse', 'apocalypse-series'], preselect: true },
        { type: 'product_type', values: ['Board Game', 'Expansion'], preselect: false },
        { type: 'availability', values: ['in-stock'], preselect: false }
      ],
      suggestedFilters: [
        { type: 'vendor', values: ['Petersen Games'], preselect: false },
        { type: 'tag', values: ['strategy', 'horror', 'miniatures'], preselect: false }
      ]
    });
    
    this.collectionMappings.set('sandys-games', {
      name: "Sandy's Games", 
      requiredFilters: [
        { type: 'tag', values: ['sandys-games', 'sandy-petersen'], preselect: true },
        { type: 'product_type', values: ['Board Game', 'RPG'], preselect: false }
      ],
      suggestedFilters: [
        { type: 'vendor', values: ['Petersen Games'], preselect: false },
        { type: 'tag', values: ['horror', 'lovecraft', 'rpg'], preselect: false }
      ]
    });
    
    this.collectionMappings.set('cthulhu-mythos', {
      name: 'Cthulhu Mythos',
      requiredFilters: [
        { type: 'tag', values: ['cthulhu', 'lovecraft', 'mythos'], preselect: true },
        { type: 'product_type', values: ['Board Game', 'RPG', 'Book'], preselect: false }
      ],
      suggestedFilters: [
        { type: 'vendor', values: ['Petersen Games', 'Chaosium'], preselect: false },
        { type: 'tag', values: ['horror', 'cosmic-horror', 'call-of-cthulhu'], preselect: false }
      ]
    });
    
    this.collectionMappings.set('board-games', {
      name: 'Board Games',
      requiredFilters: [
        { type: 'product_type', values: ['Board Game'], preselect: true }
      ],
      suggestedFilters: [
        { type: 'tag', values: ['strategy', 'cooperative', 'competitive', 'miniatures'], preselect: false },
        { type: 'availability', values: ['in-stock', 'pre-order'], preselect: false }
      ]
    });
    
    this.collectionMappings.set('rpg', {
      name: 'RPG',
      requiredFilters: [
        { type: 'product_type', values: ['RPG', 'Rulebook'], preselect: true }
      ],
      suggestedFilters: [
        { type: 'tag', values: ['call-of-cthulhu', 'd20', 'campaign'], preselect: false },
        { type: 'format', values: ['PDF', 'Hardcover'], preselect: false }
      ]
    });
    
    console.log(`✅ Set up ${this.collectionMappings.size} collection mappings`);
  }

  populateFiltersForCollection() {
    if (!this.currentCollection || this.currentCollection === 'all') {
      console.log('📋 No specific collection or all collections - using default filter state');
      return;
    }
    
    const collectionConfig = this.collectionMappings.get(this.currentCollection);
    if (!collectionConfig) {
      console.log(`⚠️ No filter configuration found for collection: ${this.currentCollection}`);
      return;
    }
    
    console.log(`🤓 Populating filters for ${collectionConfig.name}...`);
    
    // Apply required filters (usually pre-selected)
    this.applyFilterSet(collectionConfig.requiredFilters, 'required');
    
    // Apply suggested filters (usually available but not pre-selected)
    this.applyFilterSet(collectionConfig.suggestedFilters, 'suggested');
    
    // Update filter visibility and state
    this.updateFilterStates();
    
    console.log(`✅ Filters populated for ${collectionConfig.name}`);
  }

  applyFilterSet(filters, type) {
    if (!filters || filters.length === 0) return;
    
    console.log(`📋 Applying ${type} filters:`, filters);
    
    filters.forEach(filterConfig => {
      this.applyFilterConfig(filterConfig, type);
    });
  }

  applyFilterConfig(filterConfig, type) {
    try {
      const { type: filterType, values, preselect } = filterConfig;
      
      values.forEach(value => {
        // Find matching filter inputs
        const inputs = this.findFilterInputs(filterType, value);
        
        inputs.forEach(input => {
          // Ensure the filter option is visible
          this.ensureFilterOptionVisible(input, filterType, value);
          
          // Pre-select if required
          if (preselect && input.type === 'checkbox') {
            input.checked = true;
            console.log(`✅ Pre-selected filter: ${filterType}=${value}`);
            
            // Trigger change event to update filter system
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
          
          // Add collection-specific styling
          this.addCollectionStyling(input, type);
        });
      });
      
    } catch (error) {
      console.error(`❌ Error applying filter config:`, error);
    }
  }

  findFilterInputs(filterType, value) {
    const inputs = [];
    
    try {
      // Strategy 1: Direct value match
      let selectors = [
        `input[value="${value}"]`,
        `input[value*="${value}"]`,
        `input[data-value="${value}"]`,
        `input[data-value*="${value}"]`
      ];
      
      // Strategy 2: Name-based matching for different filter types
      switch (filterType) {
        case 'tag':
          selectors.push(
            `input[name*="tag"][value*="${value}"]`,
            `input[name*="filter.v.tag"][value*="${value}"]`
          );
          break;
        case 'product_type':
          selectors.push(
            `input[name*="product_type"][value*="${value}"]`,
            `input[name*="filter.v.product_type"][value*="${value}"]`
          );
          break;
        case 'vendor':
          selectors.push(
            `input[name*="vendor"][value*="${value}"]`,
            `input[name*="filter.v.vendor"][value*="${value}"]`
          );
          break;
        case 'availability':
          selectors.push(
            `input[name*="availability"][value*="${value}"]`,
            `input[name*="filter.v.availability"][value*="${value}"]`
          );
          break;
      }
      
      // Search for matching inputs
      selectors.forEach(selector => {
        const foundInputs = document.querySelectorAll(selector);
        foundInputs.forEach(input => {
          if (!inputs.includes(input)) {
            inputs.push(input);
          }
        });
      });
      
      console.log(`🔍 Found ${inputs.length} inputs for ${filterType}=${value}`);
      
    } catch (error) {
      console.error(`❌ Error finding filter inputs for ${filterType}=${value}:`, error);
    }
    
    return inputs;
  }

  ensureFilterOptionVisible(input, filterType, value) {
    try {
      // Find the parent filter section
      const filterSection = input.closest('.facets__disclosure, .mobile-facets__details, .facet-inputs-component');
      if (filterSection) {
        // Ensure the section is visible
        filterSection.style.display = '';
        filterSection.classList.remove('hidden');
        
        // If it's a details element, ensure it can be opened
        if (filterSection.tagName === 'DETAILS') {
          filterSection.removeAttribute('hidden');
        }
      }
      
      // Ensure the input's immediate container is visible
      const inputContainer = input.closest('.facets__item, .mobile-facets__item, .list-menu__item');
      if (inputContainer) {
        inputContainer.style.display = '';
        inputContainer.classList.remove('hidden');
      }
      
      // Ensure the label is visible
      const label = input.closest('label') || document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        label.style.display = '';
        label.classList.remove('hidden');
      }
      
    } catch (error) {
      console.error(`❌ Error ensuring filter option visibility:`, error);
    }
  }

  addCollectionStyling(input, type) {
    try {
      const container = input.closest('.facets__item, .mobile-facets__item, .list-menu__item');
      if (!container) return;
      
      // Add collection-specific classes
      container.classList.add(`collection-filter-${type}`);
      container.classList.add(`collection-${this.currentCollection}`);
      
      // Add visual indicators for pre-selected filters
      if (input.checked && type === 'required') {
        container.classList.add('collection-filter-preselected');
      }
      
    } catch (error) {
      console.error(`❌ Error adding collection styling:`, error);
    }
  }

  updateFilterStates() {
    try {
      console.log('🔄 Updating filter states...');
      
      // Update filter status displays
      const statusElements = document.querySelectorAll('.facets__status, facet-status-component');
      statusElements.forEach(status => {
        // Trigger update of status display
        if (typeof status.updateListSummary === 'function') {
          const checkedInputs = status.closest('details')?.querySelectorAll('input:checked') || [];
          status.updateListSummary(Array.from(checkedInputs));
        }
      });
      
      // Update clear all button visibility
      const clearAllButtons = document.querySelectorAll('.facets__clear-all, .mobile-facets__clear, .interactive-clear-all');
      clearAllButtons.forEach(button => {
        const activeFilters = document.querySelectorAll('.facets input:checked');
        if (activeFilters.length > 0) {
          button.style.display = '';
          button.classList.remove('hidden');
        }
      });
      
      // Dispatch custom event for other systems
      document.dispatchEvent(new CustomEvent('collection-filters:populated', {
        detail: {
          collection: this.currentCollection,
          activeFilters: document.querySelectorAll('.facets input:checked').length
        }
      }));
      
    } catch (error) {
      console.error('❌ Error updating filter states:', error);
    }
  }

  setupDynamicUpdates() {
    try {
      console.log('🔄 Setting up dynamic filter updates...');
      
      // Listen for collection changes
      window.addEventListener('popstate', () => {
        setTimeout(() => {
          this.detectCurrentCollection();
          this.populateFiltersForCollection();
        }, 100);
      });
      
      // Listen for section reloads
      document.addEventListener('shopify:section:load', () => {
        setTimeout(() => {
          this.detectCurrentCollection();
          this.populateFiltersForCollection();
        }, 200);
      });
      
      // Listen for facets updates
      document.addEventListener('facets:updated', () => {
        setTimeout(() => this.updateFilterStates(), 100);
      });
      
    } catch (error) {
      console.error('❌ Error setting up dynamic updates:', error);
    }
  }

  // Public method to refresh filters for current collection
  refresh() {
    console.log('🔄 Refreshing collection filters...');
    this.detectCurrentCollection();
    this.populateFiltersForCollection();
  }

  // Public method to get current collection info
  getCurrentCollectionInfo() {
    if (!this.currentCollection) return null;
    
    return {
      handle: this.currentCollection,
      config: this.collectionMappings.get(this.currentCollection),
      activeFilters: document.querySelectorAll('.facets input:checked').length
    };
  }
}

// Initialize the filter populator
let collectionFilterPopulator;

document.addEventListener('DOMContentLoaded', () => {
  collectionFilterPopulator = new CollectionFilterPopulator();
});

// Make available globally
window.CollectionFilterPopulator = CollectionFilterPopulator;
window.collectionFilterPopulator = collectionFilterPopulator;

// Export functions for external use
window.refreshCollectionFilters = () => {
  if (collectionFilterPopulator) {
    collectionFilterPopulator.refresh();
  }
};

window.getCurrentCollectionInfo = () => {
  if (collectionFilterPopulator) {
    return collectionFilterPopulator.getCurrentCollectionInfo();
  }
  return null;
};

console.log('🦄 Collection Filter Population script loaded');