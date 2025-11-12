// ========================================
// MOBILE CLEAR ALL ENHANCEMENT
// Replace "View All Collections (Clear All Filters)" with "Clear All"
// Clear All action clears all filters and resets to 'ALL Games' state (373 items)
// ========================================

class MobileClearAllEnhancement {
  constructor() {
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
    console.log('🔧 Setting up Mobile Clear All Enhancement...');
    
    this.replaceViewAllCollectionsText();
    this.enhanceClearAllBehavior();
    this.setupDynamicUpdates();
    
    this.initialized = true;
    console.log('✅ Mobile Clear All Enhancement initialized');
  }

  replaceViewAllCollectionsText() {
    try {
      console.log('📝 Replacing "View All Collections" text with "Clear All"...');
      
      // Target buttons with "View All Collections" text
      const buttons = document.querySelectorAll('button, .mobile-facets__clear, .facets__clear-all');
      let replacements = 0;
      
      buttons.forEach(button => {
        const textContent = button.textContent.trim();
        
        if (textContent.includes('View All Collections') || 
            textContent.includes('Clear All Filters')) {
          
          // Replace the text content
          button.innerHTML = button.innerHTML.replace(
            /View All Collections\s*\(?\s*Clear All Filters?\s*\)?/gi,
            'Clear All'
          );
          
          // Also update any child text nodes
          this.replaceTextInElement(button, /View All Collections\s*\(?\s*Clear All Filters?\s*\)?/gi, 'Clear All');
          
          // Add class for identification
          button.classList.add('enhanced-clear-all-mobile');
          
          replacements++;
          console.log('✅ Replaced button text:', button);
        }
      });
      
      console.log(`✅ Replaced text in ${replacements} buttons`);
      
    } catch (error) {
      console.error('❌ Error replacing View All Collections text:', error);
    }
  }

  replaceTextInElement(element, searchRegex, replacement) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
      if (searchRegex.test(textNode.textContent)) {
        textNode.textContent = textNode.textContent.replace(searchRegex, replacement);
      }
    });
  }

  enhanceClearAllBehavior() {
    try {
      console.log('🔧 Enhancing Clear All behavior...');
      
      const clearAllButtons = document.querySelectorAll(
        '.mobile-facets__clear, .facets__clear-all, .enhanced-clear-all-mobile'
      );
      
      clearAllButtons.forEach(button => {
        // Remove existing event listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode?.replaceChild(newButton, button);
        
        // Add enhanced click handler
        newButton.addEventListener('click', (event) => {
          this.handleClearAllClick(event, newButton);
        });
        
        console.log('✅ Enhanced Clear All button:', newButton);
      });
      
    } catch (error) {
      console.error('❌ Error enhancing Clear All behavior:', error);
    }
  }

  handleClearAllClick(event, button) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🤓 Enhanced Mobile Clear All clicked');
    
    // Check if we're on mobile
    if (window.innerWidth <= 768) {
      console.log('📱 Mobile viewport detected');
      
      // Clear all filters but navigate to All Games state
      this.clearAllFiltersAndRedirect();
    } else {
      // Desktop behavior - use existing enhanced functionality
      const currentPath = window.location.pathname;
      if (currentPath.includes('/collections/') && currentPath !== '/collections/all') {
        window.location.href = '/collections/all';
      } else {
        this.clearFiltersInPlace();
      }
    }
  }

  clearAllFiltersAndRedirect() {
    try {
      console.log('🔄 Clearing all filters and redirecting to All Games...');
      
      // Add loading state
      document.body.classList.add('clearing-filters');
      
      // Show loading indicator
      this.showLoadingIndicator();
      
      // Clear filters first (for visual feedback)
      this.clearFiltersInPlace(false);
      
      // Then redirect to All Games after a brief delay
      setTimeout(() => {
        console.log('🦄 Redirecting to All Games (373 items)');
        window.location.href = '/collections/all';
      }, 300);
      
    } catch (error) {
      console.error('❌ Error clearing filters and redirecting:', error);
      // Fallback - just redirect
      window.location.href = '/collections/all';
    }
  }

  clearFiltersInPlace(updateURL = true) {
    try {
      console.log('🔄 Clearing filters in place...');
      
      // Clear checkboxes
      const filterInputs = document.querySelectorAll(
        '.facets input[type="checkbox"], .mobile-facets input[type="checkbox"]'
      );
      filterInputs.forEach(input => {
        if (input.checked) {
          input.checked = false;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      
      // Clear range inputs
      const rangeInputs = document.querySelectorAll(
        '.facets input[type="range"], .facets input[type="number"], ' +
        '.mobile-facets input[type="range"], .mobile-facets input[type="number"]'
      );
      rangeInputs.forEach(input => {
        if (input.min !== undefined) {
          input.value = input.min;
        } else {
          input.value = '';
        }
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      // Clear search inputs
      const searchInputs = document.querySelectorAll(
        '.facets input[type="search"], .facets input[type="text"], ' +
        '.mobile-facets input[type="search"], .mobile-facets input[type="text"]'
      );
      searchInputs.forEach(input => {
        if (input.value) {
          input.value = '';
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      
      // Update URL if requested
      if (updateURL) {
        this.updateURLToAllGames();
      }
      
      console.log('✅ Filters cleared in place');
      
    } catch (error) {
      console.error('❌ Error clearing filters in place:', error);
    }
  }

  updateURLToAllGames() {
    try {
      const url = new URL(window.location);
      
      // Remove all filter parameters
      const paramsToRemove = [];
      for (const [key] of url.searchParams.entries()) {
        if (key.startsWith('filter') || key === 'q' || key === 'sort_by' || key === 'page') {
          paramsToRemove.push(key);
        }
      }
      
      paramsToRemove.forEach(param => url.searchParams.delete(param));
      
      // Set path to all collections
      url.pathname = '/collections/all';
      
      // Update history
      window.history.replaceState({}, 'All Games - Petersen Games', url.toString());
      
      console.log('🔄 URL updated to All Games state');
      
    } catch (error) {
      console.error('❌ Error updating URL:', error);
    }
  }

  showLoadingIndicator() {
    try {
      // Remove existing loading indicator
      const existingIndicator = document.querySelector('.mobile-clear-loading');
      if (existingIndicator) {
        existingIndicator.remove();
      }
      
      // Create loading indicator
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'mobile-clear-loading';
      loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">Clearing filters...</div>
      `;
      
      // Add styles
      loadingIndicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 10000;
        text-align: center;
        backdrop-filter: blur(10px);
      `;
      
      document.body.appendChild(loadingIndicator);
      
    } catch (error) {
      console.error('❌ Error showing loading indicator:', error);
    }
  }

  setupDynamicUpdates() {
    try {
      console.log('🔄 Setting up dynamic updates...');
      
      // Re-run when mobile facets are loaded
      document.addEventListener('shopify:section:load', () => {
        setTimeout(() => {
          this.replaceViewAllCollectionsText();
          this.enhanceClearAllBehavior();
        }, 100);
      });
      
      // Re-run when facets are updated
      document.addEventListener('facets:updated', () => {
        setTimeout(() => {
          this.replaceViewAllCollectionsText();
        }, 50);
      });
      
      // Watch for new buttons being added
      const observer = new MutationObserver(() => {
        setTimeout(() => {
          this.replaceViewAllCollectionsText();
          this.enhanceClearAllBehavior();
        }, 50);
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
    } catch (error) {
      console.error('❌ Error setting up dynamic updates:', error);
    }
  }
}

// Initialize the mobile enhancement
let mobileClearAllEnhancement;

document.addEventListener('DOMContentLoaded', () => {
  mobileClearAllEnhancement = new MobileClearAllEnhancement();
});

// Make available globally
window.MobileClearAllEnhancement = MobileClearAllEnhancement;
window.mobileClearAllEnhancement = mobileClearAllEnhancement;

// Export functions for external use
window.enhanceMobileClearAll = () => {
  if (mobileClearAllEnhancement) {
    mobileClearAllEnhancement.replaceViewAllCollectionsText();
    mobileClearAllEnhancement.enhanceClearAllBehavior();
  }
};

// CSS for loading state
const loadingStyles = `
<style>
.clearing-filters {
  pointer-events: none;
  opacity: 0.7;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  opacity: 0.9;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', loadingStyles);

console.log('🦄 Mobile Clear All Enhancement script loaded');