// Apple Intelligence Integration Type Definitions
// Apple Intelligence Strategic Director - TypeScript Standards

declare global {
  // Apple Intelligence Context
  interface AppleIntelligenceContext {
    project: string;
    environment: 'development' | 'staging' | 'production';
    capabilities: string[];
    version: string;
    neuralEngine: M4NeuralEngineConfig;
  }

  interface M4NeuralEngineConfig {
    cores: number;
    acceleration: boolean;
    optimizations: string[];
    performanceProfile: 'balanced' | 'performance' | 'efficiency';
  }

  // Design Token System
  interface DesignToken {
    name: string;
    value: string | number;
    type: 'color' | 'spacing' | 'typography' | 'animation' | 'effect';
    category: string;
    description?: string;
    applHIG: boolean;
  }

  interface DesignTokenCollection {
    spacing: SpacingTokens;
    colors: ColorTokens;
    typography: TypographyTokens;
    animations: AnimationTokens;
    effects: EffectTokens;
  }

  interface SpacingTokens {
    base: number; // 8px grid
    micro: number; // 2px
    tiny: number;  // 4px
    xs: number;    // 8px
    sm: number;    // 16px
    md: number;    // 24px
    lg: number;    // 32px
    xl: number;    // 40px
    xxl: number;   // 48px
    touchTarget: number; // 44px (Apple HIG)
    touchTargetLarge: number; // 56px (Enhanced mobile)
  }

  interface ColorTokens {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    foreground: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    accent: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
    };
    glass: {
      background: string;
      border: string;
      hover: string;
      active: string;
    };
  }

  interface TypographyTokens {
    fontFamily: {
      primary: string; // Apple system fonts
      body: string;
    };
    fontSize: {
      xs: string;   // 12px
      sm: string;   // 14px
      base: string; // 16px
      lg: string;   // 18px
      xl: string;   // 20px
      '2xl': string; // 24px
      '3xl': string; // 32px
      '4xl': string; // 48px
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  }

  interface AnimationTokens {
    duration: {
      fast: string;    // 150ms
      normal: string;  // 200ms
      slow: string;    // 300ms
      slower: string;  // 500ms
    };
    easing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
    transitions: {
      all: string;
      colors: string;
      transform: string;
    };
  }

  interface EffectTokens {
    blur: {
      sm: string;  // blur(8px)
      md: string;  // blur(16px)
      lg: string;  // blur(24px)
      xl: string;  // blur(32px)
    };
    borderRadius: {
      sm: string;  // 4px
      md: string;  // 8px
      lg: string;  // 12px
      xl: string;  // 16px
      full: string; // 9999px
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      glass: string;
    };
  }

  // Apple HIG Validation
  interface HIGValidationResult {
    isCompliant: boolean;
    score: number; // 0-100
    violations: HIGViolation[];
    touchTargets: TouchTargetValidation[];
    colorContrast: ColorContrastValidation[];
    spacing: SpacingValidation[];
  }

  interface HIGViolation {
    type: 'touch-target' | 'color-contrast' | 'spacing' | 'typography';
    element: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
    recommendation: string;
  }

  interface ColorContrastValidation {
    foreground: string;
    background: string;
    ratio: number;
    wcagAA: boolean;
    wcagAAA: boolean;
    element: string;
  }

  interface SpacingValidation {
    element: string;
    property: string;
    value: string;
    expectedGrid: boolean; // Should align to 8px grid
    recommendation?: string;
  }

  // Token Security
  interface TokenSecurityConfig {
    obfuscation: boolean;
    consoleProtection: boolean;
    developerAccess: boolean;
    encryptionLevel: 'none' | 'basic' | 'advanced';
  }

  // Performance Monitoring
  interface PerformanceMetrics {
    renderTime: number;
    paintTime: number;
    interactionDelay: number;
    bundleSize: number;
    m4Acceleration: boolean;
    neuralEngineUtilization: number;
  }

  // Strategic Director Integration
  interface StrategicDirectorAPI {
    validateDesign(tokens: DesignTokenCollection): HIGValidationResult;
    optimizePerformance(config: any): PerformanceMetrics;
    generateTokens(source: any): DesignTokenCollection;
    protectTokens(config: TokenSecurityConfig): boolean;
    analyzeCompliance(element: HTMLElement): HIGValidationResult;
  }

  // Global Apple Intelligence Access
  interface Window {
    AppleIntelligenceDirector?: StrategicDirectorAPI;
    designTokens?: DesignTokenCollection;
    HIGValidator?: (element: HTMLElement) => HIGValidationResult;
    M4Accelerator?: {
      isAvailable: boolean;
      optimize: (task: any) => Promise<any>;
    };
  }
}

export {};