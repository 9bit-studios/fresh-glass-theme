/**
 * Enhanced Gaming Design Tokens
 * Extracted from EnhancedStatCard component
 * 
 * Design tokens optimized for gaming dashboards and stat displays
 * with rich gradients and glassmorphic effects.
 */

export const enhancedGamingTokens = {
  colors: {
    primary: '#0A0D1C',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textTertiary: 'rgba(255, 255, 255, 0.65)',
    textQuaternary: 'rgba(255, 255, 255, 0.45)',
    accentSuccess: '#66BB6A',
    accentTertiary: '#EC407A',
  },
  gradients: {
    glassCard: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(10, 10, 15, 0.7) 100%)',
  },
  shadows: {
    glassSubtle: '0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05)',
    glassMedium: '0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 2px 0 rgba(255, 255, 255, 0.08)',
  },
  spacing: {
    sm: '8px',
    xl: '20px',
  },
  radius: {
    lg: '16px',
    md: '12px',
  },
  blur: {
    medium: '16px',
    subtle: '8px',
  },
  animation: {
    fast: '200ms',
    medium: '300ms',
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  }
};

export type EnhancedGamingTokens = typeof enhancedGamingTokens;