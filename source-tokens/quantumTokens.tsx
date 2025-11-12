import React, { createContext, useContext, useCallback } from 'react';
// 
// Enhanced Design Tokens with Apple Navigation Integration
//  // Quantum tokens 
const quantumTokens = {
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6', 
    accent: '#EC4899',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textTertiary: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    glass: 'rgba(255, 255, 255, 0.05)',
  },
  spacing: {
    xs: '4px',
    sm: '8px', 
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
};
