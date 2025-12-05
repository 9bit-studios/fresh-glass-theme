// ===================================================================
// FOUNDATION INTEGRATION WITH UNIFIED TOKENS + RESPONSIVE SYSTEM
// ===================================================================

// Your unified tokens provide: colors, typography, spacing, effects
// Missing: responsive breakpoints, layout patterns, page systems
// Solution: Layer responsive/layout system ON TOP of unified tokens

// 1. RESPONSIVE LAYER (ADD TO UNIFIED TOKENS)
// ===================================================================

// Add to UnifiedDesignSystem.tsx
export const responsiveTokens = {
  // Apple-style breakpoints
  breakpoints: {
    mobile: '320px',
    mobileLarge: '428px',    // iPhone Pro Max
    tablet: '744px',         // iPad Mini
    tabletLarge: '834px',    // iPad Air
    desktop: '1024px',       // iPad Pro / Small Desktop
    desktopLarge: '1194px',  // Desktop
    wide: '1440px',          // Large Desktop
  },
  
  // Container max-widths for each breakpoint
  containers: {
    mobile: '100%',
    mobileLarge: '100%',
    tablet: '100%',
    tabletLarge: '100%',
    desktop: '960px',
    desktopLarge: '1140px',
    wide: '1320px',
  },
  
  // Grid system
  grid: {
    columns: 12,
    gutters: {
      mobile: '16px',
      tablet: '24px', 
      desktop: '32px',
    },
    margins: {
      mobile: '16px',
      tablet: '32px',
      desktop: '48px',
    }
  }
};

// 2. LAYOUT SYSTEM LAYER
// ===================================================================

// foundation/Layout.tsx
import React from 'react';
import { unifiedDesignTokens, responsiveTokens } from '../UnifiedDesignSystem';

// Responsive Container
export const Container: React.FC<{
  children: React.ReactNode;
  maxWidth?: keyof typeof responsiveTokens.containers;
  padding?: boolean;
}> = ({ 
  children, 
  maxWidth = 'wide',
  padding = true 
}) => (
  <div style={{
    width: '100%',
    maxWidth: responsiveTokens.containers[maxWidth],
    margin: '0 auto',
    padding: padding ? `0 ${responsiveTokens.grid.margins.mobile}` : '0',
    
    // Responsive padding using CSS custom properties
    '--container-padding-tablet': responsiveTokens.grid.margins.tablet,
    '--container-padding-desktop': responsiveTokens.grid.margins.desktop,
  }}
  className="responsive-container"
  >
    {children}
  </div>
);

// Responsive Grid
export const Grid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  gap?: keyof typeof unifiedDesignTokens.spacing;
  breakpoint?: keyof typeof responsiveTokens.breakpoints;
}> = ({ 
  children, 
  columns = 12,
  gap = 'medium',
  breakpoint = 'tablet'
}) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: unifiedDesignTokens.spacing[gap],
    width: '100%',
  }}
  className={`grid-${breakpoint}`}
  >
    {children}
  </div>
);

// Responsive Section
export const Section: React.FC<{
  children: React.ReactNode;
  spacing?: 'small' | 'medium' | 'large' | 'xlarge';
  background?: 'primary' | 'secondary' | 'glass';
}> = ({ 
  children, 
  spacing = 'large',
  background = 'primary'
}) => {
  const spacingMap = {
    small: unifiedDesignTokens.spacing.large,
    medium: unifiedDesignTokens.spacing.xlarge, 
    large: unifiedDesignTokens.spacing.xxlarge,
    xlarge: unifiedDesignTokens.spacing.huge,
  };
  
  const backgroundMap = {
    primary: unifiedDesignTokens.colors.primary,
    secondary: unifiedDesignTokens.colors.secondary,
    glass: unifiedDesignTokens.gradients.primaryGlass,
  };

  return (
    <section style={{
      padding: `${spacingMap[spacing]} 0`,
      background: backgroundMap[background],
      position: 'relative',
    }}>
      {children}
    </section>
  );
};

// 3. RESPONSIVE CSS SYSTEM
// ===================================================================

// foundation/responsive.css
export const responsiveCSS = `
/* Base responsive container */
.responsive-container {
  padding-left: 16px;
  padding-right: 16px;
}

/* Tablet breakpoint */
@media (min-width: 744px) {
  .responsive-container {
    padding-left: var(--container-padding-tablet);
    padding-right: var(--container-padding-tablet);
  }
  
  .grid-tablet {
    grid-template-columns: repeat(8, 1fr);
  }
}

/* Desktop breakpoint */
@media (min-width: 1024px) {
  .responsive-container {
    padding-left: var(--container-padding-desktop);
    padding-right: var(--container-padding-desktop);
  }
  
  .grid-desktop {
    grid-template-columns: repeat(12, 1fr);
  }
}

/* Typography responsive scaling */
.responsive-typography {
  font-size: clamp(
    ${unifiedDesignTokens.typography.body.size}, 
    2.5vw, 
    ${unifiedDesignTokens.typography.headline.size}
  );
}

/* Apple-style responsive spacing */
.responsive-spacing-small {
  margin: ${unifiedDesignTokens.spacing.small};
}

@media (min-width: 744px) {
  .responsive-spacing-small {
    margin: ${unifiedDesignTokens.spacing.medium};
  }
}

@media (min-width: 1024px) {
  .responsive-spacing-small {
    margin: ${unifiedDesignTokens.spacing.large};
  }
}
`;

// 4. PAGE LAYOUT FOUNDATION
// ===================================================================

// foundation/PageLayout.tsx
import React from 'react';
import { unifiedDesignTokens } from '../UnifiedDesignSystem';

export const PageLayout: React.FC<{
  children: React.ReactNode;
  navigation?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'standard' | 'wide' | 'narrow';
}> = ({ 
  children, 
  navigation,
  sidebar,
  footer,
  variant = 'standard'
}) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    background: unifiedDesignTokens.gradients.backgroundPrimary,
    color: unifiedDesignTokens.colors.label,
  }}>
    {/* Navigation */}
    {navigation && (
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: unifiedDesignTokens.gradients.primaryGlass,
        backdropFilter: unifiedDesignTokens.depth.backdrop.thickMaterial,
        borderBottom: `${unifiedDesignTokens.lineWeights.thin} solid ${unifiedDesignTokens.colors.separator}`,
      }}>
        {navigation}
      </header>
    )}
    
    {/* Main content area */}
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      maxWidth: variant === 'wide' ? '1920px' : variant === 'narrow' ? '800px' : '1440px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Sidebar */}
      {sidebar && (
        <aside style={{
          width: '280px',
          flexShrink: 0,
          padding: unifiedDesignTokens.spacing.large,
          background: unifiedDesignTokens.gradients.secondaryGlass,
          borderRight: `${unifiedDesignTokens.lineWeights.thin} solid ${unifiedDesignTokens.colors.separator}`,
        }}>
          {sidebar}
        </aside>
      )}
      
      {/* Main content */}
      <main style={{
        flex: 1,
        padding: unifiedDesignTokens.spacing.large,
        minWidth: 0, // Allows flex shrinking
      }}>
        {children}
      </main>
    </div>
    
    {/* Footer */}
    {footer && (
      <footer style={{
        marginTop: 'auto',
        background: unifiedDesignTokens.gradients.tertiaryGlass,
        borderTop: `${unifiedDesignTokens.lineWeights.thin} solid ${unifiedDesignTokens.colors.separator}`,
        padding: `${unifiedDesignTokens.spacing.xlarge} 0`,
      }}>
        {footer}
      </footer>
    )}
  </div>
);

// 5. APPLE HIG NAVIGATION FOUNDATION
// ===================================================================

// foundation/Navigation.tsx
export const Navigation: React.FC<{
  title?: string;
  sections?: Array<{ id: string; label: string }>;
  actions?: React.ReactNode;
  isMobile?: boolean;
}> = ({ 
  title,
  sections = [],
  actions,
  isMobile = false 
}) => (
  <nav style={{
    padding: `${unifiedDesignTokens.spacing.medium} ${unifiedDesignTokens.spacing.large}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: unifiedDesignTokens.components.navigation.height,
  }}>
    {/* Title/Logo */}
    {title && (
      <h1 style={{
        ...unifiedDesignTokens.typography.headline,
        margin: 0,
        color: unifiedDesignTokens.colors.label,
      }}>
        {title}
      </h1>
    )}
    
    {/* Navigation sections - hide on mobile */}
    {!isMobile && sections.length > 0 && (
      <div style={{
        display: 'flex',
        gap: unifiedDesignTokens.spacing.medium,
      }}>
        {sections.map((section) => (
          <button
            key={section.id}
            style={{
              padding: `${unifiedDesignTokens.spacing.small} ${unifiedDesignTokens.spacing.medium}`,
              background: unifiedDesignTokens.gradients.primaryGlass,
              border: `${unifiedDesignTokens.lineWeights.thin} solid ${unifiedDesignTokens.colors.separator}`,
              borderRadius: unifiedDesignTokens.cornerRadius.medium,
              color: unifiedDesignTokens.colors.label,
              fontSize: unifiedDesignTokens.typography.subheadline.size,
              fontWeight: unifiedDesignTokens.typography.subheadline.weight,
              cursor: 'pointer',
              transition: `all ${unifiedDesignTokens.animation.duration.fast} ${unifiedDesignTokens.animation.easing.standard}`,
            }}
          >
            {section.label}
          </button>
        ))}
      </div>
    )}
    
    {/* Actions */}
    {actions && (
      <div style={{ display: 'flex', alignItems: 'center', gap: unifiedDesignTokens.spacing.small }}>
        {actions}
      </div>
    )}
  </nav>
);

// 6. INTEGRATION WITH FOUNDATION FILES
// ===================================================================

// foundation/index.ts
export { Container, Grid, Section } from './Layout';
export { PageLayout } from './PageLayout';
export { Navigation } from './Navigation';

// Add responsive tokens to unified system
export { responsiveTokens } from './responsive-tokens';

// CSS exports
export { responsiveCSS } from './responsive.css';

// 7. USAGE EXAMPLE IN YOUR FOUNDATION COMPONENT
// ===================================================================

// foundation/ProductPage.tsx
import React from 'react';
import { unifiedDesignTokens } from '../UnifiedDesignSystem';
import { Container, Grid, Section, PageLayout, Navigation } from './index';

export const ProductPageFoundation: React.FC<{
  product: any;
  navigation?: React.ReactNode;
}> = ({ product, navigation }) => (
  <PageLayout
    navigation={navigation}
    variant="standard"
  >
    {/* Hero Section */}
    <Section spacing="large" background="glass">
      <Container maxWidth="wide">
        <Grid columns={12} gap="large">
          <div style={{ gridColumn: 'span 6' }}>
            <h1 style={{
              ...unifiedDesignTokens.typography.largeTitle,
              color: unifiedDesignTokens.colors.label,
              marginBottom: unifiedDesignTokens.spacing.medium,
            }}>
              {product.title}
            </h1>
            <p style={{
              ...unifiedDesignTokens.typography.body,
              color: unifiedDesignTokens.colors.secondaryLabel,
            }}>
              {product.description}
            </p>
          </div>
          <div style={{ gridColumn: 'span 6' }}>
            {/* Product image */}
          </div>
        </Grid>
      </Container>
    </Section>
    
    {/* Content Section */}
    <Section spacing="medium">
      <Container>
        <Grid columns={8} gap="medium" breakpoint="tablet">
          {/* Your content here automatically uses unified tokens */}
        </Grid>
      </Container>
    </Section>
  </PageLayout>
);

// 8. MOBILE-FIRST RESPONSIVE HOOK
// ===================================================================

// hooks/useResponsive.ts
import { useState, useEffect } from 'react';
import { responsiveTokens } from '../UnifiedDesignSystem';

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<keyof typeof responsiveTokens.breakpoints>('mobile');
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= parseInt(responsiveTokens.breakpoints.wide)) {
        setBreakpoint('wide');
        setIsMobile(false);
      } else if (width >= parseInt(responsiveTokens.breakpoints.desktopLarge)) {
        setBreakpoint('desktopLarge');
        setIsMobile(false);
      } else if (width >= parseInt(responsiveTokens.breakpoints.desktop)) {
        setBreakpoint('desktop');
        setIsMobile(false);
      } else if (width >= parseInt(responsiveTokens.breakpoints.tablet)) {
        setBreakpoint('tablet');
        setIsMobile(false);
      } else {
        setBreakpoint('mobile');
        setIsMobile(true);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return { breakpoint, isMobile };
};

// ===================================================================
// INTEGRATION CHECKLIST
// ===================================================================

/*
✅ What Unified Tokens Provide:
- Colors (Apple HIG + your brand)
- Typography (Apple HIG scale)
- Spacing (8px grid)
- Corner radius
- Shadows & blur effects
- Animation timing

❌ What Unified Tokens DON'T Provide:
- Responsive breakpoints
- Layout patterns  
- Page structure
- Grid systems
- Container logic
- Navigation patterns

✅ What This Foundation System Adds:
- Responsive breakpoints & containers
- Grid system with Apple HIG proportions  
- Page layout patterns
- Navigation components
- Mobile-first responsive logic
- CSS integration layer

✅ Usage Pattern:
1. Import unified tokens for styling
2. Import foundation components for layout
3. Use responsive hook for breakpoint logic
4. Apply CSS classes for responsive behavior

// Example:
import { unifiedDesignTokens } from './UnifiedDesignSystem';
import { Container, Grid, PageLayout } from './foundation';
import { useResponsive } from './hooks/useResponsive';

const MyPage = () => {
  const { isMobile } = useResponsive();
  
  return (
    <PageLayout>
      <Container>
        <Grid columns={isMobile ? 4 : 12}>
          <div style={{
            color: unifiedDesignTokens.colors.label,
            padding: unifiedDesignTokens.spacing.large,
          }}>
            Content using unified tokens + responsive layout
          </div>
        </Grid>
      </Container>
    </PageLayout>
  );
};
*/