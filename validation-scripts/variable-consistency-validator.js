#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * Variable Consistency Validator
 * Validates CSS variable definitions, usage, and fallback consistency
 */

class VariableConsistencyValidator {
  constructor() {
    this.themeDir = '/Users/pennyplatt/9bit-studios/petersen-portal/fresh-glass-theme/petersen-glass-theme';
    this.variableDefinitions = new Map();
    this.variableUsage = new Map();
    this.report = {
      timestamp: new Date().toISOString(),
      conflicts: [],
      undefinedVariables: [],
      inconsistentFallbacks: [],
      spacingIssues: []
    };
  }

  async validate(targetVariable = null) {
    console.log('🔍 VARIABLE CONSISTENCY VALIDATOR');
    console.log('=' + '='.repeat(60));
    
    if (targetVariable) {
      console.log(`Targeting specific variable: ${targetVariable}`);
    }
    
    try {
      // Step 1: Collect all variable definitions
      await this.collectVariableDefinitions();
      
      // Step 2: Collect all variable usage
      await this.collectVariableUsage();
      
      // Step 3: Validate consistency
      await this.validateConsistency(targetVariable);
      
      // Step 4: Generate report
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Validation error:', error);
    }
  }

  async collectVariableDefinitions() {
    console.log('📋 COLLECTING VARIABLE DEFINITIONS...');
    
    const assetsDir = path.join(this.themeDir, 'assets');
    const files = await fs.readdir(assetsDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));
    
    for (const file of cssFiles) {
      const content = await fs.readFile(path.join(assetsDir, file), 'utf8');
      const lines = content.split('');
      
      lines.forEach((line, index) => {
        // Match CSS variable definitions
        const matches = line.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g);
        
        for (const match of matches) {
          const varName = match[1];
          const value = match[2].trim();
          
          if (!this.variableDefinitions.has(varName)) {
            this.variableDefinitions.set(varName, []);
          }
          
          this.variableDefinitions.get(varName).push({
            file,
            line: index + 1,
            value,
            context: line.trim()
          });
        }
      });
    }
    
    console.log(`  Found ${this.variableDefinitions.size} unique variables`);
  }

  async collectVariableUsage() {
    console.log('📋 COLLECTING VARIABLE USAGE...');
    
    const assetsDir = path.join(this.themeDir, 'assets');
    const files = await fs.readdir(assetsDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));
    
    for (const file of cssFiles) {
      const content = await fs.readFile(path.join(assetsDir, file), 'utf8');
      const lines = content.split('');
      
      lines.forEach((line, index) => {
        // Match var() usage
        const matches = line.matchAll(/var\((--[a-zA-Z0-9-]+)(?:,\s*([^)]+))?\)/g);
        
        for (const match of matches) {
          const varName = match[1];
          const fallback = match[2] ? match[2].trim() : null;
          
          if (!this.variableUsage.has(varName)) {
            this.variableUsage.set(varName, []);
          }
          
          this.variableUsage.get(varName).push({
            file,
            line: index + 1,
            fallback,
            context: line.trim()
          });
        }
      });
    }
    
    console.log(`  Found ${this.variableUsage.size} variables being used`);
  }

  async validateConsistency(targetVariable) {
    console.log('🔍 VALIDATING CONSISTENCY...');
    
    // 1. Find conflicts (multiple definitions)
    for (const [varName, definitions] of this.variableDefinitions) {
      if (targetVariable && varName !== targetVariable) continue;
      
      const uniqueValues = [...new Set(definitions.map(d => d.value))];
      if (uniqueValues.length > 1) {
        this.report.conflicts.push({
          variable: varName,
          values: uniqueValues,
          definitions: definitions
        });
      }
    }
    
    // 2. Find undefined variables
    for (const [varName, usages] of this.variableUsage) {
      if (targetVariable && varName !== targetVariable) continue;
      
      if (!this.variableDefinitions.has(varName)) {
        this.report.undefinedVariables.push({
          variable: varName,
          usages: usages.slice(0, 5) // First 5 usages
        });
      }
    }
    
    // 3. Check fallback consistency
    for (const [varName, usages] of this.variableUsage) {
      if (targetVariable && varName !== targetVariable) continue;
      
      const fallbacks = usages.filter(u => u.fallback).map(u => u.fallback);
      const uniqueFallbacks = [...new Set(fallbacks)];
      
      if (uniqueFallbacks.length > 1) {
        this.report.inconsistentFallbacks.push({
          variable: varName,
          fallbacks: uniqueFallbacks,
          usages: usages.filter(u => u.fallback).slice(0, 5)
        });
      }
    }
    
    // 4. Validate spacing variables specifically
    await this.validateSpacingVariables(targetVariable);
    
    console.log(`  Found ${this.report.conflicts.length} conflicts`);
    console.log(`  Found ${this.report.undefinedVariables.length} undefined variables`);
    console.log(`  Found ${this.report.inconsistentFallbacks.length} inconsistent fallbacks`);
    console.log(`  Found ${this.report.spacingIssues.length} spacing issues`);
  }

  async validateSpacingVariables(targetVariable) {
    const spacingPattern = /space|padding|margin|gap/;
    const expectedValues = {
      'xs': ['4px', '0.25rem'],
      'sm': ['8px', '0.5rem', '12px'], // 12px is common on mobile
      'md': ['16px', '1rem'],
      'lg': ['24px', '1.5rem'],
      'xl': ['32px', '2rem'],
      '2xl': ['48px', '3rem']
    };
    
    for (const [varName, definitions] of this.variableDefinitions) {
      if (targetVariable && varName !== targetVariable) continue;
      
      if (spacingPattern.test(varName)) {
        // Check if it matches expected patterns
        for (const [size, validValues] of Object.entries(expectedValues)) {
          if (varName.includes(size)) {
            const actualValue = definitions[0].value;
            
            // Check if it's a valid value
            if (!validValues.includes(actualValue) && !actualValue.includes('var(')) {
              this.report.spacingIssues.push({
                variable: varName,
                expected: validValues,
                actual: actualValue,
                definitions: definitions
              });
            }
            
            // Check for mobile/tablet overrides
            await this.checkMobileOverrides(varName);
          }
        }
      }
    }
  }

  async checkMobileOverrides(varName) {
    // Check if this variable is overridden in media queries
    const cssFiles = ['priority-foundation.css', 'base.css'];
    
    for (const file of cssFiles) {
      try {
        const content = await fs.readFile(path.join(this.themeDir, 'assets', file), 'utf8');
        
        // Find media queries that redefine this variable
        const mediaQueryPattern = /@media[^{]+\{[^}]*}/gs;
        const matches = content.match(mediaQueryPattern);
        
        if (matches) {
          matches.forEach(query => {
            if (query.includes(varName)) {
              const condition = query.match(/@media([^{]+)/)?.[1];
              console.log(`    ${varName} overridden in media query: ${condition?.trim()}`);
            }
          });
        }
      } catch (error) {
        // File might not exist
      }
    }
  }

  async generateReport() {
    console.log('📊 GENERATING VALIDATION REPORT...');
    
    const report = {
      timestamp: this.report.timestamp,
      summary: {
        totalVariablesDefined: this.variableDefinitions.size,
        totalVariablesUsed: this.variableUsage.size,
        conflicts: this.report.conflicts.length,
        undefinedVariables: this.report.undefinedVariables.length,
        inconsistentFallbacks: this.report.inconsistentFallbacks.length,
        spacingIssues: this.report.spacingIssues.length
      },
      details: this.report
    };
    
    // Save JSON report
    await fs.writeFile(
      path.join(__dirname, 'variable-consistency-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    // Save readable report
    await this.generateReadableReport(report);
    
    console.log('✅ Reports generated:');
    console.log('  - variable-consistency-report.json');
    console.log('  - variable-consistency-report.md');
  }

  async generateReadableReport(report) {
    let markdown = `# Variable Consistency Report

Generated: ${report.timestamp}

## Summary

- **Variables Defined**: ${report.summary.totalVariablesDefined}
- **Variables Used**: ${report.summary.totalVariablesUsed}
- **Conflicts**: ${report.summary.conflicts}
- **Undefined Variables**: ${report.summary.undefinedVariables}
- **Inconsistent Fallbacks**: ${report.summary.inconsistentFallbacks}
- **Spacing Issues**: ${report.summary.spacingIssues}

## Variable Conflicts

${report.details.conflicts.slice(0, 20).map(conflict => {
  return `### ${conflict.variable}
**Values**: ${conflict.values.join(' vs ')}

${conflict.definitions.map(def => 
  `- \`${def.file}\` line ${def.line}: \`${def.value}\``
).join('')}
`;
}).join('')}

## Undefined Variables

${report.details.undefinedVariables.slice(0, 20).map(undef => {
  return `### ${undef.variable}
Used in:
${undef.usages.map(usage => 
  `- \`${usage.file}\` line ${usage.line}${usage.fallback ? ` (fallback: ${usage.fallback})` : ''}`
).join('')}
`;
}).join('')}

## Inconsistent Fallbacks

${report.details.inconsistentFallbacks.slice(0, 20).map(item => {
  return `### ${item.variable}
**Different fallbacks**: ${item.fallbacks.join(', ')}

${item.usages.map(usage => 
  `- \`${usage.file}\` line ${usage.line}: fallback = \`${usage.fallback}\``
).join('')}
`;
}).join('')}

## Spacing Issues

${report.details.spacingIssues.map(issue => {
  return `### ${issue.variable}
**Expected**: ${issue.expected.join(' or ')}
**Actual**: ${issue.actual}

Defined in:
${issue.definitions.map(def => 
  `- \`${def.file}\` line ${def.line}`
).join('')}
`;
}).join('')}

## Recommendations

1. **Resolve Conflicts**: Each variable should have only one value
2. **Define Missing Variables**: Create a central file for all undefined variables
3. **Standardize Fallbacks**: Use consistent fallback values for the same variable
4. **Fix Spacing Values**: Align spacing with expected values for consistency
5. **Document Overrides**: Clearly document why certain values differ from standards
`;

    await fs.writeFile(
      path.join(__dirname, 'variable-consistency-report.md'),
      markdown
    );
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const targetVariable = args[0] || null;

// Run the validator
const validator = new VariableConsistencyValidator();
validator.validate(targetVariable).catch(console.error);