# Filter System Implementation Guide

## Overview
The Petersen Games filter system uses Shopify's native faceted search (facets) feature combined with custom glass-morphic UI components. The system works across mobile and desktop with synchronized filtering capabilities.

## Architecture

### Core Components

1. **Facets System** (`blocks/filters.liquid`)
   - Shopify's native filtering system
   - Automatically generates filters based on product attributes
   - Handles URL parameter management

2. **JavaScript Controllers** (`assets/facets.js`)
   - `FacetsFormComponent`: Main form handler
   - `FacetInputsComponent`: Individual filter inputs
   - `PriceFacetComponent`: Price range filtering
   - `SortingFilterComponent`: Sort options

3. **UI Components**
   - Desktop: Glass-filter sidebar (vertical or horizontal)
   - Mobile: Filter drawer with glass morphism
   - Mega Dropdown: Quick navigation to collections

## Filter Types & URL Parameters

### Product Filters
```
/collections/all?filter.p.product_type=Board+Games
/collections/all?filter.p.tag=faction-packs
/collections/all?filter.v.availability=1  (in stock)
/collections/all?filter.v.price.gte=10&filter.v.price.lte=100
```

### Sorting
```
/collections/all?sort_by=price-ascending
/collections/all?sort_by=created-descending
/collections/all?sort_by=best-selling
```

## Tag Taxonomy (Based on Strategy Guides)

### Game Line Tags (Flagship)
- `flagship-cthulhu-wars`
- `flagship-planet-apocalypse`
- `flagship-evil-high-priest`
- `flagship-orcs-must-die`
- `flagship-the-gods-war`
- `flagship-hyperspace`

### Product Type Tags
- `expansion`
- `core-game`
- `miniatures`
- `accessories`
- `books`
- `rpg`

### Gameplay Mechanics Tags
- `mechanics-cooperative`
- `mechanics-strategy`
- `mechanics-asymmetric`
- `mechanics-tower-defense`
- `mechanics-dice-bash`

### Theme Tags
- `theme-cthulhu-mythos`
- `theme-fantasy`
- `theme-sci-fi`
- `theme-horror`

### Complexity Tags (Baby Cthulhu Rating)
- `weight-1-light` (1 Baby Cthulhu)
- `weight-2-medium-light` (2 Baby Cthulhus)
- `weight-3-medium-heavy` (3 Baby Cthulhus)
- `weight-4-heavy` (4 Baby Cthulhus)

### Player Count Tags
- `pc-solo-capable`
- `pc-two-player-only`
- `pc-2-players`
- `pc-3-players`
- `pc-4-players`
- `pc-5-plus-players`

## Configuration in Shopify Admin

### 1. Enable Filtering in Theme Customizer
1. Go to Online Store > Themes > Customize
2. Navigate to a Collection page
3. Find the "Filters" block in the template
4. Enable filtering: `ON`
5. Choose filter style: `horizontal` or `vertical`
6. Configure display options

### 2. Product Metafields Setup
Required metafields for advanced filtering:
- `custom.baby_cthulhus` (number): Complexity rating 1-5
- `custom.player_count_min` (number): Minimum players
- `custom.player_count_max` (number): Maximum players
- `custom.play_time` (number): Play time in minutes

### 3. Collection Setup
Create smart collections with rules:
```liquid
Collection: "Cthulhu Wars"
Rules: 
- Product tag contains "flagship-cthulhu-wars"
OR
- Product tag contains "cosmic-horror"
```

## Mega Dropdown Navigation

The mega dropdown in the header provides quick access to:

### Game Lines (Collections)
- `/collections/cthulhu-wars`
- `/collections/planet-apocalypse`
- `/collections/hyperspace`
- `/collections/evil-high-priest`
- `/collections/orcs-must-die`
- `/collections/the-gods-war`

### Product Types (Filtered Views)
- Core Games: `/collections/all?filter.p.product_type=Board+Games`
- Expansions: `/collections/expansions`
- Miniatures: `/collections/all?filter.p.product_type=Miniatures`
- RPG Materials: `/collections/all?filter.p.product_type=Books`

### Special Collections
- New Releases: `/collections/all?sort_by=created-descending`
- Pre-Orders: `/collections/all?filter.v.availability=0`
- Limited Edition: `/collections/all?filter.p.tag=limited-edition`

## Mobile vs Desktop Behavior

### Desktop
- Filters display in sidebar (vertical) or top bar (horizontal)
- Always visible when enabled
- Real-time filtering without page reload
- Glass morphism styling

### Mobile
- Filters hidden in drawer
- Toggle button shows filter count bubble
- Drawer slides from right with glass effect
- Touch-optimized with 44px minimum targets

## JavaScript Events

The system dispatches custom events for filter updates:

```javascript
// Listen for filter updates
document.addEventListener('theme:filter:update', (event) => {
  console.log('Filters updated:', event.detail);
});

// Programmatically update filters
const facetsForm = document.querySelector('facets-form-component');
facetsForm.updateFiltersByURL('/collections/all?filter.p.tag=cthulhu');
```

## Performance Optimization

1. **Prefetching**: Hovering over filter options prefetches results
2. **Debouncing**: Price inputs debounced by 200ms
3. **View Transitions**: Smooth transitions between filter states
4. **Section Rendering**: Only updates product grid, not entire page

## Troubleshooting

### Filters Not Showing
1. Check if filtering is enabled in theme settings
2. Verify products have proper tags and metafields
3. Ensure collection has products to filter

### Mobile Drawer Not Opening
1. Check JavaScript console for errors
2. Verify `facets.js` is loaded
3. Ensure dialog-component is properly initialized

### URL Parameters Not Working
1. Check collection handle is correct
2. Verify filter parameter format
3. Ensure products match filter criteria

## Testing Checklist

- [ ] Desktop filters work in horizontal mode
- [ ] Desktop filters work in vertical mode
- [ ] Mobile drawer opens and closes properly
- [ ] Filter count bubble updates correctly
- [ ] Clear all filters button works
- [ ] Individual filter removal works
- [ ] Price range filtering works
- [ ] Sorting options work
- [ ] Mega dropdown links navigate correctly
- [ ] URL parameters persist on page reload
- [ ] Back/forward browser navigation maintains filters

## Future Enhancements

1. **Save Filter Presets**: Allow users to save filter combinations
2. **Filter Analytics**: Track popular filter combinations
3. **AI Recommendations**: Suggest filters based on browsing history
4. **Visual Filter Preview**: Show product thumbnails in filters
5. **Advanced Search**: Combine text search with filters

---

*Last Updated: Current Date*
*Theme: Petersen Games Glass Theme*
*Platform: Shopify Plus*