# Johnson Health Tech Style Guide
## Premium Enterprise Dark Mode Theme

---

## Design Philosophy

The Johnson Health Tech Shopify theme embodies **Apple Enterprise aesthetics** with **subtle liquid glass effects** and a **premium fitness brand identity**. This is NOT a gaming theme, NOT a purple void theme—this is a professional, sophisticated dark mode experience for enterprise fitness equipment.

### Core Principles

1. **Rich Black, Not Pure Black**: Use layered blacks (#080808, #0B010D, #160918) for depth
2. **Glass Effects, Not Gradients**: Subtle blur with translucent overlays, NO gradient hover effects
3. **Red is Precious**: Only use Johnson Health Tech red (#CC0000) for primary CTAs
4. **System Blue for UI**: Use #007AFF exclusively for cart bubbles and system indicators
5. **Smooth, Never Blinky**: 0.25s cubic-bezier transitions, NO jarring effects

---

## Color Palette

### Brand Colors (Use Sparingly)

```css
--jht-red: #CC0000;           /* Primary CTA buttons ONLY */
--jht-red-hover: #761616;     /* Red button hover state */
```

**When to Use Red:**
- ✅ Add to Cart button
- ✅ Buy Now button
- ✅ Checkout button
- ❌ NOT for links
- ❌ NOT for hover text
- ❌ NOT for secondary buttons
- ❌ NOT for navigation

### Rich Black Backgrounds

```css
--black-pure: #080808;        /* Body background, deepest black */
--black-rich: #0B010D;        /* Gradient mid-point, adds depth */
--black-container: #160918;   /* Selected states, modal backgrounds */
```

**Usage:**
- Body: `#080808`
- Sections: Gradient from `#080808` → `#0B010D` → `#080808`
- Containers/Modals: `#160918`
- Selected button states: `#160918`

### Glass Overlay Opacities

```css
--glass-2: rgba(255, 255, 255, 0.02);   /* Ultra-subtle surfaces */
--glass-4: rgba(255, 255, 255, 0.04);   /* Card backgrounds */
--glass-7: rgba(255, 255, 255, 0.07);   /* Input fields */
--glass-8: rgba(255, 255, 255, 0.08);   /* Secondary buttons, header */
--glass-10: rgba(255, 255, 255, 0.10);  /* Hover states */
--glass-11: rgba(255, 255, 255, 0.11);  /* Elevated surfaces */
--glass-20: rgba(255, 255, 255, 0.20);  /* Prominent elements */
```

**Usage:**
- Cards: `--glass-4` → hover `--glass-7`
- Buttons (secondary): `--glass-8` → hover `--glass-10`
- Inputs: `--glass-7` → focus `--glass-10`
- Header: `--glass-8` with heavy blur

### System Colors

```css
--system-blue: #007AFF;       /* Cart bubble, focus states ONLY */
--system-blue-hover: #0063CC; /* Blue hover state */
```

**When to Use System Blue:**
- ✅ Cart notification bubble
- ✅ Cart count badge
- ✅ Input focus border (with glow)
- ✅ Focus visible outlines
- ❌ NOT for buttons
- ❌ NOT for links
- ❌ NOT for general UI

### Text Hierarchy (Translucent)

```css
--text-primary: rgba(255, 255, 255, 0.90);    /* Headings, primary content */
--text-secondary: rgba(255, 255, 255, 0.76);  /* Body text, descriptions */
--text-tertiary: rgba(255, 255, 255, 0.60);   /* Captions, metadata */
--text-muted: rgba(255, 255, 255, 0.50);      /* Disabled, placeholder */
--text-subtle: rgba(255, 255, 255, 0.20);     /* Very subtle hints */
```

### Border Opacities

```css
--border-subtle: rgba(255, 255, 255, 0.08);     /* Card borders */
--border-default: rgba(255, 255, 255, 0.10);    /* Button borders */
--border-prominent: rgba(255, 255, 255, 0.20);  /* Hover states */
--border-ghost: rgba(255, 255, 255, 0.40);      /* Ghost button normal */
--border-solid: rgba(255, 255, 255, 0.90);      /* Ghost button border */
```

---

## Typography

### Font Stack

```css
font-family: 'SF Compact', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
```

### Font Weights

- **Body**: 457 (SF Compact medium-ish)
- **Headings**: 556 (SF Compact semibold)
- **Buttons**: 457
- **Bold elements**: 600

### Letter Spacing

```css
--body-letter-spacing: -0.014em;
--heading-letter-spacing: -0.025em;
```

### Text Sizes

```css
body: 13px / 20px line-height
h1: clamp(28px, 4vw, 42px)
h2-h6: Proportional scaling
buttons: 13px
```

### Text Shadow (Red Buttons Only)

```css
text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
```

---

## Glass Effects

### Backdrop Filters

```css
--blur-light: blur(10px);     /* Buttons, cards */
--blur-medium: blur(20px);    /* Modals, overlays */
--blur-heavy: blur(50px);     /* Header, navigation */
```

### Usage Rules

1. **Always combine blur with translucent background**
   ```css
   background: var(--glass-8);
   backdrop-filter: var(--blur-light);
   ```

2. **Add subtle borders for definition**
   ```css
   border: 1px solid var(--border-default);
   ```

3. **Use inset highlights for depth**
   ```css
   box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.03),
               0px 0px 2px rgba(0, 0, 0, 0.1),
               0px 5px 5px rgba(0, 0, 0, 0.03),
               inset 0px 8px 10px rgba(246, 249, 255, 0.2);
   ```

---

## Button System

### Primary Red Button (CTA Only)

**Classes:** `.product-form__submit`, `button[name="add"]`, `.cart__checkout-button`

```css
background: var(--jht-red);
border: none;
border-radius: 8px;
color: #FFFFFF;
font-weight: 457;
font-size: 13px;
padding: 6px 16px;
min-height: 48px;
box-shadow: var(--shadow-sm);
backdrop-filter: var(--blur-light);
text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
```

**Hover:**
```css
background: var(--jht-red-hover);
transform: translateY(-1px);
```

**Active:**
```css
transform: translateY(0) scale(0.98);
```

### Glass Secondary Button

**Classes:** `.button`, `.button--secondary`, quantity controls, search, etc.

```css
background: var(--glass-8);
border: 1px solid var(--border-default);
border-radius: 8px;
color: var(--text-primary);
font-weight: 457;
font-size: 13px;
padding: 6px 16px;
box-shadow: var(--shadow-sm);
backdrop-filter: var(--blur-light);
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
```

**Hover:**
```css
background: var(--glass-10);
border-color: var(--border-prominent);
color: var(--text-primary); /* Stay white, NOT red */
```

### Ghost Button

**Classes:** `.button--ghost`

```css
background: transparent;
border: 1px solid var(--border-solid);
color: var(--text-primary);
```

**Hover:**
```css
background: var(--glass-8);
border-color: var(--border-subtle);
color: var(--text-muted);
```

### Selected State

```css
background: var(--black-container);
border: none;
color: var(--text-primary);
```

---

## Component Styles

### Cards

```css
.card {
  background: var(--glass-4);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: var(--blur-light);
  box-shadow: var(--shadow-sm);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  background: var(--glass-7);
  border-color: var(--border-default);
  transform: translateY(-2px);
}
```

### Input Fields

```css
input, textarea, select {
  background: var(--glass-7);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 16px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

input:hover {
  background: var(--glass-10);
  border-color: var(--border-prominent);
}

input:focus {
  outline: none;
  background: var(--glass-10);
  border-color: var(--system-blue);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12);
}
```

### Header

```css
.header {
  background: var(--glass-8);
  backdrop-filter: var(--blur-heavy);
  border-bottom: 1px solid var(--border-subtle);
}
```

### Modals & Drawers

```css
.modal, .drawer {
  background: var(--black-container);
  backdrop-filter: var(--blur-heavy);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  box-shadow: var(--shadow-glass);
}
```

### Cart Bubble

```css
.cart-bubble {
  background: var(--system-blue);
  color: #FFFFFF;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
  padding: 2px 6px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.4);
}
```

---

## Spacing System

8-point grid system:

```css
--space-xs: 4px;    /* 0.5 units */
--space-sm: 8px;    /* 1 unit */
--space-md: 12px;   /* 1.5 units */
--space-lg: 16px;   /* 2 units */
--space-xl: 24px;   /* 3 units */
--space-2xl: 32px;  /* 4 units */
--space-3xl: 48px;  /* 6 units */
```

**Usage:**
- Button padding: `6px 16px` (vertical, horizontal)
- Card padding: `24px`
- Section padding: `48px` (desktop), `24px` (mobile)
- Gap between buttons: `12px`
- Margin bottom headings: `24px`

---

## Transitions & Animations

### Timing Functions

```css
--transition-smooth: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
```

**Usage:**
- Buttons: `transition: all var(--transition-smooth);`
- Hover effects: Smooth 0.25s
- Active states: Fast 0.15s
- NO instant (0s) transitions
- NO slow (>0.35s) transitions

### Transforms

```css
/* Hover lift */
transform: translateY(-1px);

/* Active press */
transform: translateY(0) scale(0.98);

/* Card hover */
transform: translateY(-2px);
```

**Rules:**
- ✅ Subtle translateY for lift effect
- ✅ Scale(0.98) for active press
- ❌ NO translateY > 3px (too much)
- ❌ NO rotation effects
- ❌ NO skew effects

---

## Shadows

### Standard Shadows

```css
--shadow-sm: 0px 1px 1px rgba(0, 0, 0, 0.03),
             0px 0px 2px rgba(0, 0, 0, 0.1),
             0px 5px 5px rgba(0, 0, 0, 0.03);
```

### Glass Shadows (with Inset Highlight)

```css
--shadow-glass: 0px 1px 1px rgba(0, 0, 0, 0.03),
                0px 0px 2px rgba(0, 0, 0, 0.1),
                0px 5px 5px rgba(0, 0, 0, 0.03),
                inset 0px 8px 10px rgba(246, 249, 255, 0.2);
```

### Blue Glow (Cart Bubble Only)

```css
box-shadow: 0 2px 6px rgba(0, 122, 255, 0.4);
```

---

## Accessibility

### Focus States

```css
*:focus-visible {
  outline: 2px solid var(--system-blue);
  outline-offset: 3px;
}
```

### Touch Targets

- Minimum button height: `48px` (Apple HIG standard)
- Minimum clickable area: `44px × 44px`

### Color Contrast

- Text on dark background: minimum 90% opacity white
- Secondary text: minimum 76% opacity white
- Ensure WCAG AA compliance for all text

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
  --button-padding-x: 20px;
  --space-2xl: 24px;
}

/* Tablet */
@media (max-width: 768px) {
  --button-height: 44px;
  --space-3xl: 32px;

  .product-form__buttons {
    flex-direction: column;
  }
}

/* Desktop */
@media (min-width: 769px) {
  /* Default desktop styles */
}
```

---

## Do's and Don'ts

### ✅ DO

- Use glass effects with blur and translucent backgrounds
- Keep red limited to primary CTA buttons only
- Use smooth 0.25s transitions for all hover effects
- Layer blacks (#080808, #0B010D, #160918) for depth
- Apply backdrop-filter with appropriate blur
- Use system blue (#007AFF) for cart and focus states
- Maintain 8-point grid spacing
- Keep button heights at 48px minimum
- Use translucent text (90%, 76%, 60%)
- Apply subtle inset highlights to glass elements

### ❌ DON'T

- Use gradient hover effects (NO linear-gradient on hover)
- Make hover text red (keep neutral white)
- Use red for navigation, links, or secondary buttons
- Use purple or purple tints (this is NOT the Petersen Games theme)
- Use pure white (#FFFFFF) for backgrounds
- Create "blinky" or instant (0s) transitions
- Use heavy shadows or glows (except cart bubble)
- Exceed 2px translateY for hover lift
- Use bright or saturated colors
- Add decorative gradients or effects

---

## File Structure

```
/johnson-health-theme/
├── assets/
│   ├── johnson-health-theme.css    # Main theme CSS
│   ├── design-tokens.css           # Foundation tokens
│   └── base.css                    # Shopify base styles
├── config/
│   ├── settings_data.json          # Theme configuration
│   └── settings_schema.json        # Settings structure
├── layout/
│   └── theme.liquid                # Main layout
├── snippets/
│   ├── color-schemes.liquid        # Color scheme generator
│   └── theme-styles-variables.liquid  # Typography variables
└── product_template.csv            # Fitness product data
```

---

## Testing Checklist

- [ ] All primary CTA buttons are red (#CC0000)
- [ ] All secondary buttons are glass (not red)
- [ ] Cart bubble is system blue (#007AFF)
- [ ] Hover effects are smooth (0.25s), not blinky
- [ ] No red hover text on links
- [ ] Backdrop filters applied with blur
- [ ] Rich black backgrounds (#080808)
- [ ] Translucent text hierarchy
- [ ] 48px minimum button height
- [ ] Focus visible states are blue
- [ ] Glass borders at 8-10% opacity
- [ ] Spacing follows 8pt grid
- [ ] Mobile responsive (44px buttons)
- [ ] No gradient overlays on hover

---

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Backdrop Filter**: Requires modern browser with backdrop-filter support
- **Fallbacks**: Solid backgrounds for older browsers without backdrop-filter

---

## Performance

- Minimize use of backdrop-filter (only on visible elements)
- Use `will-change: transform` sparingly
- Optimize blur radius (10px for most, 50px max for headers)
- Keep transitions under 0.3s
- Avoid animating expensive properties (filter, backdrop-filter)

---

## Reference Examples

### Apple Developer Site
https://developer.apple.com/tutorials/app-dev-training/#macos-essentials

### Apple Enterprise Resources
https://www.apple.com/business/enterprise/resources/

### Apple Services (Dark Mode)
https://www.apple.com/services/

### Figma Design System
See `/design-system/` for component styles extracted from Figma

---

*Last Updated: December 2025*
*Theme Version: 1.0.0*
*Design System: Apple HIG Enterprise Dark Mode*
