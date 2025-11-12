// Search Modal Functionality
function toggleSearch() {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  
  overlay.classList.toggle('active');
  
  if (overlay.classList.contains('active')) {
    setTimeout(() => input.focus(), 100);
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Close search on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  // Close search when clicking outside
  const searchOverlay = document.getElementById('search-overlay');
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeSearch();
      }
    });
  }

  // Auto-submit on suggestion click
  const suggestionLinks = document.querySelectorAll('.suggestion-links a');
  suggestionLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        const searchTerm = this.textContent.trim();
        searchInput.value = searchTerm;
        closeSearch();
        // Navigate to search results
        window.location.href = this.href;
      }
    });
  });
});

// Glass Mega Dropdown Functionality
function toggleGlassDropdown(trigger) {
  const menuItem = trigger.closest('.glass-menu-item');
  const dropdown = menuItem.querySelector('.glass-mega-dropdown');
  const isActive = dropdown.classList.contains('active');
  
  // Close all other dropdowns
  closeAllGlassDropdowns();
  
  if (!isActive) {
    dropdown.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
  }
}

function closeAllGlassDropdowns() {
  const dropdowns = document.querySelectorAll('.glass-mega-dropdown');
  const triggers = document.querySelectorAll('.glass-nav-link');
  
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove('active');
  });
  
  triggers.forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
  });
}

// Legacy mega dropdown functionality (keeping for compatibility)
function toggleMegaDropdown() {
  const dropdown = document.getElementById('megaDropdown');
  const toggle = document.querySelector('.dropdown-toggle');
  if (!dropdown || !toggle) return;
  
  const isActive = dropdown.classList.contains('active');
  
  if (isActive) {
    dropdown.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  } else {
    dropdown.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  // Handle mega dropdown
  const dropdown = document.getElementById('megaDropdown');
  const toggle = document.querySelector('.dropdown-toggle');
  const isDropdownClick = e.target.closest('.nav-dropdown');
  
  if (dropdown && toggle && !isDropdownClick) {
    dropdown.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  }
  
  // Handle glass dropdowns (other navigation items)
  const isGlassMenuItem = e.target.closest('.glass-menu-item');
  if (!isGlassMenuItem) {
    closeAllGlassDropdowns();
  }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    // Close glass dropdowns
    closeAllGlassDropdowns();
    
    // Close legacy dropdown
    const dropdown = document.getElementById('megaDropdown');
    const toggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      if (toggle.focus) toggle.focus();
    }
  }
});

// Export functions
window.toggleSearch = toggleSearch;
window.closeSearch = closeSearch;
window.toggleMegaDropdown = toggleMegaDropdown;
window.toggleGlassDropdown = toggleGlassDropdown;
window.closeAllGlassDropdowns = closeAllGlassDropdowns;