#!/usr/bin/env node

/**
 * COMPREHENSIVE TOKEN DISCOVERY & UNIFICATION SCANNER
 *
 * Scans across all platforms and development phases:
 * - React ecommerce dashboard (already scanned)
 * - Framer components and plugins
 * - M4-accelerated pipeline tokens
 * - Shopify Liquid theme tokens
 * - Apple Intelligence Strategic Director tokens
 * - Quantum-Spatial design system tokens
 *
 * Goal: Understand and unify the full token ecosystem
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class ComprehensiveTokenScanner {
  constructor() {
    this.projectRoot = '/Users/pennyplatt/9bit-studios';
    
    // Define all scan locations based on your project structure
    this.scanLocations = {
      // Already scanned - React ecommerce dashboard
      reactEcommerce: [
        path.join(this.projectRoot, 'claude-quantum-design-framework'),
        path.join(this.projectRoot, 'quantum-spatial-design-system'),
        path.join(this.projectRoot, 'petersen-portal'),
        path.join(this.projectRoot, 'petersen-games')
      ],
      
      // Framer components and plugins
      framer: [
        path.join(this.projectRoot, 'framer-cloudflare-demo'),
        path.join(this.projectRoot, 'framer-cloudflare-demo/framer-output'),
      ],
      
      // M4-accelerated pipeline
      m4Pipeline: [
        path.join(this.projectRoot, 'apple-intelligence-strategic-director'),
        path.join(this.projectRoot, 'apple-intelligence-strategic-director/services'),
      ],
      
      // Shopify Liquid themes
      shopifyLiquid: [
        path.join(this.projectRoot, 'petersen-games/shopify-unified'),
        path.join(this.projectRoot, 'petersen-games/fresh-glass-theme'),
      ],
      
      // Sources of truth and foundations
      foundations: [
        path.join(this.projectRoot, '9bit-studios-foundations'),
        path.join(this.projectRoot, '9bit-studios-foundations/sources-of-truth'),
        path.join(this.projectRoot, '9bit-studios-foundations/validated-foundations'),
      ],
      
      // Additional token locations
      additional: [
        path.join(this.projectRoot, 'shared-frameworks'),
        path.join(this.projectRoot, '.claude'),
      ]
    };
    
    // Token file patterns to search for
    this.tokenPatterns = {
      // TypeScript/JavaScript token files
      typescript: [
        '**/*token*.ts',
        '**/*Token*.ts',
        '**/*tokens*.ts',
        '**/*Tokens*.ts',
        '**/*theme*.ts',
        '**/*Theme*.ts',
        '**/*style*.ts',
        '**/*Style*.ts',
        '**/*design*.ts',
        '**/*Design*.ts'
      ],
      
      // React/TSX component tokens
      react: [
        '**/*token*.tsx',
        '**/*Token*.tsx',
        '**/*tokens*.tsx',
        '**/*Tokens*.tsx',
        '**/*theme*.tsx',
        '**/*Theme*.tsx',
        '**/*Provider*.tsx',
        '**/*Context*.tsx'
      ],
      
      // CSS/SCSS token files
      styles: [
        '**/*token*.css',
        '**/*token*.scss',
        '**/*variable*.css',
        '**/*variable*.scss',
        '**/*theme*.css',
        '**/*theme*.scss',
        '**/_*.scss', // SCSS partials
        '**/variable*.scss'
      ],
      
      // Shopify Liquid tokens
      liquid: [
        '**/*.liquid',
        '**/settings_schema.json',
        '**/config.yml',
        '**/theme.liquid'
      ],
      
      // Framer tokens and configs
      framer: [
        '**/framer.config.js',
        '**/framer.config.ts',
        '**/component.tsx',
        '**/props.ts',
        '**/variants.ts'
      ],
      
      // JSON configuration files
      json: [
        '**/*token*.json',
        '**/*theme*.json',
        '**/*color*.json',
        '**/*palette*.json',
        '**/design-system*.json',
        '**/tailwind.config.js',
        '**/package.json'
      ],
      
      // M4 and Apple Intelligence specific
      apple: [
        '**/*m4*.ts',
        '**/*M4*.ts',
        '**/*apple*.ts',
        '**/*Apple*.ts',
        '**/*hig*.ts',
        '**/*HIG*.ts',
        '**/*neural*.ts',
        '**/*Neural*.ts'
      ]
    };
    
    this.discoveries = {
      tokenFiles: [],
      platforms: {},
      analysis: {},
      conflicts: [],
      opportunities: []
    };
  }

  async scanComprehensively() {
    console.log('🔍 COMPREHENSIVE TOKEN ECOSYSTEM DISCOVERY');
    console.log('=' .repeat(70));
    console.log('🎯 Scanning across all platforms and development phases...');

    // Step 1: Discover all token files
    await this.discoverAllTokenFiles();
    
    // Step 2: Analyze by platform
    await this.analyzePlatformTokens();
    
    // Step 3: Extract and analyze token content
    await this.analyzeTokenContent();
    
    // Step 4: Identify conflicts and opportunities
    await this.identifyUnificationOpportunities();
    
    // Step 5: Generate comprehensive report
    await this.generateUnificationReport();
    
    return this.discoveries;
  }

  async discoverAllTokenFiles() {
    console.log('📋 Step 1: Discovering all token files across platforms...');
    
    for (const [platform, locations] of Object.entries(this.scanLocations)) {
      console.log(`🔍 Scanning ${platform}...`);
      
      for (const location of locations) {
        if (fs.existsSync(location)) {
          await this.scanLocationForTokens(location, platform);
        } else {
          console.log(`   ⚪ ${location} - Not found`);
        }
      }
    }
    
    console.log(`✅ Discovery complete: ${this.discoveries.tokenFiles.length} token files found`);
  }

  async scanLocationForTokens(location, platform) {
    try {
      console.log(`   📁 ${path.relative(this.projectRoot, location)}`);
      
      // Scan for all token patterns
      for (const [type, patterns] of Object.entries(this.tokenPatterns)) {
        for (const pattern of patterns) {
          const files = this.findFilesWithPattern(location, pattern);
          
          files.forEach(file => {
            const tokenFile = {
              path: file,
              relativePath: path.relative(this.projectRoot, file),
              platform: platform,
              type: type,
              size: this.getFileSize(file),
              modified: this.getFileModified(file),
              hasContent: this.getFileSize(file) > 0,
              extractedFrom: this.detectExtractionSource(file)
            };
            
            this.discoveries.tokenFiles.push(tokenFile);
            console.log(`     ✅ ${type}: ${path.basename(file)} (${this.formatSize(tokenFile.size)})`);
          });
        }
      }
    } catch (error) {
      console.log(`   ❌ Error scanning ${location}:`, error.message);
    }
  }

  findFilesWithPattern(location, pattern) {
    try {
      // Use find command for better performance with complex patterns
      const command = `find "${location}" -name "${pattern}" -type f 2>/dev/null || true`;
      const result = execSync(command, { encoding: 'utf8' });
      return result.trim() ? result.trim().split('') : [];
    } catch (error) {
      return [];
    }
  }

  async analyzePlatformTokens() {
    console.log('📊 Step 2: Analyzing tokens by platform...');
    
    // Group by platform
    for (const tokenFile of this.discoveries.tokenFiles) {
      if (!this.discoveries.platforms[tokenFile.platform]) {
        this.discoveries.platforms[tokenFile.platform] = {
          files: [],
          types: new Set(),
          totalSize: 0,
          hasContent: 0,
          isEmpty: 0
        };
      }
      
      const platform = this.discoveries.platforms[tokenFile.platform];
      platform.files.push(tokenFile);
      platform.types.add(tokenFile.type);
      platform.totalSize += tokenFile.size;
      
      if (tokenFile.hasContent) {
        platform.hasContent++;
      } else {
        platform.isEmpty++;
      }
    }
    
    // Report platform analysis
    for (const [platformName, platform] of Object.entries(this.discoveries.platforms)) {
      console.log(`🎯 ${platformName.toUpperCase()}`);
      console.log(`   📁 Files: ${platform.files.length}`);
      console.log(`   📊 Types: ${Array.from(platform.types).join(', ')}`);
      console.log(`   💾 Total Size: ${this.formatSize(platform.totalSize)}`);
      console.log(`   ✅ With Content: ${platform.hasContent}`);
      console.log(`   ⚪ Empty: ${platform.isEmpty}`);
      
      // Show top files by size
      const topFiles = platform.files
        .filter(f => f.hasContent)
        .sort((a, b) => b.size - a.size)
        .slice(0, 3);
        
      if (topFiles.length > 0) {
        console.log(`   🔝 Top Files:`);
        topFiles.forEach(file => {
          console.log(`      • ${path.basename(file.path)} (${this.formatSize(file.size)})`);
        });
      }
    }
  }

  async analyzeTokenContent() {
    console.log('🔬 Step 3: Analyzing token content and patterns...');
    
    const contentAnalysis = {
      colorTokens: [],
      spacingTokens: [],
      typographyTokens: [],
      componentTokens: [],
      liquidTokens: [],
      framerTokens: [],
      m4Tokens: [],
      appleHIGTokens: []
    };
    
    // Analyze files with content
    const filesToAnalyze = this.discoveries.tokenFiles
      .filter(f => f.hasContent && f.size > 100) // Focus on substantial files
      .sort((a, b) => b.size - a.size); // Largest first
    
    for (const tokenFile of filesToAnalyze.slice(0, 20)) { // Top 20 files
      try {
        const content = fs.readFileSync(tokenFile.path, 'utf8');
        const analysis = await this.analyzeFileContent(content, tokenFile);
        
        // Categorize findings
        if (analysis.hasColors) contentAnalysis.colorTokens.push(tokenFile);
        if (analysis.hasSpacing) contentAnalysis.spacingTokens.push(tokenFile);
        if (analysis.hasTypography) contentAnalysis.typographyTokens.push(tokenFile);
        if (analysis.hasComponents) contentAnalysis.componentTokens.push(tokenFile);
        if (analysis.hasLiquid) contentAnalysis.liquidTokens.push(tokenFile);
        if (analysis.hasFramer) contentAnalysis.framerTokens.push(tokenFile);
        if (analysis.hasM4) contentAnalysis.m4Tokens.push(tokenFile);
        if (analysis.hasAppleHIG) contentAnalysis.appleHIGTokens.push(tokenFile);
        
        tokenFile.contentAnalysis = analysis;
        
        console.log(`   ✅ ${path.basename(tokenFile.path)}: ${analysis.summary}`);
        
      } catch (error) {
        console.log(`   ❌ ${path.basename(tokenFile.path)}: Analysis failed`);
      }
    }
    
    this.discoveries.analysis = contentAnalysis;
    
    // Report content analysis
    console.log(`📊 CONTENT ANALYSIS SUMMARY:`);
    console.log(`   🎨 Color Systems: ${contentAnalysis.colorTokens.length}`);
    console.log(`   📏 Spacing Systems: ${contentAnalysis.spacingTokens.length}`);
    console.log(`   📝 Typography Systems: ${contentAnalysis.typographyTokens.length}`);
    console.log(`   🧩 Component Systems: ${contentAnalysis.componentTokens.length}`);
    console.log(`   💧 Shopify Liquid: ${contentAnalysis.liquidTokens.length}`);
    console.log(`   🎬 Framer Integration: ${contentAnalysis.framerTokens.length}`);
    console.log(`   🧠 M4 Optimization: ${contentAnalysis.m4Tokens.length}`);
    console.log(`   🍎 Apple HIG Compliance: ${contentAnalysis.appleHIGTokens.length}`);
  }

  async analyzeFileContent(content, tokenFile) {
    const analysis = {
      lines: content.split('').length,
      size: content.length,
      hasColors: false,
      hasSpacing: false,
      hasTypography: false,
      hasComponents: false,
      hasLiquid: false,
      hasFramer: false,
      hasM4: false,
      hasAppleHIG: false,
      tokenCount: 0,
      summary: ''
    };
    
    // Color pattern detection
    const colorPatterns = [
      /#[0-9a-fA-F]{6}/g,           // Hex colors
      /rgb\(/g,                     // RGB colors
      /rgba\(/g,                    // RGBA colors
      /hsl\(/g,                     // HSL colors
      /color.*:/g,                  // Color properties
      /primary.*color/gi,           // Primary color tokens
      /secondary.*color/gi          // Secondary color tokens
    ];
    
    analysis.hasColors = colorPatterns.some(pattern => pattern.test(content));
    
    // Spacing pattern detection
    const spacingPatterns = [
      /spacing/gi,
      /margin/gi,
      /padding/gi,
      /gap/gi,
      /\d+px/g,
      /\d+rem/g,
      /grid/gi
    ];
    
    analysis.hasSpacing = spacingPatterns.some(pattern => pattern.test(content));
    
    // Typography pattern detection
    const typographyPatterns = [
      /font/gi,
      /typography/gi,
      /text/gi,
      /heading/gi,
      /body/gi,
      /SF Pro/gi,
      /system-ui/gi
    ];
    
    analysis.hasTypography = typographyPatterns.some(pattern => pattern.test(content));
    
    // Component pattern detection
    analysis.hasComponents = /component|Component|export.*function|export.*const.*=/gi.test(content);
    
    // Shopify Liquid detection
    analysis.hasLiquid = /\{\{|\{\%|liquid|settings\./gi.test(content);
    
    // Framer detection
    analysis.hasFramer = /framer|Framer|motion\.|animate|variant/gi.test(content);
    
    // M4 optimization detection
    analysis.hasM4 = /m4|M4|neural|Neural|acceleration|apple.*intelligence/gi.test(content);
    
    // Apple HIG detection
    analysis.hasAppleHIG = /apple|Apple|HIG|hig|system.*color|touch.*target/gi.test(content);
    
    // Token counting (rough estimate)
    const tokenMatches = content.match(/export.*=|const.*=|let.*=|var.*=/g);
    analysis.tokenCount = tokenMatches ? tokenMatches.length : 0;
    
    // Generate summary
    const features = [];
    if (analysis.hasColors) features.push('Colors');
    if (analysis.hasSpacing) features.push('Spacing');
    if (analysis.hasTypography) features.push('Typography');
    if (analysis.hasComponents) features.push('Components');
    if (analysis.hasLiquid) features.push('Liquid');
    if (analysis.hasFramer) features.push('Framer');
    if (analysis.hasM4) features.push('M4');
    if (analysis.hasAppleHIG) features.push('Apple HIG');
    
    analysis.summary = `${analysis.tokenCount} tokens, ${features.join(', ')}`;
    
    return analysis;
  }

  async identifyUnificationOpportunities() {
    console.log('🔗 Step 4: Identifying unification opportunities...');
    
    // Find duplicate token patterns
    const tokenNames = new Map();
    const colorSystems = [];
    const spacingSystems = [];
    const typographySystems = [];
    
    for (const tokenFile of this.discoveries.tokenFiles) {
      if (tokenFile.contentAnalysis) {
        const analysis = tokenFile.contentAnalysis;
        
        if (analysis.hasColors) colorSystems.push(tokenFile);
        if (analysis.hasSpacing) spacingSystems.push(tokenFile);
        if (analysis.hasTypography) typographySystems.push(tokenFile);
      }
    }
    
    // Identify conflicts and opportunities
    this.discoveries.conflicts = [
      {
        type: 'Color System Fragmentation',
        count: colorSystems.length,
        files: colorSystems.map(f => f.relativePath),
        recommendation: 'Unify into single comprehensive color system'
      },
      {
        type: 'Spacing System Duplication',
        count: spacingSystems.length,
        files: spacingSystems.map(f => f.relativePath),
        recommendation: 'Consolidate to Apple 8pt grid system'
      },
      {
        type: 'Typography Inconsistency',
        count: typographySystems.length,
        files: typographySystems.map(f => f.relativePath),
        recommendation: 'Standardize on Apple HIG typography scale'
      }
    ];
    
    // Unification opportunities
    this.discoveries.opportunities = [
      {
        title: 'Unified Token Export System',
        description: 'Create single index.ts that exports all platform-specific tokens',
        impact: 'High',
        effort: 'Medium'
      },
      {
        title: 'Cross-Platform Token Bridge',
        description: 'Build system to translate tokens between React, Liquid, and Framer',
        impact: 'High',
        effort: 'High'
      },
      {
        title: 'M4-Accelerated Token Pipeline',
        description: 'Optimize token processing with Apple Neural Engine',
        impact: 'Medium',
        effort: 'Low'
      },
      {
        title: 'Automated Token Validation',
        description: 'Real-time validation across all platforms and formats',
        impact: 'High',
        effort: 'Medium'
      }
    ];
    
    console.log(`✅ Identified ${this.discoveries.conflicts.length} conflicts and ${this.discoveries.opportunities.length} opportunities`);
  }

  async generateUnificationReport() {
    console.log('📋 Step 5: Generating comprehensive unification report...');
    
    const reportPath = path.join(this.projectRoot, 'COMPREHENSIVE_TOKEN_DISCOVERY_REPORT.md');
    
    const report = this.buildUnificationReport();
    
    fs.writeFileSync(reportPath, report);
    
    console.log(`✅ Report generated: ${reportPath}`);
    console.log('🎯 NEXT STEPS:');
    console.log('1. Review the comprehensive discovery report');
    console.log('2. Prioritize unification opportunities');
    console.log('3. Begin with highest impact, lowest effort items');
    console.log('4. Build unified token export system');
  }

  buildUnificationReport() {
    const totalFiles = this.discoveries.tokenFiles.length;
    const totalSize = this.discoveries.tokenFiles.reduce((sum, f) => sum + f.size, 0);
    const withContent = this.discoveries.tokenFiles.filter(f => f.hasContent).length;
    
    return `# Comprehensive Token Discovery & Unification Report

## 📊 Executive Summary

**Token Ecosystem Analysis**: ${new Date().toLocaleDateString()}
- **Total Files Discovered**: ${totalFiles}
- **Files with Content**: ${withContent}
- **Total Size**: ${this.formatSize(totalSize)}
- **Platforms Scanned**: ${Object.keys(this.discoveries.platforms).length}

## 🎯 Platform Distribution

${Object.entries(this.discoveries.platforms).map(([platform, data]) => `
### ${platform.toUpperCase()}
- Files: ${data.files.length}
- Types: ${Array.from(data.types).join(', ')}
- Size: ${this.formatSize(data.totalSize)}
- Content Ratio: ${Math.round((data.hasContent / data.files.length) * 100)}%
`).join('')}

## 🔬 Content Analysis

### Token Systems Discovered
- 🎨 **Color Systems**: ${this.discoveries.analysis.colorTokens?.length || 0}
- 📏 **Spacing Systems**: ${this.discoveries.analysis.spacingTokens?.length || 0}
- 📝 **Typography Systems**: ${this.discoveries.analysis.typographyTokens?.length || 0}
- 🧩 **Component Systems**: ${this.discoveries.analysis.componentTokens?.length || 0}
- 💧 **Shopify Liquid**: ${this.discoveries.analysis.liquidTokens?.length || 0}
- 🎬 **Framer Integration**: ${this.discoveries.analysis.framerTokens?.length || 0}
- 🧠 **M4 Optimization**: ${this.discoveries.analysis.m4Tokens?.length || 0}
- 🍎 **Apple HIG Compliance**: ${this.discoveries.analysis.appleHIGTokens?.length || 0}

## ⚠️ Unification Conflicts

${this.discoveries.conflicts.map(conflict => `
### ${conflict.type}
- **Count**: ${conflict.count} systems
- **Recommendation**: ${conflict.recommendation}
- **Files**:
${conflict.files.map(f => `  - ${f}`).join('')}
`).join('')}

## 🚀 Unification Opportunities

${this.discoveries.opportunities.map((opp, i) => `
### ${i + 1}. ${opp.title}
- **Description**: ${opp.description}
- **Impact**: ${opp.impact}
- **Effort**: ${opp.effort}
`).join('')}

## 📁 Complete File Inventory

${this.discoveries.tokenFiles
  .filter(f => f.hasContent)
  .sort((a, b) => b.size - a.size)
  .map(file => `
### ${path.basename(file.path)}
- **Path**: \`${file.relativePath}\`
- **Platform**: ${file.platform}
- **Type**: ${file.type}
- **Size**: ${this.formatSize(file.size)}
- **Modified**: ${file.modified}
${file.contentAnalysis ? `- **Content**: ${file.contentAnalysis.summary}` : ''}
`).join('')}

## 🎯 Recommended Unification Strategy

### Phase 1: Consolidation (Week 1)
1. **Merge Color Systems** - Unify all color tokens into comprehensive system
2. **Standardize Spacing** - Adopt Apple 8pt grid across all platforms
3. **Typography Alignment** - Implement Apple HIG typography scale

### Phase 2: Cross-Platform Bridge (Week 2)
1. **Token Translation System** - React ↔ Liquid ↔ Framer
2. **Unified Export System** - Single source of truth with platform adapters
3. **Validation Pipeline** - Real-time token validation

### Phase 3: M4 Optimization (Week 3)
1. **Neural Engine Acceleration** - Optimize token processing
2. **Apple Intelligence Integration** - Smart token suggestions
3. **Performance Monitoring** - Token usage analytics

### Phase 4: Production Deployment (Week 4)
1. **Vercel Integration** - Deploy unified token system
2. **Cross-Platform Testing** - Validate across all platforms
3. **Documentation** - Complete token system documentation

---
*Generated by Comprehensive Token Scanner - ${new Date().toISOString()}*
`;
  }

  // Utility methods
  getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch {
      return 0;
    }
  }

  getFileModified(filePath) {
    try {
      return fs.statSync(filePath).mtime.toISOString().split('T')[0];
    } catch {
      return 'unknown';
    }
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  detectExtractionSource(filePath) {
    if (filePath.includes('ecommerce') || filePath.includes('EcommerceSideMenu')) {
      return 'React Ecommerce Extraction';
    }
    if (filePath.includes('petersen') || filePath.includes('PetersenGames')) {
      return 'Gaming Component Extraction';
    }
    if (filePath.includes('enhanced') || filePath.includes('Enhanced')) {
      return 'Enhanced Component Extraction';
    }
    return 'Manual Creation';
  }
}

// Main execution
async function main() {
  const scanner = new ComprehensiveTokenScanner();
  
  try {
    const results = await scanner.scanComprehensively();
    
    console.log('🎉 COMPREHENSIVE TOKEN DISCOVERY COMPLETE!');
    console.log('📋 Summary:');
    console.log(`   📁 Total Files: ${results.tokenFiles.length}`);
    console.log(`   🎯 Platforms: ${Object.keys(results.platforms).join(', ')}`);
    console.log(`   ⚠️  Conflicts: ${results.conflicts.length}`);
    console.log(`   🚀 Opportunities: ${results.opportunities.length}`);
    
    console.log('📄 Check the generated report: COMPREHENSIVE_TOKEN_DISCOVERY_REPORT.md');
    
  } catch (error) {
    console.error('❌ Scanner failed:', error);
    process.exit(1);
  }
}

// Export for use as module
module.exports = { ComprehensiveTokenScanner };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
