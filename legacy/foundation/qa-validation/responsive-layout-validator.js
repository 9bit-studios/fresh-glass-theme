/**
 * Responsive Layout Validator
 * Interactive tool for validating mobile/desktop layouts for glass filter system
 * 
 * Validates:
 * - Apple HIG compliant responsive breakpoints
 * - Touch target sizing across devices
 * - Glass filter layout behavior (sidebar vs mobile overlay)
 * - Foundation variable usage in responsive contexts
 * - Header/navigation/filter bar positioning
 */

const fs = require('fs').promises;
const path = require('path');

class ResponsiveLayoutValidator {
  constructor() {
    this.baseDir = '/Users/pennyplatt/9bit-studios/petersen-portal/fresh-glass-theme/petersen-glass-theme';
    this.appleBreakpoints = {
      mobile: { min: 320, max: 744, name: 'iPhone/Mobile' },
      tablet: { min: 744, max: 1024, name: 'iPad/Tablet' },
      desktop: { min: 1024, max: 1920, name: 'Desktop/Large' }
    };
    
    this.touchTargets = {
      minimum: 44,     // Apple HIG minimum
      preferred: 48,   // Apple HIG preferred
      mobile: 56       // Enhanced mobile target
    };
    
    this.layoutComponents = [
      'layout/theme.liquid',
      'sections/glass-filter.liquid',
      'sections/glass-filter-bar.liquid',
      'sections/glass-filter-sidebar.liquid',
      'snippets/foundation-integration.liquid'
    ];
  }

  async validateAllLayouts() {
    console.log('📱 Starting Responsive Layout Validation...');
    
    const results = {
      components: [],
      breakpointAnalysis: {},
      touchTargetCompliance: {},
      layoutBehavior: {},
      foundationIntegration: {},
      summary: {
        totalComponents: this.layoutComponents.length,
        passed: 0,
        failed: 0,
        issues: []
      }
    };

    for (const component of this.layoutComponents) {
      try {
        const validation = await this.validateComponent(component);
        results.components.push(validation);
        
        if (validation.passed) {
          results.summary.passed++;
        } else {
          results.summary.failed++;
          results.summary.issues.push(...validation.issues);
        }
        
      } catch (error) {
        results.summary.failed++;
        results.summary.issues.push(`${component}: ${error.message}`);
      }
    }

    // Generate comprehensive analysis
    results.breakpointAnalysis = await this.analyzeBreakpoints(results.components);
    results.touchTargetCompliance = await this.analyzeTouchTargets(results.components);
    results.layoutBehavior = await this.analyzeLayoutBehavior(results.components);
    results.foundationIntegration = await this.analyzeFoundationIntegration(results.components);

    return results;
  }

  async validateComponent(componentPath) {
    console.log(`🔍 Validating layout: ${componentPath}`);
    
    const fullPath = path.join(this.baseDir, componentPath);
    const content = await fs.readFile(fullPath, 'utf8');
    
    const validation = {
      component: componentPath,
      breakpoints: this.extractBreakpoints(content),
      touchTargets: this.validateTouchTargets(content),
      foundationUsage: this.checkFoundationUsage(content),
      glassLayoutPatterns: this.checkGlassLayoutPatterns(content),
      mobileAdaptations: this.checkMobileAdaptations(content),
      issues: [],
      recommendations: [],
      passed: true
    };

    // Component-specific validations
    if (componentPath.includes('theme.liquid')) {
      await this.validateThemeLayout(validation, content);
    } else if (componentPath.includes('filter')) {
      await this.validateFilterLayout(validation, content);
    } else if (componentPath.includes('foundation-integration')) {
      await this.validateFoundationIntegration(validation, content);
    }

    validation.passed = validation.issues.length === 0;
    return validation;
  }

  extractBreakpoints(content) {
    const breakpoints = [];
    const mediaRegex = /@media[^{]*\((max-width|min-width):\s*(\d+)px\)/g;
    let match;
    
    while ((match = mediaRegex.exec(content)) !== null) {
      const type = match[1];
      const width = parseInt(match[2]);
      
      breakpoints.push({
        type,
        width,
        context: this.getBreakpointContext(content, match.index)
      });
    }
    
    return breakpoints.sort((a, b) => a.width - b.width);
  }

  getBreakpointContext(content, index) {
    // Extract surrounding lines for context
    const lines = content.substring(0, index).split('');
    const startLine = Math.max(0, lines.length - 5);
    const contextLines = lines.slice(startLine).join('');
    
    // Look for component or class context
    const classMatch = contextLines.match(/\.([a-zA-Z-]+)[^{]*$/);
    return classMatch ? classMatch[1] : 'unknown';
  }

  validateTouchTargets(content) {
    const touchTargetIssues = [];
    
    // Check for hardcoded sizes below 44px
    const sizeRegex = /(min-height|height|min-width|width):\s*(\d+)px/g;
    let match;
    
    while ((match = sizeRegex.exec(content)) !== null) {
      const property = match[1];
      const size = parseInt(match[2]);
      
      if ((property.includes('height') || property.includes('width')) && 
          size < this.touchTargets.minimum && size > 10) { // Ignore very small values like borders
        
        touchTargetIssues.push({
          property,
          size,
          line: this.getLineNumber(content, match.index),
          recommendation: `Use var(--foundation-touch-target, 44px) instead of ${size}px`
        });
      }
    }
    
    return touchTargetIssues;
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('').length;
  }

  checkFoundationUsage(content) {
    const foundationPatterns = {
      variables: [],
      touchTargets: 0,
      breakpointVars: 0,
      spacingVars: 0
    };
    
    // Count foundation variable usage
    const varRegex = /var\((--foundation-[^)]+)\)/g;
    let match;
    
    while ((match = varRegex.exec(content)) !== null) {
      const variable = match[1];
      foundationPatterns.variables.push(variable);
      
      if (variable.includes('touch-target')) {
        foundationPatterns.touchTargets++;
      }
      if (variable.includes('breakpoint')) {
        foundationPatterns.breakpointVars++;
      }
      if (variable.includes('space') || variable.includes('gap') || variable.includes('margin')) {
        foundationPatterns.spacingVars++;
      }
    }
    
    return foundationPatterns;
  }

  checkGlassLayoutPatterns(content) {
    const patterns = {
      glassEffects: content.includes('backdrop-filter') || content.includes('blur('),
      fixedPositioning: content.includes('position: fixed'),
      stickyPositioning: content.includes('position: sticky'),
      zIndexManagement: /z-index:\s*\d+/.test(content),
      overlayPattern: content.includes('overlay'),
      sidebarPattern: content.includes('sidebar'),
      responsiveGrids: content.includes('grid-template-columns')
    };
    
    return patterns;
  }

  checkMobileAdaptations(content) {
    const adaptations = {
      mobileOnlyElements: content.includes('mobile-only'),
      desktopHidden: content.includes('desktop-hidden') || content.includes('display: none'),
      touchOptimizations: content.includes('touch') || content.includes('-webkit-tap-highlight'),
      mobileNavigation: content.includes('mobile-nav') || content.includes('hamburger'),
      swipeGestures: content.includes('swipe') || content.includes('touch-action'),
      viewportMeta: content.includes('viewport') && content.includes('width=device-width')
    };
    
    return adaptations;
  }

  async validateThemeLayout(validation, content) {
    // Theme should have proper viewport and foundation loading
    if (!content.includes('width=device-width')) {
      validation.issues.push('Missing viewport meta tag for mobile responsiveness');
      validation.recommendations.push('Add: <meta name="viewport" content="width=device-width, initial-scale=1">');
    }
    
    // Check foundation loading order
    const foundationOrder = [
      'QuantumFoundation.css',
      'foundation-integration',
      'quantumspatial-color-tokens.css',
      'base.css',
      'global-glass-theme.css'
    ];
    
    let lastIndex = -1;
    foundationOrder.forEach(item => {
      const index = content.indexOf(item);
      if (index !== -1 && index < lastIndex) {
        validation.issues.push(`Foundation loading order issue: ${item} should load before previous items`);
      }
      if (index !== -1) lastIndex = index;
    });
  }

  async validateFilterLayout(validation, content) {
    // Filter components should have proper responsive behavior
    const requiredBreakpoints = [768, 1024];
    const foundBreakpoints = validation.breakpoints.map(bp => bp.width);
    
    requiredBreakpoints.forEach(bp => {
      if (!foundBreakpoints.includes(bp)) {
        validation.issues.push(`Missing required breakpoint: ${bp}px for proper filter behavior`);
        validation.recommendations.push(`Add @media (max-width: ${bp}px) for responsive filter layout`);
      }
    });
    
    // Check for proper sidebar/overlay pattern
    if (content.includes('sidebar') && !content.includes('overlay')) {
      validation.issues.push('Sidebar filter missing overlay for mobile');
      validation.recommendations.push('Add overlay element for mobile sidebar backdrop');
    }
    
    // Check for foundation variable usage in positioning
    if (content.includes('position: fixed') && !validation.foundationUsage.variables.some(v => v.includes('z-index'))) {
      validation.issues.push('Fixed positioning without foundation z-index management');
      validation.recommendations.push('Use foundation z-index variables for consistent layering');
    }
  }

  async validateFoundationIntegration(validation, content) {
    // Foundation integration should map all necessary variables
    const requiredMappings = [
      'touch-target',
      'nav-height',
      'sidebar-width',
      'breakpoint'
    ];
    
    requiredMappings.forEach(mapping => {
      if (!content.includes(mapping)) {
        validation.issues.push(`Missing foundation mapping: ${mapping}`);
        validation.recommendations.push(`Add CSS variable mapping for --foundation-${mapping}`);
      }
    });
  }

  async analyzeBreakpoints(components) {
    const analysis = {
      allBreakpoints: new Set(),
      appleCompliant: 0,
      nonCompliant: [],
      recommendations: []
    };
    
    components.forEach(component => {
      component.breakpoints?.forEach(bp => {
        analysis.allBreakpoints.add(bp.width);
        
        // Check if breakpoint aligns with Apple standards
        const isAppleStandard = Object.values(this.appleBreakpoints)
          .some(standard => Math.abs(bp.width - standard.max) <= 10);
        
        if (isAppleStandard) {
          analysis.appleCompliant++;
        } else {
          analysis.nonCompliant.push({
            component: component.component,
            breakpoint: bp.width,
            context: bp.context
          });
        }
      });
    });
    
    // Generate recommendations
    if (analysis.nonCompliant.length > 0) {
      analysis.recommendations.push('Consider aligning breakpoints with Apple device standards');
      analysis.recommendations.push('Use foundation breakpoint variables for consistency');
    }
    
    return analysis;
  }

  async analyzeTouchTargets(components) {
    const analysis = {
      totalIssues: 0,
      componentIssues: new Map(),
      severityLevels: {
        critical: 0,  // < 32px
        warning: 0,   // 32-43px  
        minor: 0      // 44-47px (below preferred 48px)
      },
      recommendations: []
    };
    
    components.forEach(component => {
      const issues = component.touchTargets || [];
      analysis.totalIssues += issues.length;
      
      if (issues.length > 0) {
        analysis.componentIssues.set(component.component, issues);
        
        issues.forEach(issue => {
          if (issue.size < 32) {
            analysis.severityLevels.critical++;
          } else if (issue.size < 44) {
            analysis.severityLevels.warning++;
          } else if (issue.size < 48) {
            analysis.severityLevels.minor++;
          }
        });
      }
    });
    
    if (analysis.totalIssues > 0) {
      analysis.recommendations.push('Replace hardcoded sizes with foundation touch target variables');
      analysis.recommendations.push('Ensure all interactive elements meet 44px minimum (Apple HIG)');
    }
    
    return analysis;
  }

  async analyzeLayoutBehavior(components) {
    const analysis = {
      glassEffectUsage: 0,
      properLayering: 0,
      responsiveGrids: 0,
      mobileAdaptations: 0,
      issues: [],
      recommendations: []
    };
    
    components.forEach(component => {
      const patterns = component.glassLayoutPatterns || {};
      const mobile = component.mobileAdaptations || {};
      
      if (patterns.glassEffects) analysis.glassEffectUsage++;
      if (patterns.zIndexManagement) analysis.properLayering++;
      if (patterns.responsiveGrids) analysis.responsiveGrids++;
      if (mobile.mobileOnlyElements || mobile.touchOptimizations) analysis.mobileAdaptations++;
      
      // Check for layout issues
      if (patterns.fixedPositioning && !patterns.zIndexManagement) {
        analysis.issues.push(`${component.component}: Fixed positioning without z-index management`);
      }
      
      if (patterns.glassEffects && !patterns.zIndexManagement) {
        analysis.issues.push(`${component.component}: Glass effects without proper layering`);
      }
    });
    
    return analysis;
  }

  async analyzeFoundationIntegration(components) {
    const analysis = {
      totalVariables: 0,
      touchTargetUsage: 0,
      spacingUsage: 0,
      breakpointUsage: 0,
      componentsUsingFoundation: 0,
      recommendations: []
    };
    
    components.forEach(component => {
      const foundation = component.foundationUsage || {};
      
      if (foundation.variables && foundation.variables.length > 0) {
        analysis.componentsUsingFoundation++;
        analysis.totalVariables += foundation.variables.length;
        analysis.touchTargetUsage += foundation.touchTargets || 0;
        analysis.spacingUsage += foundation.spacingVars || 0;
        analysis.breakpointUsage += foundation.breakpointVars || 0;
      }
    });
    
    const percentage = (analysis.componentsUsingFoundation / components.length) * 100;
    
    if (percentage < 80) {
      analysis.recommendations.push('Increase foundation variable usage across all components');
    }
    
    if (analysis.touchTargetUsage === 0) {
      analysis.recommendations.push('Implement foundation touch target variables for Apple HIG compliance');
    }
    
    return analysis;
  }

  async generateInteractiveReport(results) {
    let report = `# Responsive Layout Validation Report
Generated: ${new Date().toISOString()}

## Summary
- Total Components: ${results.summary.totalComponents}
- ✅ Passed: ${results.summary.passed}
- ❌ Failed: ${results.summary.failed}
- 🔍 Total Issues: ${results.summary.issues.length}

## Apple HIG Compliance Score: ${Math.round((results.summary.passed / results.summary.totalComponents) * 100)}%

`;

    // Breakpoint Analysis
    report += `## 📱 Breakpoint Analysis
- Total Unique Breakpoints: ${results.breakpointAnalysis.allBreakpoints?.size || 0}
- Apple Standard Compliant: ${results.breakpointAnalysis.appleCompliant}
- Non-Compliant: ${results.breakpointAnalysis.nonCompliant?.length || 0}

### Recommended Apple Breakpoints:
- 📱 Mobile: 320px - 744px (iPhone)
- 📱 Tablet: 744px - 1024px (iPad)  
- 💻 Desktop: 1024px+ (Desktop)

`;

    // Touch Target Analysis
    report += `## 👆 Touch Target Analysis
- Total Issues: ${results.touchTargetCompliance.totalIssues}
- 🔴 Critical (<32px): ${results.touchTargetCompliance.severityLevels?.critical || 0}
- 🟡 Warning (32-43px): ${results.touchTargetCompliance.severityLevels?.warning || 0}
- 🟢 Minor (44-47px): ${results.touchTargetCompliance.severityLevels?.minor || 0}

### Apple HIG Requirements:
- ✅ Minimum: 44px × 44px
- 🎯 Preferred: 48px × 48px
- 📱 Mobile Enhanced: 56px × 56px

`;

    // Foundation Integration
    report += `## 🎯 Foundation Integration
- Components Using Foundation: ${results.foundationIntegration.componentsUsingFoundation}/${results.summary.totalComponents}
- Total Foundation Variables: ${results.foundationIntegration.totalVariables}
- Touch Target Usage: ${results.foundationIntegration.touchTargetUsage}
- Spacing Variables: ${results.foundationIntegration.spacingUsage}

`;

    // Component Details
    report += `## 📋 Component Analysis`;
    
    results.components.forEach(component => {
      const status = component.passed ? '✅' : '❌';
      report += `### ${status} ${component.component}`;
      
      if (component.breakpoints?.length > 0) {
        report += `**Breakpoints:** ${component.breakpoints.map(bp => `${bp.width}px`).join(', ')}`;
      }
      
      if (component.touchTargets?.length > 0) {
        report += `**Touch Target Issues:** ${component.touchTargets.length}`;
        component.touchTargets.forEach(issue => {
          report += `  - ${issue.property}: ${issue.size}px (line ${issue.line})`;
        });
      }
      
      if (component.foundationUsage?.variables?.length > 0) {
        report += `**Foundation Variables:** ${component.foundationUsage.variables.length}`;
      }
      
      if (component.issues?.length > 0) {
        report += `**Issues:**`;
        component.issues.forEach(issue => {
          report += `  - ${issue}`;
        });
      }
      
      if (component.recommendations?.length > 0) {
        report += `**Recommendations:**`;
        component.recommendations.forEach(rec => {
          report += `  - ${rec}`;
        });
      }
      
      report += ``;
    });

    // Overall Recommendations
    if (results.summary.issues.length > 0) {
      report += `## 💡 Priority Recommendations`;
      
      const uniqueRecommendations = [...new Set([
        ...results.breakpointAnalysis.recommendations || [],
        ...results.touchTargetCompliance.recommendations || [],
        ...results.foundationIntegration.recommendations || []
      ])];
      
      uniqueRecommendations.forEach(rec => {
        report += `- ${rec}`;
      });
    }

    const reportPath = path.join(this.baseDir, 'responsive-layout-report.md');
    await fs.writeFile(reportPath, report);
    
    console.log(`📊 Responsive layout report generated: ${reportPath}`);
    return reportPath;
  }

  // Interactive validation methods
  async validateSingleBreakpoint(width, componentPath) {
    const component = await this.validateComponent(componentPath);
    const hasBreakpoint = component.breakpoints.some(bp => bp.width === width);
    
    return {
      component: componentPath,
      breakpoint: width,
      exists: hasBreakpoint,
      isAppleStandard: Object.values(this.appleBreakpoints)
        .some(standard => Math.abs(width - standard.max) <= 10),
      recommendation: hasBreakpoint ? 
        'Breakpoint found' : 
        `Add @media (max-width: ${width}px) for responsive behavior`
    };
  }

  async suggestLayoutFix(componentPath, issueType) {
    const fixes = {
      'missing-mobile-breakpoint': `
@media (max-width: 768px) {
  .component {
    /* Mobile-specific styles */
    padding: var(--foundation-space-md, 16px);
    font-size: var(--foundation-text-sm, 14px);
  }
}`,
      
      'touch-target-small': `
/* Replace hardcoded sizes with foundation variables */
.button, .interactive-element {
  min-height: var(--foundation-touch-target, 44px);
  min-width: var(--foundation-touch-target, 44px);
}

@media (max-width: 744px) {
  .button, .interactive-element {
    min-height: var(--foundation-touch-target-large, 56px);
    min-width: var(--foundation-touch-target-large, 56px);
  }
}`,
      
      'missing-foundation-variables': `
/* Use foundation variables instead of hardcoded values */
.component {
  padding: var(--foundation-space-lg, 24px);
  gap: var(--foundation-space-md, 16px);
  border-radius: var(--foundation-radius-md, 12px);
  background: var(--foundation-glass-subtle);
  backdrop-filter: var(--foundation-glass-subtle-backdrop-filter);
}`,
      
      'z-index-management': `
/* Use foundation z-index scale */
.fixed-header {
  z-index: var(--foundation-z-header, 400);
}

.modal-overlay {
  z-index: var(--foundation-z-modal, 1000);
}

.sidebar {
  z-index: var(--foundation-z-overlay, 100);
}`
    };

    return fixes[issueType] || 'No specific fix available for this issue type';
  }
}

module.exports = { ResponsiveLayoutValidator };

// CLI usage for interactive validation  
if (require.main === module) {
  const validator = new ResponsiveLayoutValidator();
  
  validator.validateAllLayouts()
    .then(results => {
      console.log('📱 Responsive Layout Validation Results:');
      console.log(`✅ Passed: ${results.summary.passed}`);
      console.log(`❌ Failed: ${results.summary.failed}`);
      console.log(`🔍 Total Issues: ${results.summary.issues.length}`);
      console.log(`👆 Touch Target Issues: ${results.touchTargetCompliance.totalIssues}`);
      console.log(`🎯 Foundation Integration: ${results.foundationIntegration.componentsUsingFoundation}/${results.summary.totalComponents}`);
      
      return validator.generateInteractiveReport(results);
    })
    .then(reportPath => {
      console.log(`📋 Detailed report: ${reportPath}`);
    })
    .catch(error => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
}