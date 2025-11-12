import React, { createContext, useContext, useCallback } from 'react';

// 🎨 SIMPLIFIED DESIGN TOKEN SYSTEM
// One source of truth for all styling

// 1. CORE TOKEN DEFINITIONS
const coreTokens = {
  // Color Palette (reduced to essentials)
  colors: {
    // Base colors
    background: '#000000',
    surface: '#1A1A1A',
    card: '#2A2A2A',
    
    // Text hierarchy
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textTertiary: '#666666',
    
    // Interactive colors
    primary: '#4FC3F7',
    secondary: '#AB47BC',
    accent: '#EC407A',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    
    // Glass effects
    glass: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    glassHover: 'rgba(255, 255, 255, 0.15)',
  },

  // Spacing Scale (8px base)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Typography Scale
  typography: {
    h1: { size: '48px', weight: '800', lineHeight: '1.2' },
    h2: { size: '36px', weight: '700', lineHeight: '1.3' },
    h3: { size: '24px', weight: '600', lineHeight: '1.4' },
    body: { size: '16px', weight: '400', lineHeight: '1.6' },
    small: { size: '14px', weight: '400', lineHeight: '1.5' },
    caption: { size: '12px', weight: '500', lineHeight: '1.4' },
  },

  // Border Radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 16px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.3)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },

  // Animation Duration
  animation: {
    fast: '0.15s',
    medium: '0.3s',
    slow: '0.5s',
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
};

// 2. COMPUTED STYLES (generated from core tokens)
const computedStyles = {
  // Pre-built component styles
  button: {
    primary: {
      background: `linear-gradient(135deg, ${coreTokens.colors.primary}, #29B6F6)`,
      color: coreTokens.colors.text,
      padding: `${coreTokens.spacing.md} ${coreTokens.spacing.lg}`,
      borderRadius: coreTokens.radius.md,
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: coreTokens.shadows.md,
      transition: `all ${coreTokens.animation.medium} ${coreTokens.animation.easing}`,
    },
    secondary: {
      background: coreTokens.colors.glass,
      color: coreTokens.colors.text,
      padding: `${coreTokens.spacing.md} ${coreTokens.spacing.lg}`,
      borderRadius: coreTokens.radius.md,
      border: `1px solid ${coreTokens.colors.glassBorder}`,
      fontWeight: '600',
      cursor: 'pointer',
      backdropFilter: 'blur(20px)',
      transition: `all ${coreTokens.animation.medium} ${coreTokens.animation.easing}`,
    },
  },

  card: {
    default: {
      background: coreTokens.colors.glass,
      borderRadius: coreTokens.radius.lg,
      padding: coreTokens.spacing.lg,
      border: `1px solid ${coreTokens.colors.glassBorder}`,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: coreTokens.shadows.glass,
    },
    elevated: {
      background: coreTokens.colors.surface,
      borderRadius: coreTokens.radius.lg,
      padding: coreTokens.spacing.xl,
      boxShadow: coreTokens.shadows.lg,
    },
  },

  layout: {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${coreTokens.spacing.lg}`,
    },
    grid: {
      display: 'grid',
      gap: coreTokens.spacing.lg,
    },
    flex: {
      display: 'flex',
      gap: coreTokens.spacing.md,
    },
  },
};

// 3. DESIGN SYSTEM CONTEXT
const DesignSystemContext = createContext(null);

// 4. DESIGN SYSTEM PROVIDER
export const DesignSystemProvider = ({ children, customTokens = {} }) => {
  // Merge custom tokens with core tokens
  const tokens = {
    ...coreTokens,
    ...customTokens,
    colors: { ...coreTokens.colors, ...customTokens.colors },
  };

  const designSystem = {
    tokens,
    styles: computedStyles,
    // Utility functions
    utils: {
      // Get responsive spacing
      space: (size) => tokens.spacing[size] || size,
      
      // Get color with opacity
      color: (colorKey, opacity = 1) => {
        const color = tokens.colors[colorKey];
        if (opacity < 1 && color.startsWith('#')) {
          const hex = color.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
      },
      
      // Get glass effect
      glass: (opacity = 0.1) => ({
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid rgba(255, 255, 255, ${opacity * 2})`,
      }),
      
      // Get gradient
      gradient: (color1, color2) => 
        `linear-gradient(135deg, ${color1}, ${color2})`,
    },
  };

  return (
    <DesignSystemContext.Provider value={designSystem}>
      {children}
    </DesignSystemContext.Provider>
  );
};

// 5. DESIGN SYSTEM HOOK
export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within DesignSystemProvider');
  }
  return context;
};

// 6. PRE-BUILT COMPONENTS
export const Button = ({ 
  variant = 'primary', 
  children, 
  onClick, 
  disabled,
  style = {},
  ...props 
}) => {
  const { styles } = useDesignSystem();
  
  const buttonStyle = {
    ...styles.button[variant],
    ...style,
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = styles.button[variant].boxShadow.replace('0.2', '0.4');
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = styles.button[variant].boxShadow;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ 
  variant = 'default', 
  children, 
  style = {},
  ...props 
}) => {
  const { styles } = useDesignSystem();
  
  return (
    <div 
      style={{ ...styles.card[variant], ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Container = ({ children, style = {}, ...props }) => {
  const { styles } = useDesignSystem();
  
  return (
    <div 
      style={{ ...styles.layout.container, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Grid = ({ 
  columns = 'repeat(auto-fit, minmax(300px, 1fr))', 
  children, 
  style = {},
  ...props 
}) => {
  const { styles } = useDesignSystem();
  
  return (
    <div 
      style={{ 
        ...styles.layout.grid, 
        gridTemplateColumns: columns,
        ...style 
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Flex = ({ 
  direction = 'row', 
  align = 'center', 
  justify = 'flex-start',
  children, 
  style = {},
  ...props 
}) => {
  const { styles } = useDesignSystem();
  
  return (
    <div 
      style={{ 
        ...styles.layout.flex,
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        ...style 
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// 7. MODULAR UI COMPONENTS

// Navigation Component
export const Navigation = ({ items = [], activeItem, onItemClick }) => {
  const { tokens, utils } = useDesignSystem();
  
  return (
    <nav style={{
      display: 'flex',
      gap: tokens.spacing.md,
      padding: tokens.spacing.md,
      ...utils.glass(0.1),
      borderRadius: tokens.radius.lg,
    }}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemClick?.(item)}
          style={{
            background: activeItem === item.id 
              ? utils.gradient(tokens.colors.primary, tokens.colors.secondary)
              : 'transparent',
            border: 'none',
            borderRadius: tokens.radius.md,
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            color: tokens.colors.text,
            fontWeight: activeItem === item.id ? '600' : '400',
            cursor: 'pointer',
            transition: `all ${tokens.animation.medium}`,
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

// Carousel Component
export const Carousel = ({ items = [], renderItem }) => {
  const { tokens } = useDesignSystem();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: tokens.radius.lg,
    }}>
      <div style={{
        display: 'flex',
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: `transform ${tokens.animation.medium} ${tokens.animation.easing}`,
      }}>
        {items.map((item, index) => (
          <div key={index} style={{ minWidth: '100%' }}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {items.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: tokens.spacing.md,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: tokens.spacing.sm,
        }}>
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: currentIndex === index 
                  ? tokens.colors.primary 
                  : tokens.colors.glass,
                cursor: 'pointer',
                transition: `all ${tokens.animation.fast}`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Filter Component
export const Filter = ({ 
  categories = [], 
  activeCategory, 
  onCategoryChange,
  searchValue,
  onSearchChange 
}) => {
  const { tokens, utils } = useDesignSystem();
  
  return (
    <div style={{
      ...utils.glass(0.1),
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
    }}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        style={{
          width: '100%',
          background: utils.glass(0.05).background,
          border: `1px solid ${tokens.colors.glassBorder}`,
          borderRadius: tokens.radius.md,
          padding: tokens.spacing.md,
          color: tokens.colors.text,
          fontSize: tokens.typography.body.size,
          marginBottom: tokens.spacing.md,
        }}
      />
      
      {/* Categories */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: tokens.spacing.sm,
      }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange?.(category.id)}
            style={{
              background: activeCategory === category.id
                ? utils.gradient(tokens.colors.primary, tokens.colors.secondary)
                : utils.glass(0.05).background,
              border: `1px solid ${
                activeCategory === category.id 
                  ? tokens.colors.primary 
                  : tokens.colors.glassBorder
              }`,
              borderRadius: tokens.radius.md,
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              color: tokens.colors.text,
              fontWeight: activeCategory === category.id ? '600' : '400',
              cursor: 'pointer',
              transition: `all ${tokens.animation.medium}`,
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// 8. DEMO COMPONENT
const DesignSystemDemo = () => {
  const [activeNav, setActiveNav] = React.useState('home');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [searchValue, setSearchValue] = React.useState('');
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
  ];
  
  const filterCategories = [
    { id: 'all', label: 'All' },
    { id: 'games', label: 'Games' },
    { id: 'accessories', label: 'Accessories' },
  ];
  
  const carouselItems = [
    { title: 'Game 1', image: '🎮' },
    { title: 'Game 2', image: '🎯' },
    { title: 'Game 3', image: '🎲' },
  ];
  
  return (
    <DesignSystemProvider>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
        padding: '20px',
      }}>
        <Container>
          <h1 style={{ color: '#FFFFFF', marginBottom: '40px' }}>
            Simplified Design System Demo
          </h1>
          
          {/* Navigation */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#B3B3B3', marginBottom: '20px' }}>Navigation</h2>
            <Navigation 
              items={navItems}
              activeItem={activeNav}
              onItemClick={(item) => setActiveNav(item.id)}
            />
          </div>
          
          {/* Buttons */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#B3B3B3', marginBottom: '20px' }}>Buttons</h2>
            <Flex>
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button disabled>Disabled Button</Button>
            </Flex>
          </div>
          
          {/* Cards */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#B3B3B3', marginBottom: '20px' }}>Cards</h2>
            <Grid columns="repeat(auto-fit, minmax(250px, 1fr))">
              <Card>
                <h3 style={{ color: '#FFFFFF', margin: '0 0 10px' }}>Glass Card</h3>
                <p style={{ color: '#B3B3B3', margin: 0 }}>
                  This is a glassmorphic card with backdrop blur.
                </p>
              </Card>
              <Card variant="elevated">
                <h3 style={{ color: '#FFFFFF', margin: '0 0 10px' }}>Elevated Card</h3>
                <p style={{ color: '#B3B3B3', margin: 0 }}>
                  This is an elevated card with shadow.
                </p>
              </Card>
            </Grid>
          </div>
          
          {/* Filter */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#B3B3B3', marginBottom: '20px' }}>Filter</h2>
            <Filter
              categories={filterCategories}
              activeCategory={activeFilter}
              onCategoryChange={setActiveFilter}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>
          
          {/* Carousel */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#B3B3B3', marginBottom: '20px' }}>Carousel</h2>
            <Carousel
              items={carouselItems}
              renderItem={(item) => (
                <Card style={{ textAlign: 'center', minHeight: '200px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                    {item.image}
                  </div>
                  <h3 style={{ color: '#FFFFFF', margin: 0 }}>
                    {item.title}
                  </h3>
                </Card>
              )}
            />
          </div>
        </Container>
      </div>
    </DesignSystemProvider>
  );
};

export default DesignSystemDemo;