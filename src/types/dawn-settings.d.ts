// Dawn Theme Settings Type Definitions
// Apple Intelligence Strategic Director - TypeScript Standards
// Aligned with Horizon settings_data.json and QuantumSpatial Foundation

declare global {
  // Theme Settings Interface (matches your settings_data.json structure)
  interface DawnThemeSettings {
    // Branding
    logo?: string;
    logo_width: number;
    favicon?: string;
    
    // Typography (Foundation aligned)
    type_header_font: string;
    heading_scale: number;
    type_body_font: string;
    body_scale: number;
    
    // Layout (Foundation aligned)
    page_width: number; // 1400px = --foundation-content-max-width
    spacing_sections: number; // 64px = --foundation-xxxl
    spacing_grid_horizontal: number; // 32px = --foundation-lg
    spacing_grid_vertical: number; // 32px = --foundation-lg
    
    // Animations
    animations_reveal_on_scroll: boolean;
    animations_hover_elements: string;
    
    // Buttons (Apple HIG compliant)
    buttons_border_thickness: number;
    buttons_border_opacity: number;
    buttons_radius: number; // 12px
    buttons_shadow_opacity: number;
    buttons_shadow_horizontal_offset: number;
    buttons_shadow_vertical_offset: number;
    buttons_shadow_blur: number;
    
    // Variant Pills (Touch targets)
    variant_pills_border_thickness: number;
    variant_pills_border_opacity: number;
    variant_pills_radius: number; // 22px
    variant_pills_shadow_opacity: number;
    variant_pills_shadow_horizontal_offset: number;
    variant_pills_shadow_vertical_offset: number;
    variant_pills_shadow_blur: number;
    
    // Inputs (Foundation height: 44px)
    inputs_border_thickness: number;
    inputs_border_opacity: number;
    inputs_radius: number; // 12px
    inputs_shadow_opacity: number;
    inputs_shadow_horizontal_offset: number;
    inputs_shadow_vertical_offset: number;
    inputs_shadow_blur: number;
    
    // Cards (Product grid foundation)
    card_style: string;
    card_image_padding: number;
    card_text_alignment: string;
    card_color_scheme: string;
    card_border_thickness: number;
    card_border_opacity: number;
    card_corner_radius: number; // 16px = --foundation-card-border-radius
    card_shadow_opacity: number;
    card_shadow_horizontal_offset: number;
    card_shadow_vertical_offset: number;
    card_shadow_blur: number;
    
    // Collection Cards
    collection_card_style: string;
    collection_card_image_padding: number;
    collection_card_text_alignment: string;
    collection_card_color_scheme: string;
    collection_card_border_thickness: number;
    collection_card_border_opacity: number;
    collection_card_corner_radius: number;
    collection_card_shadow_opacity: number;
    collection_card_shadow_horizontal_offset: number;
    collection_card_shadow_vertical_offset: number;
    collection_card_shadow_blur: number;
    
    // Blog Cards
    blog_card_style: string;
    blog_card_image_padding: number;
    blog_card_text_alignment: string;
    blog_card_color_scheme: string;
    blog_card_border_thickness: number;
    blog_card_border_opacity: number;
    blog_card_corner_radius: number;
    blog_card_shadow_opacity: number;
    blog_card_shadow_horizontal_offset: number;
    blog_card_shadow_vertical_offset: number;
    blog_card_shadow_blur: number;
    
    // Text Boxes
    text_boxes_border_thickness: number;
    text_boxes_border_opacity: number;
    text_boxes_radius: number;
    text_boxes_shadow_opacity: number;
    text_boxes_shadow_horizontal_offset: number;
    text_boxes_shadow_vertical_offset: number;
    text_boxes_shadow_blur: number;
    
    // Media
    media_border_thickness: number;
    media_border_opacity: number;
    media_radius: number;
    media_shadow_opacity: number;
    media_shadow_horizontal_offset: number;
    media_shadow_vertical_offset: number;
    media_shadow_blur: number;
    
    // Popups
    popup_border_thickness: number;
    popup_border_opacity: number;
    popup_corner_radius: number;
    popup_shadow_opacity: number;
    popup_shadow_horizontal_offset: number;
    popup_shadow_vertical_offset: number;
    popup_shadow_blur: number;
    
    // Drawers
    drawer_border_thickness: number;
    drawer_border_opacity: number;
    drawer_shadow_opacity: number;
    drawer_shadow_horizontal_offset: number;
    drawer_shadow_vertical_offset: number;
    drawer_shadow_blur: number;
    
    // Badges
    badge_position: string;
    badge_corner_radius: number;
    sale_badge_color_scheme: string;
    sold_out_badge_color_scheme: string;
    
    // Brand Content
    brand_headline?: string;
    brand_description?: string;
    brand_image_width: number;
    
    // Social Links
    social_facebook_link?: string;
    social_instagram_link?: string;
    social_youtube_link?: string;
    social_tiktok_link?: string;
    social_twitter_link?: string;
    social_snapchat_link?: string;
    social_pinterest_link?: string;
    social_tumblr_link?: string;
    social_vimeo_link?: string;
    
    // Search
    predictive_search_enabled: boolean;
    predictive_search_show_vendor: boolean;
    predictive_search_show_price: boolean;
    currency_code_enabled: boolean;
    
    // Cart
    cart_type: string;
    show_vendor: boolean;
    show_cart_note: boolean;
    cart_drawer_collection?: string;
    cart_color_scheme: string;
    
    // Color Schemes (QuantumSpatial aligned)
    color_schemes: Record<string, ColorSchemeSettings>;
  }
  
  // Color Scheme Structure (matches your settings_data.json)
  interface ColorSchemeSettings {
    settings: {
      background: string; // "#000000"
      background_gradient?: string; // "linear-gradient(135deg, #000000 0%, #0A0A0F 100%)"
      text: string; // "#FFFFFF"
      button: string; // "#6366F1"
      button_label: string; // "#FFFFFF"
      secondary_button_label: string; // "#FFFFFF"
      shadow: string; // "#000000"
    };
  }
  
  // Foundation Settings Validation
  interface FoundationSettingsValidation {
    touchTargets: {
      buttonsCompliant: boolean; // >= 44px
      inputsCompliant: boolean; // >= 44px
      cardsCompliant: boolean; // >= 44px
    };
    spacing: {
      gridAligned: boolean; // Multiples of 8px
      sectionsOptimal: boolean; // 64px = --foundation-xxxl
      horizontalConsistent: boolean; // 32px = --foundation-lg
    };
    typography: {
      systemFonts: boolean; // Uses system-ui
      scaleAppropriate: boolean; // 100% scale
    };
    colorSchemes: {
      quantumSpatialAligned: boolean; // Matches QuantumSpatial tokens
      contrastCompliant: boolean; // WCAG compliant
      glassMorphicReady: boolean; // Supports glass effects
    };
  }
  
  // Settings Integration with Foundation
  interface SettingsFoundationMapper {
    mapToFoundation(settings: DawnThemeSettings): FoundationIntegration;
    validateCompliance(settings: DawnThemeSettings): FoundationSettingsValidation;
    generateCSSVariables(settings: DawnThemeSettings): CSSCustomProperties;
    optimizeForAppleHIG(settings: DawnThemeSettings): DawnThemeSettings;
  }
  
  // Updated ShopifySettings to use proper typing
  interface ShopifySettings extends DawnThemeSettings {
    [key: string]: any; // Allow for additional dynamic settings
  }
}

export {};