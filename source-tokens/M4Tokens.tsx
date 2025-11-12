/**
 * 9Bit Studios Quantum-Spatial Design System
 * Design Tokens - M4-Optimized
 */

const M4Tokens = {
  colors: {
    // Primary Foundation
    voidBlack: '#0A0621',
    deepSpaceIndigo: '#131A36',
    ultraIndigo: '#1E1F5C',
    dimensionalEggplant: '#331F4A',
    midnightRichness: '#0D0D15',
    quantumViolet: '#6A3093',
    ultraMarine: '#405DE5',
    ultraViolet: '#613FE7',
    
    // Secondary Accents
    subtleAqua: '#06D6A0',
    subtleCyan: '#5AC8FA',
    dimensionalTeal: '#126D71',
    roseEnergy: '#BF4080',
    quantumPulsePink: '#FF2D55',
    dimensionalOrange: '#FF6B6B',
    
    // Heritage System
    heritageGreen: '#2C5F2D',
    heritageGreenLight: '#3D8B40',
    heritageGreenDark: '#1B3D1A',
    heritagePixelGreen: '#3DFF74',
    
    // Functional Colors
    primaryAction: '#5AC8FA',
    secondaryAction: '#126D71',
    tertiaryAction: '#613FE7',
    destructive: '#BF4080',
    success: '#2C5F2D',
    warning: '#FF6B6B',
    info: '#06D6A0'
  },
  
  gradients: {
    heritageState: 'linear-gradient(135deg, #1B3D1A, #2C5F2D, #3D8B40)',
    transitionalState: 'linear-gradient(135deg, #331F4A, #1E1F5C, #613FE7)',
    quantumState: 'linear-gradient(135deg, #6A3093, #BF4080, #FF2D55)',
    quantumDepth: 'linear-gradient(135deg, #131A36, #331F4A, #6A3093)',
    spatialBackground: 'linear-gradient(180deg, #0A0621, #131A36)',
    energyFlow: 'linear-gradient(90deg, #2C5F2D, #5AC8FA, #FF2D55)'
  },
  
  opacity: {
    subtle: 0.7,
    verySubtle: 0.3,
    hover: 0.85,
    active: 0.95,
    disabled: 0.5,
    
    // Grid Opacity
    gridSubtle: 0.05,
    gridMedium: 0.1,
    gridProminent: 0.15
  },
  
  spacing: {
    quantum: 4,
    xxs: 4,
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64
  },
  
  borders: {
    radiusXs: 2,
    radiusSm: 4,
    radiusMd: 8,
    radiusLg: 12,
    radiusXl: 20,
    radiusPill: 9999,
    
    widthThin: 1,
    widthMedium: 2,
    widthThick: 3
  },
  
  shadows: {
    subtle: '0 2px 4px rgba(10, 6, 33, 0.2)',
    medium: '0 4px 8px rgba(10, 6, 33, 0.3)',
    prominent: '0 8px 16px rgba(10, 6, 33, 0.4)',
    quantum: '0 8px 24px rgba(90, 200, 250, 0.25)',
    
    // Glow Effects
    glowSubtle: '0 0 5px rgba(90, 200, 250, 0.5)',
    glowMedium: '0 0 10px rgba(90, 200, 250, 0.6)',
    glowQuantum: '0 0 15px rgba(191, 64, 128, 0.7)'
  },
  
  typography: {
    // Font Families
    fontPrimaryDisplay: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    fontPrimaryText: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSecondaryDisplay: "'Clash Grotesque', sans-serif",
    fontSecondaryText: "'Clash Grotesque', sans-serif",
    fontMono: "'SF Mono', 'JetBrains Mono', monospace",
    
    // Font Weights
    weightRegular: 400,
    weightMedium: 500,
    weightSemibold: 600,
    weightBold: 700,
    
    // Font Sizes
    sizeXs: 12,
    sizeSm: 14,
    sizeMd: 16,
    sizeLg: 20,
    sizeXl: 24,
    sizeXxl: 32,
    sizeDisplay: 48,
    
    // Line Heights
    lineHeightXs: 16,
    lineHeightSm: 20,
    lineHeightMd: 24,
    lineHeightLg: 28,
    lineHeightXl: 32,
    lineHeightXxl: 40,
    lineHeightDisplay: 56,
    
    // Letter Spacing
    letterSpacingTight: -0.2,
    letterSpacingNormal: 0,
    letterSpacingWide: 0.1
  },
  
  animation: {
    // Timing
    transitionInstant: 50,
    transitionFast: 150,
    transitionMedium: 300,
    transitionSlow: 500,
    transitionDeliberate: 800,
    
    // Easing
    easeStandard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    easeDecelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    easeAccelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    easeQuantum: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeEnergy: 'cubic-bezier(0.17, 0.89, 0.32, 1.25)'
  },
  
  glassmorphism: {
    backgroundSubtle: 'rgba(19, 26, 54, 0.4)',
    backgroundMedium: 'rgba(19, 26, 54, 0.6)',
    backgroundProminent: 'rgba(19, 26, 54, 0.8)',
    
    borderColor: 'rgba(90, 200, 250, 0.2)',
    borderColorHeritage: 'rgba(61, 255, 116, 0.2)',
    borderColorQuantum: 'rgba(191, 64, 128, 0.2)',
    
    blurSubtle: 5,
    blurMedium: 10,
    blurProminent: 15
  },
  
  zIndex: {
    background: -10,
    grid: -5,
    base: 0,
    above: 10,
    floating: 100,
    overlay: 1000,
    modal: 2000,
    popover: 5000,
    quantum: 9000
  },
  
  states: {
    materialized: {
      opacity: 1,
      glow: 0,
      layers: 1,
      shadow: '0 2px 8px rgba(90, 200, 250, 0.3)'
    },
    partial: {
      opacity: 0.7,
      glow: 0.3,
      layers: 1,
      shadow: '0 1px 6px rgba(90, 200, 250, 0.2)'
    },
    energy: {
      opacity: 0.9,
      glow: 0.8,
      layers: 1,
      shadow: '0 2px 12px rgba(90, 200, 250, 0.6)'
    },
    superposition: {
      opacity: 0.85,
      glow: 0.4,
      layers: 3,
      shadow: '0 3px 10px rgba(90, 200, 250, 0.4)'
    }
  },
  
  grids: {
    background: {
      opacity: 0.05,
      lineColor: '#5AC8FA',
      lineWidth: 1,
      cellSize: 32,
      perspective: 60,
      scale: 2
    },
    navigation: {
      opacity: 0.1,
      lineColor: '#5AC8FA',
      lineWidth: 1,
      cellSize: 24,
      perspective: 40,
      scale: 1.5
    },
    distortion: {
      opacity: 0.08,
      lineColor: '#BF4080',
      lineWidth: 1,
      cellSize: 20,
      skewX: 10,
      skewY: 5
    }
  }
};

// Utility functions for working with tokens
const designSystem = {
  // Get color value by name
  getColor: (colorName) => {
    return designTokens.colors[colorName] || null;
  },
  
  // Get a gradient by state
  getGradientForState: (state) => {
    switch(state) {
      case 'heritage':
        return designTokens.gradients.heritageState;
      case 'transitional':
        return designTokens.gradients.transitionalState;
      case 'quantum':
        return designTokens.gradients.quantumState;
      default:
        return designTokens.gradients.transitionalState;
    }
  },
  
  // Get state properties
  getStateProps: (state) => {
    return designTokens.states[state] || designTokens.states.materialized;
  },
  
  // Get grid properties
  getGridProps: (type) => {
    return designTokens.grids[type] || designTokens.grids.background;
  },
  
  // Convert to CSS variables
  toCSSVariables: () => {
    // Implementation for converting tokens to CSS variables
    // This would output CSS custom properties
    let cssVars = ':root {';
    
    // Colors
    Object.entries(designTokens.colors).forEach(([name, value]) => {
      cssVars += `  --color-${kebabCase(name)}: ${value};`;
    });
    
    // Other token categories would follow the same pattern
    // ...
    
    cssVars += '}';
    return cssVars;
  },
  
  // Get shadow with custom opacity
  getShadowWithOpacity: (type, opacity) => {
    const shadow = designTokens.shadows[type];
    if (!shadow) return null;
    
    // Parse the shadow to adjust opacity
    // This is a simplified example - a real implementation would be more robust
    return shadow.replace(/rgba\([^,]+,[^,]+,[^,]+,\s*[^)]+\)/, (match) => {
      return match.replace(/[0-9]?\.?[0-9]+\)$/, `${opacity})`);
    });
  }
};

// Helper function to convert camelCase to kebab-case
function kebabCase(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { designTokens, designSystem };
}