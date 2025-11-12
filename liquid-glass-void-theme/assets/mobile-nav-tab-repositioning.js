// ========================================
// MOBILE NAV TAB REPOSITIONING
// Enhanced sliding nav behavior for mobile viewport
// Moves active collection tab to first position
// ========================================

// Function to move active tab to first position in mobile viewport
function moveActiveTabToFirst(activeTab, container) {
  try {
    // Only apply on mobile viewport
    if (window.innerWidth > 768) {
      return;
    }
    
    // Find the scroll container (nav-tabs-scroll)
    const scrollContainer = container.querySelector('.nav-tabs-scroll');
    if (!scrollContainer) {
      console.log('❌ No scroll container found');
      return;
    }
    
    // Get all navigation tabs in the container
    const allTabs = Array.from(scrollContainer.querySelectorAll('.nav-tab, .glass-tab'));
    
    // Find the index of the active tab
    const activeIndex = allTabs.indexOf(activeTab);
    if (activeIndex === -1) {
      console.log('❌ Active tab not found in container');
      return;
    }
    
    // If already first, no need to move
    if (activeIndex === 0) {
      console.log('✅ Active tab already in first position');
      return;
    }
    
    console.log(`📱 Moving active tab from position ${activeIndex + 1} to position 1`);
    
    // Remove the active tab from its current position
    const tabToMove = allTabs[activeIndex];
    tabToMove.remove();
    
    // Insert it as the first child
    scrollContainer.insertBefore(tabToMove, scrollContainer.firstChild);
    
    // Scroll to ensure the first tab is visible
    scrollContainer.scrollLeft = 0;
    
    console.log('✅ Active tab moved to first position successfully');
    
  } catch (error) {
    console.error('❌ Error moving active tab to first position:', error);
  }
}

// Enhanced setActiveNavTab function that includes mobile repositioning
function enhancedSetActiveNavTab() {
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
        
        // Mobile viewport behavior: Move active tab to first position
        moveActiveTabToFirst(activeTab, foundInContainer);
        
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

// Event listeners for enhanced navigation
document.addEventListener('DOMContentLoaded', enhancedSetActiveNavTab);
document.addEventListener('shopify:section:load', enhancedSetActiveNavTab);
document.addEventListener('shopify:section:reorder', enhancedSetActiveNavTab);
window.addEventListener('popstate', enhancedSetActiveNavTab);

// Handle window resize to ensure proper behavior across viewport changes
window.addEventListener('resize', function() {
  // Debounce to prevent excessive calls
  clearTimeout(window.navResizeTimeout);
  window.navResizeTimeout = setTimeout(enhancedSetActiveNavTab, 150);
});

// Export functions for external use
window.moveActiveTabToFirst = moveActiveTabToFirst;
window.enhancedSetActiveNavTab = enhancedSetActiveNavTab;