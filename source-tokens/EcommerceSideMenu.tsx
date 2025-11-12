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

// Ecommerce-Specific Icons
const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 3v6h8V3h-8zM3 3v6h8V3H3zm10 8v6h8v-6h-8zM3 11v6h8v-6H3z"/>
  </svg>
);

const OrdersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 14l-5-5 1.5-1.5L9 11l7-7L17.5 5.5 9 14z"/>
    <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9"/>
  </svg>
);

const ProductsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16v2H4V4zm0 4h16v12H4V8zm2 2v8h12v-8H6z"/>
    <path d="M8 12h2v2H8v-2zm4 0h2v2h-2v-2z"/>
  </svg>
);

const CustomersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);

const AnalyticsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3v18h18M9 17V9l4 4 4-4v8"/>
  </svg>
);

const InventoryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 4h14l-1 7H6L5 4zM5 4L4 2H2v2h2l3 7h9l3-7H5z"/>
    <circle cx="9" cy="20" r="1"/>
    <circle cx="20" cy="20" r="1"/>
  </svg>
);

const PromotionsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16a6.5 6.5 0 010-13zm0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
    <path d="M12 10h-2.5l2.5-3.5L14.5 10H12z"/>
  </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// Ecommerce Menu Configuration
interface EcommerceMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  isActive?: boolean;
  badge?: string | number;
  category: 'overview' | 'commerce' | 'customers' | 'marketing' | 'settings';
}

const ecommerceMenuSections = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: DashboardIcon, 
        category: 'overview' as const,
        isActive: true 
      },
      { 
        id: 'analytics', 
        label: 'Analytics', 
        icon: AnalyticsIcon, 
        category: 'overview' as const 
      },
    ]
  },
  {
    id: 'commerce',
    label: 'Commerce',
    items: [
      { 
        id: 'orders', 
        label: 'Orders', 
        icon: OrdersIcon, 
        category: 'commerce' as const,
        badge: 12 
      },
      { 
        id: 'products', 
        label: 'Products', 
        icon: ProductsIcon, 
        category: 'commerce' as const,
        badge: 156 
      },
      { 
        id: 'inventory', 
        label: 'Inventory', 
        icon: InventoryIcon, 
        category: 'commerce' as const 
      },
    ]
  },
  {
    id: 'customers',
    label: 'Customers',
    items: [
      { 
        id: 'customers', 
        label: 'All Customers', 
        icon: CustomersIcon, 
        category: 'customers' as const,
        badge: '2.8k' 
      },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      { 
        id: 'promotions', 
        label: 'Promotions', 
        icon: PromotionsIcon, 
        category: 'marketing' as const,
        badge: 3 
      },
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [
      { 
        id: 'settings', 
        label: 'Store Settings', 
        icon: SettingsIcon, 
        category: 'settings' as const 
      },
    ]
  }
];

// Apple HIG Compliant Menu Item Component
interface LiquidGlassMenuItemProps {
  item: EcommerceMenuItem;
  isActive?: boolean;
  onClick?: (item: EcommerceMenuItem) => void;
  collapsed?: boolean;
  isMobile?: boolean;
}

const LiquidGlassMenuItem: React.FC<LiquidGlassMenuItemProps> = ({ 
  item, 
  isActive = false, 
  onClick,
  collapsed = false,
  isMobile = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onClick?.(item);
  }, [onClick, item]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'overview': return liquidGlassTokens.colors.systemBlue;
      case 'commerce': return liquidGlassTokens.colors.systemGreen;
      case 'customers': return liquidGlassTokens.colors.systemPurple;
      case 'marketing': return liquidGlassTokens.colors.systemOrange;
      case 'settings': return liquidGlassTokens.colors.systemTeal;
      default: return liquidGlassTokens.colors.systemBlue;
    }
  };

  const categoryColor = getCategoryColor(item.category);

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: parseFloat(liquidGlassTokens.animation.duration.short),
        ease: [0.4, 0.0, 0.2, 1] // Convert cubic-bezier to Framer Motion format
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: collapsed ? liquidGlassTokens.spacing.small : `${liquidGlassTokens.spacing.small} ${liquidGlassTokens.spacing.medium}`,
        borderRadius: liquidGlassTokens.cornerRadius.medium,
        border: 'none',
        cursor: 'pointer',
        minHeight: isMobile ? '44px' : '32px',
        position: 'relative',
        userSelect: 'none',
        marginBottom: liquidGlassTokens.spacing.tiny,
        background: isActive 
          ? liquidGlassTokens.colors.systemFill
          : isHovered 
            ? liquidGlassTokens.colors.secondarySystemFill
            : 'transparent',
        color: isActive ? categoryColor : liquidGlassTokens.colors.secondaryLabel,
        transition: `all ${liquidGlassTokens.animation.duration.short} ${liquidGlassTokens.animation.easing.standard}`,
      }}
      role="button"
      tabIndex={0}
      aria-label={item.label}
    >
      {/* Icon Container */}
      <div style={{
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: collapsed ? 0 : liquidGlassTokens.spacing.small,
        flexShrink: 0,
        color: isActive ? categoryColor : liquidGlassTokens.colors.tertiaryLabel,
        transition: `color ${liquidGlassTokens.animation.duration.short} ${liquidGlassTokens.animation.easing.standard}`,
      }}>
        <item.icon />
      </div>

      {/* Text Label */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}
          >
            <span style={{
              fontSize: liquidGlassTokens.typography.body.size,
              fontWeight: isActive ? '600' : '400',
              lineHeight: liquidGlassTokens.typography.body.lineHeight,
              color: 'inherit',
            }}>
              {item.label}
            </span>

            {/* Badge */}
            {item.badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  backgroundColor: categoryColor,
                  color: 'white',
                  borderRadius: liquidGlassTokens.cornerRadius.continuous,
                  padding: `${liquidGlassTokens.spacing.micro} ${liquidGlassTokens.spacing.small}`,
                  fontSize: liquidGlassTokens.typography.caption1.size,
                  fontWeight: '600',
                  minWidth: '16px',
                  textAlign: 'center',
                  lineHeight: '1',
                }}
              >
                {typeof item.badge === 'number' && item.badge > 999 
                  ? `${Math.floor(item.badge / 1000)}k` 
                  : item.badge}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Indicator */}
      {isActive && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: '3px',
          height: '16px',
          backgroundColor: categoryColor,
          borderRadius: '0 2px 2px 0',
          transform: 'translateY(-50%)',
        }} />
      )}
    </motion.button>
  );
};

// Section Header Component
const SectionHeader: React.FC<{ label: string; collapsed: boolean }> = ({ label, collapsed }) => (
  <AnimatePresence>
    {!collapsed && (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        style={{
          fontSize: liquidGlassTokens.typography.caption1.size,
          fontWeight: '600',
          color: liquidGlassTokens.colors.tertiaryLabel,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: `${liquidGlassTokens.spacing.large} 0 ${liquidGlassTokens.spacing.small}`,
          paddingLeft: liquidGlassTokens.spacing.small,
        }}
      >
        {label}
      </motion.div>
    )}
  </AnimatePresence>
);

// Main Ecommerce Side Menu Component
interface EcommerceSideMenuProps {
  activeItem?: string;
  onItemClick?: (item: EcommerceMenuItem) => void;
  collapsed?: boolean;
  isMobile?: boolean;
  className?: string;
}

const EcommerceSideMenu: React.FC<EcommerceSideMenuProps> = ({
  activeItem,
  onItemClick,
  collapsed = false,
  isMobile = false,
  className = '',
}) => {
  const containerVariants: any = {
    expanded: {
      width: isMobile ? '100%' : 240,
      transition: {
        duration: parseFloat(liquidGlassTokens.animation.duration.medium),
        ease: [0.4, 0.0, 0.2, 1], // Convert cubic-bezier to Framer Motion format
      }
    },
    collapsed: {
      width: isMobile ? '56px' : 64,
      transition: {
        duration: parseFloat(liquidGlassTokens.animation.duration.medium),
        ease: [0.4, 0.0, 0.2, 1], // Convert cubic-bezier to Framer Motion format
      }
    }
  };

  return (
    <motion.nav
      className={className}
      variants={containerVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      style={{
        height: isMobile ? 'auto' : '100vh',
        backgroundColor: liquidGlassTokens.colors.secondary,
        borderRight: isMobile ? 'none' : `0.5px solid ${liquidGlassTokens.colors.separator}`,
        borderBottom: isMobile ? `0.5px solid ${liquidGlassTokens.colors.separator}` : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        backdropFilter: `blur(${liquidGlassTokens.effects.backgroundBlur})`,
        WebkitBackdropFilter: `blur(${liquidGlassTokens.effects.backgroundBlur})`,
      }}
      role="navigation"
      aria-label="Store Navigation"
    >
      {/* Logo/Brand Area */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              padding: liquidGlassTokens.spacing.medium,
              borderBottom: `0.5px solid ${liquidGlassTokens.colors.separator}`,
              marginBottom: liquidGlassTokens.spacing.small,
            }}
          >
            <h2 style={{
              color: liquidGlassTokens.colors.label,
              fontSize: liquidGlassTokens.typography.headline.size,
              fontWeight: liquidGlassTokens.typography.headline.weight,
              lineHeight: liquidGlassTokens.typography.headline.lineHeight,
              margin: 0,
            }}>
              Store Dashboard
            </h2>
            <p style={{
              color: liquidGlassTokens.colors.tertiaryLabel,
              fontSize: liquidGlassTokens.typography.footnote.size,
              lineHeight: liquidGlassTokens.typography.footnote.lineHeight,
              margin: `${liquidGlassTokens.spacing.micro} 0 0`,
            }}>
              Commerce Management
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Content */}
      <div style={{
        padding: collapsed ? liquidGlassTokens.spacing.small : liquidGlassTokens.spacing.medium,
        flex: 1,
        overflow: 'auto',
      }}>
        {ecommerceMenuSections.map((section) => (
          <div key={section.id}>
            {section.label && section.items.length > 0 && (
              <SectionHeader label={section.label} collapsed={collapsed} />
            )}
            
            {section.items.map((item) => (
              <LiquidGlassMenuItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={onItemClick}
                collapsed={collapsed}
                isMobile={isMobile}
              />
            ))}
          </div>
        ))}
      </div>
    </motion.nav>
  );
};

export default EcommerceSideMenu;
export type { EcommerceMenuItem, EcommerceSideMenuProps };
export { ecommerceMenuSections, liquidGlassTokens };