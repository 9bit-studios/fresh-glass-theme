/**
 * Quantum-Spatial Design Tokens
 * Extracted from PetersenGamesSideMenu component
 * 
 * Enhanced quantum-spatial design tokens with refined color blending
 * and comprehensive gaming-focused styling system.
 */

export const quantumSpatialTokens = {
  colors: {
    // Softer, more refined base colors
    primary: '#0A0D1C',      // Softer dark base
    secondary: '#1A2332',     // Warmer secondary
    tertiary: '#2A334A',      // Gentler tertiary
    quaternary: '#3A4562',    // Additional depth layer
    
    // Refined accent palette with better blending
    accent: '#4FC3F7',        // Softer cyan
    accentSecondary: '#AB47BC', // Refined purple
    accentTertiary: '#EC407A',  // Softer rose
    accentSuccess: '#66BB6A',   // Gentle green
    accentWarning: '#FFA726',   // Warm orange
    
    // Text with better contrast ratios
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textTertiary: 'rgba(255, 255, 255, 0.65)',
    textQuaternary: 'rgba(255, 255, 255, 0.45)',
    
    // Glassy surface colors
    glassLight: 'rgba(255, 255, 255, 0.12)',
    glassMedium: 'rgba(255, 255, 255, 0.08)',
    glassDark: 'rgba(255, 255, 255, 0.04)',
  },
  
  gradients: {
    // Enhanced glassmorphic gradients
    glassCard: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    glassButton: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
    glassActive: 'linear-gradient(135deg, rgba(79, 195, 247, 0.2) 0%, rgba(171, 71, 188, 0.15) 100%)',
    
    // Refined color blending
    primaryBlend: 'linear-gradient(135deg, #0A0D1C 0%, #1A2332 50%, #2A334A 100%)',
    accentBlend: 'linear-gradient(135deg, #4FC3F7 0%, #AB47BC 50%, #EC407A 100%)',
    surfaceBlend: 'linear-gradient(135deg, rgba(26, 35, 50, 0.8) 0%, rgba(42, 51, 74, 0.6) 100%)',
  },
  
  shadows: {
    // Enhanced shadow system for depth
    glassSubtle: '0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    glassMedium: '0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    glassProminent: '0 16px 48px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    quantumGlow: '0 0 24px rgba(79, 195, 247, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '50%',
  },
  
  blur: {
    subtle: '8px',
    medium: '16px',
    strong: '24px',
    extreme: '32px',
  },
  
  animation: {
    fast: '200ms',
    medium: '300ms',
    slow: '500ms',
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
};

export type QuantumSpatialTokens = typeof quantumSpatialTokens;