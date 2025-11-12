// Generate CSS from your TypeScript definitions
// Run this to create foundation.css from your types

interface SpacingTokens {
  base: 8;
  micro: 2;
  tiny: 4;
  xs: 8;
  sm: 16;
  md: 24;
  lg: 32;
  xl: 40;
  xxl: 48;
  touchTarget: 44;
  touchTargetLarge: 56;
}

interface ColorTokens {
  background: {
    primary: '#000000';
    secondary: '#0D0D15';
    tertiary: '#0A0A0F';
  };
  foreground: {
    primary: '#FFFFFF';
    secondary: 'rgba(252, 253, 242, 0.85)';
    tertiary: 'rgba(252, 253, 242, 0.7)';
  };
  accent: {
    primary: '#007AFF';
    secondary: '#504CF5';
    success: '#3DFF74';
  };
  glass: {
    background: 'rgba(10, 6, 33, 0.4)';
    border: 'rgba(90, 200, 250, 0.3)';
    hover: 'rgba(255, 255, 255, 0.1)';
  };
}

// Generator function
function generateCSSFromTypes(): string {
  const spacing: SpacingTokens = {
    base: 8,
    micro: 2,
    tiny: 4,
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
    touchTarget: 44,
    touchTargetLarge: 56
  };

  const colors: ColorTokens = {
    background: {
      primary: '#000000',
      secondary: '#0D0D15',
      tertiary: '#0A0A0F'
    },
    foreground: {
      primary: '#FFFFFF',
      secondary: 'rgba(252, 253, 242, 0.85)',
      tertiary: 'rgba(252, 253, 242, 0.7)'
    },
    accent: {
      primary: '#007AFF',
      secondary: '#504CF5',
      success: '#3DFF74'
    },
    glass: {
      background: 'rgba(10, 6, 33, 0.4)',
      border: 'rgba(90, 200, 250, 0.3)',
      hover: 'rgba(255, 255, 255, 0.1)'
    }
  };

  let css = ':root {';
  
  // Generate spacing variables
  Object.entries(spacing).forEach(([key, value]) => {
    css += `  --foundation-${key}: ${value}px;`;
  });
  
  // Generate color variables
  function flattenColors(obj: any, prefix: string = ''): void {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        flattenColors(value, `${prefix}${key}-`);
      } else {
        css += `  --foundation-${prefix}${key}: ${value};`;
      }
    });
  }
  
  flattenColors(colors);
  
  css += '}';
  
  // Generate utility classes
  css += '/* Touch Target Enforcement (Apple HIG) */';
  css += 'button, .button, [role="button"] {';
  css += '  min-height: var(--foundation-touchTarget);';
  css += '  min-width: var(--foundation-touchTarget);';
  css += '}';
  
  css += '@media (max-width: 744px) {';
  css += '  button, .button, [role="button"] {';
  css += '    min-height: var(--foundation-touchTargetLarge);';
  css += '    min-width: var(--foundation-touchTargetLarge);';
  css += '  }';
  css += '}';
  
  // Generate glass effects
  css += '/* Glass Effects */';
  css += '.glass-effect {';
  css += '  background: var(--foundation-glass-background);';
  css += '  border: 1px solid var(--foundation-glass-border);';
  css += '  backdrop-filter: blur(16px) saturate(150%);';
  css += '  transition: background 0.2s ease;';
  css += '}';
  
  css += '.glass-effect:hover {';
  css += '  background: var(--foundation-glass-hover);';
  css += '}';
  
  return css;
}

// Generate the CSS
console.log(generateCSSFromTypes());

// Copy this output directly to your QuantumFoundation.css