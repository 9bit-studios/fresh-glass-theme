/**
 * Unified Type Definitions for Petersen Games Fresh Glass Theme
 * Priority Order: Apple Intelligence → Foundation → Glass → Shopify
 * 
 * This file consolidates all type definitions with proper priority chain
 */

// Apple Intelligence (PRIMARY AUTHORITY)
// Using the more comprehensive apple-intelligence.d.ts
export * from './apple-intelligence';

// Foundation CSS System (Critical for Variable Translation)
export * from './foundation';

// Glass Filter System (UI Effects)
export * from './glass-filter';

// Shopify Integration Types
export * from './shopify';

// Dawn Theme Settings (Optional)
// Uncomment if needed for theme configuration
// export * from './dawn-settings';

// Import Oksana Foundation Model types with correct paths
export type {
  ServiceConfig,
  ServiceStatus,
  ServiceValidationResult
} from '../../../Oksana/types/services';

export type {
  SecureEnvironmentConfig,
  SecureEnvironmentVariable
} from '../../../Oksana/types/secure-environment';

export type {
  DesignToken,
  TokenCollection,
  TokenCategory
} from '../../../Oksana/types/tokens';

// Re-export the generated Apple Intelligence enhanced types
// Note: apple-intelligence.d.ts is more comprehensive and should be primary
import type { AppleIntelligenceConfig as GeneratedConfig } from './apple-intelligence-enhanced';

// Merge configurations for complete type coverage
declare global {
  interface Window {
    // Apple Intelligence primary interface
    AppleIntelligence: import('./apple-intelligence').AppleIntelligenceContext;
    
    // Foundation CSS integration
    FoundationIntegration: import('./foundation').FoundationIntegration;
    
    // Glass filter system
    GlassFilter: import('./glass-filter').GlassFilterSystem;
    
    // Shopify integration
    Shopify: import('./shopify').ShopifyTheme;
    
    // M4 Neural Engine (from Apple Intelligence)
    M4NeuralEngine: {
      optimize: (component: any) => any;
      accelerate: (fn: Function) => Function;
      renderTime: string;
    };
  }
}

// Export unified configuration type
export interface UnifiedThemeConfiguration {
  // Apple Priority
  appleIntelligence: {
    enabled: boolean;
    priority: 'PRIMARY';
    m4Acceleration: boolean;
    neuralEngine: boolean;
    higCompliance: boolean;
  };
  
  // Foundation System
  foundation: {
    cssVariables: boolean;
    gridSystem: boolean;
    touchTargets: boolean;
  };
  
  // Glass Effects
  glassFilter: {
    enabled: boolean;
    blur: string;
    opacity: number;
  };
  
  // Shopify Configuration
  shopify: {
    theme: string;
    store: string;
    apiVersion: string;
  };
  
  // OksanaPlatform Integration
  oksanaPlatform: {
    services: boolean;
    tokens: boolean;
    security: boolean;
  };
}

export {};
