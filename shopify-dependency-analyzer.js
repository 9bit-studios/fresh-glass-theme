#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * Shopify Theme Dependency & Bloat Analyzer
 * Identifies what's actually used vs. what's redundant
 */

class ShopifyDependencyAnalyzer {
  constructor(themeDir) {
    this.themeDir = themeDir || '/Users/pennyplatt/Documents/9BitStudios/petersen-portal/petersen-glass-theme';
    this.dependencies = new Map();
    this.usageMap = new Map();
    this.redundancies = new Map();
    this.report = {
      timestamp: new Date().toISOString(),
      totalFiles: 0,
      usedFiles: 0,
      unusedFiles: 0,
      redundantFiles: 0,
      criticalDependencies: [],
      safesToDelete: [],
      bloatAnalysis: {}
    };
  }

  async analyze() {
    console.log('🔍 SHOPIFY DEPENDENCY & BLOAT ANALYZER');
    console.log('=' + '='.repeat(60));
    console.log(`Analyzing: ${this.themeDir}`);
    
    try {
      // Step 1: Map all files and their relationships
      await this.mapAllFiles();
      
      // Step 2: Trace actual usage from templates
      await this.traceUsageFromTemplates();
      
      // Step 3: Identify CSS/JS dependencies
      await this.analyzeCSSJSDependencies();
      
      // Step 4: Find redundancies and duplicates  
      await this.findRedundancies();
      
      // Step 5: Generate cleanup recommendations
      await this.generateCleanupPlan();
      
      // Step 6: Create visual dependency map
      await this.createDependencyMap();
      
      return this.report;
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      throw error;
    }
  }

  async mapAllFiles() {
    console.log('📋 MAPPING ALL FILES...');
    
    const directories = ['sections', 'snippets', 'templates', 'layout', 'assets'];
    
    for (const dir of directories) {
      const dirPath = path.join(this.themeDir, dir);
      
      try {
        const files = await fs.readdir(dirPath);
        
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stats = await fs.stat(filePath);
          
          if (stats.isFile()) {
            const fileInfo = {
              path: filePath,
              relativePath: path.join(dir, file),
              type: this.getFileType(file),
              size: stats.size,
              modified: stats.mtime,
              directory: dir,
              usedBy: new Set(),
              uses: new Set(),
              analyzed: false
            };
            
            this.dependencies.set(file, fileInfo);
            this.report.totalFiles++;
          }
        }
      } catch (error) {
        console.warn(`  ⚠️  Could not read directory: ${dir}`);
      }
    }
    
    console.log(`  Found ${this.report.totalFiles} files to analyze`);
  }

  async traceUsageFromTemplates() {
    console.log('🔍 TRACING USAGE FROM TEMPLATES...');
    
    // Start from templates - these are the entry points
    const templates = Array.from(this.dependencies.values())
      .filter(file => file.directory === 'templates');
    
    for (const template of templates) {
      console.log(`  📄 Analyzing template: ${template.relativePath}`);
      await this.traceFileUsage(template);
    }
    
    // Also trace from layout files
    const layouts = Array.from(this.dependencies.values())
      .filter(file => file.directory === 'layout');
    
    for (const layout of layouts) {
      console.log(`  📄 Analyzing layout: ${layout.relativePath}`);
      await this.traceFileUsage(layout);
    }
  }

  async traceFileUsage(fileInfo) {
    if (fileInfo.analyzed) return;
    
    try {
      const content = await fs.readFile(fileInfo.path, 'utf8');
      fileInfo.analyzed = true;
      
      // Find all {% render %} calls
      const renderMatches = content.matchAll(/{% render ['"`]([^'"`]+)['"`]/g);
      for (const match of renderMatches) {
        const snippetName = match[1] + '.liquid';
        this.recordUsage(fileInfo, snippetName, 'render');
      }
      
      // Find all {% include %} calls (deprecated but still used)
      const includeMatches = content.matchAll(/{% include ['"`]([^'"`]+)['"`]/g);
      for (const match of includeMatches) {
        const snippetName = match[1] + '.liquid';
        this.recordUsage(fileInfo, snippetName, 'include');
      }
      
      // Find section references
      const sectionMatches = content.matchAll(/{% section ['"`]([^'"`]+)['"`]/g);
      for (const match of sectionMatches) {
        const sectionName = match[1] + '.liquid';
        this.recordUsage(fileInfo, sectionName, 'section');
      }
      
      // Find asset references
      const assetMatches = content.matchAll(/{{ ['"`]([^'"`]+\.(css|js|png|jpg|jpeg|gif|svg))['"`] \| asset_url/g);
      for (const match of assetMatches) {
        const assetName = match[1];
        this.recordUsage(fileInfo, assetName, 'asset');
      }
      
      // Find CSS/JS file references
      const styleMatches = content.matchAll(/['"`]([^'"`]+\.css)['"`]/g);
      for (const match of styleMatches) {
        this.recordUsage(fileInfo, match[1], 'stylesheet');
      }
      
      const scriptMatches = content.matchAll(/['"`]([^'"`]+\.js)['"`]/g);
      for (const match of scriptMatches) {
        this.recordUsage(fileInfo, match[1], 'script');
      }
      
      // Recursively analyze referenced files
      for (const referencedFile of fileInfo.uses) {
        const refFileInfo = this.dependencies.get(referencedFile);
        if (refFileInfo && !refFileInfo.analyzed) {
          await this.traceFileUsage(refFileInfo);
        }
      }
      
    } catch (error) {
      console.warn(`    ⚠️  Could not read file: ${fileInfo.relativePath}`);
    }
  }

  recordUsage(fromFile, toFileName, usageType) {
    const toFile = this.dependencies.get(toFileName);
    
    if (toFile) {
      fromFile.uses.add(toFileName);
      toFile.usedBy.add(fromFile.relativePath);
      
      // Track usage statistics
      if (!this.usageMap.has(toFileName)) {
        this.usageMap.set(toFileName, {
          file: toFile,
          usageCount: 0,
          usageTypes: new Set(),
          usedBy: new Set()
        });
      }
      
      const usage = this.usageMap.get(toFileName);
      usage.usageCount++;
      usage.usageTypes.add(usageType);
      usage.usedBy.add(fromFile.relativePath);
    }
  }

  async analyzeCSSJSDependencies() {
    console.log('📋 ANALYZING CSS/JS DEPENDENCIES...');
    
    const cssFiles = Array.from(this.dependencies.values())
      .filter(file => file.relativePath.endsWith('.css'));
    
    const jsFiles = Array.from(this.dependencies.values())
      .filter(file => file.relativePath.endsWith('.js'));
    
    // Analyze CSS imports and dependencies
    for (const cssFile of cssFiles) {
      await this.analyzeCSSFile(cssFile);
    }
    
    // Analyze JS imports and dependencies
    for (const jsFile of jsFiles) {
      await this.analyzeJSFile(jsFile);
    }
  }

  async analyzeCSSFile(fileInfo) {
    try {
      const content = await fs.readFile(fileInfo.path, 'utf8');
      
      // Find @import statements
      const importMatches = content.matchAll(/@import\s+['"`]([^'"`]+)['"`]/g);
      for (const match of importMatches) {
        this.recordUsage(fileInfo, match[1], 'css-import');
      }
      
      // Find url() references
      const urlMatches = content.matchAll(/url\(['"`]?([^'"`\)]+)['"`]?\)/g);
      for (const match of urlMatches) {
        const urlPath = match[1];
        if (!urlPath.startsWith('http') && !urlPath.startsWith('data:')) {
          this.recordUsage(fileInfo, path.basename(urlPath), 'css-url');
        }
      }
      
      // Count selectors, rules, and variables
      const selectors = content.match(/[^{}]+\{[^{}]*\}/g) || [];
      const variables = content.match(/--[a-zA-Z][a-zA-Z0-9-]*:/g) || [];
      
      fileInfo.cssStats = {
        selectors: selectors.length,
        variables: variables.length,
        lines: content.split('').length
      };
      
    } catch (error) {
      console.warn(`    ⚠️  Could not analyze CSS: ${fileInfo.relativePath}`);
    }
  }

  async analyzeJSFile(fileInfo) {
    try {
      const content = await fs.readFile(fileInfo.path, 'utf8');
      
      // Find import/require statements
      const importMatches = content.matchAll(/(?:import|require)\s*\(?['"`]([^'"`]+)['"`]\)?/g);
      for (const match of importMatches) {
        this.recordUsage(fileInfo, path.basename(match[1]), 'js-import');
      }
      
      // Count functions and classes
      const functions = content.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || [];
      const classes = content.match(/class\s+\w+/g) || [];
      
      fileInfo.jsStats = {
        functions: functions.length,
        classes: classes.length,
        lines: content.split('').length
      };
      
    } catch (error) {
      console.warn(`    ⚠️  Could not analyze JS: ${fileInfo.relativePath}`);
    }
  }

  async findRedundancies() {
    console.log('🔍 FINDING REDUNDANCIES...');
    
    // Group files by similar names/purposes
    const groups = new Map();
    
    for (const [fileName, fileInfo] of this.dependencies) {
      const baseName = this.getBaseName(fileName);
      
      if (!groups.has(baseName)) {
        groups.set(baseName, []);
      }
      groups.get(baseName).push(fileInfo);
    }
    
    // Identify potential duplicates
    for (const [baseName, files] of groups) {
      if (files.length > 1) {
        const redundancyInfo = await this.analyzeRedundancy(baseName, files);
        if (redundancyInfo.isDuplicate) {
          this.redundancies.set(baseName, redundancyInfo);
          this.report.redundantFiles += files.length - 1;
        }
      }
    }
    
    console.log(`  Found ${this.redundancies.size} potential redundancy groups`);
  }

  async analyzeRedundancy(baseName, files) {
    const redundancyInfo = {
      baseName,
      files,
      isDuplicate: false,
      similarity: 0,
      recommendation: 'keep-all'
    };
    
    if (files.length === 2) {
      // Compare file contents for similarity
      try {
        const content1 = await fs.readFile(files[0].path, 'utf8');
        const content2 = await fs.readFile(files[1].path, 'utf8');
        
        redundancyInfo.similarity = this.calculateSimilarity(content1, content2);
        
        if (redundancyInfo.similarity > 0.8) {
          redundancyInfo.isDuplicate = true;
          
          // Determine which file to keep
          const usage1 = this.usageMap.get(files[0].relativePath.split('/').pop())?.usageCount || 0;
          const usage2 = this.usageMap.get(files[1].relativePath.split('/').pop())?.usageCount || 0;
          
          if (usage1 > usage2) {
            redundancyInfo.recommendation = `keep-${files[0].relativePath}`;
          } else if (usage2 > usage1) {
            redundancyInfo.recommendation = `keep-${files[1].relativePath}`;
          } else {
            redundancyInfo.recommendation = `keep-newer`;
          }
        }
      } catch (error) {
        // Could not compare files
      }
    }
    
    return redundancyInfo;
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  async generateCleanupPlan() {
    console.log('📋 GENERATING CLEANUP PLAN...');
    
    // Identify unused files
    const unusedFiles = [];
    const criticalFiles = [];
    const safesToDelete = [];
    
    for (const [fileName, fileInfo] of this.dependencies) {
      const usage = this.usageMap.get(fileName);
      
      if (!usage || usage.usageCount === 0) {
        unusedFiles.push(fileInfo);
        this.report.unusedFiles++;
        
        // Determine if it's safe to delete
        if (this.isSafeToDelete(fileInfo)) {
          safesToDelete.push({
            file: fileInfo.relativePath,
            reason: 'Not referenced by any template or active file',
            size: fileInfo.size,
            lastModified: fileInfo.modified
          });
        }
      } else {
        this.report.usedFiles++;
        
        // Identify critical dependencies
        if (usage.usageCount > 5 || usage.usageTypes.has('layout')) {
          criticalFiles.push({
            file: fileInfo.relativePath,
            usageCount: usage.usageCount,
            usageTypes: Array.from(usage.usageTypes),
            usedBy: Array.from(usage.usedBy)
          });
        }
      }
    }
    
    this.report.criticalDependencies = criticalFiles;
    this.report.safesToDelete = safesToDelete;
    
    console.log(`  🗑️  ${safesToDelete.length} files safe to delete`);
    console.log(`  ⚠️  ${criticalFiles.length} critical dependencies identified`);
  }

  isSafeToDelete(fileInfo) {
    // Files that are generally safe to delete if unused
    const safePatterns = [
      /\.backup$/,
      /\.old$/,
      /\.tmp$/,
      /test.*\.liquid$/,
      /demo.*\.liquid$/,
      /unused.*\./,
      /deprecated.*\./
    ];
    
    // Files that should be kept even if unused (might be used dynamically)
    const keepPatterns = [
      /theme\.liquid$/,
      /404\.liquid$/,
      /robots\.txt$/,
      /sitemap\.xml$/
    ];
    
    for (const pattern of keepPatterns) {
      if (pattern.test(fileInfo.relativePath)) {
        return false;
      }
    }
    
    for (const pattern of safePatterns) {
      if (pattern.test(fileInfo.relativePath)) {
        return true;
      }
    }
    
    // If not used and not critical, it's probably safe
    return fileInfo.directory !== 'layout' && fileInfo.directory !== 'templates';
  }

  async createDependencyMap() {
    console.log('🗺️  CREATING DEPENDENCY MAP...');
    
    const dependencyMap = {
      nodes: [],
      edges: [],
      clusters: {}
    };
    
    // Create nodes for used files
    for (const [fileName, usage] of this.usageMap) {
      const fileInfo = usage.file;
      
      dependencyMap.nodes.push({
        id: fileName,
        label: fileName,
        type: fileInfo.directory,
        size: fileInfo.size,
        usageCount: usage.usageCount,
        critical: usage.usageCount > 5
      });
    }
    
    // Create edges for dependencies
    for (const [fileName, usage] of this.usageMap) {
      const fileInfo = usage.file;
      
      for (const dependency of fileInfo.uses) {
        if (this.usageMap.has(dependency)) {
          dependencyMap.edges.push({
            from: fileName,
            to: dependency,
            type: 'depends-on'
          });
        }
      }
    }
    
    // Group by directory
    for (const node of dependencyMap.nodes) {
      const dir = this.dependencies.get(node.id)?.directory || 'unknown';
      if (!dependencyMap.clusters[dir]) {
        dependencyMap.clusters[dir] = [];
      }
      dependencyMap.clusters[dir].push(node.id);
    }
    
    this.report.dependencyMap = dependencyMap;
  }

  getFileType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const baseName = path.basename(fileName, ext);
    
    if (ext === '.liquid') {
      if (fileName.includes('section')) return 'section';
      if (fileName.includes('snippet')) return 'snippet';
      return 'template';
    }
    
    return ext.slice(1) || 'unknown';
  }

  getBaseName(fileName) {
    // Remove common suffixes and variations
    return fileName
      .replace(/\.(liquid|css|js|scss)$/, '')
      .replace(/[-_](mobile|desktop|tablet)$/, '')
      .replace(/[-_](v2|new|old)$/, '')
      .replace(/[-_]\d+$/, '');
  }

  async generateReport() {
    console.log('📊 GENERATING ANALYSIS REPORT...');
    
    // Calculate bloat statistics
    const totalSize = Array.from(this.dependencies.values())
      .reduce((sum, file) => sum + file.size, 0);
    
    const unusedSize = this.report.safesToDelete
      .reduce((sum, item) => sum + item.size, 0);
    
    this.report.bloatAnalysis = {
      totalSize: this.formatBytes(totalSize),
      unusedSize: this.formatBytes(unusedSize),
      bloatPercentage: ((unusedSize / totalSize) * 100).toFixed(1),
      potentialSavings: this.formatBytes(unusedSize)
    };
    
    // Save detailed report
    const reportPath = path.join(__dirname, 'dependency-analysis-report.json');
    await fs.writeFile(reportPath, JSON.stringify(this.report, null, 2));
    
    // Generate human-readable summary
    await this.generateSummaryReport();
    
    console.log(`✅ Analysis complete!`);
    console.log(`📄 Detailed report: ${reportPath}`);
    console.log(`📄 Summary report: dependency-analysis-summary.md`);
    
    return this.report;
  }

  async generateSummaryReport() {
    const summary = `# Shopify Theme Dependency Analysis Report

Generated: ${this.report.timestamp}

## Summary Statistics

- **Total Files**: ${this.report.totalFiles}
- **Used Files**: ${this.report.usedFiles}
- **Unused Files**: ${this.report.unusedFiles}
- **Safe to Delete**: ${this.report.safesToDelete.length}
- **Redundant Files**: ${this.report.redundantFiles}

## Bloat Analysis

- **Total Theme Size**: ${this.report.bloatAnalysis.totalSize}
- **Unused File Size**: ${this.report.bloatAnalysis.unusedSize}
- **Bloat Percentage**: ${this.report.bloatAnalysis.bloatPercentage}%
- **Potential Savings**: ${this.report.bloatAnalysis.potentialSavings}

## Critical Dependencies

${this.report.criticalDependencies.slice(0, 10).map(dep => 
  `- **${dep.file}**: Used ${dep.usageCount} times by ${dep.usedBy.slice(0, 3).join(', ')}${dep.usedBy.length > 3 ? '...' : ''}`
).join('')}

## Safe to Delete

${this.report.safesToDelete.slice(0, 20).map(item => 
  `- \`${item.file}\` (${this.formatBytes(item.size)}) - ${item.reason}`
).join('')}

## Redundancy Groups

${Array.from(this.redundancies.entries()).slice(0, 10).map(([baseName, info]) => 
  `- **${baseName}**: ${info.files.length} similar files (${Math.round(info.similarity * 100)}% similarity)`
).join('')}

## Recommendations

### High Priority
1. **Delete unused files**: Remove ${this.report.safesToDelete.length} files to save ${this.report.bloatAnalysis.potentialSavings}
2. **Consolidate redundant files**: Merge similar files in ${this.redundancies.size} groups
3. **Optimize critical dependencies**: Review heavily-used files for optimization

### Medium Priority
1. **Review CSS/JS bundling**: Combine related stylesheets and scripts
2. **Audit asset references**: Ensure all referenced assets exist
3. **Update dependency paths**: Use consistent naming conventions

### Low Priority
1. **Document dependencies**: Create dependency documentation
2. **Implement file naming standards**: Use consistent naming patterns
3. **Regular cleanup**: Set up automated dependency checking
`;

    await fs.writeFile(
      path.join(__dirname, 'dependency-analysis-summary.md'),
      summary
    );
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI Usage
if (require.main === module) {
  const themeDir = process.argv[2] || process.cwd();
  
  console.log('🚀 Starting Shopify Theme Dependency Analysis...');
  console.log(`📁 Theme Directory: ${themeDir}`);
  
  const analyzer = new ShopifyDependencyAnalyzer(themeDir);
  
  analyzer.analyze()
    .then(report => {
      return analyzer.generateReport();
    })
    .then(() => {
      console.log('🎉 Analysis completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    });
}

module.exports = ShopifyDependencyAnalyzer;