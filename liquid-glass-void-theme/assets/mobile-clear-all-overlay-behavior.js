// ========================================
// MOBILE CLEAR ALL - OVERLAY BEHAVIOR
// Handles Clear All in mobile filter overlay without page navigation
// Shows filter reset and count update in overlay
// ========================================

function handleMobileClearAllInOverlay() {
  console.log('📱 Setting up mobile Clear All overlay behavior...');
  
  // Find mobile Clear All buttons (in drawers/overlays)
  const mobileSelectors = [
    '.mobile-facets__clear',
    '.facets--drawer .facets__clear-all', 
    '.drawer .facets__clear-all'
  ];
  
  let mobileClearButtons = [];
  mobileSelectors.forEach(selector => {
    const buttons = document.querySelectorAll(selector);
    mobileClearButtons.push(...buttons);
  });
  
  mobileClearButtons.forEach((button, index) => {
    enhanceMobileClearButton(button, index);
  });
  
  console.log(`📱 Enhanced ${mobileClearButtons.length} mobile Clear All buttons`);
}

function enhanceMobileClearButton(button, index) {
  try {
    console.log(`📱 Enhancing mobile Clear All button ${index + 1}`);
    
    // Store original handlers
    const originalClick = button.onclick;
    const originalHandlers = [];
    
    // Clone button to remove existing event listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add mobile-specific Clear All handler
    newButton.addEventListener('click', function(event) {
      const currentPath = window.location.pathname;
      
      // If we're on collections/all, use native behavior but stay in overlay
      if (currentPath === '/collections/all') {
        console.log('📱 On collections/all - clearing filters in overlay');
        handleNativeMobileClear(newButton, event);
        return;
      }
      
      // If on filtered collection page, clear to "All Games" state but stay in overlay
      if (currentPath.includes('/collections/')) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('📱 On filtered collection - clearing to All Games state in overlay');
        clearToAllGamesInOverlay();
      }
    });
    
  } catch (error) {
    console.error(`❌ Error enhancing mobile Clear All button ${index + 1}:`, error);
  }
}

function clearToAllGamesInOverlay() {
  try {
    console.log('📱 Clearing to All Games state in mobile overlay...');
    
    // Step 1: Clear all filter inputs in the mobile drawer
    clearAllMobileFilterInputs();
    
    // Step 2: Remove facet remove tags
    clearFacetRemoveTags();
    
    // Step 3: Update the "See Results" button to show 373 items
    updateMobileResultsButton(373);
    
    // Step 4: Update background URL state to collections/all
    updateBackgroundState();
    
    // Step 5: Hide Clear All button (no filters active)
    hideClearAllButton();
    
    // Step 6: Update any filter counts or states
    updateFilterDisplayStates();
    
    console.log('✅ Mobile overlay cleared to All Games state');
    
  } catch (error) {
    console.error('❌ Error clearing to All Games state in overlay:', error);
  }
}

function clearAllMobileFilterInputs() {
  console.log('📱 Clearing all mobile filter inputs...');
  
  // Find the mobile filter drawer/overlay
  const mobileDrawer = document.querySelector('.mobile-facets, .facets--drawer, .drawer');
  if (!mobileDrawer) {
    console.log('⚠️ Could not find mobile filter drawer');
    return;
  }
  
  // Clear checkbox inputs
  const checkboxes = mobileDrawer.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  // Clear radio inputs
  const radios = mobileDrawer.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    if (radio.checked && radio.value !== '') {
      radio.checked = false;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  // Clear range inputs (price filters)
  const ranges = mobileDrawer.querySelectorAll('input[type="range"], input[type="number"]');
  ranges.forEach(range => {
    if (range.min !== undefined) {
      range.value = range.min;
    } else {
      range.value = '';
    }
    range.dispatchEvent(new Event('change', { bubbles: true }));
  });
  
  // Clear search inputs
  const searches = mobileDrawer.querySelectorAll('input[type="search"], input[type="text"]');
  searches.forEach(search => {
    if (search.value) {
      search.value = '';
      search.dispatchEvent(new Event('input', { bubbles: true }));
      search.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  console.log(`📱 Cleared ${checkboxes.length + radios.length + ranges.length + searches.length} filter inputs`);
}

function clearFacetRemoveTags() {
  console.log('📱 Removing facet remove tags...');
  
  // Find and remove facet remove tags
  const facetTags = document.querySelectorAll('facet-remove-component, .facet-remove, .facets-remove__pill');
  facetTags.forEach(tag => {
    tag.remove();
  });
  
  // Hide the facets-remove container if it's empty
  const facetContainers = document.querySelectorAll('.facets-remove');
  facetContainers.forEach(container => {
    if (container.children.length === 0) {
      container.style.display = 'none';
    }
  });
  
  console.log(`📱 Removed ${facetTags.length} facet remove tags`);
}

function updateMobileResultsButton(itemCount) {
  console.log(`📱 Updating mobile results button to show ${itemCount} items...`);
  
  // Find the "See Results" or "See Items" button
  const resultsSelectors = [
    '.facets__see-results',
    '.mobile-facets__see-results', 
    '.drawer .button-primary',
    'button[on\\:click*="closeDialog"]'
  ];
  
  let resultsButton = null;
  for (const selector of resultsSelectors) {
    resultsButton = document.querySelector(selector);
    if (resultsButton) break;
  }
  
  if (resultsButton) {
    // Update button text to show new count
    const buttonText = resultsButton.textContent.replace(/\d+/, itemCount);
    resultsButton.textContent = buttonText;
    
    // Also try more specific text updates
    if (resultsButton.textContent.includes('item')) {
      resultsButton.textContent = `See ${itemCount} items`;
    }
    
    console.log(`📱 Updated results button: "${resultsButton.textContent}"`);
  } else {
    console.log('⚠️ Could not find mobile results button');
  }
}

function updateBackgroundState() {
  console.log('📱 Updating background URL state to collections/all...');
  
  try {
    // Update the URL in the background so when overlay closes, user is on collections/all
    const url = new URL(window.location);
    url.pathname = '/collections/all';
    
    // Remove all filter parameters
    const paramsToRemove = [];
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith('filter') || key === 'q' || key === 'sort_by') {
        paramsToRemove.push(key);
      }
    }
    paramsToRemove.forEach(param => url.searchParams.delete(param));
    
    // Update history without navigation
    window.history.replaceState({}, '', url.toString());
    
    console.log(`📱 Background URL updated to: ${url.toString()}`);
    
  } catch (error) {
    console.error('❌ Error updating background URL state:', error);
  }
}

function hideClearAllButton() {
  console.log('📱 Hiding Clear All button (no active filters)...');
  
  const clearButtons = document.querySelectorAll('.facets__clear-all, .mobile-facets__clear');
  clearButtons.forEach(button => {
    button.classList.remove('active');
    // Don't force hide completely - let CSS handle visibility based on active class
  });
}

function updateFilterDisplayStates() {
  console.log('📱 Updating filter display states...');
  
  // Update any filter count displays
  const filterCounts = document.querySelectorAll('.filter-count, .active-filter-count');
  filterCounts.forEach(count => {
    count.textContent = '0';
    count.style.display = 'none';
  });
  
  // Update any "All Games" or collection navigation states
  // This will be handled by the mobile-nav-tab-repositioning.js when the user closes the overlay
}

function handleNativeMobileClear(button, event) {
  console.log('📱 Handling native mobile clear on collections/all...');
  
  // Let the native behavior proceed but enhance it
  // Don't prevent default - let Shopify handle the clearing
  
  // After a short delay, update the UI
  setTimeout(() => {
    updateMobileResultsButton(373);
    updateBackgroundState();
    hideClearAllButton();
  }, 100);
}

// Initialize mobile Clear All behavior
document.addEventListener('DOMContentLoaded', handleMobileClearAllInOverlay);
document.addEventListener('shopify:section:load', handleMobileClearAllInOverlay);
document.addEventListener('shopify:section:reorder', handleMobileClearAllInOverlay);

// Handle when mobile facets drawer opens
document.addEventListener('facets:loaded', handleMobileClearAllInOverlay);

// Export functions for debugging
window.handleMobileClearAllInOverlay = handleMobileClearAllInOverlay;
window.clearToAllGamesInOverlay = clearToAllGamesInOverlay;

console.log('📱 Mobile Clear All overlay behavior loaded');