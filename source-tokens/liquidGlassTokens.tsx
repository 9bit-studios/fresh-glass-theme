import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Apple HIG and Liquid Glass Compliant Design Tokens
const liquidGlassTokens = {
  colors: {
    // Apple-inspired color palette with proper contrast ratios
    primary: '#000000',           // True black for maximum contrast
    secondary: '#1C1C1E',         // Apple's secondary background
    tertiary: '#2C2C2E',          // Apple's tertiary background
    quaternary: '#3A3A3C',        // Apple's quaternary background
    
    // System colors following Apple HIG
    systemBlue: '#007AFF',        // Apple's system blue
    systemGreen: '#34C759',       // Apple's system green
    systemOrange: '#FF9500',      // Apple's system orange
    systemRed: '#FF3B30',         // Apple's system red
    systemPurple: '#AF52DE',      // Apple's system purple
    systemTeal: '#5AC8FA',        // Apple's system teal
    
    // Text hierarchy with proper contrast
    label: '#FFFFFF',             // Primary label
    secondaryLabel: 'rgba(255, 255, 255, 0.6)',  // Secondary label
    tertiaryLabel: 'rgba(255, 255, 255, 0.3)',   // Tertiary label
    quaternaryLabel: 'rgba(255, 255, 255, 0.18)', // Quaternary label
    
    // Fills with Apple's opacity system
    systemFill: 'rgba(120, 120, 128, 0.2)',      // Primary fill
    secondarySystemFill: 'rgba(120, 120, 128, 0.16)', // Secondary fill
    tertiarySystemFill: 'rgba(120, 120, 128, 0.12)',  // Tertiary fill
    quaternarySystemFill: 'rgba(120, 120, 128, 0.08)', // Quaternary fill
    
    // Separator colors
    separator: 'rgba(84, 84, 88, 0.6)',
    opaqueSeparator: '#38383A',
  },
  
  // Apple's spacing system based on 8pt grid
  spacing: {
    micro: '2px',    // 0.25x
    tiny: '4px',     // 0.5x
    small: '8px',    // 1x base unit
    medium: '16px',  // 2x
    large: '24px',   // 3x
    xlarge: '32px',  // 4x
    xxlarge: '48px', // 6x
    huge: '64px',    // 8x
  },
  
  // Apple's corner radius system
  cornerRadius: {
    small: '6px',    // Small elements
    medium: '10px',  // Medium elements
    large: '14px',   // Large elements
    xlarge: '20px',  // Extra large elements
    continuous: '50%', // Continuous corners
  },
  
  // Apple's typography system
  typography: {
    largeTitle: { size: '34px', weight: '400', lineHeight: '41px' },
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
  },
  
  // Apple's animation values
  animation: {
    duration: {
      short: '0.2s',
      medium: '0.35s',
      long: '0.5s',
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      decelerated: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      accelerated: 'cubic-bezier(0.4, 0.0, 1, 1)',
    }
  },
  
  // Liquid Glass specific effects
  effects: {
    blur: '20px',
    backgroundBlur: '40px',
    thinMaterialBlur: '8px',
    thickMaterialBlur: '30px',
  }
};


export { liquidGlassTokens };