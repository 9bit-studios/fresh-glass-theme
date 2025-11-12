// ========================================
// FILTERED COLLECTION OPENING STATE MANAGER
// Makes filtered collection pages behave like collections/all 
// with appropriate filters pre-selected and facet remove tags visible
// ========================================

// Collection to filter mappings based on your requirements
const collectionFilterMappings = {
  '/collections/planet-apocalypse': {
    displayName: 'Planet Apocalypse',
    filters: {
      'Game-Line': 'Planet Apocalypse'
    },
    expectedCount: '63 items'
  },
  '/collections/hyperspace-standard-edition-complete': {
    displayName: 'Hyperspace Standard Edition',
    filters: {
      'Game-Line': 'Hyperspace'
    },
    expectedCount: '45 items'
  },
  '/collections/sandys-games': {
    displayName: "Sandy's Games",
    filters: {
      'Game-Line': "Sandy's Games"
    },
    expectedCount: '28 items'
  },
  '/collections/larval-games': {
    displayName: 'Larval Games',
    filters: {
      'Game-Line': 'Larval Games'
    },
    expectedCount: '15 items'
  },
  '/collections/cthulhu-wars-1': {
    displayName: 'Cthulhu Wars',
    filters: {
      'Game-Line': 'Cthulhu Wars'
    },
    expectedCount: '89 items'
  },
  '/collections/miniatures': {
    displayName: 'Miniatures',
    filters: {
      'Product-Type': 'Miniatures'
    },
    expectedCount: '124 items'
  }
};

function initializeFilteredCollectionState() {
  console.log('🎯 Initializing filtered collection opening state...');
  
  const currentPath = window.location.pathname;
  const collectionConfig = collectionFilterMappings[currentPath];
  
  if (!collectionConfig) {
    console.log('📄 Not a filtered collection page, skipping opening state setup');
    return;
  }
  
  console.log(`🏷️ Setting up opening state for: ${collectionConfig.displayName}`);
  
  // Wait for DOM and filters to be ready
  setTimeout(() => {
    setupFilteredOpeningState(collectionConfig, currentPath);
  }, 500);
}

function setupFilteredOpeningState(config, currentPath) {
  try {
    // Step 1: Pre-select the appropriate filter checkboxes
    preselectFilterCheckboxes(config.filters);
    
    // Step 2: Create and show facet remove tags
    createFacetRemoveTags(config.filters, config.displayName);
    
    // Step 3: Make Clear All button visible and accessible
    makeClearAllButtonAccessible(config.expectedCount);
    
    // Step 4: Update the page state to match filtered state
    updatePageStateForFilters(config);
    
    console.log(`✅ Opening state configured for ${config.displayName}`);
    
  } catch (error) {
    console.error('❌ Error setting up filtered opening state:', error);
  }
}

function preselectFilterCheckboxes(filters) {
  console.log('☑️ Pre-selecting filter checkboxes...');
  
  Object.entries(filters).forEach(([filterKey, filterValue]) => {
    // Look for checkboxes that match this filter
    const checkboxSelectors = [
      `input[type="checkbox"][data-filter-key="${filterKey}"][value="${filterValue}"]`,
      `input[type="checkbox"][name*="${filterKey}"][value="${filterValue}"]`,
      `input[type="checkbox"][data-facet="${filterKey}"][value="${filterValue}"]`,
      `input[type="checkbox"][value="${filterValue}"]`
    ];
    
    let foundCheckbox = null;
    for (const selector of checkboxSelectors) {
      foundCheckbox = document.querySelector(selector);
      if (foundCheckbox) break;
    }
    
    if (foundCheckbox && !foundCheckbox.checked) {
      foundCheckbox.checked = true;
      // Trigger change event to notify other systems
      foundCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`✅ Pre-selected: ${filterKey} = ${filterValue}`);
    } else if (!foundCheckbox) {
      console.log(`⚠️ Could not find checkbox for: ${filterKey} = ${filterValue}`);
    }
  });
}

function createFacetRemoveTags(filters, displayName) {
  console.log('🏷️ Creating facet remove tags...');
  
  // Find the facet remove container (look for common patterns)
  const facetContainerSelectors = [
    '.facets__selected',
    '.active-facets',
    '.applied-filters',
    '.facet-filters__summary',
    '.mobile-facets__summary'
  ];
  
  let facetContainer = null;
  for (const selector of facetContainerSelectors) {
    facetContainer = document.querySelector(selector);
    if (facetContainer) break;
  }
  
  if (!facetContainer) {
    // Create a facet container if none exists
    facetContainer = createFacetContainer();
  }
  
  // Clear existing facet tags to avoid duplicates
  const existingTags = facetContainer.querySelectorAll('.facet-remove');
  existingTags.forEach(tag => tag.remove());
  
  // Create facet remove tags for each filter
  Object.entries(filters).forEach(([filterKey, filterValue]) => {
    const facetTag = createFacetRemoveTag(filterKey, filterValue, displayName);
    facetContainer.appendChild(facetTag);
  });
  
  // Make the container visible
  facetContainer.style.display = 'block';
  facetContainer.style.visibility = 'visible';
  facetContainer.style.opacity = '1';
}

function createFacetContainer() {
  console.log('📦 Creating facet remove container...');
  
  // Look for existing facets-remove container first
  let container = document.querySelector('.facets-remove.facets-remove--mobile-and-vertical');
  
  if (container) {
    console.log('✅ Found existing facets-remove container');
    return container;
  }
  
  // Look for a good place to insert the facet container
  const insertTargets = [
    '.facets form',
    '.facets',
    '.collection-filters',
    '.filters'
  ];
  
  let insertTarget = null;
  for (const selector of insertTargets) {
    insertTarget = document.querySelector(selector);
    if (insertTarget) break;
  }
  
  // Create container with proper Shopify classes
  container = document.createElement('div');
  container.className = 'facets-remove facets-remove--mobile-and-vertical';
  
  if (insertTarget) {
    // Insert at the beginning of the facets form
    insertTarget.insertBefore(container, insertTarget.firstChild);
  } else {
    // Fallback: try to find any form
    const form = document.querySelector('form');
    if (form) {
      form.insertBefore(container, form.firstChild);
    }
  }
  
  return container;
}

function createFacetRemoveTag(filterKey, filterValue, displayName) {
  // Create proper Shopify facet-remove-component
  const facetComponent = document.createElement('facet-remove-component');
  facetComponent.className = 'pills__pill pills__pill--desktop-small facets-remove__pill';
  facetComponent.setAttribute('data-url', '/collections/all'); // URL to remove filter
  facetComponent.setAttribute('tabindex', '0');
  facetComponent.setAttribute('role', 'button');
  
  facetComponent.innerHTML = `
    ${filterKey}: ${filterValue}
    <span class="svg-wrapper svg-wrapper--smaller">
      <svg viewBox="0 0 12 12" class="icon icon-close" aria-hidden="true" focusable="false">
        <path stroke="currentColor" stroke-width="2" d="M3 9l6-6m0 6L3 3" fill="none"/>
      </svg>
    </span>
    <span class="visually-hidden">Remove filter</span>
  `;
  
  // Add click handler to remove the filter
  facetComponent.addEventListener('click', (event) => {
    event.preventDefault();
    removeFacetFilter(filterKey, filterValue);
  });
  
  facetComponent.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      removeFacetFilter(filterKey, filterValue);
    }
  });
  
  return facetComponent;
}

function makeClearAllButtonAccessible(expectedCount) {
  console.log('🔘 Making Clear All button accessible...');
  
  // Find Clear All buttons using the correct selectors from the theme
  const clearAllButtons = document.querySelectorAll('.facets__clear-all, .facets__clear-all-link');
  
  clearAllButtons.forEach(button => {
    // Add the 'active' class to make the button visible (per Shopify theme CSS)
    button.classList.add('active');
    
    // Make sure it's visible
    button.style.display = 'grid'; // Per the CSS: .facets__clear-all.active { display: grid; }
    
    console.log(`✅ Activated Clear All button: ${button.className}`);
  });
  
  // Also look for and activate any Clear All buttons in the actions area
  const actionsClearAll = document.querySelector('.facets__actions .facets__clear-all');
  if (actionsClearAll) {
    actionsClearAll.classList.add('active');
    const actionsContainer = actionsClearAll.closest('.facets__actions');
    if (actionsContainer) {
      actionsContainer.classList.add('facets__actions--active');
    }
  }
  
  console.log(`✅ Made ${clearAllButtons.length} Clear All buttons accessible`);
}

function ensureClearAllRedirect(button) {
  // Remove existing click handlers and add our redirect handler
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);
  
  newButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🎯 Clear All clicked - redirecting to collections/all');
    
    // Add loading state
    newButton.innerHTML = '<span>Clearing...</span>';
    newButton.disabled = true;
    
    // Redirect to collections/all
    window.location.href = '/collections/all';
  });
}

function removeFacetFilter(filterKey, filterValue) {
  console.log(`🗑️ Removing filter: ${filterKey} = ${filterValue}`);
  
  // Since we're on a filtered collection page, any filter removal should redirect to collections/all
  // This maintains the behavior you described where only collections/all can show mixed states
  console.log('📍 Filter removed from filtered collection page, redirecting to collections/all');
  window.location.href = '/collections/all';
}

function updatePageStateForFilters(config) {
  // Update any count displays or other state indicators
  const countDisplays = document.querySelectorAll('.collection-count, .product-count, .results-count');
  countDisplays.forEach(display => {
    if (display.textContent.includes('item')) {
      display.textContent = config.expectedCount;
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeFilteredCollectionState);

// Re-initialize on section loads (Shopify AJAX)
document.addEventListener('shopify:section:load', initializeFilteredCollectionState);
document.addEventListener('shopify:section:reorder', initializeFilteredCollectionState);

// Re-initialize when facets are updated
document.addEventListener('facets:updated', initializeFilteredCollectionState);

// Export functions for debugging
window.initializeFilteredCollectionState = initializeFilteredCollectionState;
window.debugFilteredState = function() {
  console.log('Current path:', window.location.pathname);
  console.log('Config:', collectionFilterMappings[window.location.pathname]);
  console.log('Available checkboxes:', document.querySelectorAll('input[type="checkbox"]'));
  console.log('Clear All buttons:', document.querySelectorAll('.facets__clear-all, .mobile-facets__clear'));
};

console.log('🎯 Filtered collection opening state manager loaded');