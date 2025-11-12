// ========================================
// ENHANCED CLEAR ALL FUNCTIONALITY
// Return to ALL Collections state instead of just clearing current collection
// Phase 11 Collection Page Enhancements
// ========================================

// Function to enhance Clear All button functionality
function enhanceClearAllFunctionality() {
  console.log('🔄 Enhancing Clear All button functionality...');
  
  // Find all Clear All buttons in the page
  const clearAllButtons = document.querySelectorAll('.facets__clear-all, .mobile-facets__clear, button[data-facet-clear], .clear-filter');
  
  if (clearAllButtons.length === 0) {
    console.log('❌ No Clear All buttons found');
    return;
  }
  
  console.log(`✅ Found ${clearAllButtons.length} Clear All buttons`);
  
  // Enhance each Clear All button
  clearAllButtons.forEach((button, index) => {
    enhanceClearAllButton(button, index);
  });
}

// Function to enhance individual Clear All button
function enhanceClearAllButton(button, index) {
  try {
    console.log(`🔧 Enhancing Clear All button ${index + 1}`);
    
    // Store original click handler
    const originalClickHandler = button.onclick;
    
    // Remove existing event listeners by cloning the button
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add enhanced click handler
    newButton.addEventListener('click', function(event) {
      console.log('🎯 Enhanced Clear All clicked');
      
      const currentPath = window.location.pathname;
      
      // If we're already on collections/all, use native Shopify behavior to clear filters
      if (currentPath === '/collections/all') {
        console.log('📍 On collections/all page, using native clear behavior');
        // Let the native Shopify facet system handle this
        return; // Don't prevent default - let Shopify handle it
      }
      
      // If we're on a filtered collection page, redirect to collections/all
      if (currentPath.includes('/collections/')) {
        event.preventDefault();
        event.stopPropagation();
        
        const allCollectionsUrl = '/collections/all';
        
        console.log(`🚀 Redirecting from ${currentPath} to ${allCollectionsUrl}`);
        
        // Add smooth transition effect
        document.body.style.opacity = '0.8';
        document.body.style.transition = 'opacity 0.3s ease';
        
        // Navigate to ALL Collections
        window.location.href = allCollectionsUrl;
      } else {
        // If not on a collection page, fall back to original behavior
        console.log('📄 Not on collection page, using standard clear behavior');
        
        if (originalClickHandler) {
          originalClickHandler.call(newButton, event);
        } else {
          // Try to trigger form reset or facets clear
          clearFiltersStandard(newButton);
        }
      }
    });
    
    // Update button text to be more descriptive
    updateButtonText(newButton);
    
    // Add visual enhancement
    enhanceButtonVisuals(newButton);
    
    console.log(`✅ Enhanced Clear All button ${index + 1} successfully`);
    
  } catch (error) {
    console.error(`❌ Error enhancing Clear All button ${index + 1}:`, error);
  }
}

// Function to update button text for clarity
function updateButtonText(button) {
  try {
    // Check if we're on a collection page
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/collections/')) {
      // Extract collection name for better UX
      const pathParts = currentPath.split('/collections/')[1];
      const collectionHandle = pathParts ? pathParts.split('/')[0] : null;
      
      if (collectionHandle && collectionHandle !== 'all') {
        // Update button text to indicate it will return to ALL Collections
        const originalText = button.textContent.trim();
        
        // Only update if it's a generic "Clear" or "Clear All" text
        if (originalText.toLowerCase().includes('clear')) {
          button.innerHTML = `
            <span class="clear-all-enhanced-text">
              <span class="clear-all-main">Clear All</span>
              <span class="clear-all-subtitle">(See 373 items)</span>
            </span>
          `;
          
          console.log(`📝 Updated button text from "${originalText}" to "Clear All (See 373 items)"`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error updating button text:', error);
  }
}

// Function to enhance button visuals
function enhanceButtonVisuals(button) {
  try {
    // Add enhanced styling class
    button.classList.add('clear-all-enhanced');
    
    // Add visual indicator icon
    const hasIcon = button.querySelector('.clear-all-icon');
    if (!hasIcon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'clear-all-icon';
      iconSpan.innerHTML = '↺'; // Unicode refresh/reset symbol
      button.insertBefore(iconSpan, button.firstChild);
    }
    
    console.log('🎨 Enhanced button visuals');
  } catch (error) {
    console.error('❌ Error enhancing button visuals:', error);
  }
}

// Fallback standard clear functionality
function clearFiltersStandard(button) {
  try {
    console.log('🔄 Attempting standard filter clear...');
    
    // Try to find and submit the facets form
    const facetsForm = document.querySelector('form[data-facets-form], #facets-form, .facets-form');
    if (facetsForm) {
      // Clear all form inputs
      const inputs = facetsForm.querySelectorAll('input[type="checkbox"], input[type="radio"]');
      inputs.forEach(input => {
        if (input.checked) {
          input.checked = false;
        }
      });
      
      // Clear range inputs
      const rangeInputs = facetsForm.querySelectorAll('input[type="range"], input[type="number"]');
      rangeInputs.forEach(input => {
        input.value = input.min || '';
      });
      
      // Submit the form to apply changes
      facetsForm.submit();
      console.log('✅ Standard filter clear completed');
    } else {
      // Try alternative methods
      console.log('⚠️ No facets form found, trying alternative clear methods');
      
      // Try to trigger updateFilters event
      const updateEvent = new CustomEvent('facets:clear', {
        bubbles: true,
        detail: { clearAll: true }
      });
      button.dispatchEvent(updateEvent);
      
      // Try to reload the page without query parameters
      const baseUrl = window.location.pathname;
      if (window.location.search) {
        window.location.href = baseUrl;
      }
    }
  } catch (error) {
    console.error('❌ Error with standard clear functionality:', error);
  }
}

// Function to handle page load and setup
function initializeEnhancedClearAll() {
  console.log('🚀 Initializing Enhanced Clear All functionality...');
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceClearAllFunctionality);
  } else {
    enhanceClearAllFunctionality();
  }
  
  // Handle dynamic content loading (AJAX, etc.)
  document.addEventListener('shopify:section:load', enhanceClearAllFunctionality);
  document.addEventListener('shopify:section:reorder', enhanceClearAllFunctionality);
  
  // Re-run when filters are updated
  document.addEventListener('facets:updated', enhanceClearAllFunctionality);
  
  console.log('✅ Enhanced Clear All initialization complete');
}

// CSS styles for enhanced button (injected via JavaScript)
function injectEnhancedStyles() {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    /* Enhanced Clear All Button Styles */
    .clear-all-enhanced {
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    .clear-all-enhanced:hover {
      transform: translateY(-1px) scale(1.02) !important;
    }
    
    .clear-all-icon {
      font-size: 1.1em !important;
      opacity: 0.8 !important;
      transition: opacity 0.3s ease !important;
    }
    
    .clear-all-enhanced:hover .clear-all-icon {
      opacity: 1 !important;
      animation: rotate-refresh 0.5s ease !important;
    }
    
    @keyframes rotate-refresh {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(180deg); }
    }
    
    .clear-all-enhanced-text {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      line-height: 1.2 !important;
    }
    
    .clear-all-main {
      font-weight: 500 !important;
    }
    
    .clear-all-subtitle {
      font-size: 0.75em !important;
      opacity: 0.7 !important;
      margin-top: 0.1rem !important;
    }
    
    /* Mobile responsive adjustments */
    @media (max-width: 768px) {
      .clear-all-enhanced-text {
        gap: 0.1rem !important;
      }
      
      .clear-all-subtitle {
        font-size: 0.7em !important;
      }
    }
  `;
  
  document.head.appendChild(styleSheet);
  console.log('🎨 Enhanced Clear All styles injected');
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  injectEnhancedStyles();
  initializeEnhancedClearAll();
});

// Export functions for external use
window.enhanceClearAllFunctionality = enhanceClearAllFunctionality;
window.initializeEnhancedClearAll = initializeEnhancedClearAll;

// Debug helper
window.debugClearAll = function() {
  console.log('🔍 Debug: Clear All buttons found:');
  const buttons = document.querySelectorAll('.facets__clear-all, .mobile-facets__clear, button[data-facet-clear], .clear-filter');
  buttons.forEach((button, index) => {
    console.log(`Button ${index + 1}:`, button);
    console.log(`Text: "${button.textContent.trim()}"`);
    console.log(`Classes: ${button.className}`);
    console.log(`Parent form:`, button.closest('form'));
  });
};