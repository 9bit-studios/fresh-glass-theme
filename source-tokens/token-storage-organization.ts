// ===================================================================
// DESIGN TOKEN STORAGE ORGANIZATION SYSTEM
// ===================================================================

// 1. EXTRACT ALL TOKENS TO DEDICATED FILES
// ===================================================================

// tokens/core-foundations.ts
export const coreFoundations = {
  // Apple HIG Base (never changes)
  spacing: {
    micro: '2px',    // 0.25x
    tiny: '4px',     // 0.5x  
    small: '8px',    // 1x base
    medium: '16px',  // 2x
    large: '24px',   // 3x
    xlarge: '32px',  // 4x
    xxlarge: '48px', // 6x
    huge: '64px',    // 8x
  },
  cornerRadius: {
    small: '6px',
    medium: '10px', 
    large: '14px',
    xlarge: '20px',
    continuous: '50%',
  },
  typography: {
    largeTitle: { size: '34px', weight: '700', lineHeight: '41px' },
    title1: { size: '28px', weight: '600', lineHeight: '34px' },
    // ... Apple HIG scale
  },
  accessibility: {
    minTouchTarget: '44px',
    contrastRatios: { AA: 4.5, AAA: 7 }
  }
};

// tokens/brand-colors.ts
export const brandColors = {
  // Your Brand Palette
  voidBlack: '#0A0621',
  deepSpaceIndigo: '#131A36', 
  dimensionalEggplant: '#331F4A',
  subtleCyan: '#5AC8FA',
  quantumViolet: '#6A3093',
  etherealPurple: '#613FE7',
  
  // Apple System Colors (preserved)
  systemBlue: '#007AFF',
  systemGreen: '#34C759', 
  systemRed: '#FF3B30',
  systemOrange: '#FF9500',
  systemPurple: '#AF52DE',
  systemTeal: '#5AC8FA',
};

// tokens/liquid-glass-effects.ts  
export const liquidGlassEffects = {
  backgrounds: {
    subtle: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    medium: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
    prominent: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.08) 100%)',
  },
  blur: {
    subtle: 'blur(8px)',
    medium: 'blur(16px)', 
    strong: 'blur(24px)',
    ultra: 'blur(40px)',
  },
  shadows: {
    glass: '0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    glassHover: '0 12px 48px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  borders: {
    subtle: '0.5px solid rgba(255, 255, 255, 0.08)',
    medium: '1px solid rgba(255, 255, 255, 0.15)',
    prominent: '1px solid rgba(255, 255, 255, 0.25)',
  }
};

// 2. THEME COMPOSITION LAYER
// ===================================================================

// themes/petersen-gaming-theme.ts
import { coreFoundations } from '../tokens/core-foundations';
import { brandColors } from '../tokens/brand-colors';
import { liquidGlassEffects } from '../tokens/liquid-glass-effects';

export const petersenGamingTheme = {
  // Inherit core foundations
  ...coreFoundations,
  
  // Brand-specific colors
  colors: {
    // Primary backgrounds (brand colors)
    primary: brandColors.voidBlack,
    secondary: brandColors.deepSpaceIndigo,
    tertiary: brandColors.dimensionalEggplant,
    
    // Gaming accents  
    accent: brandColors.subtleCyan,
    accentSecondary: brandColors.quantumViolet,
    accentTertiary: brandColors.etherealPurple,
    
    // System colors (Apple HIG preserved)
    systemBlue: brandColors.systemBlue,
    systemGreen: brandColors.systemGreen,
    systemRed: brandColors.systemRed,
    
    // Text hierarchy (with brand tinting)
    label: '#FFFFFF',
    secondaryLabel: 'rgba(255, 255, 255, 0.6)',
    tertiaryLabel: 'rgba(255, 255, 255, 0.3)',
    quaternaryLabel: 'rgba(255, 255, 255, 0.18)',
    
    // Glass effects with brand colors
    glass: `linear-gradient(135deg, 
      ${brandColors.deepSpaceIndigo}20 0%, 
      ${brandColors.dimensionalEggplant}10 100%
    )`,
  },
  
  // Liquid glass effects
  effects: liquidGlassEffects,
  
  // Theme-specific gradients
  gradients: {
    gaming: `linear-gradient(135deg, 
      ${brandColors.quantumViolet} 0%, 
      ${brandColors.etherealPurple} 50%, 
      ${brandColors.subtleCyan} 100%
    )`,
    background: `linear-gradient(135deg, 
      ${brandColors.voidBlack} 0%, 
      ${brandColors.deepSpaceIndigo} 25%, 
      ${brandColors.dimensionalEggplant} 75%, 
      ${brandColors.voidBlack} 100%
    )`,
  },
  
  // Animation with brand personality
  animation: {
    duration: {
      fast: '150ms',
      medium: '300ms', 
      slow: '500ms',
    },
    easing: {
      quantum: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      apple: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  }
};

// themes/ecommerce-theme.ts  
export const ecommerceTheme = {
  ...coreFoundations,
  colors: {
    // More neutral for e-commerce
    primary: '#000000',           // True black
    secondary: '#1C1C1E',         // Apple secondary
    accent: brandColors.systemBlue,
    // ... e-commerce specific colors
  },
  effects: liquidGlassEffects,
};

// 3. PROVIDER INTEGRATION SYSTEM
// ===================================================================

// providers/DesignSystemProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { petersenGamingTheme } from '../themes/petersen-gaming-theme';
import { ecommerceTheme } from '../themes/ecommerce-theme';

type ThemeName = 'petersen-gaming' | 'ecommerce';
type DesignTokens = typeof petersenGamingTheme;

interface DesignSystemContextType {
  tokens: DesignTokens;
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | null>(null);

const THEMES = {
  'petersen-gaming': petersenGamingTheme,
  'ecommerce': ecommerceTheme,
};

interface DesignSystemProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({ 
  children, 
  defaultTheme = 'petersen-gaming' 
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeName>(defaultTheme);
  
  const value = {
    tokens: THEMES[currentTheme],
    theme: currentTheme,
    setTheme: setCurrentTheme,
  };

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = (): DesignSystemContextType => {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within DesignSystemProvider');
  }
  return context;
};

// 4. COMPONENT USAGE PATTERN
// ===================================================================

// components/ExampleComponent.tsx
import React from 'react';
import { useDesignSystem } from '../providers/DesignSystemProvider';

const ExampleComponent: React.FC = () => {
  const { tokens } = useDesignSystem();
  
  return (
    <div style={{
      // Use tokens instead of hardcoded values
      background: tokens.colors.secondary,
      padding: tokens.spacing.large,
      borderRadius: tokens.cornerRadius.medium,
      
      // Apply liquid glass effects
      backgroundImage: tokens.effects.backgrounds.medium,
      backdropFilter: tokens.effects.blur.medium,
      border: tokens.effects.borders.subtle,
      boxShadow: tokens.effects.shadows.glass,
      
      // Brand gradient overlay
      backgroundBlendMode: 'overlay',
    }}>
      <h2 style={{
        color: tokens.colors.label,
        fontSize: tokens.typography.title1.size,
        fontWeight: tokens.typography.title1.weight,
        lineHeight: tokens.typography.title1.lineHeight,
      }}>
        Component using design tokens
      </h2>
    </div>
  );
};

// 5. MIGRATION HELPER UTILITIES
// ===================================================================

// utils/token-migration.ts
export const migrationHelpers = {
  // Map old quantum tokens to new system
  mapQuantumTokens: (oldTokens: any) => {
    return {
      primary: petersenGamingTheme.colors.accent,        // #6366F1 → #5AC8FA
      secondary: petersenGamingTheme.colors.accentSecondary, // #8B5CF6 → #6A3093
      accent: petersenGamingTheme.colors.accentTertiary,     // #EC4899 → #613FE7
    };
  },
  
  // Convert hardcoded colors to theme references
  convertHardcodedColors: (styleObject: Record<string, any>) => {
    const colorMap = {
      '#6366F1': 'tokens.colors.accent',
      '#8B5CF6': 'tokens.colors.accentSecondary', 
      '#EC4899': 'tokens.colors.accentTertiary',
      '#000000': 'tokens.colors.primary',
    };
    
    // Return conversion suggestions
    return Object.entries(styleObject).map(([key, value]) => {
      if (colorMap[value as string]) {
        return { property: key, oldValue: value, newValue: colorMap[value as string] };
      }
      return null;
    }).filter(Boolean);
  }
};

// 6. EXPORT STRUCTURE FOR EASY IMPORTS
// ===================================================================

// index.ts (main export file)
export { DesignSystemProvider, useDesignSystem } from './providers/DesignSystemProvider';
export { petersenGamingTheme, ecommerceTheme } from './themes';
export { coreFoundations, brandColors, liquidGlassEffects } from './tokens';
export { migrationHelpers } from './utils/token-migration';

// Types
export type { DesignTokens, ThemeName } from './providers/DesignSystemProvider';

// ===================================================================
// USAGE EXAMPLES
// ===================================================================

/*
// In your app root:
<DesignSystemProvider defaultTheme="petersen-gaming">
  <App />
</DesignSystemProvider>

// In components:
const { tokens, setTheme } = useDesignSystem();

// Switch themes:
setTheme('ecommerce'); // Changes entire app instantly

// Access tokens:
background: tokens.colors.primary
padding: tokens.spacing.large
borderRadius: tokens.cornerRadius.medium

// Apply effects:
backgroundImage: tokens.effects.backgrounds.medium
backdropFilter: tokens.effects.blur.medium
boxShadow: tokens.effects.shadows.glass
*/

// ===================================================================
// MIGRATION CHECKLIST
// ===================================================================

/*
✅ PHASE 1: Extract Embedded Tokens
1. Move quantumTokens from PetersenGamesHomepage.tsx → themes/petersen-gaming-theme.ts
2. Move liquidGlassTokens from EcommerceSideMenu.tsx → tokens/liquid-glass-effects.ts
3. Preserve unifiedDesignTokens as core foundations

✅ PHASE 2: Create Theme System  
1. Set up provider with theme switching
2. Create brand-specific themes
3. Test theme switching works

✅ PHASE 3: Migrate Components
1. Replace hardcoded tokens with useDesignSystem hook
2. Update one component at a time
3. Visual regression test each change

✅ PHASE 4: Cleanup
1. Remove embedded token definitions
2. Update import statements
3. Document new token usage patterns
*/