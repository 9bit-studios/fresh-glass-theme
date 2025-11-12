/**
 * Design Tokens Index
 * Central export point for all design token systems
 */

// Core unified tokens
export { 
  coreTokens, 
  computedStyles, 
  designUtils, 
  petersenTheme,
  type CoreTokens,
  type ComputedStyles,
  type DesignUtils,
  type PetersenTheme
} from '../components/extracted/coreDesignTokens';

// Enhanced gaming tokens
export { 
  enhancedGamingTokens,
  type EnhancedGamingTokens 
} from './enhancedGamingTokens';

// Quantum-spatial tokens
export { 
  quantumSpatialTokens,
  type QuantumSpatialTokens 
} from './quantumSpatialTokens';

// Apple HIG tokens
export { 
  appleHIGTokens,
  liquidGlassTokens,
  type AppleHIGTokens,
  type LiquidGlassTokens 
} from './appleHIGTokens';

// Unified design tokens
export {
  unifiedTokens,
  unifiedDesignTokens,
  type UnifiedTokens,
  type UnifiedDesignTokens
} from './unifiedTokens';

// Re-export existing token files if they exist and are properly structured
// export * from './enhancedDesignTokens';
// export * from './liquidGlassTokens';
// export * from './quantumTokens';

// Unified token merger utility
export const mergeTokens = <T extends Record<string, any>>(...tokenSets: T[]): T => {
  return tokenSets.reduce((merged, tokens) => ({
    ...merged,
    ...tokens,
    // Deep merge for nested objects
    colors: { ...merged.colors, ...tokens.colors },
    spacing: { ...merged.spacing, ...tokens.spacing },
    typography: { ...merged.typography, ...tokens.typography },
    gradients: { ...merged.gradients, ...tokens.gradients },
    shadows: { ...merged.shadows, ...tokens.shadows },
    animation: { ...merged.animation, ...tokens.animation },
  }), {} as T);
};

// Token selection utility
export const selectTokenSystem = (theme: 'core' | 'gaming' | 'quantum' | 'apple' | 'petersen') => {
  switch (theme) {
    case 'core':
      return coreTokens;
    case 'gaming':
      return enhancedGamingTokens;
    case 'quantum':
      return quantumSpatialTokens;
    case 'apple':
      return appleHIGTokens;
    case 'petersen':
      return petersenTheme;
    default:
      return coreTokens;
  }
};