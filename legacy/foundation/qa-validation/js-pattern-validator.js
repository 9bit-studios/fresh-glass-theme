/**
 * JavaScript Pattern Validator
 * Interactive tool for validating JavaScript patterns in glass filter components
 * 
 * Validates:
 * - Function exports and global namespace management
 * - Event listener patterns and mobile responsiveness  
 * - Filter integration with Shopify facets
 * - Component lifecycle management
 */

const fs = require('fs').promises;
const path = require('path');

class JavaScriptPatternValidator {
  constructor() {
    this.baseDir = '/Users/pennyplatt/Documents//petersen-portal/fresh-glass-theme/petersen-glass-theme';
    this.patterns = new Map();
    this.validationRules = {
      // Function patterns
      functionExports: {
        required: ['openGlassFilters', 'closeGlassFilters', 'toggleFilterSection'],
        pattern: /window\.(\w+)\s*=\s*(\w+)/g
      },
      
      // Event patterns
      eventListeners: {
        required: ['DOMContentLoaded', 'change', 'click'],
        pattern: /addEventListener\s*\(\s*['"]([^'"]+)['"]/g
      },
      
      // Mobile patterns
      mobileHandlers: {
        required: ['innerWidth', 'resize'],
        pattern: /(window\.innerWidth|addEventListener\s*\(\s*['"]resize['"])/g
      },
      
      // Filter integration
      facetsIntegration: {
        required: ['facet', 'filter'],
        pattern: /(facet|filter)/gi
      }
    };
  }

  async validateComponent(componentPath) {
    console.log(`🔍 Validating JavaScript patterns: ${componentPath}`);
    
    try {
      const content = await fs.readFile(path.join(this.baseDir, componentPath), 'utf8');
      const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
      
      if (!scriptMatch) {
        return {
          component: componentPath,
          hasScript: false,
          validation: { passed: true, note: 'No JavaScript found' }
        };
      }
      
      const jsContent = scriptMatch[1];
      const validation = await this.analyzeJavaScript(jsContent, componentPath);
      
      return {
        component: componentPath,
        hasScript: true,
        jsContent,
        validation
      };
      
    } catch (error) {
      return {
        component: componentPath,
        error: error.message,
        validation: { passed: false, issues: [error.message] }
      };
    }
  }

  async analyzeJavaScript(jsContent, componentPath) {
    const analysis = {
      functions: this.extractFunctions(jsContent),
      exports: this.extractExports(jsContent),
      events: this.extractEventListeners(jsContent),
      mobileHandling: this.checkMobileHandling(jsContent),
      facetsIntegration: this.checkFacetsIntegration(jsContent),
      issues: [],
      recommendations: [],
      passed: true
    };

    // Validate based on component type
    if (componentPath.includes('filter')) {
      await this.validateFilterComponent(analysis, jsContent);
    }
    
    if (componentPath.includes('sidebar')) {
      await this.validateSidebarComponent(analysis, jsContent);
    }
    
    if (componentPath.includes('bar')) {
      await this.validateBarComponent(analysis, jsContent);
    }

    analysis.passed = analysis.issues.length === 0;
    return analysis;
  }

  extractFunctions(jsContent) {
    const functions = [];
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)/g;
    let match;
    
    while ((match = functionRegex.exec(jsContent)) !== null) {
      functions.push({
        name: match[1],
        declaration: match[0]
      });
    }
    
    return functions;
  }

  extractExports(jsContent) {
    const exports = [];
    const exportRegex = /window\.(\w+)\s*=\s*(\w+)/g;
    let match;
    
    while ((match = exportRegex.exec(jsContent)) !== null) {
      exports.push({
        name: match[1],
        value: match[2]
      });
    }
    
    return exports;
  }

  extractEventListeners(jsContent) {
    const events = [];
    const eventRegex = /addEventListener\s*\(\s*['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = eventRegex.exec(jsContent)) !== null) {
      events.push(match[1]);
    }
    
    return [...new Set(events)]; // Remove duplicates
  }

  checkMobileHandling(jsContent) {
    return {
      hasViewportChecks: jsContent.includes('innerWidth'),
      hasResizeHandler: jsContent.includes('addEventListener') && jsContent.includes('resize'),
      hasBreakpointLogic: /\d{3,4}/.test(jsContent), // Look for pixel values like 768, 1024
      hasTouchHandling: jsContent.includes('touch') || jsContent.includes('click')
    };
  }

  checkFacetsIntegration(jsContent) {
    return {
      hasFacetsComponents: jsContent.includes('facet'),
      hasFilterHandling: jsContent.includes('filter'),
      hasFormIntegration: jsContent.includes('form') || jsContent.includes('submit'),
      hasURLUpdates: jsContent.includes('URLSearchParams') || jsContent.includes('window.location')
    };
  }

  async validateFilterComponent(analysis, jsContent) {
    // Glass filter components should have specific patterns
    const requiredFunctions = ['toggleFilterSection', 'handleFilterChange', 'clearAllFilters'];
    
    requiredFunctions.forEach(funcName => {
      const hasFunction = analysis.functions.some(f => f.name === funcName) || 
                         jsContent.includes(funcName);
      
      if (!hasFunction) {
        analysis.issues.push(`Missing required function: ${funcName}`);
        analysis.recommendations.push(`Add ${funcName} function for filter functionality`);
      }
    });

    // Check for filter bar integration
    if (!jsContent.includes('addFilterToBar') && !jsContent.includes('filter-tag')) {
      analysis.issues.push('Missing filter bar integration');
      analysis.recommendations.push('Add integration with glass filter bar for active filter display');
    }

    // Check for mobile toggle
    if (!jsContent.includes('mobile') && !analysis.mobileHandling.hasViewportChecks) {
      analysis.issues.push('Missing mobile filter handling');
      analysis.recommendations.push('Add mobile-specific filter toggle functionality');
    }
  }

  async validateSidebarComponent(analysis, jsContent) {
    // Sidebar should have open/close functions
    const requiredFunctions = ['openGlassFilters', 'closeGlassFilters'];
    
    requiredFunctions.forEach(funcName => {
      const hasFunction = analysis.functions.some(f => f.name === funcName) || 
                         analysis.exports.some(e => e.name === funcName);
      
      if (!hasFunction) {
        analysis.issues.push(`Missing sidebar function: ${funcName}`);
        analysis.recommendations.push(`Ensure ${funcName} is defined and exported to window`);
      }
    });

    // Check for facets integration
    if (!analysis.facetsIntegration.hasFacetsComponents) {
      analysis.issues.push('Missing Shopify facets integration');
      analysis.recommendations.push('Add facets-form-component and facet-inputs-component integration');
    }

    // Check for overlay handling
    if (!jsContent.includes('overlay') && !jsContent.includes('backdrop')) {
      analysis.issues.push('Missing overlay/backdrop handling');
      analysis.recommendations.push('Add overlay click handling for mobile sidebar close');
    }
  }

  async validateBarComponent(analysis, jsContent) {
    // Filter bar should handle sorting and view modes
    const requiredFunctions = ['updateSort', 'setViewMode', 'toggleMobileFilters'];
    
    requiredFunctions.forEach(funcName => {
      const hasFunction = analysis.functions.some(f => f.name === funcName) || 
                         jsContent.includes(funcName);
      
      if (!hasFunction) {
        analysis.issues.push(`Missing bar function: ${funcName}`);
        analysis.recommendations.push(`Add ${funcName} for filter bar controls`);
      }
    });

    // Check for active filter management
    if (!jsContent.includes('addFilterTag') || !jsContent.includes('removeFilterTag')) {
      analysis.issues.push('Missing active filter tag management');
      analysis.recommendations.push('Add functions to manage active filter display tags');
    }

    // Check for URL parameter handling
    if (!analysis.facetsIntegration.hasURLUpdates) {
      analysis.issues.push('Missing URL parameter management');
      analysis.recommendations.push('Add URLSearchParams handling for filter state persistence');
    }
  }

  async validateAllComponents() {
    const components = [
      'sections/glass-filter.liquid',
      'sections/glass-filter-bar.liquid',
      'sections/glass-filter-sidebar.liquid'
    ];

    const results = {
      components: [],
      summary: {
        total: components.length,
        passed: 0,
        failed: 0,
        totalIssues: 0
      }
    };

    for (const component of components) {
      const validation = await this.validateComponent(component);
      results.components.push(validation);
      
      if (validation.validation?.passed) {
        results.summary.passed++;
      } else {
        results.summary.failed++;
      }
      
      if (validation.validation?.issues) {
        results.summary.totalIssues += validation.validation.issues.length;
      }
    }

    return results;
  }

  async generateInteractiveReport(results) {
    let report = `# JavaScript Pattern Validation Report
Generated: ${new Date().toISOString()}

## Summary
- Total Components: ${results.summary.total}
- Passed: ${results.summary.passed}
- Failed: ${results.summary.failed}
- Total Issues: ${results.summary.totalIssues}

`;

    results.components.forEach(component => {
      report += `## ${component.component}`;
      
      if (!component.hasScript) {
        report += `✅ No JavaScript - validation passed`;
        return;
      }
      
      const validation = component.validation;
      
      if (validation.passed) {
        report += `✅ **PASSED** - All patterns validated`;
      } else {
        report += `❌ **FAILED** - ${validation.issues.length} issues found`;
      }
      
      if (validation.functions?.length > 0) {
        report += `### Functions Found`;
        validation.functions.forEach(func => {
          report += `- \`${func.name}\``;
        });
      }
      
      if (validation.exports?.length > 0) {
        report += `### Global Exports`;
        validation.exports.forEach(exp => {
          report += `- \`window.${exp.name} = ${exp.value}\``;
        });
      }
      
      if (validation.events?.length > 0) {
        report += `### Event Listeners`;
        validation.events.forEach(event => {
          report += `- \`${event}\``;
        });
      }
      
      if (validation.issues?.length > 0) {
        report += `### ❌ Issues`;
        validation.issues.forEach(issue => {
          report += `- ${issue}`;
        });
      }
      
      if (validation.recommendations?.length > 0) {
        report += `### 💡 Recommendations`;
        validation.recommendations.forEach(rec => {
          report += `- ${rec}`;
        });
      }
      
      report += `---`;
    });

    const reportPath = path.join(this.baseDir, 'js-validation-report.md');
    await fs.writeFile(reportPath, report);
    
    console.log(`📊 JavaScript validation report generated: ${reportPath}`);
    return reportPath;
  }

  // Interactive validation methods
  async validateSingleFunction(functionName, jsContent) {
    const exists = jsContent.includes(functionName);
    const exported = new RegExp(`window\\.${functionName}\\s*=`).test(jsContent);
    
    return {
      function: functionName,
      exists,
      exported,
      recommendation: exists && !exported ? 
        `Add: window.${functionName} = ${functionName};` : 
        exists ? 'Function properly defined and exported' : 'Function not found'
    };
  }

  async suggestJavaScriptFix(componentPath, issueType) {
    const fixes = {
      'missing-exports': `
// Add to end of script block:
window.openGlassFilters = openGlassFilters;
window.closeGlassFilters = closeGlassFilters;
window.toggleFilterSection = toggleFilterSection;`,
      
      'missing-mobile': `
// Add mobile responsiveness:
function handleMobileResize() {
  if (window.innerWidth <= 768) {
    // Mobile-specific logic
  }
}
window.addEventListener('resize', handleMobileResize);`,
      
      'missing-facets': `
// Add Shopify facets integration:
document.addEventListener('DOMContentLoaded', function() {
  const facetInputs = document.querySelectorAll('facet-inputs-component input');
  facetInputs.forEach(input => {
    input.addEventListener('change', function() {
      console.log('Filter changed:', this.name, this.value);
    });
  });
});`,
      
      'missing-url-handling': `
// Add URL parameter handling:
function updateURLParameters(filters) {
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);
  
  // Update parameters based on filters
  Object.keys(filters).forEach(key => {
    params.set('filter.' + key, filters[key]);
  });
  
  window.history.replaceState({}, '', url.pathname + '?' + params.toString());
}`
    };

    return fixes[issueType] || 'No specific fix available for this issue type';
  }
}

module.exports = { JavaScriptPatternValidator };

// CLI usage for interactive validation
if (require.main === module) {
  const validator = new JavaScriptPatternValidator();
  
  validator.validateAllComponents()
    .then(results => {
      console.log('📊 JavaScript Pattern Validation Results:');
      console.log(`✅ Passed: ${results.summary.passed}`);
      console.log(`❌ Failed: ${results.summary.failed}`);
      console.log(`🔍 Total Issues: ${results.summary.totalIssues}`);
      
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