# Liquid Glass Token Integration Plan

## Current State Analysis

### CSS Loading Order (theme.liquid)
1. `QuantumFoundation.css` - Base design tokens (from assets folder)
2. `priority-foundation.css` - Has BOTH validated glass styles AND incongruent styles
3. `base.css` - Theme default styles

### Available Liquid Glass Resources (/glass-tokens/)
- `QuantumFoundation.css` - Core token definitions
- `glass-foundation.css` - Glass effect foundations
- `global-glass-theme.css` - Global glass theme styles
- `quantumspatial-color-tokens.css` - Color system
- `quantumspatial-tokens.css` - Design tokens
- `facets.css` - Faceted filter styles

## Integration Strategy

### Phase 1: Reorganize CSS Architecture
```liquid
<!-- theme.liquid proposed structure -->
<!-- 1. Core Token System -->
{{ 'quantumspatial-tokens.css' | asset_url | stylesheet_tag }}
{{ 'quantumspatial-color-tokens.css' | asset_url | stylesheet_tag }}

<!-- 2. Glass Foundation Layer -->
{{ 'glass-foundation.css' | asset_url | stylesheet_tag }}

<!-- 3. Component Styles -->
{{ 'QuantumFoundation.css' | asset_url | stylesheet_tag }}
{{ 'global-glass-theme.css' | asset_url | stylesheet_tag }}

<!-- 4. Priority Overrides (cleaned) -->
{{ 'priority-foundation-clean.css' | asset_url | stylesheet_tag }}

<!-- 5. Base Theme (if needed) -->
{{ 'base.css' | asset_url | stylesheet_tag }}
```

### Phase 2: Extract & Preserve Validated Styles

From `priority-foundation.css`, preserve:
- ✅ Product grid glass effects (lines 873-1000)
- ✅ Glass filter bar styles (lines 1280-1400)
- ✅ Apple font overrides (lines 5-60)
- ✅ Mobile typography fixes (lines 1401-1453)
- ✅ Layout dimensions and variables

Remove/Replace:
- ❌ Cart page styles (lines 1742-2197) - Move to separate file
- ❌ Duplicate glass definitions that conflict with glass-foundation.css
- ❌ Hardcoded colors that should use tokens

### Phase 3: Token Mapping

Map existing variables to liquid glass tokens:
```css
/* Current */
--glass-surface: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);

/* Should use tokens from quantumspatial-tokens.css */
--glass-surface: var(--quantum-glass-surface-01);
--glass-border: var(--quantum-glass-border-subtle);
```

### Phase 4: Component Migration

1. **Glass Top Header** - Extract inline styles to use tokens
2. **Glass Filter Bar** - Use facets.css patterns
3. **Product Cards** - Leverage glass-foundation.css effects
4. **Mobile Overlays** - Apply consistent glass treatment

## File Operations Needed

1. Copy liquid glass token files from /glass-tokens/ to /assets/:
   - quantumspatial-tokens.css
   - quantumspatial-color-tokens.css
   - glass-foundation.css
   - global-glass-theme.css

2. Create priority-foundation-clean.css with only validated styles

3. Update theme.liquid with new loading order

4. Test with browser-qa-validation.js

## Validation Checklist

- [ ] All glass effects use consistent tokens
- [ ] No duplicate/conflicting definitions
- [ ] Apple fonts remain forced globally
- [ ] Mobile layouts properly spaced
- [ ] Product grid maintains validated styles
- [ ] Glass effects perform well
- [ ] All components reference token system