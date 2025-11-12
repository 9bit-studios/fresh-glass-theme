// Foundation CSS System Type Definitions
// Apple Intelligence Strategic Director - TypeScript Standards

declare global {
  // CSS Custom Properties (Foundation System)
  interface CSSCustomProperties {
    // Spacing System (8pt grid)
    '--foundation-base': string;
    '--foundation-px': string;
    '--foundation-micro': string;
    '--foundation-tiny': string;
    '--foundation-xs': string;
    '--foundation-sm': string;
    '--foundation-md': string;
    '--foundation-lg': string;
    '--foundation-xl': string;
    '--foundation-xxl': string;
    '--foundation-xxxl': string;
    '--foundation-xxxxl': string;
    '--foundation-xxxxxl': string;

    // Touch Targets (Apple HIG)
    '--foundation-touch-target': string;
    '--foundation-touch-target-large': string;

    // Navigation
    '--foundation-nav-height': string;
    '--foundation-nav-height-mobile': string;
    '--foundation-nav-padding': string;

    // Content Spacing
    '--foundation-content-padding': string;
    '--foundation-section-gap': string;
    '--foundation-card-padding': string;
    '--foundation-card-gap': string;

    // Form Elements
    '--foundation-input-height': string;
    '--foundation-input-padding': string;
    '--foundation-form-gap': string;
    '--foundation-button-padding': string;

    // Layout
    '--foundation-sidebar-width': string;
    '--foundation-sidebar-padding': string;
    '--foundation-content-max-width': string;
    '--foundation-container-padding': string;

    // Colors
    '--foundation-background-primary': string;
    '--foundation-background-secondary': string;
    '--foundation-foreground-primary': string;
    '--foundation-foreground-secondary': string;
    '--foundation-accent-primary': string;

    // Glass Effects
    '--glass-surface': string;
    '--glass-border': string;
    '--glass-hover': string;
    '--glass-active': string;
    '--glass-effect': string;
  }

  // Foundation Integration System
  interface FoundationIntegration {
    properties: CSSCustomProperties;
    touchTargets: TouchTargetConfig;
    spacing: SpacingConfig;
    layout: LayoutConfig;
    glassMorphic: GlassMorphicConfig;
  }

  interface TouchTargetConfig {
    minimum: number; // 44px
    recommended: number; // 48px
    comfortable: number; // 56px
    mobileEnhanced: number; // 56px
  }

  interface SpacingConfig {
    gridBase: number; // 8px
    microAdjustments: number[]; // 1px, 2px, 4px
    standardScale: number[]; // 8, 16, 24, 32, 40, 48, 64, 80, 96
    componentSpecific: {
      navigation: number;
      content: number;
      cards: number;
      forms: number;
      buttons: number;
    };
  }

  interface LayoutConfig {
    breakpoints: {
      xs: number;    // 320px - iPhone SE
      sm: number;    // 375px - iPhone standard
      md: number;    // 428px - iPhone Pro Max
      lg: number;    // 744px - iPad Mini portrait
      xl: number;    // 834px - iPad Air portrait
      xxl: number;   // 1024px - iPad Pro portrait / Desktop small
      xxxl: number;  // 1194px - Desktop medium
      xxxxl: number; // 1440px - Desktop large
      xxxxxl: number; // 1920px - Desktop extra large
    };
    containers: {
      mobile: string;   // 100%
      tablet: string;   // 100%
      desktop: string;  // contained widths
    };
    grid: {
      mobile: number;   // 4 columns
      tablet: number;   // 8 columns
      desktop: number;  // 12 columns
    };
    gutters: Record<string, number>;
    margins: Record<string, number>;
  }

  interface GlassMorphicConfig {
    blur: {
      light: string;   // blur(8px)
      medium: string;  // blur(16px)
      heavy: string;   // blur(24px)
      extreme: string; // blur(32px)
    };
    opacity: {
      subtle: number;    // 0.02
      light: number;     // 0.05
      medium: number;    // 0.1
      strong: number;    // 0.2
    };
    borders: {
      subtle: string;    // rgba(255, 255, 255, 0.1)
      medium: string;    // rgba(255, 255, 255, 0.2)
      strong: string;    // rgba(255, 255, 255, 0.3)
    };
    backgrounds: {
      surface: string;   // rgba(255, 255, 255, 0.05)
      hover: string;     // rgba(255, 255, 255, 0.1)
      active: string;    // rgba(255, 255, 255, 0.15)
    };
  }

  // CSS Integration Methods
  interface CSSPropertyManager {
    setProperty(name: keyof CSSCustomProperties, value: string): void;
    getProperty(name: keyof CSSCustomProperties): string;
    updateSpacing(scale: SpacingConfig): void;
    applyTouchTargets(config: TouchTargetConfig): void;
    enableGlassEffects(config: GlassMorphicConfig): void;
    validateFoundation(): FoundationValidationResult;
  }

  interface FoundationValidationResult {
    isValid: boolean;
    missingProperties: string[];
    invalidValues: string[];
    higCompliance: HIGValidationResult;
    recommendations: string[];
  }

  // Element Enhancement
  interface ElementFoundationEnhancement {
    element: HTMLElement;
    applyTouchTargets(): void;
    applySpacing(spacing: string[]): void;
    applyGlassEffect(config: GlassMorphicConfig): void;
    validateHIG(): TouchTargetValidation;
  }

  // Foundation Utility Functions
  interface FoundationUtils {
    calculateSpacing(multiplier: number): string;
    generateGlassEffect(opacity: number, blur: string): string;
    validateTouchTarget(element: HTMLElement): boolean;
    enforceGrid(value: number): number;
    optimizeForM4(styles: CSSStyleDeclaration): CSSStyleDeclaration;
  }

  // Global Foundation Access
  interface Window {
    FoundationIntegration?: FoundationIntegration;
    CSSPropertyManager?: CSSPropertyManager;
    FoundationUtils?: FoundationUtils;
  }
}

export {};