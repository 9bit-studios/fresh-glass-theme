# QA Tools User Guide
## Apple Intelligence Strategic Director

Last Updated: July 20, 2025

---

## Table of Contents
1. [Overview](#overview)
2. [Token Validator](#token-validator)
3. [Shopify Theme Auditor](#shopify-theme-auditor)
4. [Emergency Cleanup Tool](#emergency-cleanup-tool)
5. [Service Validator](#service-validator)
6. [Workflow Examples](#workflow-examples)

---

## Overview

The QA tools help ensure consistency, quality, and Apple HIG compliance across your projects. Each tool serves a specific purpose:

- **Token Validator**: Ensures design token consistency
- **Shopify Theme Auditor**: Validates Petersen Games theme quality
- **Emergency Cleanup**: Analyzes directory structure
- **Service Validator**: Checks service health

---

## Token Validator

### Purpose
Validates design tokens against Apple HIG standards and Quantum-Spatial design system requirements.

### Basic Usage
```bash
cd /apple-intelligence-strategic-director/services
node qa/token-validator.js
```

### What It Validates
1. **Spacing System** - 8pt grid compliance
2. **Color System** - Valid formats and contrast
3. **Typography** - Apple HIG font sizes
4. **Glassmorphism** - Blur, opacity, and transparency
5. **Accessibility** - Touch targets, contrast, focus
6. **Apple HIG** - System fonts, dynamic type

### Understanding the Output
```
🔍 Starting Comprehensive Token Validation...
  📏 Validating spacing system...
    ✅ Spacing validation: 95.0%
  🎨 Validating color system...
    ✅ Color validation: 92.5%
```

**Score Interpretation**:
- **90-100%**: Excellent compliance
- **80-89%**: Good, minor issues
- **70-79%**: Needs attention
- **Below 70%**: Critical issues

### Report Location
```bash
# Generated at:
/services/token-validation-report.json
```

### Fixing Common Issues

#### Spacing Issues
```css
/* ❌ Bad - Not on 8pt grid */
.component {
  padding: 15px;
}

/* ✅ Good - 8pt grid aligned */
.component {
  padding: 16px; /* 2 * 8 */
}
```

#### Typography Issues
```css
/* ❌ Bad - Non-standard size */
.text {
  font-size: 14px;
}

/* ✅ Good - Apple HIG size */
.text {
  font-size: 15px; /* Subhead */
}
```

---

## Shopify Theme Auditor

### Purpose
Comprehensive audit of the Petersen Games Shopify theme for quality, performance, and compliance.

### Basic Usage
```bash
cd /apple-intelligence-strategic-director/services
node qa/shopify-theme-auditor.js
```

### What It Audits

#### 1. **CSS Analysis**
- Variable declarations
- Selector complexity
- Glassmorphism usage
- Token compliance
- Performance metrics

#### 2. **JavaScript Analysis**
- Modern JS usage
- DOM manipulation patterns
- Apple-specific features
- Performance concerns

#### 3. **Inline Code Detection**
- Inline CSS in Liquid files
- Inline JavaScript
- Style attributes
- Script tags

#### 4. **Conflicts & Issues**
- CSS variable conflicts
- Selector conflicts
- Naming inconsistencies

### Understanding the Report
```
🔍 Starting Comprehensive Shopify Theme Audit...
🎯 Target: Petersen Games Portal

📋 Auditing CSS Sources...
  ✅ Analyzed: QuantumFoundation.css
  ✅ Analyzed: priority-foundation.css
  ❌ Missing: critical.css
```

### Key Metrics
- **Overall Health**: Combined score (aim for >85%)
- **Token Compliance**: CSS variable usage (aim for >90%)
- **Inline Code**: Lower is better (aim for <5 files)

### Report Sections

#### Executive Summary
```json
{
  "overallHealth": 82,
  "criticalIssues": 3,
  "totalRecommendations": 8
}
```

#### Recommendations
Prioritized by impact:
- **High**: Address immediately
- **Medium**: Plan for next sprint
- **Low**: Nice to have

### Common Fixes

#### Remove Inline CSS
```liquid
<!-- ❌ Bad -->
<div style="background: rgba(0,0,0,0.5); padding: 20px;">

<!-- ✅ Good -->
<div class="glass-panel">
```

#### Use Design Tokens
```css
/* ❌ Bad */
.component {
  color: #007AFF;
}

/* ✅ Good */
.component {
  color: var(--color-primary);
}
```

---

## Emergency Cleanup Tool

### Purpose
Analyzes service directory structure and identifies optimization opportunities.

### Basic Usage
```bash
cd /apple-intelligence-strategic-director/services
./scripts/emergency-cleanup.sh

# For actual cleanup (use with caution)
./scripts/emergency-cleanup.sh --execute
```

### What It Analyzes
1. **Directory Structure** - Organization and nesting
2. **Naming Conventions** - Consistency checks
3. **Duplicate Files** - Similar services
4. **Archive Candidates** - Old/unused files
5. **File Statistics** - Size and modification dates

### Understanding the Output
```
📋 Step 1: Analyzing current directory structure...
Current services structure:
  📁 services (2601 JS files)
  📁 services/Frontend Design (8 JS files)
```

### Key Actions
- **Standardize Naming**: Fix inconsistent names
- **Remove Duplicates**: Consolidate similar services
- **Archive Old Files**: Move unused files
- **Organize Structure**: Group by function

### Safety Features
- **Dry Run Default**: Shows what would change
- **Backup Creation**: Saves current state
- **Report Generation**: Documents all findings

---

## Service Validator

### Purpose
Validates all services for common issues and best practices.

### Basic Usage
```bash
cd /apple-intelligence-strategic-director/services
node validate-services.js
```

### What It Checks
1. **Exports** - Proper module exports
2. **Dependencies** - Missing imports
3. **Code Quality** - Demo/mock code detection
4. **Hardcoded Paths** - Portability issues
5. **TODOs** - Incomplete implementations

### Understanding the Results
```
🔍 Scanning Apple Intelligence Strategic Director Services...

✅ enhanced-frontend-service.js (12.5KB)
⚠️ shopify-service.js (8.2KB)
   ⚠️ Contains demo/mock code
   ⚠️ Hardcoded paths: 3
```

### Report Output
```json
{
  "summary": {
    "total": 15,
    "valid": 12,
    "issues": 3,
    "duplicates": 2
  }
}
```

---

## Workflow Examples

### 1. **Pre-Development QA Check**
```bash
# 1. Initialize services
node streamlined-init.js full

# 2. Validate services
node validate-services.js

# 3. Check tokens
node qa/token-validator.js
```

### 2. **Shopify Theme Development**
```bash
# 1. Audit current theme
node qa/shopify-theme-auditor.js

# 2. Review recommendations
cat shopify-theme-audit-report.json | grep -A5 "recommendations"

# 3. Fix issues based on priority
# 4. Re-run audit to verify
```

### 3. **Weekly Maintenance**
```bash
# 1. Check directory health
./scripts/emergency-cleanup.sh

# 2. Validate all services
node validate-services.js

# 3. Review reports
ls -la *-report.json
```

### 4. **Design System Validation**
```bash
# 1. Validate tokens
node qa/token-validator.js

# 2. Check specific categories
cat token-validation-report.json | jq '.results.spacing'

# 3. Fix non-compliant tokens
# 4. Re-validate
```

---

## Best Practices

### 1. **Regular Validation**
Run QA tools:
- Before major commits
- After design system updates
- Weekly for maintenance

### 2. **Address Issues by Priority**
1. Critical (blocks development)
2. High (affects quality)
3. Medium (improvement opportunity)
4. Low (nice to have)

### 3. **Track Progress**
```bash
# Save reports with timestamps
mv token-validation-report.json reports/token-validation-$(date +%Y%m%d).json
```

### 4. **Automate Where Possible**
```bash
# Add to package.json scripts
"scripts": {
  "qa": "node validate-services.js && node qa/token-validator.js",
  "audit": "node qa/shopify-theme-auditor.js"
}
```

### 5. **Document Fixes**
Keep track of:
- What was fixed
- Why it was changed
- Impact on other systems

---

## Troubleshooting

### Token Validator Issues

**Problem**: Can't find token files
```bash
# Solution: Specify token location
const validator = new TokenValidator({
  primarySource: '/path/to/tokens/'
});
```

### Shopify Auditor Issues

**Problem**: Theme path not found
```bash
# Solution: Update path in auditor
this.themeRoot = '/correct/path/to/theme/';
```

### Service Validator Issues

**Problem**: Too many false positives
```bash
# Solution: Review and update validation rules
# Or add exceptions for specific patterns
```

---

## Integration with CI/CD

### GitHub Actions Example
```yaml
- name: Run QA Tools
  run: |
    cd services
    node validate-services.js
    node qa/token-validator.js
    if [ -f "*-report.json" ]; then
      echo "QA issues found"
      exit 1
    fi
```

### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

cd services
node validate-services.js || exit 1
echo "✅ Services validated"
```

---

## Summary

The QA tools provide comprehensive validation for:
- **Design consistency** via token validation
- **Theme quality** via Shopify auditor
- **Code organization** via cleanup tool
- **Service health** via validator

Use them regularly to maintain high quality standards and catch issues early!
