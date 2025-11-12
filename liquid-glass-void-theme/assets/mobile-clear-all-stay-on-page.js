// ========================================
// MOBILE CLEAR ALL - STAY ON FILTER PAGE
// Simple fix to keep user on filter screen after clearing
// Works with existing functionality
// ========================================

function fixMobileClearAllBehavior() {
  console.log('🔧 Fixing mobile Clear All behavior to stay on filter page...');
  
  // Only target mobile Clear All buttons
  const mobileClearButtons = document.querySelectorAll('.mobile-facets__clear, .facets__clear-all');
  
  mobileClearButtons.forEach(button => {
    // Store original onclick if it exists
    const originalOnClick = button.onclick;
    
    // Override the click behavior
    button.addEventListener('click', function(event) {
      // Only apply this fix on mobile screens
      if (window.innerWidth > 768) {
        return; // Let desktop behavior work normally
      }
      
      console.log('📱 Mobile Clear All clicked - staying on filter page');
      
      // Prevent default navigation
      event.preventDefault();
      event.stopPropagation();
      
      // Clear all filter inputs
      clearMobileFiltersInPlace();
      
      // Stay on the filter screen - don't navigate away
      // The background state will be collections/all with "All Games" active
      
    }, true); // Use capture to intercept before other handlers
  });
  
  console.log(`✅ Fixed ${mobileClearButtons.length} mobile Clear All buttons`);
}

function clearMobileFiltersInPlace() {
  try {
    console.log('🔄 Clearing mobile filters in place...');
    
    // Find all filter inputs in mobile facets
    const filterInputs = document.querySelectorAll('.mobile-facets input[type="checkbox"], .mobile-facets input[type="radio"]');
    filterInputs.forEach(input => {
      if (input.checked) {
        input.checked = false;
        // Trigger change event for any listeners
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    // Clear range inputs (price filters)
    const rangeInputs = document.querySelectorAll('.mobile-facets input[type="range"], .mobile-facets input[type="number"]');
    rangeInputs.forEach(input => {
      if (input.min !== undefined) {
        input.value = input.min;
      } else {
        input.value = '';
      }
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Clear search inputs
    const searchInputs = document.querySelectorAll('.mobile-facets input[type="search"], .mobile-facets input[type="text"]');
    searchInputs.forEach(input => {
      if (input.value) {
        input.value = '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    // Update the background URL state (for when user closes filter)
    updateBackgroundURLState();
    
    // Hide Clear All button since no filters are active
    const clearButtons = document.querySelectorAll('.mobile-facets__clear, .facets__clear-all');
    clearButtons.forEach(btn => {
      btn.style.display = 'none';
    });
    
    console.log('✅ Mobile filters cleared - staying on filter screen');
    
  } catch (error) {
    console.error('❌ Error clearing mobile filters:', error);
  }
}

function updateBackgroundURLState() {
  try {
    // Update the background URL so when user closes filter, they're on collections/all
    const url = new URL(window.location);
    
    // Remove filter parameters but keep the collections path
    const paramsToRemove = [];
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith('filter') || key === 'q' || key === 'sort_by') {
        paramsToRemove.push(key);
      }
    }
    
    paramsToRemove.forEach(param => url.searchParams.delete(param));
    
    // Set the path to collections/all for background state
    if (url.pathname.includes('/collections/')) {
      url.pathname = '/collections/all';
    }
    
    // Update history without reload - this sets the "background" state
    window.history.replaceState({}, '', url.toString());
    
    console.log('🔄 Background URL state updated to:', url.toString());
    
  } catch (error) {
    console.error('❌ Error updating background URL state:', error);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', fixMobileClearAllBehavior);

// Re-initialize when mobile facets are loaded/reloaded
document.addEventListener('shopify:section:load', fixMobileClearAllBehavior);
document.addEventListener('shopify:section:reorder', fixMobileClearAllBehavior);

// Also run when mobile facets drawer opens
document.addEventListener('facets:loaded', fixMobileClearAllBehavior);

// Export for debugging
window.fixMobileClearAllBehavior = fixMobileClearAllBehavior;
window.clearMobileFiltersInPlace = clearMobileFiltersInPlace;

console.log('📱 Mobile Clear All stay-on-page script loaded');