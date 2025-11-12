// Glass Filter System Type Definitions
// Apple Intelligence Strategic Director - TypeScript Standards

declare global {
  // Filter State Management
  interface FilterState {
    activeFilters: Map<string, FilterValue[]>;
    priceRange: PriceRange;
    sortBy: string;
    viewMode: ViewMode;
    resultsCount: number;
    isLoading: boolean;
  }

  interface PriceRange {
    min: number;
    max: number;
    currency: string;
  }

  type ViewMode = 'grid' | 'list' | 'compact';

  // Glass Filter Configuration
  interface GlassFilterConfig {
    sidebar: HTMLElement;
    overlay: HTMLElement;
    navigationButton: HTMLElement;
    productGrid: HTMLElement;
    filterBar?: HTMLElement;
    sortSelect?: HTMLElement;
    viewToggleGroup?: HTMLElement;
    resultsCount?: HTMLElement;
  }

  // Filter Integration Classes
  interface GlassFilterIntegration {
    sidebar: HTMLElement | null;
    overlay: HTMLElement | null;
    navigationButton: HTMLElement | null;
    isInitialized: boolean;
    currentView: ViewMode;
    activeFilters: Map<string, FilterValue[]>;

    init(): void;
    setup(): void;
    bindEvents(): void;
    toggleSidebar(): void;
    openSidebar(): void;
    closeSidebar(): void;
    isSidebarOpen(): boolean;
    updateFilterVisuals(): void;
    getActiveFiltersCount(): number;
    clearAllFilters(): void;
    handleFilterChange(input: HTMLInputElement): void;
  }

  // Facets Form Component (Shopify)
  interface FacetsFormComponent extends HTMLElement {
    sectionId: string;
    createURLParameters(formData?: FormData): URLSearchParams;
    updateFilters(): void;
    updateFiltersByURL(url: string): void;
  }

  // Filter Event Types
  interface FilterUpdateEvent extends CustomEvent {
    detail: {
      filters: URLSearchParams;
      source: 'sidebar' | 'bar' | 'url';
      timestamp: number;
    };
  }

  // Product Grid Management
  interface ProductGridManager {
    container: HTMLElement;
    products: HTMLElement[];
    currentView: ViewMode;
    isLoading: boolean;

    switchView(newView: ViewMode): void;
    updateProducts(products: ShopifyProduct[]): void;
    showLoading(): void;
    hideLoading(): void;
    animateIn(elements: HTMLElement[]): void;
  }

  // Filter Input Types
  interface FilterInput {
    type: 'checkbox' | 'radio' | 'range' | 'select';
    name: string;
    value: FilterValue;
    label: string;
    count?: number;
    element: HTMLInputElement | HTMLSelectElement;
  }

  // Apple HIG Compliance
  interface TouchTargetValidation {
    minHeight: number; // 44px
    minWidth: number;  // 44px
    element: HTMLElement;
    isCompliant: boolean;
  }

  // Glass Effect Configuration
  interface GlassEffectConfig {
    blur: string;
    opacity: number;
    borderColor: string;
    backgroundColor: string;
    borderRadius: string;
  }

  // Animation Configuration
  interface AnimationConfig {
    duration: number;
    easing: string;
    delay?: number;
    fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
  }

  // Performance Monitoring
  interface FilterPerformanceMetrics {
    renderTime: number;
    filterCount: number;
    resultsCount: number;
    loadTime: number;
    interactionDelay: number;
  }

  // Global Filter Functions (Legacy Support)
  interface Window {
    toggleGlassFilters?: () => void;
    openGlassFilters?: () => void;
    closeGlassFilters?: () => void;
    openFilterSidebar?: () => void;
    setViewMode?: (view: ViewMode) => void;
    updateSort?: (value: string) => void;
    clearAllFilters?: () => void;
    toggleMobileFilters?: () => void;
    glassFilterIntegration?: GlassFilterIntegration;
  }
}

export {};