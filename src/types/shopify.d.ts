// Shopify Liquid Type Definitions
// Apple Intelligence Strategic Director - TypeScript Standards

declare global {
  // Core Shopify Objects
  interface ShopifyProduct {
    id: string | number;
    title: string;
    handle: string;
    description: string;
    vendor: string;
    type: string;
    price: number;
    compare_at_price?: number;
    available: boolean;
    featured_image?: ShopifyImage;
    images: ShopifyImage[];
    variants: ShopifyVariant[];
    options: ShopifyOption[];
    tags: string[];
    url: string;
    created_at: string;
    updated_at: string;
  }

  interface ShopifyVariant {
    id: string | number;
    title: string;
    price: number;
    compare_at_price?: number;
    sku: string;
    position: number;
    option1?: string;
    option2?: string;
    option3?: string;
    weight: number;
    weight_unit: string;
    inventory_quantity: number;
    available: boolean;
    requires_shipping: boolean;
    taxable: boolean;
    barcode?: string;
    featured_image?: ShopifyImage;
    url: string;
  }

  interface ShopifyImage {
    id: string | number;
    alt?: string;
    width: number;
    height: number;
    src: string;
    url: string;
    position: number;
    product_id: string | number;
    variant_ids: string[] | number[];
  }

  interface ShopifyOption {
    name: string;
    position: number;
    values: string[];
  }

  interface ShopifyCollection {
    id: string | number;
    title: string;
    handle: string;
    description: string;
    featured_image?: ShopifyImage;
    image?: ShopifyImage;
    url: string;
    products: ShopifyProduct[];
    all_products_count: number;
    current_type?: string;
    current_vendor?: string;
    default_sort_by: string;
  }

  interface ShopifyCart {
    item_count: number;
    total_price: number;
    total_weight: number;
    currency: string;
    items: ShopifyCartItem[];
    note?: string;
    attributes: Record<string, string>;
  }

  interface ShopifyCartItem {
    id: string | number;
    properties: Record<string, string>;
    quantity: number;
    variant_id: string | number;
    product_id: string | number;
    title: string;
    price: number;
    line_price: number;
    original_price: number;
    discounted_price: number;
    sku: string;
    vendor: string;
    product_title: string;
    product_description: string;
    product_type: string;
    url: string;
    image?: string;
    handle: string;
    requires_shipping: boolean;
    product_has_only_default_variant: boolean;
    gift_card: boolean;
    final_price: number;
    final_line_price: number;
    url_to_remove: string;
  }

  // Filter and Facet Types
  interface ShopifyFilter {
    label: string;
    param_name: string;
    type: 'list' | 'price_range' | 'boolean';
    values?: ShopifyFilterValue[];
    range_max?: number;
    range_min?: number;
    min_value?: FilterValue;
    max_value?: FilterValue;
    active_values: FilterValue[];
    inactive_values: FilterValue[];
    url_to_remove: string;
  }

  interface ShopifyFilterValue {
    label: string;
    value: string;
    count: number;
    active: boolean;
    url_to_add: string;
    url_to_remove: string;
    param_name: string;
  }

  type FilterValue = string | number;

  // Pagination
  interface ShopifyPaginate {
    current_page: number;
    current_offset: number;
    items: number;
    parts: ShopifyPaginatePart[];
    pages: number;
    previous?: ShopifyPaginateNavigation;
    next?: ShopifyPaginateNavigation;
  }

  interface ShopifyPaginatePart {
    title: string;
    url?: string;
    is_link: boolean;
  }

  interface ShopifyPaginateNavigation {
    title: string;
    url: string;
    is_link: boolean;
  }

  // Theme Settings
  interface ShopifySettings {
    [key: string]: string | number | boolean;
  }

  // Money Filters
  interface MoneyFormatOptions {
    with_currency?: boolean;
    without_currency?: boolean;
    precision?: number;
  }

  // Image URL Parameters
  interface ImageUrlOptions {
    width?: number;
    height?: number;
    crop?: 'top' | 'center' | 'bottom' | 'left' | 'right';
    scale?: number;
    format?: 'jpg' | 'png' | 'webp';
  }

  // Search Results
  interface ShopifySearchResults {
    terms: string;
    results_count: number;
    results: (ShopifyProduct | ShopifyPage | ShopifyArticle)[];
  }

  interface ShopifyPage {
    id: string | number;
    title: string;
    content: string;
    excerpt: string;
    handle: string;
    url: string;
    created_at: string;
    updated_at: string;
  }

  interface ShopifyArticle {
    id: string | number;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    handle: string;
    url: string;
    created_at: string;
    updated_at: string;
    published_at: string;
    tags: string[];
    image?: ShopifyImage;
  }
}

export {};