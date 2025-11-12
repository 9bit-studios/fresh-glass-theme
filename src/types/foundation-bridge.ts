// Foundation Bridge: TypeScript Types → CSS Runtime
// Implements your existing type definitions

class FoundationBridge {
  private root: HTMLElement;
  
  constructor() {
    this.root = document.documentElement;
    this.initializeFromTypes();
  }

  // Initialize CSS custom properties from TypeScript definitions
  private initializeFromTypes(): void {
    // Spacing system (from your SpacingTokens interface)
    const spacing = {
      base: 8,
      micro: 2,
      tiny: 4,
      xs: 8,
      sm: 16,
      md: 24,
      lg: 32,
      xl: 40,
      xxl: 48,
      touchTarget: 44,
      touchTargetLarge: 56
    };

    // Apply spacing tokens
    Object.entries(spacing).forEach(([key, value]) => {
      this.setProperty(`--foundation-${key}`, `${value}px`);
    });

    // Glass effects (from your GlassMorphicConfig interface)
    const glass = {
      blur: {
        light: 'blur(8px)',
        medium: 'blur(16px)',
        heavy: 'blur(24px)'
      },
      backgrounds: {
        surface: 'rgba(10, 6, 33, 0.4)',
        hover: 'rgba(255, 255, 255, 0.1)',
        active: 'rgba(255, 255, 255, 0.15)'
      },
      borders: {
        subtle: 'rgba(90, 200, 250, 0.3)',
        medium: 'rgba(255, 255, 255, 0.2)'
      }
    };

    // Apply glass tokens
    this.setProperty('--foundation-glass-blur-medium', glass.blur.medium);
    this.setProperty('--foundation-glass-surface', glass.backgrounds.surface);
    this.setProperty('--foundation-glass-hover', glass.backgrounds.hover);
    this.setProperty('--foundation-glass-border', glass.borders.subtle);

    // Colors (from your ColorTokens interface)
    const colors = {
      background: {
        primary: '#000000',
        secondary: '#0D0D15',
        tertiary: '#0A0A0F'
      },
      foreground: {
        primary: '#FFFFFF',
        secondary: 'rgba(252, 253, 242, 0.85)',
        tertiary: 'rgba(252, 253, 242, 0.7)'
      },
      accent: {
        primary: '#007AFF',
        secondary: '#504CF5',
        success: '#3DFF74'
      }
    };

    // Apply color tokens
    this.flattenAndApply(colors, 'foundation');
  }

  // Utility to flatten nested objects and apply as CSS custom properties
  private flattenAndApply(obj: any, prefix: string): void {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        this.flattenAndApply(value, `${prefix}-${key}`);
      } else {
        this.setProperty(`--${prefix}-${key}`, value as string);
      }
    });
  }

  private setProperty(name: string, value: string): void {
    this.root.style.setProperty(name, value);
  }

  private getProperty(name: string): string {
    return getComputedStyle(this.root).getPropertyValue(name);
  }

  // Enforce Apple HIG touch targets (implements your TouchTargetConfig)
  enforceTouchTargets(): void {
    const style = document.createElement('style');
    style.textContent = `
      button, .button, [role="button"], 
      input[type="submit"], input[type="button"] {
        min-height: var(--foundation-touchTarget);
        min-width: var(--foundation-touchTarget);
      }
      
      @media (max-width: 744px) {
        button, .button, [role="button"],
        input[type="submit"], input[type="button"] {
          min-height: var(--foundation-touchTargetLarge);
          min-width: var(--foundation-touchTargetLarge);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Apply glass effects (implements your GlassMorphicConfig)
  applyGlassEffects(): void {
    const style = document.createElement('style');
    style.textContent = `
      .glass-effect {
        background: var(--foundation-glass-surface);
        border: 1px solid var(--foundation-glass-border);
        backdrop-filter: var(--foundation-glass-blur-medium) saturate(150%);
        transition: background 0.2s ease;
      }
      
      .glass-effect:hover {
        background: var(--foundation-glass-hover);
      }
      
      .product-card,
      .card {
        background: var(--foundation-glass-surface);
        backdrop-filter: var(--foundation-glass-blur-medium) saturate(150%);
        border: 1px solid var(--foundation-glass-border);
        border-radius: 16px;
        padding: var(--foundation-lg);
        transition: all 0.2s ease;
      }
      
      .product-card:hover,
      .card:hover {
        background: var(--foundation-glass-hover);
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(style);
  }

  // Map existing Shopify classes to foundation (implements your integration strategy)
  mapShopifyClasses(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* Map Shopify button classes to foundation */
      .btn,
      .button,
      .shopify-payment-button__button {
        background: var(--foundation-accent-primary);
        color: var(--foundation-foreground-primary);
        border: none;
        border-radius: 12px;
        padding: var(--foundation-md) var(--foundation-lg);
        min-height: var(--foundation-touchTarget);
        transition: all 0.2s ease;
      }
      
      .btn:hover,
      .button:hover {
        background: var(--foundation-accent-secondary);
        transform: translateY(-1px);
      }
      
      /* Map Shopify typography to foundation */
      h1, .h1 { 
        font-size: 34px;
        font-weight: 700;
        line-height: 41px;
        letter-spacing: -0.5px;
        color: var(--foundation-foreground-primary);
      }
      
      h2, .h2 {
        font-size: 28px;
        font-weight: 600;
        line-height: 34px;
        letter-spacing: -0.3px;
        color: var(--foundation-foreground-primary);
      }
      
      body, p {
        font-size: 17px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: -0.022em;
        color: var(--foundation-foreground-secondary);
      }
    `;
    document.head.appendChild(style);
  }

  // Validate against your HIGValidationResult interface
  validate(): boolean {
    const validator = window.HIGValidator;
    if (validator) {
      const result = validator.validatePage();
      console.log(`Foundation Compliance: ${result.score}/100`);
      return result.isCompliant;
    }
    return false;
  }

  // Initialize everything
  initialize(): void {
    this.enforceTouchTargets();
    this.applyGlassEffects();
    this.mapShopifyClasses();
    
    console.log('✅ Foundation Bridge initialized with TypeScript types');
    
    // Validate after a brief delay
    setTimeout(() => {
      this.validate();
    }, 500);
  }
}

// Auto-initialize and make globally available
const foundationBridge = new FoundationBridge();
foundationBridge.initialize();

window.FoundationBridge = foundationBridge;

// Export for module systems
export default FoundationBridge;