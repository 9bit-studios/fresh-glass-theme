# Johnson Health Tech Development Guide
## Shopify Theme Development & Refinement

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Customization Guide](#customization-guide)
5. [Component Development](#component-development)
6. [Shopify Integration](#shopify-integration)
7. [Testing & QA](#testing--qa)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

```bash
# Required
- Shopify CLI (3.x or higher)
- Node.js 18+
- Git
- Code editor (VS Code recommended)

# Optional but recommended
- Shopify Theme Check extension
- Liquid syntax highlighting
```

### Installation

```bash
# 1. Navigate to theme directory
cd /Users/pennyplatt/Documents//Oksana/quantum-spatial/fresh-glass-theme/johnson-health-theme/

# 2. Install Shopify CLI (if not installed)
npm install -g @shopify/cli @shopify/theme

# 3. Login to Shopify
shopify login --store=your-store-name.myshopify.com

# 4. Start development server
shopify theme dev
```

### Quick Start

```bash
# Push theme to Shopify
shopify theme push

# Pull latest changes from Shopify
shopify theme pull

# Preview theme locally
shopify theme dev --store=your-store-name.myshopify.com
```

---

## Project Structure

```
johnson-health-theme/
│
├── assets/                          # Static assets
│   ├── johnson-health-theme.css    # ⭐ Main theme styles
│   ├── design-tokens.css           # Foundation design system
│   ├── base.css                    # Shopify base styles
│   └── [images, fonts, scripts]
│
├── config/                          # Theme configuration
│   ├── settings_data.json          # ⭐ Current theme settings
│   └── settings_schema.json        # Settings UI definition
│
├── layout/                          # Theme layouts
│   ├── theme.liquid                # ⭐ Main layout template
│   ├── password.liquid             # Password page
│   └── gift_card.liquid            # Gift card layout
│
├── sections/                        # Reusable sections
│   ├── header.liquid
│   ├── footer.liquid
│   ├── product-template.liquid
│   └── [other sections]
│
├── snippets/                        # Reusable components
│   ├── color-schemes.liquid        # ⭐ Color CSS generator
│   ├── theme-styles-variables.liquid  # ⭐ Typography variables
│   ├── product-card.liquid
│   └── [other snippets]
│
├── templates/                       # Page templates
│   ├── index.liquid                # Homepage
│   ├── product.liquid              # Product page
│   ├── collection.liquid           # Collection page
│   ├── cart.liquid                 # Cart page
│   └── [other templates]
│
├── locales/                         # Translations
│   └── en.default.json
│
├── product_template.csv             # ⭐ Product import data
├── STYLE-GUIDE.md                   # ⭐ Design system documentation
└── DEVELOPMENT-GUIDE.md             # ⭐ This file
```

### Key Files (⭐)

**Files you'll modify most often:**

1. **`assets/johnson-health-theme.css`**
   - All JHT brand styling
   - Component styles
   - Glass effects and colors

2. **`config/settings_data.json`**
   - Theme configuration
   - Color scheme values
   - Typography settings

3. **`snippets/color-schemes.liquid`**
   - Generates CSS variables from settings
   - Maps Shopify theme settings to CSS

4. **`layout/theme.liquid`**
   - Main HTML structure
   - Loads stylesheets
   - Global meta tags

---

## Development Workflow

### 1. Local Development

```bash
# Start local development server
shopify theme dev

# Access local preview
# Opens browser to: http://127.0.0.1:9292
```

**Hot Reload:** Changes to `.liquid`, `.css`, `.js` files auto-reload in browser.

### 2. Making Style Changes

#### Workflow for CSS Updates:

```bash
# 1. Edit assets/johnson-health-theme.css
code assets/johnson-health-theme.css

# 2. Save file (auto-reloads in browser)
# 3. Test in browser
# 4. Push to Shopify when ready
shopify theme push --only assets/johnson-health-theme.css
```

#### Workflow for Settings Changes:

```bash
# 1. Edit config/settings_data.json
code config/settings_data.json

# 2. Save and push
shopify theme push --only config/settings_data.json

# 3. Refresh Shopify admin to see changes
```

### 3. Version Control

```bash
# Create feature branch
git checkout -b feature/button-refinements

# Commit changes
git add assets/johnson-health-theme.css
git commit -m "Refine glass button hover states"

# Push to remote
git push origin feature/button-refinements
```

### 4. Shopify Theme Editor Integration

After pushing changes:

1. Go to: `Shopify Admin → Online Store → Themes`
2. Click "Customize" on your theme
3. Test changes in theme editor
4. Publish when ready

---

## Customization Guide

### Adding New Colors

**1. Update CSS Variables** (`assets/johnson-health-theme.css`)

```css
:root {
  /* Add new color */
  --jht-accent-blue: #007AFF;
  --jht-accent-blue-hover: #0063CC;
}
```

**2. Update Settings Schema** (`config/settings_schema.json`)

```json
{
  "name": "JHT Accent Color",
  "type": "color",
  "id": "accent_color",
  "default": "#007AFF",
  "label": "Accent Color"
}
```

**3. Update Settings Data** (`config/settings_data.json`)

```json
{
  "current": {
    "accent_color": "#007AFF"
  }
}
```

### Creating New Button Variants

**Example: Add a "Tertiary" Button**

```css
/* In assets/johnson-health-theme.css */

.button--tertiary {
  background: transparent !important;
  border: 1px solid var(--border-default) !important;
  color: var(--text-tertiary) !important;
  font-weight: 457;
  padding: 6px 16px;
  border-radius: 8px;
  transition: all var(--transition-smooth);
}

.button--tertiary:hover {
  background: var(--glass-4) !important;
  border-color: var(--border-prominent) !important;
  color: var(--text-primary) !important;
}
```

### Modifying Glass Effects

**Adjust Blur Intensity:**

```css
/* Light blur for subtle effects */
--blur-light: blur(10px);

/* Heavy blur for navigation/header */
--blur-heavy: blur(50px);

/* Custom blur for specific component */
.custom-component {
  backdrop-filter: blur(15px) saturate(140%);
}
```

**Adjust Glass Opacity:**

```css
/* Make glass buttons more opaque */
.button {
  background: var(--glass-10) !important; /* was --glass-8 */
}

/* Make cards more transparent */
.card {
  background: var(--glass-2) !important; /* was --glass-4 */
}
```

### Changing Spacing

**Update Spacing Variables:**

```css
:root {
  /* Increase spacing globally */
  --space-xl: 32px;   /* was 24px */
  --space-2xl: 48px;  /* was 32px */
  --space-3xl: 64px;  /* was 48px */
}
```

**Apply to Specific Components:**

```css
/* More padding on product pages */
.product {
  padding: var(--space-4xl) var(--space-2xl); /* Add --space-4xl: 96px */
}

/* Tighter spacing on cards */
.card {
  padding: var(--space-md); /* Use smaller spacing */
}
```

---

## Component Development

### Creating a New Component

**1. Create Snippet** (`snippets/component-name.liquid`)

```liquid
{% comment %}
  Component: Product Feature Card
  Usage: {% render 'product-feature-card', title: 'Title', description: 'Desc' %}
{% endcomment %}

<div class="feature-card">
  <h3 class="feature-card__title">{{ title }}</h3>
  <p class="feature-card__description">{{ description }}</p>
  <a href="{{ link }}" class="button button--secondary">
    Learn More
  </a>
</div>
```

**2. Add Component Styles** (`assets/johnson-health-theme.css`)

```css
/* === FEATURE CARD === */
.feature-card {
  background: var(--glass-4);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-xl);
  backdrop-filter: var(--blur-light);
  transition: all var(--transition-smooth);
}

.feature-card:hover {
  background: var(--glass-7);
  border-color: var(--border-default);
  transform: translateY(-2px);
}

.feature-card__title {
  color: var(--text-primary);
  font-weight: 556;
  margin-bottom: var(--space-md);
}

.feature-card__description {
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}
```

**3. Use in Template**

```liquid
{% render 'product-feature-card',
  title: 'Commercial Grade',
  description: 'Built for professional use',
  link: '/collections/commercial'
%}
```

### Button Component Patterns

**Primary CTA (Red):**
```liquid
<button name="add" class="product-form__submit">
  Add to Cart
</button>
```

**Secondary Glass Button:**
```liquid
<button class="button button--secondary">
  Learn More
</button>
```

**Ghost Button:**
```liquid
<a href="#" class="button button--ghost">
  View Details
</a>
```

**Selected State:**
```liquid
<button class="button button--selected">
  Active
</button>
```

### Card Component Pattern

```liquid
<div class="card product-card">
  <div class="card__media">
    {{ product.featured_image | image_url: width: 800 | image_tag }}
  </div>
  <div class="card__content">
    <h3 class="card__title">{{ product.title }}</h3>
    <p class="card__price">{{ product.price | money }}</p>
    <a href="{{ product.url }}" class="button button--secondary">
      View Product
    </a>
  </div>
</div>
```

---

## Shopify Integration

### Working with Liquid Variables

**Product Data:**
```liquid
{{ product.title }}
{{ product.price | money }}
{{ product.description }}
{{ product.featured_image | image_url: width: 800 }}
{{ product.available }}
```

**Collection Data:**
```liquid
{% for product in collection.products %}
  {{ product.title }}
{% endfor %}
```

**Cart Data:**
```liquid
{{ cart.item_count }}
{{ cart.total_price | money }}
{% for item in cart.items %}
  {{ item.title }}
{% endfor %}
```

### Using Theme Settings in Liquid

**Access Settings:**
```liquid
{{ settings.accent_color }}
{{ settings.type_body_font.family }}
```

**Apply to Inline Styles:**
```liquid
<style>
  :root {
    --custom-accent: {{ settings.accent_color }};
  }
</style>
```

### Shopify Section Settings

```json
{
  "name": "Hero Banner",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Johnson Health Tech"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Background Color",
      "default": "#0B010D"
    }
  ],
  "presets": [
    {
      "name": "Hero Banner"
    }
  ]
}
```

### Product Metafields

**Access Custom Fields:**
```liquid
{{ product.metafields.custom.warranty_years }}
{{ product.metafields.specs.motor_power }}
```

---

## Testing & QA

### Browser Testing Checklist

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (14+)
- [ ] **Edge** (latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

### Visual QA Checklist

**Colors:**
- [ ] Primary buttons are red (#CC0000)
- [ ] Secondary buttons are glass (not red)
- [ ] Cart bubble is system blue (#007AFF)
- [ ] Background is rich black (#080808)
- [ ] Text uses translucent white (90%, 76%, 60%)

**Glass Effects:**
- [ ] Backdrop-filter applied to glass elements
- [ ] Blur is subtle (10-20px)
- [ ] Glass opacity is correct (4-10%)
- [ ] Borders are visible but subtle

**Interactions:**
- [ ] Hover effects are smooth (0.25s)
- [ ] No "blinky" or instant transitions
- [ ] Transform effects are subtle (1-2px)
- [ ] Active states scale down (0.98)
- [ ] Focus visible states show blue outline

**Spacing:**
- [ ] 8pt grid maintained
- [ ] Button heights minimum 48px
- [ ] Adequate padding on all components
- [ ] Consistent gaps between elements

**Typography:**
- [ ] Font weights correct (457, 556, 600)
- [ ] Letter spacing applied (-0.014em, -0.025em)
- [ ] Line heights readable
- [ ] Text hierarchy clear

### Accessibility Testing

```bash
# Install axe DevTools
# Chrome Extension: axe DevTools - Web Accessibility Testing

# Test checklist:
- [ ] All buttons have accessible labels
- [ ] Focus states visible (blue outline)
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Touch targets minimum 44x44px
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
```

### Performance Testing

```bash
# Lighthouse audit
# Chrome DevTools → Lighthouse → Generate Report

# Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+
```

**Performance Checklist:**
- [ ] Images optimized (WebP format)
- [ ] CSS minified for production
- [ ] JavaScript deferred/async
- [ ] Fonts subset and preloaded
- [ ] Lazy loading for images
- [ ] Minimal use of backdrop-filter

### Shopify Theme Check

```bash
# Install Shopify Theme Check
npm install -g @shopify/theme-check

# Run checks
theme-check .

# Fix issues
theme-check . --auto-correct
```

---

## Deployment

### Development → Staging

```bash
# 1. Test locally
shopify theme dev

# 2. Push to development theme
shopify theme push --development

# 3. Preview in Shopify admin
# Admin → Themes → Development theme → Preview
```

### Staging → Production

```bash
# 1. Create theme backup
shopify theme pull --live

# 2. Push to production
shopify theme push --live

# 3. Verify deployment
# Visit: your-store.myshopify.com

# 4. Publish theme
# Admin → Themes → Publish
```

### Rollback Procedure

```bash
# 1. Pull previous version from git
git checkout main
git pull origin main

# 2. Push previous version
shopify theme push --live

# Or restore from Shopify backup:
# Admin → Themes → Theme Library → Restore
```

### CI/CD with GitHub Actions

**.github/workflows/deploy.yml**

```yaml
name: Deploy to Shopify

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Shopify CLI
        run: npm install -g @shopify/cli @shopify/theme

      - name: Deploy theme
        env:
          SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}
          SHOPIFY_FLAG_STORE: ${{ secrets.SHOPIFY_STORE }}
        run: shopify theme push --live
```

---

## Troubleshooting

### Common Issues

**Issue: Glass effects not showing**

```bash
# Check browser support for backdrop-filter
# Safari: Enable in Develop → Experimental Features → CSS Backdrop Filters

# Fallback for unsupported browsers:
@supports not (backdrop-filter: blur(10px)) {
  .button {
    background: rgba(255, 255, 255, 0.15) !important;
  }
}
```

**Issue: Buttons still showing as red when they shouldn't**

```css
/* Check CSS specificity - add more specific selector */
.header .button:not(.product-form__submit):not([name="add"]) {
  background: var(--glass-8) !important;
  border: 1px solid var(--border-default) !important;
  color: var(--text-primary) !important;
}
```

**Issue: Transitions are "blinky"**

```css
/* Ensure transition timing is set correctly */
.button {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); /* NOT transition: all 0s; */
}

/* Remove any ::before or ::after with instant transitions */
.button::before,
.button::after {
  display: none !important; /* Disable gradient overlays */
}
```

**Issue: Text not translucent**

```css
/* Make sure you're using rgba, not hex */
color: rgba(255, 255, 255, 0.90); /* CORRECT */
color: #FFFFFF; /* WRONG - not translucent */
```

**Issue: Cart bubble not blue**

```css
/* Ensure !important is used to override Shopify defaults */
.cart-bubble {
  background: var(--system-blue) !important;
  color: #FFFFFF !important;
}
```

### Debugging Tools

**Chrome DevTools:**
```bash
# Inspect element
Right-click → Inspect

# Check computed styles
Elements → Computed

# Test backdrop-filter support
Console: CSS.supports('backdrop-filter', 'blur(10px)')
```

**Shopify Theme Inspector:**
```liquid
{% comment %}
  Add to theme.liquid for debugging
{% endcomment %}

{{ 'Debug: Theme version 1.0.0' | log }}
{{ product | json }}
{{ cart | json }}
```

**Liquid Console Logging:**
```liquid
{% assign debug_mode = true %}

{% if debug_mode %}
  <script>
    console.log('Product:', {{ product | json }});
    console.log('Cart:', {{ cart | json }});
  </script>
{% endif %}
```

### Performance Issues

**Issue: Slow page load**

```bash
# Minify CSS
npx clean-css-cli -o assets/johnson-health-theme.min.css assets/johnson-health-theme.css

# Update theme.liquid to use minified version
{{ 'johnson-health-theme.min.css' | asset_url | stylesheet_tag }}
```

**Issue: Backdrop-filter causing lag**

```css
/* Reduce blur radius */
--blur-light: blur(6px); /* was blur(10px) */

/* Or disable on mobile */
@media (max-width: 768px) {
  .button {
    backdrop-filter: none;
    background: rgba(255, 255, 255, 0.12) !important; /* Solid fallback */
  }
}
```

---

## Advanced Customization

### Adding Carbon Particle Effects

```css
/* Subtle particle animation for hero sections */
@keyframes particles {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100vh) translateX(50px);
    opacity: 0;
  }
}

.hero::before {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: particles 10s linear infinite;
}
```

### Custom Scrollbar Styling

```css
/* Premium scrollbar (already in theme) */
::-webkit-scrollbar {
  width: 14px;
}

::-webkit-scrollbar-track {
  background: var(--glass-2);
}

::-webkit-scrollbar-thumb {
  background: var(--glass-10);
  border-radius: 7px;
  border: 3px solid var(--black-pure);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--glass-20);
}
```

### Dark Mode Toggle (Optional)

```liquid
<!-- Add to header.liquid -->
<button id="theme-toggle" class="button button--ghost">
  <svg id="theme-icon-dark" style="display: none;"><!-- Moon icon --></svg>
  <svg id="theme-icon-light"><!-- Sun icon --></svg>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  toggle.addEventListener('click', () => {
    const isDark = root.classList.toggle('theme-light');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
</script>
```

---

## Import Product Data

### Using product_template.csv

```bash
# 1. Login to Shopify Admin
# 2. Go to: Products → Import
# 3. Upload: product_template.csv
# 4. Map columns (auto-detected)
# 5. Import products

# CSV includes:
# - Matrix Treadmills
# - Exercise Bikes
# - Ellipticals
# - Rowing Machines
# - Strength Equipment
# - Accessories
```

### Bulk Edit Products

```bash
# Export products
# Admin → Products → Export

# Edit CSV with additional data
# - Update descriptions
# - Add metafields
# - Change pricing

# Re-import
# Admin → Products → Import → Overwrite existing products
```

---

## Resources

### Official Documentation

- [Shopify Theme Development](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)
- [Theme Check](https://shopify.dev/themes/tools/theme-check)

### Design Resources

- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Fonts](https://developer.apple.com/fonts/)
- [Inter Font](https://rsms.me/inter/)

### Community

- [Shopify Community](https://community.shopify.com/)
- [Shopify Partners](https://www.shopify.com/partners)

---

## Support

For questions or issues:

1. Check this guide and STYLE-GUIDE.md
2. Search Shopify documentation
3. Ask in #johnson-health-tech Slack channel
4. Contact theme developer

---

*Last Updated: December 2025*
*Theme Version: 1.0.0*
*Developed by: 9Bit Studios*
