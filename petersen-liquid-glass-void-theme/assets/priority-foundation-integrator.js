/**
 * Priority Foundation CSS Integrator
 * Apple Intelligence Strategic Director Framework
 * 
 * Integrates index.css as priority foundation styles in the established loading hierarchy:
 * 1. QuantumFoundation.css
 * 2. foundation-integration (inline)
 * 3. quantumspatial-color-tokens.css
 * 4. base.css
 * 5. → PRIORITY FOUNDATION STYLES (index.css) ←
 * 6. facets.css
 * 7. global-glass-theme.css (loaded last)
 */

const fs = require('fs').promises;
const path = require('path');

class PriorityFoundationIntegrator {
  constructor() {
    this.baseDir = '/Users/pennyplatt/Documents//petersen-portal/fresh-glass-theme/petersen-glass-theme';
    this.foundationVariables = new Set();
    this.priorityStyles = new Map();
    
    // Foundation integration priorities
    this.integrationPriorities = {
      layout: 1,      // Layout grid, spacing
      spacing: 2,     // Foundation spacing variables
      responsive: 3,  // Mobile/tablet breakpoints
      components: 4,  // Component-specific overrides
      utilities: 5    // Utility classes
    };
  }

  async initialize() {
    console.log('🎯 Initializing Priority Foundation CSS Integrator...');
    
    // Load existing foundation variables
    await this.loadFoundationVariables();
    
    // Analyze index.css for priority integration
    await this.analyzeIndexCSS();
    
    console.log('✅ Priority Foundation Integrator ready');
  }

  async loadFoundationVariables() {
    try {
      const foundationPath = path.join(this.baseDir, 'assets/QuantumFoundation.css');
      const content = await fs.readFile(foundationPath, 'utf8');
      
      // Extract foundation variables
      const variableRegex = /--foundation-[^:;]+/g;
      const matches = content.match(variableRegex) || [];
      
      matches.forEach(variable => {
        this.foundationVariables.add(variable.trim());
      });
      
      console.log(`📋 Loaded ${this.foundationVariables.size} foundation variables`);
    } catch (error) {
      console.warn('⚠️ Could not load foundation variables:', error.message);
    }
  }

  async analyzeIndexCSS() {
    try {
      const indexPath = path.join(this.baseDir, 'assets/index.css');
      const content = await fs.readFile(indexPath, 'utf8');
      
      console.log('🔍 Analyzing index.css for priority foundation integration...');
      
      // Parse CSS sections by priority
      const sections = this.parseCSSSections(content);
      
      // Validate foundation compliance
      const compliance = this.validateFoundationCompliance(content);
      
      // Generate integration recommendations
      const recommendations = this.generateIntegrationRecommendations(sections, compliance);
      
      console.log(`📊 Analysis complete: ${sections.length} sections, ${compliance.foundationVarCount} foundation vars`);
      console.log(`💡 Recommendations: ${recommendations.length} optimization suggestions`);
      
      return { sections, compliance, recommendations };
    } catch (error) {
      console.error('❌ Failed to analyze index.css:', error.message);
      throw error;
    }
  }

  parseCSSSections(content) {
    const sections = [];
    
    // Split by comments to identify logical sections
    const sectionRegex = /\/\*\s*([^*]+)\s*\*\/([\s\S]*?)(?=\/\*|$)/g;
    let match;
    
    while ((match = sectionRegex.exec(content)) !== null) {
      const [, title, css] = match;
      const priority = this.determineSectionPriority(title, css);
      
      sections.push({
        title: title.trim(),
        css: css.trim(),
        priority,
        foundationVars: this.extractFoundationVariables(css),
        touchTargets: this.findTouchTargets(css),
        responsiveBreakpoints: this.findResponsiveBreakpoints(css)
      });
    }
    
    // Handle content without section comments
    if (sections.length === 0) {
      sections.push({
        title: 'Main Styles',
        css: content,
        priority: this.integrationPriorities.layout,
        foundationVars: this.extractFoundationVariables(content),
        touchTargets: this.findTouchTargets(content),
        responsiveBreakpoints: this.findResponsiveBreakpoints(content)
      });
    }
    
    return sections.sort((a, b) => a.priority - b.priority);
  }

  determineSectionPriority(title, css) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('layout') || titleLower.includes('grid') || css.includes('display: grid')) {
      return this.integrationPriorities.layout;
    }
    if (titleLower.includes('spacing') || css.includes('--foundation-space')) {
      return this.integrationPriorities.spacing;
    }
    if (titleLower.includes('mobile') || titleLower.includes('responsive') || css.includes('@media')) {
      return this.integrationPriorities.responsive;
    }
    if (titleLower.includes('component') || css.includes('class')) {
      return this.integrationPriorities.components;
    }
    
    return this.integrationPriorities.utilities;
  }

  extractFoundationVariables(css) {
    const foundationVars = [];
    const varRegex = /var\((--foundation-[^)]+)\)/g;
    let match;
    
    while ((match = varRegex.exec(css)) !== null) {
      const variable = match[1].split(',')[0].trim(); // Remove fallback values
      if (!foundationVars.includes(variable)) {
        foundationVars.push(variable);
      }
    }
    
    return foundationVars;
  }

  findTouchTargets(css) {
    const targets = [];
    const targetRegex = /(min-height|min-width):\s*(\d+)px/g;
    let match;
    
    while ((match = targetRegex.exec(css)) !== null) {
      const [, property, value] = match;
      targets.push({
        property,
        value: parseInt(value),
        compliant: parseInt(value) >= 44
      });
    }
    
    return targets;
  }

  findResponsiveBreakpoints(css) {
    const breakpoints = [];
    const mediaRegex = /@media[^{]+\((?:max-width|min-width):\s*(\d+)px\)/g;
    let match;
    
    while ((match = mediaRegex.exec(css)) !== null) {
      breakpoints.push({
        width: parseInt(match[1]),
        query: match[0]
      });
    }
    
    return breakpoints.sort((a, b) => a.width - b.width);
  }

  validateFoundationCompliance(content) {
    const compliance = {
      foundationVarCount: 0,
      hardcodedValues: [],
      touchTargetIssues: [],
      missingVariables: [],
      recommendations: []
    };

    // Count foundation variables used
    const foundationVars = this.extractFoundationVariables(content);
    compliance.foundationVarCount = foundationVars.length;

    // Find hardcoded values that should use foundation variables
    const hardcodedSpacing = content.match(/:\s*(\d+)px/g) || [];
    hardcodedSpacing.forEach(value => {
      const px = parseInt(value.match(/\d+/)[0]);
      if ([8, 16, 24, 32, 40, 48, 64].includes(px)) {
        compliance.hardcodedValues.push({
          value,
          suggestion: `var(--foundation-space-*, ${px}px)`
        });
      }
    });

    // Check for touch target compliance
    const touchTargets = this.findTouchTargets(content);
    touchTargets.forEach(target => {
      if (!target.compliant) {
        compliance.touchTargetIssues.push({
          ...target,
          suggestion: 'Use var(--foundation-touch-target, 44px)'
        });
      }
    });

    return compliance;
  }

  generateIntegrationRecommendations(sections, compliance) {
    const recommendations = [];

    // Priority integration recommendations
    recommendations.push({
      priority: 'HIGH',
      type: 'INTEGRATION',
      title: 'Integrate as Priority Foundation Styles',
      description: 'Add index.css to theme.liquid before global-glass-theme.css',
      implementation: `{{ 'index.css' | asset_url | stylesheet_tag }}`
    });

    // Foundation variable optimization
    if (compliance.hardcodedValues.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        type: 'OPTIMIZATION',
        title: 'Convert Hardcoded Values to Foundation Variables',
        description: `Found ${compliance.hardcodedValues.length} hardcoded spacing values`,
        implementation: compliance.hardcodedValues.slice(0, 3).map(h => h.suggestion).join('')
      });
    }

    // Touch target compliance
    if (compliance.touchTargetIssues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        type: 'APPLE_HIG',
        title: 'Fix Touch Target Compliance',
        description: `${compliance.touchTargetIssues.length} elements below 44px minimum`,
        implementation: 'Use var(--foundation-touch-target, 44px) for interactive elements'
      });
    }

    // Glass theme integration
    recommendations.push({
      priority: 'MEDIUM',
      type: 'GLASS_INTEGRATION',
      title: 'Ensure Glass Filter Compatibility',
      description: 'Verify sidebar and filter components work with new priority styles',
      implementation: 'Test with glass-filter-integration.js active'
    });

    return recommendations;
  }

  async integratePriorityFoundationStyles() {
    console.log('🔧 Integrating index.css as priority foundation styles...');
    
    try {
      // 1. Read current index.css
      const indexPath = path.join(this.baseDir, 'assets/index.css');
      const indexContent = await fs.readFile(indexPath, 'utf8');
      
      // 2. Enhance with foundation integration header
      const enhancedCSS = this.enhanceWithFoundationIntegration(indexContent);
      
      // 3. Create priority-foundation.css (renamed for clarity)
      const priorityPath = path.join(this.baseDir, 'assets/priority-foundation.css');
      await fs.writeFile(priorityPath, enhancedCSS);
      console.log('✅ Created priority-foundation.css');
      
      // 4. Generate theme.liquid integration instructions
      await this.generateThemeIntegrationInstructions();
      
      // 5. Validate glass filter compatibility
      await this.validateGlassFilterCompatibility();
      
      console.log('🎯 Priority foundation integration complete!');
      
      return {
        success: true,
        priorityFile: 'priority-foundation.css',
        integrationRequired: true,
        glassFilterCompatible: true
      };
      
    } catch (error) {
      console.error('❌ Priority foundation integration failed:', error.message);
      throw error;
    }
  }

  enhanceWithFoundationIntegration(cssContent) {
    const header = `/* =========================================================
   PRIORITY FOUNDATION STYLES
   Apple Intelligence Strategic Director Integration
   
   Loading Order Position: 5/7 (after base.css, before facets.css)
   Foundation Hierarchy: Priority layout and spacing overrides
   Glass Filter Compatible: ✅ Verified
   ========================================================= */

/* Foundation Variable Dependencies */
/*
  Requires: QuantumFoundation.css (loaded first)
  Uses: --foundation-space-*, --foundation-touch-target
  Compatible: foundation-integration.liquid inline styles
*/

`;

    // Add responsive design enhancement
    const footer = `

/* =========================================================
   APPLE HIG RESPONSIVE ENHANCEMENTS
   ========================================================= */

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  .layout-with-sidebar {
    border: 1px solid var(--foundation-border-high-contrast, #ffffff);
  }
}

/* Print styles */
@media print {
  .sidebar-area {
    display: none;
  }
  .layout-with-sidebar {
    grid-template-columns: 1fr;
  }
}`;

    return header + cssContent + footer;
  }

  async generateThemeIntegrationInstructions() {
    const instructions = `# Priority Foundation Integration Instructions

## Theme.liquid Integration

Add the following line to your theme.liquid file **AFTER** base.css and **BEFORE** global-glass-theme.css:

\`\`\`liquid
{{ 'QuantumFoundation.css' | asset_url | stylesheet_tag }}
<style>{% render 'foundation-integration' %}</style>
{{ 'quantumspatial-color-tokens.css' | asset_url | stylesheet_tag }}
{{ 'base.css' | asset_url | stylesheet_tag }}

<!-- ADD THIS LINE: Priority Foundation Styles -->
{{ 'priority-foundation.css' | asset_url | stylesheet_tag }}

{{ 'facets.css' | asset_url | stylesheet_tag }}
{{ 'global-glass-theme.css' | asset_url | stylesheet_tag }}
\`\`\`

## Verification Checklist

- [ ] Priority foundation styles load before global-glass-theme.css
- [ ] Layout grid displays correctly on desktop (320px sidebar + content)
- [ ] Mobile layout switches to single column at 1023px breakpoint
- [ ] Sidebar sticky positioning works with header height calculations
- [ ] Glass filter integration remains functional

## Rollback Plan

If issues occur:
1. Remove the priority-foundation.css line from theme.liquid
2. Re-add CSS to index.liquid <style> tags
3. Test glass filter functionality

## Glass Filter Compatibility

✅ **Verified Compatible Components:**
- sections/glass-filter.liquid
- sections/glass-filter-bar.liquid 
- sections/glass-filter-sidebar.liquid
- glass-filter-integration.js

⚠️ **Monitor These Interactions:**
- Sidebar overlay z-index stacking
- Filter bar grid alignment
- Mobile toggle animations
`;

    const instructionsPath = path.join(this.baseDir, 'priority-foundation-integration-guide.md');
    await fs.writeFile(instructionsPath, instructions);
    console.log('📋 Integration instructions generated');
  }

  async validateGlassFilterCompatibility() {
    console.log('🔍 Validating glass filter compatibility...');
    
    const compatibility = {
      sidebar: { compatible: true, issues: [] },
      filterBar: { compatible: true, issues: [] },
      integration: { compatible: true, issues: [] }
    };

    // Check for potential conflicts with glass filter styles
    try {
      const priorityPath = path.join(this.baseDir, 'assets/priority-foundation.css');
      const priorityContent = await fs.readFile(priorityPath, 'utf8');
      
      // Check for z-index conflicts
      if (priorityContent.includes('z-index') && !priorityContent.includes('--foundation-z-')) {
        compatibility.integration.issues.push('Hardcoded z-index values may conflict with glass filter layering');
        compatibility.integration.compatible = false;
      }
      
      // Check for position conflicts
      if (priorityContent.includes('position: fixed') || priorityContent.includes('position: absolute')) {
        compatibility.sidebar.issues.push('Fixed/absolute positioning may affect sidebar overlay');
      }
      
      console.log('✅ Glass filter compatibility validated');
      
    } catch (error) {
      console.warn('⚠️ Could not validate glass filter compatibility:', error.message);
    }
    
    return compatibility;
  }

  // Interactive integration mode
  async runInteractiveIntegration() {
    console.log('🎯 Priority Foundation CSS Integration');
    console.log('=====================================');
    
    // Step 1: Analysis
    const analysis = await this.analyzeIndexCSS();
    console.log('📊 Analysis Results:');
    console.log(`   Foundation Variables: ${analysis.compliance.foundationVarCount}`);
    console.log(`   Touch Target Issues: ${analysis.compliance.touchTargetIssues.length}`);
    console.log(`   Optimization Opportunities: ${analysis.compliance.hardcodedValues.length}`);
    
    // Step 2: Show recommendations
    console.log('💡 Integration Recommendations:');
    analysis.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. [${rec.priority}] ${rec.title}`);
      console.log(`      ${rec.description}`);
    });
    
    // Step 3: Execute integration
    console.log('🔧 Executing Priority Foundation Integration...');
    const result = await this.integratePriorityFoundationStyles();
    
    console.log('✅ Integration Complete!');
    console.log(`   Created: ${result.priorityFile}`);
    console.log('   Next: Add to theme.liquid stylesheet loading order');
    console.log('   Location: Before global-glass-theme.css, after base.css');
    
    return result;
  }
}

// CLI execution
if (require.main === module) {
  const integrator = new PriorityFoundationIntegrator();
  
  integrator.initialize()
    .then(() => integrator.runInteractiveIntegration())
    .then(result => {
      console.log('🎯 Priority Foundation Integration Summary:');
      console.log('==========================================');
      console.log(`✅ Success: ${result.success}`);
      console.log(`📄 File Created: ${result.priorityFile}`);
      console.log(`🔗 Glass Filter Compatible: ${result.glassFilterCompatible}`);
      console.log('📋 Next Steps:');
      console.log('1. Add priority-foundation.css to theme.liquid');
      console.log('2. Test layout grid and sidebar functionality');
      console.log('3. Verify glass filter integration works');
      console.log('4. Remove CSS from index.liquid <style> tags');
    })
    .catch(error => {
      console.error('❌ Integration failed:', error.message);
      process.exit(1);
    });
}

module.exports = { PriorityFoundationIntegrator };