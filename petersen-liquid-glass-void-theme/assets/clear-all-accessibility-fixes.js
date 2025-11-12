// ========================================
// CLEAR ALL ACCESSIBILITY FIXES
// Ensures Clear All button is accessible on collection pages in opening state
// Coordinates with existing enhanced-clear-all-functionality.js
// ========================================

class ClearAllAccessibilityManager {
  constructor() {
    this.initialized = false;
    this.observers = new Map();
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
    console.log('🔧 Setting up Clear All accessibility fixes...');
    
    // Wait for other filter systems to initialize
    setTimeout(() => {
      this.ensureInitialVisibility();
      this.setupLoadingStateManager();
      this.setupDynamicVisibility();
      this.initialized = true;
      console.log('✅ Clear All accessibility fixes initialized');
    }, 500);
  }

  ensureInitialVisibility() {
    try {
      console.log('👀 Ensuring Clear All button initial visibility...');
      
      // Target all Clear All buttons across different filter contexts
      const clearAllSelectors = [
        '.facets__clear-all',
        '.mobile-facets__clear',
        '.clear-all-enhanced',
        '.interactive-clear-all',
        'button[data-facet-clear]',
        '.clear-filter'
      ];
      
      clearAllSelectors.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => this.makeButtonAccessible(button));
      });
      
    } catch (error) {
      console.error('❌ Error ensuring initial visibility:', error);
    }
  }

  makeButtonAccessible(button) {
    if (!button) return;
    
    try {
      // Force visibility and accessibility
      button.style.opacity = '1';
      button.style.visibility = 'visible';
      button.style.display = '';
      
      // Remove any hiding classes that might be applied
      const hidingClasses = ['hidden', 'hide', 'disabled', 'd-none'];
      hidingClasses.forEach(cls => button.classList.remove(cls));
      
      // Ensure button is focusable
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }
      
      // Add accessibility attributes if missing
      if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
        button.setAttribute('aria-label', 'Clear all filters');
      }
      
      // Ensure button has proper role
      if (!button.hasAttribute('role') && button.tagName !== 'BUTTON') {
        button.setAttribute('role', 'button');
      }
      
      console.log('✅ Made Clear All button accessible:', button);
      
    } catch (error) {
      console.error('❌ Error making button accessible:', error);
    }
  }

  setupLoadingStateManager() {
    try {
      console.log('⏳ Setting up loading state management...');
      
      // Watch for loading states that might hide Clear All buttons
      const loadingSelectors = [
        '.loading',
        '.is-loading',
        '[data-loading="true"]',
        '.facets-loading'
      ];
      
      loadingSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          this.setupLoadingObserver(element);
        });
      });
      
      // Listen for custom loading events
      document.addEventListener('facets:loading', (e) => {
        console.log('🔄 Facets loading detected, ensuring Clear All visibility');
        setTimeout(() => this.ensureInitialVisibility(), 100);
      });
      
      document.addEventListener('facets:loaded', (e) => {
        console.log('✅ Facets loaded, ensuring Clear All visibility');
        setTimeout(() => this.ensureInitialVisibility(), 100);
      });
      
    } catch (error) {
      console.error('❌ Error setting up loading state manager:', error);
    }
  }

  setupLoadingObserver(element) {
    const observerId = Math.random().toString(36).substr(2, 9);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'data-loading')) {
          
          const isLoading = element.classList.contains('loading') || 
                           element.classList.contains('is-loading') ||
                           element.getAttribute('data-loading') === 'true';
          
          if (!isLoading) {
            // Loading finished, ensure Clear All is visible
            setTimeout(() => this.ensureInitialVisibility(), 100);
          }
        }
      });
    });
    
    observer.observe(element, {
      attributes: true,
      attributeFilter: ['class', 'data-loading']
    });
    
    this.observers.set(observerId, observer);
  }

  setupDynamicVisibility() {
    try {
      console.log('🔄 Setting up dynamic visibility management...');
      
      // Create main observer for filter changes
      const mainObserver = new MutationObserver((mutations) => {
        let shouldCheck = false;
        
        mutations.forEach((mutation) => {
          // Check for new Clear All buttons being added
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                const clearAllButtons = node.querySelectorAll && node.querySelectorAll(
                  '.facets__clear-all, .mobile-facets__clear, .clear-all-enhanced, .interactive-clear-all'
                );
                if (clearAllButtons && clearAllButtons.length > 0) {
                  shouldCheck = true;
                }
              }
            });
          }
          
          // Check for attribute changes that might affect visibility
          if (mutation.type === 'attributes' && 
              ['style', 'class', 'hidden', 'aria-hidden'].includes(mutation.attributeName)) {
            const target = mutation.target;
            if (target.matches && target.matches(
              '.facets__clear-all, .mobile-facets__clear, .clear-all-enhanced, .interactive-clear-all'
            )) {
              shouldCheck = true;
            }
          }
        });
        
        if (shouldCheck) {
          setTimeout(() => this.ensureInitialVisibility(), 50);
        }
      });
      
      // Observe the entire document for changes
      mainObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden', 'aria-hidden']
      });
      
      this.observers.set('main', mainObserver);
      
      // Also listen for section reloads (Shopify themes)
      document.addEventListener('shopify:section:load', () => {
        setTimeout(() => this.ensureInitialVisibility(), 200);
      });
      
      document.addEventListener('shopify:section:reorder', () => {
        setTimeout(() => this.ensureInitialVisibility(), 200);
      });
      
    } catch (error) {
      console.error('❌ Error setting up dynamic visibility:', error);
    }
  }

  // Public method to force Clear All visibility (can be called externally)
  forceVisibility() {
    console.log('🔧 Forcing Clear All button visibility...');
    this.ensureInitialVisibility();
  }

  // Public method to check if Clear All buttons are accessible
  checkAccessibility() {
    const clearAllButtons = document.querySelectorAll(
      '.facets__clear-all, .mobile-facets__clear, .clear-all-enhanced, .interactive-clear-all'
    );
    
    let accessibleCount = 0;
    let totalCount = clearAllButtons.length;
    
    clearAllButtons.forEach(button => {
      const isVisible = button.offsetWidth > 0 && button.offsetHeight > 0;
      const isClickable = !button.disabled && button.style.pointerEvents !== 'none';
      const hasAccessibility = button.hasAttribute('aria-label') || button.textContent.trim();
      
      if (isVisible && isClickable && hasAccessibility) {
        accessibleCount++;
      }
    });
    
    const report = {
      total: totalCount,
      accessible: accessibleCount,
      percentage: totalCount > 0 ? (accessibleCount / totalCount) * 100 : 0
    };
    
    console.log('📊 Clear All Accessibility Report:', report);
    return report;
  }

  destroy() {
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.initialized = false;
  }
}

// Initialize the accessibility manager
let clearAllAccessibilityManager;

document.addEventListener('DOMContentLoaded', () => {
  clearAllAccessibilityManager = new ClearAllAccessibilityManager();
});

// Make available globally for debugging and external control
window.ClearAllAccessibilityManager = ClearAllAccessibilityManager;
window.clearAllAccessibilityManager = clearAllAccessibilityManager;

// Export functions for external use
window.forceClearAllVisibility = () => {
  if (clearAllAccessibilityManager) {
    clearAllAccessibilityManager.forceVisibility();
  }
};

window.checkClearAllAccessibility = () => {
  if (clearAllAccessibilityManager) {
    return clearAllAccessibilityManager.checkAccessibility();
  }
  return null;
};

console.log('🚀 Clear All Accessibility Fixes script loaded');