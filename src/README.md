 # TypeScript Source Directory

This directory contains TypeScript source files that compile to `/assets/dist/` for use in the Shopify theme.

## Structure

```
src/
├── components/          # Reusable components
├── filters/            # Filter system logic
├── foundation/         # Foundation integration
├── apple-intelligence/ # Apple Intelligence integration
├── utils/             # Utility functions
└── types/             # Additional type definitions
```

## Development Workflow

1. **Write TypeScript** in `src/`
2. **Compile with** `npm run build` or `npm run dev`
3. **Output goes to** `assets/dist/`
4. **Reference in Liquid** as `{{ 'filename.js' | asset_url }}`

## Type Safety

All TypeScript files have access to:
- Shopify object types (`ShopifyProduct`, `ShopifyCollection`, etc.)
- Filter system types (`FilterState`, `GlassFilterConfig`, etc.)
- Apple Intelligence types (`DesignToken`, `HIGValidationResult`, etc.)
- Foundation types (`CSSCustomProperties`, `TouchTargetConfig`, etc.)

## Compilation Target

- **Target**: ES2022 (modern browsers)
- **Output**: `/assets/dist/`
- **Source Maps**: Enabled for debugging
- **Type Checking**: Strict mode enabled
