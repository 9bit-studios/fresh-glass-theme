import React, { createContext, useContext, useCallback } from 'react';
// 
// Enhanced Design Tokens with Apple Navigation Integration
const enhancedDesignTokens = {
  colors: {
    // Softer, more sophisticated base colors
    primary: '#0A0D1C',
    secondary: '#1A2332',
    tertiary: '#2A334A',
    quaternary: '#3A4562',
    
    // Refined accent palette with better harmony
    accent: '#4FC3F7',        // Softer cyan
    accentSecondary: '#AB47BC', // Refined purple
    accentTertiary: '#EC407A',  // Softer rose
    accentSuccess: '#66BB6A',   // Gentle green
    accentWarning: '#FFA726',   // Warm orange
    accentInfo: '#42A5F5',      // Information blue
    
    // Enhanced text hierarchy
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textTertiary: 'rgba(255, 255, 255, 0.65)',
    textQuaternary: 'rgba(255, 255, 255, 0.45)',
    
    // Glassmorphic surface layers
    glassLight: 'rgba(255, 255, 255, 0.12)',
    glassMedium: 'rgba(255, 255, 255, 0.08)',
    glassDark: 'rgba(255, 255, 255, 0.04)',
    glassUltra: 'rgba(255, 255, 255, 0.02)',
  },
  
  gradients: {
    // Enhanced background gradients with deeper blending
    background: 'linear-gradient(135deg, #000000 0%, #0A0A0F 25%, #0F0F14 50%, #0A0A0F 75%, #000000 100%)',
    backgroundTexture: 'radial-gradient(circle at 20% 80%, rgba(79, 195, 247, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(171, 71, 188, 0.03) 0%, transparent 50%)',
    
    // Refined glassmorphic effects
    glassCard: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(10, 10, 15, 0.7) 100%)',
    glassCardHover: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(10, 10, 15, 0.75) 100%)',
    glassButton: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(10, 10, 15, 0.6) 100%)',
    glassActive: 'linear-gradient(135deg, rgba(45, 27, 105, 0.4) 0%, rgba(76, 29, 149, 0.3) 100%)',
    
    // Sophisticated accent blending
    accentPrimary: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
    accentSecondary: 'linear-gradient(135deg, #AB47BC 0%, #8E24AA 100%)',
    accentTertiary: 'linear-gradient(135deg, #EC407A 0%, #E91E63 100%)',
    accentSuccess: 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)',
    accentWarning: 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)',
    
    // Multi-layer surface gradients
    surfacePrimary: 'linear-gradient(135deg, rgba(26, 35, 50, 0.9) 0%, rgba(42, 51, 74, 0.7) 50%, rgba(26, 35, 50, 0.9) 100%)',
    surfaceSecondary: 'linear-gradient(135deg, rgba(42, 51, 74, 0.8) 0%, rgba(58, 69, 98, 0.6) 100%)',
  },
  
  shadows: {
    // Enhanced shadow system with multiple layers
    glassSubtle: '0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05)',
    glassMedium: '0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 2px 0 rgba(255, 255, 255, 0.08)',
    glassProminent: '0 16px 48px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 0 rgba(255, 255, 255, 0.1)',
    quantumGlow: '0 0 32px rgba(79, 195, 247, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    cardElevated: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
    xxxxl: '40px',
  },
  
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    full: '50%',
  },
  
  blur: {
    subtle: '8px',
    medium: '16px',
    strong: '24px',
    extreme: '32px',
    ultra: '40px',
  },
  
  animation: {
    fast: '200ms',
    medium: '300ms',
    slow: '500ms',
    slower: '700ms',
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  }
};
