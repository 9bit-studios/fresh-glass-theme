/**
 * COMPREHENSIVE FOUNDATION TOKENS
 * Ideal settings for spacing, design, grids, and layout
 * Based on your existing Apple HIG + Quantum Spatial tokens
 */

// ===================================================================
// 1. CORE SPACING SYSTEM (Apple 8pt grid + Quantum enhancement)
// ===================================================================
export const foundationSpacing = {
  // Base 8pt grid system (Apple HIG standard)
  base: 8,
  
  // Micro spacing (sub-grid)
  px: '1px',       // Pixel-perfect borders
  micro: '2px',    // 0.25x - Ultra micro
  tiny: '4px',     // 0.5x - Apple tiny
  
  // Core spacing scale (8pt grid)
  xs: '8px',       // 1x - Base unit
  sm: '16px',      // 2x - Small spacing
  md: '24px',      // 3x - Medium spacing  
  lg: '32px',      // 4x - Large spacing
  xl: '40px',      // 5x - Extra large
  xxl: '48px',     // 6x - Apple standard
  xxxl: '64px',    // 8x - Hero spacing
  xxxxl: '80px',   // 10x - Section spacing
  xxxxxl: '96px',  // 12x - Maximum spacing
  
  // Component-specific spacing
  component: {
    // Apple HIG touch targets
    touchTarget: '44px',     // Minimum touch area
    touchTargetLarge: '56px', // Enhanced mobile touch
    
    // Navigation spacing
    navHeight: '44px',       // Apple nav standard
    navHeightMobile: '56px', // Enhanced mobile nav
    navPadding: '16px',      // Nav horizontal padding
    
    // Content spacing
    contentPadding: '16px',  // Standard content padding
    sectionGap: '48px',      // Between sections
    cardPadding: '16px',     // Card internal padding
    cardGap: '24px',         // Between cards
    
    // Form spacing
    inputHeight: '44px',     // Apple input standard
    inputPadding: '12px',    // Input horizontal padding
    formGap: '16px',         // Between form fields
    buttonPadding: '16px',   // Button horizontal padding
    
    // Layout spacing
    sidebarWidth: '280px',   // Standard sidebar
    sidebarPadding: '24px',  // Sidebar internal padding
    contentMaxWidth: '1440px', // Max content width
    containerPadding: '32px', // Container edge padding
  }
};

// ===================================================================
// 2. RESPONSIVE GRID SYSTEM (Mobile-first Apple HIG)
// ===================================================================
export const foundationGrid = {
  // Breakpoints (Apple device sizes + web standards)
  breakpoints: {
    xs: '320px',     // iPhone SE
    sm: '375px',     // iPhone standard
    md: '428px',     // iPhone Pro Max
    lg: '744px',     // iPad Mini portrait
    xl: '834px',     // iPad Air portrait
    xxl: '1024px',   // iPad Pro portrait / Desktop small
    xxxl: '1194px',  // Desktop medium
    xxxxl: '1440px', // Desktop large
    xxxxxl: '1920px', // Desktop extra large
  },
  
  // Container max-widths for each breakpoint
  containers: {
    xs: '100%',      // Full width mobile
    sm: '100%',      // Full width mobile large
    md: '100%',      // Full width mobile max
    lg: '100%',      // Full width tablet
    xl: '100%',      // Full width tablet large
    xxl: '960px',    // Contained desktop small
    xxxl: '1140px',  // Contained desktop medium
    xxxxl: '1320px', // Contained desktop large
    xxxxxl: '1520px', // Contained desktop max
  },
  
  // Grid system configuration
  columns: {
    mobile: 4,       // 4 columns on mobile
    tablet: 8,       // 8 columns on tablet
    desktop: 12,     // 12 columns on desktop
  },
  
  // Gutters (spacing between columns)
  gutters: {
    xs: '16px',      // Mobile gutter
    sm: '16px',      // Mobile large gutter
    md: '20px',      // Mobile max gutter
    lg: '24px',      // Tablet gutter
    xl: '24px',      // Tablet large gutter
    xxl: '32px',     // Desktop gutter
    xxxl: '32px',    // Desktop medium gutter
    xxxxl: '40px',   // Desktop large gutter
    xxxxxl: '40px',  // Desktop max gutter
  },
  
  // Margins (container edge spacing)
  margins: {
    xs: '16px',      // Mobile margin
    sm: '16px',      // Mobile large margin
    md: '24px',      // Mobile max margin
    lg: '32px',      // Tablet margin
    xl: '32px',      // Tablet large margin
    xxl: '48px',     // Desktop margin
    xxxl: '48px',    // Desktop medium margin
    xxxxl: '64px',   // Desktop large margin
    xxxxxl: '64px',  // Desktop max margin
  },
  
  // Quantum-spatial grid overlays (visual grid system)
  quantum: {
    // Background grids
    background: {
      opacity: 0.05,
      lineColor: '#5AC8FA',
      lineWidth: '0.5px',
      cellSize: '32px',
      perspective: '60deg',
    },
    
    // Interface grids
    interface: {
      opacity: 0.08,
      lineColor: '#5AC8FA', 
      lineWidth: '0.5px',
      cellSize: '24px',
      perspective: '45deg',
    },
    
    // Feature grids
    feature: {
      opacity: 0.12,
      lineColor: '#AB47BC',
      lineWidth: '1px',
      cellSize: '16px',
      perspective: '30deg',
    }
  }
};

// ===================================================================
// 3. LAYOUT PATTERNS (Apple HIG + Quantum Spatial)
// ===================================================================
export const foundationLayout = {
  // Standard layout patterns
  patterns: {
    // Navigation layouts
    navigation: {
      height: '44px',
      mobileHeight: '56px',
      zIndex: 1000,
      backdropFilter: 'blur(20px) saturate(180%)',
      background: 'rgba(0, 0, 0, 0.8)',
      borderBottom: '0.5px solid rgba(255, 255, 255, 0.1)',
    },
    
    // Sidebar layouts
    sidebar: {
      width: '280px',
      mobileWidth: '320px',
      zIndex: 999,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(24px) saturate(160%)',
      borderRight: '0.5px solid rgba(255, 255, 255, 0.1)',
    },
    
    // Content areas
    content: {
      maxWidth: '1440px',
      padding: '32px',
      mobilePadding: '16px',
      tabletPadding: '24px',
    },
    
    // Card layouts
    card: {
      borderRadius: '14px',
      padding: '16px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
      backdropFilter: 'blur(16px) saturate(150%)',
      border: '0.5px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    },
    
    // Modal layouts
    modal: {
      maxWidth: '600px',
      padding: '32px',
      borderRadius: '20px',
      zIndex: 2000,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
      backdropFilter: 'blur(40px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 32px 64px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    }
  },
  
  // Z-index scale (consistent layering)
  zIndex: {
    background: -10,     // Background elements
    base: 0,             // Base content
    above: 10,           // Slightly elevated
    overlay: 100,        // Overlays
    dropdown: 200,       // Dropdowns
    sticky: 300,         // Sticky elements
    header: 400,         // Headers
    modal: 1000,         // Modals
    popover: 1100,       // Popovers
    tooltip: 1200,       // Tooltips
    toast: 1300,         // Toast notifications
    loading: 1400,       // Loading overlays
    max: 9999,           // Maximum elevation
  },
  
  // Common layout compositions
  compositions: {
    // Page layouts
    page: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    },
    
    // Main content areas
    main: {
      display: 'flex',
      flex: 1,
      maxWidth: '1440px',
      margin: '0 auto',
      width: '100%',
    },
    
    // Flex layouts
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    
    flexCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Grid layouts
    gridAuto: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
    },
    
    gridFixed: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '24px',
    }
  }
};

// ===================================================================
// 4. DESIGN SYSTEM FOUNDATIONS (Visual hierarchy)
// ===================================================================
export const foundationDesign = {
  // Visual hierarchy
  hierarchy: {
    // Content hierarchy
    content: {
      h1: { size: '34px', weight: '700', lineHeight: '41px', letterSpacing: '-0.5px' },
      h2: { size: '28px', weight: '600', lineHeight: '34px', letterSpacing: '-0.3px' },
      h3: { size: '22px', weight: '600', lineHeight: '28px', letterSpacing: '-0.2px' },
      h4: { size: '20px', weight: '600', lineHeight: '25px', letterSpacing: '-0.1px' },
      h5: { size: '17px', weight: '600', lineHeight: '22px', letterSpacing: '-0.05em' },
      h6: { size: '15px', weight: '600', lineHeight: '20px' },
      body: { size: '17px', weight: '400', lineHeight: '22px', letterSpacing: '-0.022em' },
      caption: { size: '13px', weight: '400', lineHeight: '18px' },
    },
    
    // Interface hierarchy
    interface: {
      largeTitle: { size: '34px', weight: '700', lineHeight: '41px' },
      title1: { size: '28px', weight: '400', lineHeight: '34px' },
      title2: { size: '22px', weight: '400', lineHeight: '28px' },
      title3: { size: '20px', weight: '400', lineHeight: '25px' },
      headline: { size: '17px', weight: '600', lineHeight: '22px' },
      body: { size: '17px', weight: '400', lineHeight: '22px' },
      callout: { size: '16px', weight: '400', lineHeight: '21px' },
      subheadline: { size: '15px', weight: '400', lineHeight: '20px' },
      footnote: { size: '13px', weight: '400', lineHeight: '18px' },
      caption1: { size: '12px', weight: '400', lineHeight: '16px' },
      caption2: { size: '11px', weight: '400', lineHeight: '13px' },
    }
  },
  
  // Visual rhythm (spacing relationships)
  rhythm: {
    // Vertical rhythm ratios
    ratios: {
      tight: 1.2,      // Compact spacing
      normal: 1.5,     // Standard spacing
      relaxed: 1.8,    // Loose spacing
      loose: 2.0,      // Very loose spacing
    },
    
    // Section spacing
    sections: {
      xs: '32px',      // Small section spacing
      sm: '48px',      // Medium section spacing
      md: '64px',      // Large section spacing
      lg: '80px',      // Extra large section spacing
      xl: '96px',      // Maximum section spacing
    },
    
    // Component spacing relationships
    components: {
      related: '8px',        // Related elements
      unrelated: '24px',     // Unrelated elements
      sections: '48px',      // Between sections
      features: '64px',      // Between features
    }
  },
  
  // Interactive states
  states: {
    // Standard states
    default: { opacity: 1, transform: 'scale(1)' },
    hover: { opacity: 0.8, transform: 'scale(1.02)' },
    active: { opacity: 0.9, transform: 'scale(0.98)' },
    disabled: { opacity: 0.4, transform: 'scale(1)' },
    loading: { opacity: 0.6, transform: 'scale(1)' },
    
    // Focus states (Apple HIG accessibility)
    focus: {
      outline: '2px solid #007AFF',
      outlineOffset: '2px',
      borderRadius: '4px',
    },
    
    // Quantum spatial states
    quantum: {
      materialized: { opacity: 1, filter: 'blur(0px)', scale: 1 },
      transitional: { opacity: 0.8, filter: 'blur(1px)', scale: 0.98 },
      energy: { opacity: 0.9, filter: 'blur(0px)', scale: 1.02 },
      superposition: { opacity: 0.7, filter: 'blur(2px)', scale: 0.95 },
    }
  },
  
  // Elevation system (consistent depth)
  elevation: {
    // Surface elevation levels
    flat: { boxShadow: 'none', zIndex: 0 },
    raised: { 
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)', 
      zIndex: 1 
    },
    floating: { 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)', 
      zIndex: 10 
    },
    overlay: { 
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
      zIndex: 100 
    },
    modal: { 
      boxShadow: '0 16px 32px rgba(0, 0, 0, 0.3)', 
      zIndex: 1000 
    },
    
    // Glassmorphic elevation (quantum spatial)
    glass: {
      subtle: {
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(8px) saturate(150%)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      medium: {
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(16px) saturate(160%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      prominent: {
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      }
    }
  }
};

// ===================================================================
// 5. RESPONSIVE UTILITIES (Mobile-first implementation)
// ===================================================================
export const foundationResponsive = {
  // Media query helpers
  mediaQueries: {
    // Min-width queries (mobile-first)
    sm: '(min-width: 375px)',
    md: '(min-width: 428px)', 
    lg: '(min-width: 744px)',
    xl: '(min-width: 834px)',
    xxl: '(min-width: 1024px)',
    xxxl: '(min-width: 1194px)',
    xxxxl: '(min-width: 1440px)',
    
    // Max-width queries (desktop-first)
    maxSm: '(max-width: 374px)',
    maxMd: '(max-width: 427px)',
    maxLg: '(max-width: 743px)',
    maxXl: '(max-width: 833px)',
    maxXxl: '(max-width: 1023px)',
    
    // Orientation queries
    portrait: '(orientation: portrait)',
    landscape: '(orientation: landscape)',
    
    // Device-specific queries
    mobile: '(max-width: 743px)',
    tablet: '(min-width: 744px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
    
    // Apple device queries
    iPhone: '(max-width: 428px)',
    iPad: '(min-width: 744px) and (max-width: 1024px)',
    macBook: '(min-width: 1194px)',
    
    // Reduced motion (accessibility)
    reducedMotion: '(prefers-reduced-motion: reduce)',
    
    // Dark mode
    darkMode: '(prefers-color-scheme: dark)',
    lightMode: '(prefers-color-scheme: light)',
  },
  
  // Responsive patterns
  patterns: {
    // Container patterns
    container: {
      width: '100%',
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '0 16px',
      '@media (min-width: 744px)': { padding: '0 32px' },
      '@media (min-width: 1024px)': { padding: '0 48px' },
    },
    
    // Grid patterns
    gridResponsive: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      '@media (min-width: 744px)': {
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '24px'
      },
      '@media (min-width: 1024px)': {
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '32px'
      }
    },
    
    // Typography patterns
    responsiveText: {
      fontSize: 'clamp(16px, 2.5vw, 20px)',
      lineHeight: 1.5,
    },
    
    // Spacing patterns
    responsiveSpacing: {
      padding: '16px',
      '@media (min-width: 744px)': { padding: '24px' },
      '@media (min-width: 1024px)': { padding: '32px' },
    }
  }
};

// ===================================================================
// 6. CONSOLIDATED FOUNDATION EXPORT
// ===================================================================
export const foundationTokens = {
  spacing: foundationSpacing,
  grid: foundationGrid,
  layout: foundationLayout,
  design: foundationDesign,
  responsive: foundationResponsive,
  
  // Quick access helpers
  breakpoints: foundationGrid.breakpoints,
  containers: foundationGrid.containers,
  zIndex: foundationLayout.zIndex,
  elevation: foundationDesign.elevation,
  mediaQueries: foundationResponsive.mediaQueries,
  
  // Utility functions
  utils: {
    // Get spacing value
    getSpacing: (key: keyof typeof foundationSpacing) => foundationSpacing[key],
    
    // Get breakpoint value
    getBreakpoint: (key: keyof typeof foundationGrid.breakpoints) => foundationGrid.breakpoints[key],
    
    // Get container max-width
    getContainer: (key: keyof typeof foundationGrid.containers) => foundationGrid.containers[key],
    
    // Get z-index value
    getZIndex: (key: keyof typeof foundationLayout.zIndex) => foundationLayout.zIndex[key],
    
    // Generate responsive spacing
    getResponsiveSpacing: (mobile: string, tablet?: string, desktop?: string) => ({
      padding: mobile,
      ...(tablet && { '@media (min-width: 744px)': { padding: tablet } }),
      ...(desktop && { '@media (min-width: 1024px)': { padding: desktop } }),
    }),
    
    // Generate responsive grid
    getResponsiveGrid: (mobile: number, tablet?: number, desktop?: number) => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${mobile}, 1fr)`,
      gap: foundationGrid.gutters.xs,
      ...(tablet && {
        '@media (min-width: 744px)': {
          gridTemplateColumns: `repeat(${tablet}, 1fr)`,
          gap: foundationGrid.gutters.lg,
        }
      }),
      ...(desktop && {
        '@media (min-width: 1024px)': {
          gridTemplateColumns: `repeat(${desktop}, 1fr)`,
          gap: foundationGrid.gutters.xxl,
        }
      }),
    }),
  }
};

// Type definitions
export type FoundationTokens = typeof foundationTokens;
export type FoundationSpacing = typeof foundationSpacing;
export type FoundationGrid = typeof foundationGrid;
export type FoundationLayout = typeof foundationLayout;
export type FoundationDesign = typeof foundationDesign;
export type FoundationResponsive = typeof foundationResponsive;

// Default export
export default foundationTokens;