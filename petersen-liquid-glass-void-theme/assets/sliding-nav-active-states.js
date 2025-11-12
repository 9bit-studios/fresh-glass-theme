// ========================================
// SLIDING NAV ACTIVE STATE DETECTION
// Enhanced differentiation for current page/collection
// ========================================

// Function to set active nav tab based on current page
function setActiveNavTab() {
  const currentPath = window.location.pathname;
  
  // Target ALL sliding navigation containers to handle multiple sections
  const navContainers = document.querySelectorAll('.sliding-nav-container, #sliding-nav');
  
  // Remove all active classes first from ALL navigation sections
  navContainers.forEach(container => {
    const navTabs = container.querySelectorAll('.nav-tab, .glass-tab');
    navTabs.forEach(tab => {
      tab.classList.remove('active');
    });
  });
  
  // Check if we're on a collection page
  if (currentPath.includes('/collections/')) {
    const pathParts = currentPath.split('/collections/')[1];
    const collectionHandle = pathParts ? pathParts.split('/')[0] : null;
    
    if (collectionHandle) {
      console.log(`Detecting collection handle: ${collectionHandle}`);
      
      // Try multiple matching strategies across ALL navigation containers
      let activeTab = null;
      let foundInContainer = null;
      
      // Search through each navigation container
      navContainers.forEach(container => {
        if (activeTab) return; // Skip if already found
        
        const containerTabs = container.querySelectorAll('.nav-tab, .glass-tab');
        
        // Strategy 1: Direct href match (most reliable)
        let foundTab = container.querySelector(`a[href="/collections/${collectionHandle}"]`);
        
        // Strategy 2: Partial href match
        if (!foundTab) {
          foundTab = container.querySelector(`a[href*="/collections/${collectionHandle}"]`);
        }
        
        // Strategy 3: Check data-collection attribute
        if (!foundTab) {
          foundTab = container.querySelector(`[data-collection="${collectionHandle}"]`);
        }
        
        // Strategy 4: Check for common handle variations
        if (!foundTab) {
          const variations = [
            collectionHandle.replace('-', ''),
            collectionHandle.replace('-', '_'),
            collectionHandle.replace('_', '-')
          ];
          
          for (const variation of variations) {
            foundTab = container.querySelector(`a[href*="/collections/${variation}"]`);
            if (foundTab) break;
          }
        }
        
        if (foundTab) {
          activeTab = foundTab;
          foundInContainer = container;
        }
      });
      
      if (activeTab && foundInContainer) {
        activeTab.classList.add('active');
        console.log(`✅ Active tab set for collection: ${collectionHandle}`);
        console.log(`Found in container:`, foundInContainer);
        
        // Force a style recalculation to ensure the active state shows
        activeTab.style.display = 'none';
        activeTab.offsetHeight; // Trigger reflow
        activeTab.style.display = '';
        
      } else {
        console.log(`❌ No matching tab found for collection: ${collectionHandle}`);
        // Debug: Show available tabs in all containers
        console.log('Available navigation containers and tabs:');
        navContainers.forEach((container, index) => {
          console.log(`Container ${index + 1}:`, container);
          const containerTabs = container.querySelectorAll('.nav-tab, .glass-tab');
          containerTabs.forEach(tab => {
            console.log(`  - ${tab.textContent.trim()}: ${tab.href || 'no href'}`);
          });
        });
      }
    }
  }
}

// Set active tab on page load
document.addEventListener('DOMContentLoaded', setActiveNavTab);

// Also set active tab if navigation is happening via AJAX (for themes that use it)
document.addEventListener('shopify:section:load', setActiveNavTab);

// Handle theme editor updates
document.addEventListener('shopify:section:reorder', setActiveNavTab);

// Handle browser back/forward navigation
window.addEventListener('popstate', setActiveNavTab);