# Shopify Theme Auditor - Enhanced Standalone Version

## Overview

The enhanced Shopify Theme Auditor is a sophisticated tool designed specifically for extracting embedded styles from Shopify themes and validating them against Apple HIG standards. This version operates independently without base service dependencies while maintaining all advanced features.

## Key Features

### 1. **Sophisticated Embedded Style Extraction**
- Extracts all inline styles from Liquid templates
- Analyzes each style for tokenization potential
- Provides detailed recommendations for each embedded style
- Maps styles to quantum spatial design tokens

### 2. **Apple HIG Validation** (100% Required)
- Validates touch targets (44px minimum)
- Checks typography standards (11px minimum, 17px preferred)
- Ensures 8pt grid spacing compliance
- Validates animation durations (400ms max)
- Checks line height ratios
- Validates color contrast ratios

### 3. **Token Extraction & Suggestions**
- Identifies tokenizable properties
- Suggests appropriate design tokens
- Groups by category (colors, spacing, typography)
- Tracks occurrence frequency

### 4. **Comprehensive Analysis**
- CSS file analysis with glassmorphism detection
- JavaScript modern pattern detection
- Performance metrics
- Complexity scoring
- Conflict detection

## Installation & Usage

### Basic Usage

```javascript
const ShopifyThemeAuditor = require('./shopify-theme-auditor');

// Create auditor with default settings
const auditor = new ShopifyThemeAuditor();

// Run comprehensive audit
auditor.performComprehensiveAudit()
    .then(report => {
        console.log('Audit complete!');
        console.log(`Health: ${report.executive_summary.overallHealth}%`);
        console.log(`Embedded styles found: ${report.executive_summary.embeddedStylesFound}`);
        console.log(`HIG violations: ${report.executive_summary.higViolations}`);
    })
    .catch(error => console.error('Audit failed:', error));
```

### Advanced Configuration

```javascript
const auditor = new ShopifyThemeAuditor({
    // Custom theme path
    themeRoot: '/path/to/your/shopify/theme',
    
    // Configuration options
    validateHIG: true,              // Default: true (ALWAYS required)
    extractEmbeddedStyles: true,    // Default: true
    tokenValidation: false,         // Default: false (as requested)
    deepAnalysis: true,             // Default: true
    
    // Additional options
    exportStyles: true,             // Export extracted styles
    generateSuggestions: true       // Generate token suggestions
});
```

### Command Line Usage

```bash
# Run directly
node shopify-theme-auditor.js

# Or with custom path
node shopify-theme-auditor.js --theme-root=/path/to/theme
```

## Output Files

The auditor creates several output files in organized directories:

### 1. **Main Report**
`reports/shopify-theme-audit-report.json`
- Executive summary
- Detailed analysis results
- Recommendations
- Next steps

### 2. **Extracted Styles**
`extracted-styles/embedded-styles-all-{date}.json`
- All embedded styles found
- Original style strings
- Parsed properties
- Complexity scores

### 3. **Tokenizable Styles**
`extracted-styles/embedded-styles-tokenizable-{date}.json`
- Only styles that can be tokenized
- Suggested token mappings
- Categories and patterns

### 4. **HIG Violations**
`extracted-styles/embedded-styles-hig-violations-{date}.json`
- Styles violating Apple HIG
- Specific issues identified
- Severity levels
- Fix recommendations

### 5. **Token Suggestions**
`extracted-styles/token-suggestions-{date}.json`
- Organized by category
- Occurrence frequency
- Suggested token names
- Original values

## Understanding the Results

### Embedded Style Analysis

Each embedded style is analyzed for:

```json
{
  "id": "embedded-1",
  "original": "padding: 16px; color: #6A3093; font-size: 14px;",
  "properties": {
    "padding": "16px",
    "color": "#6A3093",
    "font-size": "14px"
  },
  "tokenizable": {
    "padding": {
      "canTokenize": true,
      "category": "spacing",
      "suggestedToken": "--spacing-sm",
      "originalValue": "16px"
    },
    "color": {
      "canTokenize": true,
      "category": "color",
      "suggestedToken": "--colors-foundation-quantum-violet",
      "originalValue": "#6A3093"
    }
  },
  "higCompliant": false,
  "higIssues": [{
    "property": "font-size",
    "type": "typography",
    "message": "Font size below preferred: 14px (preferred: 17px)",
    "severity": "warning"
  }],
  "complexity": {
    "score": 6,
    "level": "simple"
  },
  "recommendations": [...]
}
```

### HIG Compliance Checks

The auditor validates against these Apple HIG standards:

1. **Touch Targets**
   - Minimum: 44px × 44px
   - Checks: width, height, min-width, min-height

2. **Typography**
   - Minimum font size: 11px
   - Preferred font size: 17px
   - System fonts preferred

3. **Spacing**
   - 8pt grid compliance
   - Consistent padding/margins

4. **Animation**
   - Maximum duration: 400ms
   - Smooth transitions

5. **Line Height**
   - Minimum: 1.2
   - Preferred: 1.5

### Token Mapping

The auditor maps common values to quantum spatial design tokens:

**Colors:**
- `#0A0621` → `--colors-foundation-void-black`
- `#6A3093` → `--colors-foundation-quantum-violet`
- `#5AC8FA` → `--colors-foundation-subtle-cyan`

**Spacing:**
- `8px` → `--spacing-xs`
- `16px` → `--spacing-sm`
- `24px` → `--spacing-md`
- `32px` → `--spacing-lg`

**Typography:**
- `14px` → `--typography-font-size-sm`
- `16px` → `--typography-font-size-md`
- `17px` → `--typography-font-size-body`

## Integration with Token System

The extracted styles can be integrated with your unified token architecture:

```javascript
// Load extracted tokenizable styles
const extractedStyles = require('./extracted-styles/embedded-styles-tokenizable-2025-08-05.json');

// Convert to token configuration
const newTokens = {};
for (const style of extractedStyles) {
    for (const [prop, info] of Object.entries(style.tokenizable)) {
        if (!newTokens[info.category]) {
            newTokens[info.category] = {};
        }
        newTokens[info.category][info.suggestedToken] = info.originalValue;
    }
}

// Add to your token configuration
const tokenConfig = require('./token-config.json');
Object.assign(tokenConfig.tokens, newTokens);
```

## Best Practices

1. **Run Regular Audits**
   - Before major deployments
   - After theme updates
   - When adding new features

2. **Address HIG Violations First**
   - High severity issues impact usability
   - Medium issues affect consistency
   - Warnings are optimization opportunities

3. **Progressive Token Migration**
   - Start with most frequent values
   - Group similar properties
   - Test thoroughly after changes

4. **Monitor Complexity**
   - Simple styles: Direct tokenization
   - Moderate: Consider grouping
   - Complex: Extract to classes

## Troubleshooting

### Theme Not Found
```javascript
// Specify custom path
const auditor = new ShopifyThemeAuditor({
    themeRoot: path.join(__dirname, '../path/to/theme')
});
```

### Missing Directories
The auditor automatically creates required directories:
- `reports/`
- `extracted-styles/`

### Large Result Sets
For themes with many embedded styles:
```javascript
// Limit analysis scope
const auditor = new ShopifyThemeAuditor({
    deepAnalysis: false,  // Faster, less detailed
    maxFiles: 100        // Limit file scanning
});
```

## Future Enhancements

1. **Automated Token Application**
   - Direct Liquid template updates
   - Backup and rollback support

2. **CI/CD Integration**
   - GitHub Actions support
   - Automated PR comments

3. **Visual Regression Testing**
   - Before/after comparisons
   - Screenshot validation

4. **Performance Impact Analysis**
   - Load time measurements
   - Runtime performance metrics

---

The Shopify Theme Auditor maintains all sophisticated features while being completely standalone, making it easy to integrate into any workflow without dependencies on base services.