function toggleSearch() {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  
  if (!overlay || !input) {
    console.warn('Search elements not found');
    return;
  }
  
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
  
  if (!overlay) {
    console.warn('Search overlay not found');
    return;
  }
  
  overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function initializeSearchListeners() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  const searchOverlay = document.getElementById('search-overlay');
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });
  }

  const suggestionLinks = document.querySelectorAll('.suggestion-links a');
  suggestionLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      if (searchInput && link.textContent) {
        const searchTerm = link.textContent.trim();
        if (searchInput.tagName === 'INPUT' && 'value' in searchInput) {
          searchInput.value = searchTerm;
        }
        closeSearch();
        if (link.tagName === 'A' && 'href' in link && typeof link.href === 'string') {
          window.location.href = link.href;
        }
      }
    });
  });
}

function toggleMegaDropdown() {
  const dropdown = document.getElementById('megaDropdown');
  const toggle = document.querySelector('.dropdown-toggle');
  
  if (!dropdown || !toggle) {
    console.warn('Dropdown elements not found');
    return;
  }
  
  const isActive = dropdown.classList.contains('active');
  
  if (isActive) {
    dropdown.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  } else {
    dropdown.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
  }
}

function initializeDropdownListeners() {
  document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('megaDropdown');
    const toggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && toggle && e.target && e.target instanceof Node) {
      if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const dropdown = document.getElementById('megaDropdown');
      const toggle = document.querySelector('.dropdown-toggle');
      
      if (dropdown && toggle && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        if ('focus' in toggle && typeof toggle.focus === 'function') {
          toggle.focus();
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initializeSearchListeners();
  initializeDropdownListeners();
});

window.toggleSearch = toggleSearch;
window.closeSearch = closeSearch;
window.toggleMegaDropdown = toggleMegaDropdown;