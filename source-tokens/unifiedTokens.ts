/**
 * Unified Design Tokens
 * Extracted from UnifiedDesignSystem.tsx
 * 
 * Apple HIG + Quantum Spatial Integration
 * Consistent line weights, visual hierarchy, and depth across gaming & ecommerce
 */

export const unifiedTokens = {
  // Apple HIG Compliant Typography with Gaming Enhancement
  typography: {
    // Primary hierarchy (Apple HIG base)
    largeTitle: { 
      size: '34px', 
      weight: '700', 
      lineHeight: '41px', 
      letterSpacing: '-0.5px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
    },
    title1: { 
      size: '28px', 
      weight: '600', 
      lineHeight: '34px', 
      letterSpacing: '-0.3px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)'
    },
    title2: { 
      size: '22px', 
      weight: '600', 
      lineHeight: '28px', 
      letterSpacing: '-0.2px',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
    },
    title3: { 
      size: '20px', 
      weight: '600', 
      lineHeight: '25px', 
      letterSpacing: '-0.1px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)'
    },
    headline: { 
      size: '17px', 
      weight: '600', 
      lineHeight: '22px', 
      letterSpacing: '-0.05em'
    },
    body: { 
      size: '17px', 
      weight: '400', 
      lineHeight: '22px', 
      letterSpacing: '-0.022em'
    },
    callout: { 
      size: '16px', 
      weight: '400', 
      lineHeight: '21px'
    },
    subheadline: { 
      size: '15px', 
      weight: '400', 
      lineHeight: '20px'
    },
    footnote: { 
      size: '13px', 
      weight: '400', 
      lineHeight: '18px'
    },
    caption1: { 
      size: '12px', 
      weight: '400', 
      lineHeight: '16px'
    },
    caption2: { 
      size: '11px', 
      weight: '400', 
      lineHeight: '13px'
    },
  },

  // Unified Color System (Gaming + Ecommerce)
  colors: {
    // Core Apple HIG Colors
    primary: '#000000',           // True black
    secondary: '#1C1C1E',         // Apple secondary background
    tertiary: '#2C2C2E',          // Apple tertiary background
    quaternary: '#3A3A3C',        // Apple quaternary background
    
    // System Colors (consistent across platforms)
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemOrange: '#FF9500',
    systemRed: '#FF3B30',
    systemPurple: '#AF52DE',
    systemTeal: '#5AC8FA',
    systemIndigo: '#5856D6',
    systemPink: '#FF2D92',
    systemYellow: '#FFCC00',
    
    // Gaming Enhancement Colors (quantum-spatial)
    quantumBlue: '#4FC3F7',       // Enhanced gaming blue
    quantumPurple: '#AB47BC',     // Enhanced gaming purple
    quantumRose: '#EC407A',       // Enhanced gaming rose
    quantumGreen: '#66BB6A',      // Enhanced gaming green
    
    // Text Hierarchy (Apple HIG + Gaming depth)
    label: '#FFFFFF',
    secondaryLabel: 'rgba(255, 255, 255, 0.6)',
    tertiaryLabel: 'rgba(255, 255, 255, 0.3)',
    quaternaryLabel: 'rgba(255, 255, 255, 0.18)',
    
    // Fills (Apple HIG standard)
    systemFill: 'rgba(120, 120, 128, 0.2)',
    secondarySystemFill: 'rgba(120, 120, 128, 0.16)',
    tertiarySystemFill: 'rgba(120, 120, 128, 0.12)',
    quaternarySystemFill: 'rgba(120, 120, 128, 0.08)',
    
    // Separators (consistent line weights)
    separator: 'rgba(84, 84, 88, 0.6)',         // 0.5px standard
    heavySeparator: 'rgba(84, 84, 88, 0.8)',    // 1px emphasis
    lightSeparator: 'rgba(84, 84, 88, 0.3)',    // 0.25px subtle
    
    // Surface overlays (gaming + ecommerce)
    glassLight: 'rgba(255, 255, 255, 0.12)',
    glassMedium: 'rgba(255, 255, 255, 0.08)',
    glassDark: 'rgba(255, 255, 255, 0.04)',
    glassUltra: 'rgba(255, 255, 255, 0.02)',
  },

  // Unified Spacing System (Apple 8pt grid + Gaming enhancement)
  spacing: {
    micro: '2px',     // 0.25x - Apple micro spacing
    tiny: '4px',      // 0.5x - Apple tiny spacing
    small: '8px',     // 1x - Base Apple unit
    medium: '16px',   // 2x - Apple medium spacing
    large: '24px',    // 3x - Apple large spacing
    xlarge: '32px',   // 4x - Apple xlarge spacing
    xxlarge: '48px',  // 6x - Enhanced gaming spacing
    huge: '64px',     // 8x - Gaming feature spacing
    massive: '80px',  // 10x - Hero section spacing
  },

  // Consistent Border Radius (Apple HIG + Gaming)
  cornerRadius: {
    micro: '2px',     // Micro elements
    small: '6px',     // Small elements (Apple standard)
    medium: '10px',   // Medium elements (Apple standard) 
    large: '14px',    // Large elements (Apple standard)
    xlarge: '20px',   // Extra large elements (Apple standard)
    xxlarge: '24px',  // Gaming enhancement
    huge: '32px',     // Gaming hero elements
    continuous: '50%', // Continuous corners
  },

  // Line Weight System (Consistent across all components)
  lineWeights: {
    hairline: '0.25px',   // Ultra-thin separators
    thin: '0.5px',        // Apple standard thin lines
    regular: '1px',       // Standard weight
    medium: '1.5px',      // Medium emphasis
    thick: '2px',         // Strong emphasis
    heavy: '3px',         // Heavy accent lines
    ultra: '4px',         // Maximum emphasis
  },

  // Visual Depth System (Shadows + Blur)
  depth: {
    // Shadow layers for consistent depth
    shadows: {
      none: 'none',
      subtle: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
      soft: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
      medium: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      large: '0 20px 25px rgba(0, 0, 0, 0.15), 0 8px 10px rgba(0, 0, 0, 0.06)',
      xlarge: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 20px rgba(0, 0, 0, 0.08)',
      
      // Gaming-enhanced shadows with color
      quantumGlow: '0 0 20px rgba(79, 195, 247, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2)',
      gamingAccent: '0 8px 32px rgba(171, 71, 188, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)',
      
      // Glassmorphic shadows (Apple + Gaming)
      glassSubtle: '0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      glassMedium: '0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      glassLarge: '0 16px 48px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    },

    // Blur effects for depth
    blur: {
      none: '0px',
      subtle: '4px',      // Subtle depth
      soft: '8px',        // Soft glassmorphism
      medium: '16px',     // Medium glassmorphism
      strong: '24px',     // Strong glassmorphism
      intense: '32px',    // Maximum glassmorphism
      background: '40px', // Background blur
    },

    // Backdrop effects (Apple + Gaming)
    backdrop: {
      thinMaterial: 'blur(8px) saturate(180%)',
      thickMaterial: 'blur(30px) saturate(180%)',
      gaming: 'blur(16px) saturate(200%) brightness(110%)',
      ecommerce: 'blur(12px) saturate(160%) brightness(105%)',
    }
  },

  // Animation System (Apple + Gaming)
  animation: {
    duration: {
      instant: '0ms',
      fast: '200ms',
      medium: '350ms',
      slow: '500ms',
      verySlow: '700ms',
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',      // Apple standard
      decelerated: 'cubic-bezier(0.0, 0.0, 0.2, 1)',   // Apple decelerated
      accelerated: 'cubic-bezier(0.4, 0.0, 1, 1)',     // Apple accelerated
      sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',         // Gaming sharp
      smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',        // Gaming smooth
      elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Gaming elastic
    }
  },

  // Component-specific configurations
  components: {
    navigation: {
      height: '44px',                              // Apple standard nav height
      mobileHeight: '56px',                        // Enhanced mobile height
      backdropBlur: 'blur(20px) saturate(180%)',  // Navigation blur
      borderWidth: '0.5px',                        // Apple standard border
    },
    card: {
      borderRadius: '14px',                        // Apple standard card radius
      padding: '16px',                             // Apple standard padding
      shadowDepth: 'medium',                       // Default shadow depth
    },
    button: {
      minHeight: '44px',                           // Apple minimum touch target
      borderRadius: '10px',                        // Apple standard button radius
      paddingHorizontal: '16px',                   // Horizontal padding
      fontWeight: '600',                           // Button text weight
    },
    input: {
      height: '44px',                              // Apple standard input height
      borderRadius: '10px',                        // Apple standard input radius
      borderWidth: '1px',                          // Standard border width
      paddingHorizontal: '12px',                   // Horizontal padding
      background: 'rgba(118, 118, 128, 0.12)',    // Apple input background
      borderColor: 'rgba(118, 118, 128, 0.24)',   // Apple input border
    }
  }
};

// Legacy export for backward compatibility
export const unifiedDesignTokens = unifiedTokens;

export type UnifiedTokens = typeof unifiedTokens;
export type UnifiedDesignTokens = typeof unifiedDesignTokens;