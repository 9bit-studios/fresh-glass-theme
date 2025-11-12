# Filter Sidebar Integration Plan
## Connecting Glass Filter Sidebar & Mobile Filter Sidebar to Shopify Product Search

### Current Architecture Analysis

#### Components Inventory
1. **glass-filter-sidebar.liquid** - Desktop filter sidebar component (left/right drawer)
2. **mobile-filter-sidebar.liquid** - Separate mobile filter sidebar (slide-out from right)
3. **glass-filter-bar.liquid** - Top filter controls bar with sort/view options
4. **facets.js** - Shopify's native faceting JavaScript (Web Components)
5. **main-collection.liquid** - Collection template with product grid
6. **blocks/filters.liquid** - Native Shopify filter blocks
7. **theme.liquid** - Contains script references:
   - `glass-filter-integration.js` (needs creation)
   - `unified-mobile-filter-fix.js` (exists)
   - `filter-enhancements.js` (exists)

#### Current Issues
- Two separate filter components (desktop & mobile) not sharing state
- Filter sidebar exists but doesn't trigger product filtering
- Missing connection between facets.js and both filter sidebars
- Form submissions not updating product grid via AJAX
- Mobile filters using page reload instead of dynamic updates
- URL parameters not being synchronized between mobile/desktop

### Integration Requirements

#### Core Functionality
1. **Filter Application**: When filters are selected, products must update
2. **URL Synchronization**: Filter state must persist in URL parameters
3. **Section Rendering**: Use Shopify's section rendering API for smooth updates
4. **Mobile/Desktop Parity**: Same filtering behavior across devices
5. **View Transitions**: Smooth animations during filter updates

#### Technical Requirements
- Integrate with Shopify's facets.js Web Components
- Support collection.filters API
- Handle price range, list, and boolean filter types
- Maintain glass morphism aesthetic
- Preserve sort and view mode selections

---

## Step-by-Step Implementation Plan

### Phase 1: Foundation Setup (Prerequisites)

#### Step 1.1: Verify Collection Template Structure
- [ ] Ensure main-collection.liquid has proper section structure
- [ ] Confirm collection template includes results-list component
- [ ] Verify product grid has proper data attributes for updates

#### Step 1.2: Load Required Scripts
- [ ] Ensure facets.js is loaded on collection pages
- [ ] Add section-renderer.js for dynamic updates
- [ ] Include necessary Web Component polyfills

### Phase 2: Update Glass Filter Sidebar

#### Step 2.1: Add Proper Form Structure
```liquid
<facets-form-component section-id="{{ section.id }}">
  <form id="FacetFiltersForm-{{ section.id }}" 
        ref="facetsForm"
        action="{{ collection.url }}">
    <!-- filters here -->
  </form>
</facets-form-component>
```

#### Step 2.2: Connect to Native Filters
- [ ] Replace hardcoded filters with `collection.filters` loop
- [ ] Use proper input names (filter.v.option.*, filter.p.*, etc.)
- [ ] Add data attributes for facets.js integration

#### Step 2.3: Implement Filter Change Handlers
```javascript
// Add to each input
onchange="this.closest('facets-form-component').updateFilters()"
```

### Phase 3: Connect Facets.js Integration

#### Step 3.1: Register Custom Elements
- [ ] Ensure FacetsFormComponent is properly initialized
- [ ] Register FacetInputsComponent for checkbox groups
- [ ] Register PriceFacetComponent for price ranges

#### Step 3.2: Implement updateFilters Method
```javascript
class GlassFilterSidebar extends FacetsFormComponent {
  updateFilters() {
    // Create URL parameters from form
    const formData = new FormData(this.refs.facetsForm);
    const searchParams = this.createURLParameters(formData);
    
    // Update URL
    const url = new URL(window.location);
    url.search = searchParams.toString();
    history.pushState({}, '', url);
    
    // Trigger section update
    this.renderSection();
  }
  
  renderSection() {
    const sectionId = this.getAttribute('section-id');
    fetch(`${window.location.pathname}?section_id=${sectionId}&${url.search}`)
      .then(response => response.text())
      .then(html => {
        // Update product grid
        this.updateProductGrid(html);
      });
  }
}
```

### Phase 4: Section Rendering Integration

#### Step 4.1: Configure Section Response
- [ ] Add section_id parameter handling in main-collection.liquid
- [ ] Ensure proper JSON response for AJAX requests
- [ ] Handle loading states during updates

#### Step 4.2: Update Product Grid
```javascript
updateProductGrid(html) {
  const parser = new DOMParser();
  const newDocument = parser.parseFromString(html, 'text/html');
  
  // Find and update product grid
  const productGrid = document.querySelector('#ResultsList');
  const newProductGrid = newDocument.querySelector('#ResultsList');
  
  if (productGrid && newProductGrid) {
    productGrid.innerHTML = newProductGrid.innerHTML;
  }
  
  // Update filter counts
  this.updateFilterCounts(newDocument);
}
```

### Phase 5: Mobile Filter Sidebar Integration (Separate Component)

#### Step 5.1: Update Mobile Filter Sidebar Structure
The mobile-filter-sidebar.liquid is a SEPARATE component from glass-filter-sidebar.liquid:
- [ ] Wrap mobile filter form in facets-form-component
- [ ] Convert inline styles to external CSS
- [ ] Replace hardcoded collections with collection.filters
- [ ] Add proper form action and section-id attributes

```liquid
<!-- mobile-filter-sidebar.liquid updates -->
<div class="mobile-filter-sidebar" id="mobile-filter-sidebar">
  <facets-form-component section-id="{{ section.id }}">
    <form id="MobileFiltersForm-{{ section.id }}" 
          ref="facetsForm"
          action="{{ collection.url }}">
      
      {% for filter in collection.filters %}
        <!-- Use native filter structure -->
      {% endfor %}
    </form>
  </facets-form-component>
</div>
```

#### Step 5.2: Synchronize Mobile and Desktop Filter State
Since they are separate components, we need a unified state manager:

```javascript
// glass-filter-integration.js
class UnifiedFilterManager {
  constructor() {
    this.desktopSidebar = document.querySelector('.glass-filter-sidebar');
    this.mobileSidebar = document.querySelector('.mobile-filter-sidebar');
    this.filterBar = document.querySelector('.glass-filter-bar');
    
    this.initializeUnifiedState();
  }
  
  initializeUnifiedState() {
    // Listen for changes on both sidebars
    [this.desktopSidebar, this.mobileSidebar].forEach(sidebar => {
      if (sidebar) {
        sidebar.addEventListener('change', (e) => {
          this.syncFilters(e.target, sidebar);
        });
      }
    });
  }
  
  syncFilters(changedInput, sourceElement) {
    const name = changedInput.name;
    const value = changedInput.value;
    const checked = changedInput.checked;
    
    // Sync to other sidebar
    const targetSidebar = sourceElement === this.desktopSidebar 
      ? this.mobileSidebar 
      : this.desktopSidebar;
    
    if (targetSidebar) {
      const targetInput = targetSidebar.querySelector(
        `input[name="${name}"][value="${value}"]`
      );
      if (targetInput) {
        targetInput.checked = checked;
      }
    }
  }
}
```

#### Step 5.3: Update Mobile Filter Functions
The mobile sidebar has its own functions that need integration:
- [ ] Update `applyMobileFilters()` to use facets.js instead of page reload
- [ ] Convert `handleMobileFilterChange()` to trigger facets updates
- [ ] Ensure `toggleMobileFilters()` works with glass-filter-bar button

### Phase 6: URL Parameter Management

#### Step 6.1: Parse Existing Parameters
```javascript
function parseURLFilters() {
  const params = new URLSearchParams(window.location.search);
  const filters = {};
  
  for (const [key, value] of params) {
    if (key.startsWith('filter.')) {
      filters[key] = value;
    }
  }
  
  return filters;
}
```

#### Step 6.2: Apply Parameters to Form
```javascript
function applyFiltersFromURL() {
  const filters = parseURLFilters();
  
  Object.entries(filters).forEach(([name, value]) => {
    const input = document.querySelector(`[name="${name}"][value="${value}"]`);
    if (input) {
      input.checked = true;
    }
  });
}
```

### Phase 7: Performance Optimization

#### Step 7.1: Debounce Filter Updates
```javascript
const debouncedUpdate = debounce(() => {
  this.updateFilters();
}, 300);
```

#### Step 7.2: Add Loading States
```css
.glass-filter-sidebar.loading {
  opacity: 0.6;
  pointer-events: none;
}
```

### Phase 8: Testing & Validation

#### Step 8.1: Functional Testing
- [ ] Test all filter types (price, list, boolean)
- [ ] Verify URL parameter persistence
- [ ] Check mobile/desktop synchronization
- [ ] Test clear all functionality

#### Step 8.2: Performance Testing
- [ ] Measure filter update response time
- [ ] Check for memory leaks
- [ ] Validate smooth animations

#### Step 8.3: Cross-browser Testing
- [ ] Safari (desktop/mobile)
- [ ] Chrome
- [ ] Firefox
- [ ] Edge

---

## Implementation Files to Modify

### Priority 1 (Core Integration)
1. **`/sections/glass-filter-sidebar.liquid`** - Desktop filter sidebar
   - Add facets-form-component wrapper
   - Replace hardcoded filters with collection.filters
   - Add proper input names and data attributes

2. **`/sections/mobile-filter-sidebar.liquid`** - Mobile filter sidebar  
   - Convert to use facets-form-component
   - Replace inline JavaScript with module approach
   - Use collection.filters instead of collections.all

3. **`/assets/glass-filter-integration.js`** - NEW FILE (referenced in theme.liquid)
   - Unified filter state manager
   - AJAX product grid updates
   - Synchronization between mobile/desktop

4. **`/sections/main-collection.liquid`**
   - Ensure proper section ID and data attributes
   - Add results-list wrapper if missing

### Priority 2 (Enhancement & Fix)
1. **`/assets/unified-mobile-filter-fix.js`** - EXISTS (update)
   - Fix mobile filter toggle functionality
   - Ensure proper drawer animations

2. **`/assets/filter-enhancements.js`** - EXISTS (update)
   - Add loading states
   - Improve transitions

3. **`/sections/glass-filter-bar.liquid`**
   - Connect toggleMobileFilters() to correct sidebar
   - Update product count dynamically

4. **`/assets/glass-filter-sidebar.css`** - EXISTS
   - Add loading states
   - Ensure proper z-index hierarchy

### Priority 3 (Optimization)
1. **`/layout/theme.liquid`**
   - Verify script loading order
   - Add section rendering support

2. **`/assets/mobile-filter-sidebar.css`** - NEW FILE
   - Extract inline styles from mobile-filter-sidebar.liquid
   - Add responsive breakpoints

3. **`/snippets/filter-active-tags.liquid`** - NEW SNIPPET
   - Shared active filter display component

---

## Code Examples

### Example 1: Minimal Working Integration
```liquid
<!-- glass-filter-sidebar.liquid -->
<facets-form-component section-id="{{ section.id }}">
  <form ref="facetsForm" action="{{ collection.url }}">
    {% for filter in collection.filters %}
      {% case filter.type %}
        {% when 'list' %}
          {% for value in filter.values %}
            <input type="checkbox" 
                   name="{{ value.param_name }}"
                   value="{{ value.value }}"
                   {% if value.active %}checked{% endif %}
                   onchange="this.form.dispatchEvent(new Event('submit'))">
          {% endfor %}
      {% endcase %}
    {% endfor %}
  </form>
</facets-form-component>

<script>
  customElements.whenDefined('facets-form-component').then(() => {
    const form = document.querySelector('facets-form-component');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.updateFilters();
    });
  });
</script>
```

### Example 2: Complete Integration Script
```javascript
// glass-filter-integration.js
class GlassFilterIntegration {
  constructor() {
    this.sidebar = document.querySelector('.glass-filter-sidebar');
    this.form = this.sidebar?.querySelector('form');
    this.initializeFilters();
  }

  initializeFilters() {
    if (!this.form) return;

    // Apply URL filters on load
    this.applyURLFilters();

    // Listen for changes
    this.form.addEventListener('change', this.handleFilterChange.bind(this));

    // Listen for clear all
    document.addEventListener('click', (e) => {
      if (e.target.matches('.clear-all-filters')) {
        this.clearAllFilters();
      }
    });
  }

  handleFilterChange(event) {
    // Debounced update
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
      this.updateFilters();
    }, 300);
  }

  updateFilters() {
    const formData = new FormData(this.form);
    const searchParams = new URLSearchParams(formData);
    
    // Update URL
    const url = new URL(window.location);
    url.search = searchParams.toString();
    history.pushState({}, '', url);

    // Update products
    this.fetchFilteredProducts(url.search);
  }

  async fetchFilteredProducts(queryString) {
    this.showLoading();

    try {
      const response = await fetch(`${window.location.pathname}${queryString}&section_id=main-collection`);
      const html = await response.text();
      this.updateProductGrid(html);
    } catch (error) {
      console.error('Filter update failed:', error);
    } finally {
      this.hideLoading();
    }
  }

  updateProductGrid(html) {
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(html, 'text/html');
    
    // Update products
    const currentGrid = document.querySelector('#ResultsList');
    const newGrid = newDoc.querySelector('#ResultsList');
    
    if (currentGrid && newGrid) {
      currentGrid.innerHTML = newGrid.innerHTML;
    }

    // Update counts
    this.updateProductCount(newDoc);
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('filters:updated'));
  }

  clearAllFilters() {
    this.form.reset();
    this.updateFilters();
  }

  showLoading() {
    this.sidebar?.classList.add('loading');
  }

  hideLoading() {
    this.sidebar?.classList.remove('loading');
  }

  applyURLFilters() {
    const params = new URLSearchParams(window.location.search);
    
    params.forEach((value, key) => {
      if (key.startsWith('filter.')) {
        const input = this.form.querySelector(`[name="${key}"][value="${value}"]`);
        if (input) {
          input.checked = true;
        }
      }
    });
  }

  updateProductCount(doc) {
    const newCount = doc.querySelector('.results-count')?.textContent;
    const currentCount = document.querySelector('.results-count');
    
    if (newCount && currentCount) {
      currentCount.textContent = newCount;
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new GlassFilterIntegration();
});
```

---

## Success Criteria

### Functional Requirements Met
- [ ] Filters update products without page reload
- [ ] URL parameters reflect current filter state
- [ ] Back/forward browser navigation works correctly
- [ ] Mobile and desktop filters are synchronized
- [ ] Clear all filters works properly

### Performance Metrics
- [ ] Filter updates complete in < 500ms
- [ ] Smooth animations during transitions
- [ ] No JavaScript errors in console
- [ ] Memory usage remains stable

### User Experience
- [ ] Loading states are clear
- [ ] Filter counts update correctly
- [ ] Active filters are visually indicated
- [ ] Mobile experience is touch-optimized
- [ ] Accessibility requirements met (ARIA labels, keyboard navigation)

---

## Timeline Estimate

- **Phase 1-2**: 2 hours (Foundation and sidebar updates)
- **Phase 3-4**: 3 hours (Facets integration and section rendering)
- **Phase 5-6**: 2 hours (Mobile and URL management)
- **Phase 7-8**: 2 hours (Optimization and testing)

**Total Estimated Time**: 9 hours

---

## Notes

- The existing facets.js provides most functionality needed
- Focus should be on connecting glass-filter-sidebar to existing facets system
- Avoid reimplementing filtering logic - use Shopify's native capabilities
- Test with real product data to ensure proper filtering
- Consider progressive enhancement for better performance

---

*Last Updated: {{ "now" | date: "%Y-%m-%d" }}*