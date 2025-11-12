// Component Extraction & Organization System
// Run this script to analyze and organize your existing components

const fs = require('fs').promises;
const path = require('path');

// 1. COMPONENT ANALYSIS SCRIPT
class ComponentExtractor {
  constructor(sourceDir = './src') {
    this.sourceDir = sourceDir;
    this.components = new Map();
    this.tokens = new Map();
    this.patterns = new Map();
  }

  // Extract all React components from files
  async extractComponents() {
    console.log('🔍 Scanning for components...');
    
    const files = await this.findTSXFiles();
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const analysis = this.analyzeComponent(content, file);
      
      if (analysis.isComponent) {
        this.components.set(analysis.name, analysis);
      }
    }
    
    console.log(`📦 Found ${this.components.size} components`);
    return this.components;
  }

  // Find all .tsx files recursively
  async findTSXFiles(dir = this.sourceDir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          files.push(...await this.findTSXFiles(fullPath));
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Cannot access ${dir}:`, error.message);
    }
    
    return files;
  }

  // Analyze individual component file
  analyzeComponent(content, filePath) {
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Check if it's a React component
    const isReactComponent = /export\s+(default\s+)?(?:const|function|class)\s+\w+/.test(content) &&
                            (/import.*React/.test(content) || /React\./.test(content) || 
                             /jsx|tsx/.test(path.extname(filePath)));

    // Extract component name
    const nameMatch = content.match(/export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/);
    const componentName = nameMatch ? nameMatch[1] : fileName;

    // Extract imports
    const imports = this.extractImports(content);
    
    // Extract props interface
    const props = this.extractProps(content);
    
    // Extract design tokens usage
    const tokensUsed = this.extractTokensUsage(content);
    
    // Extract styling patterns
    const stylingPatterns = this.extractStylingPatterns(content);
    
    // Determine component type
    const componentType = this.categorizeComponent(content, componentName);
    
    // Calculate complexity score
    const complexity = this.calculateComplexity(content);

    return {
      name: componentName,
      filePath,
      isComponent: isReactComponent,
      type: componentType,
      imports,
      props,
      tokensUsed,
      stylingPatterns,
      complexity,
      lineCount: content.split('').length,
      size: content.length
    };
  }

  // Extract import statements
  extractImports(content) {
    const importRegex = /import\s+(?:{[^}]*}|\w+|\*\s+as\s+\w+)?\s*(?:,\s*(?:{[^}]*}|\w+))?\s*from\s+['"]([^'"]+)['"]/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push({
        module: match[1],
        statement: match[0]
      });
    }
    
    return imports;
  }

  // Extract props interface
  extractProps(content) {
    const propsRegex = /interface\s+(\w+Props)\s*{([^}]*)}/g;
    const props = [];
    let match;
    
    while ((match = propsRegex.exec(content)) !== null) {
      props.push({
        interfaceName: match[1],
        definition: match[2].trim()
      });
    }
    
    return props;
  }

  // Extract design tokens usage
  extractTokensUsage(content) {
    const tokenPatterns = [
      /unifiedDesignTokens\.([\w.]+)/g,
      /designUtils\.([\w.]+)/g,
      /liquidGlassTokens\.([\w.]+)/g,
      /enhancedDesignTokens\.([\w.]+)/g,
      /theme\.([\w.]+)/g
    ];
    
    const tokensUsed = new Set();
    
    tokenPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        tokensUsed.add(match[1]);
      }
    });
    
    return Array.from(tokensUsed);
  }

  // Extract styling patterns
  extractStylingPatterns(content) {
    const patterns = {
      glassmorphism: /backdrop-filter|WebkitBackdropFilter|glass/i.test(content),
      animations: /motion\.|framer-motion|transition|animate/i.test(content),
      gradients: /linear-gradient|radial-gradient/i.test(content),
      responsiveDesign: /isMobile|useBreakpoint|@media/i.test(content),
      stateManagement: /useState|useReducer|useContext/i.test(content),
      formHandling: /useForm|onSubmit|validation/i.test(content)
    };
    
    return Object.entries(patterns)
      .filter(([, hasPattern]) => hasPattern)
      .map(([pattern]) => pattern);
  }

  // Categorize component by type
  categorizeComponent(content, name) {
    if (/Button|Btn/.test(name)) return 'button';
    if (/Card/.test(name)) return 'card';
    if (/Modal|Dialog/.test(name)) return 'modal';
    if (/Nav|Menu/.test(name)) return 'navigation';
    if (/Form|Input/.test(name)) return 'form';
    if (/Layout|Container/.test(name)) return 'layout';
    if (/Carousel|Slider/.test(name)) return 'carousel';
    if (/Filter|Search/.test(name)) return 'filter';
    if (/Dashboard|Page/.test(name)) return 'page';
    if (/Provider|Context/.test(name)) return 'provider';
    
    return 'component';
  }

  // Calculate complexity score
  calculateComplexity(content) {
    let score = 0;
    
    // Lines of code
    score += content.split('').length * 0.1;
    
    // Number of hooks
    score += (content.match(/use\w+/g) || []).length * 2;
    
    // Number of props
    score += (content.match(/\w+\s*:\s*\w+/g) || []).length * 0.5;
    
    // Conditional rendering
    score += (content.match(/\?\s*<|&&\s*</g) || []).length * 1;
    
    // State management
    score += (content.match(/useState|useReducer/g) || []).length * 3;
    
    return Math.round(score);
  }

  // Generate organized component structure
  async generateComponentCatalog() {
    await this.extractComponents();
    
    const catalog = {
      metadata: {
        totalComponents: this.components.size,
        generatedAt: new Date().toISOString(),
        averageComplexity: this.getAverageComplexity()
      },
      componentsByType: this.groupByType(),
      componentsByComplexity: this.groupByComplexity(),
      reusableComponents: this.findReusableComponents(),
      tokenUsage: this.analyzeTokenUsage(),
      recommendations: this.generateRecommendations()
    };
    
    // Save catalog to file
    await fs.writeFile(
      'component-catalog.json', 
      JSON.stringify(catalog, null, 2)
    );
    
    console.log('📊 Component catalog generated: component-catalog.json');
    return catalog;
  }

  groupByType() {
    const grouped = {};
    
    for (const [name, component] of this.components) {
      const type = component.type;
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(component);
    }
    
    return grouped;
  }

  groupByComplexity() {
    const components = Array.from(this.components.values());
    
    return {
      simple: components.filter(c => c.complexity < 10),
      medium: components.filter(c => c.complexity >= 10 && c.complexity < 30),
      complex: components.filter(c => c.complexity >= 30)
    };
  }

  findReusableComponents() {
    const reusable = [];
    
    for (const [name, component] of this.components) {
      if (
        component.type !== 'page' &&
        component.complexity < 20 &&
        component.props.length > 0
      ) {
        reusable.push(component);
      }
    }
    
    return reusable;
  }

  analyzeTokenUsage() {
    const tokenUsage = {};
    
    for (const [name, component] of this.components) {
      component.tokensUsed.forEach(token => {
        if (!tokenUsage[token]) tokenUsage[token] = [];
        tokenUsage[token].push(name);
      });
    }
    
    return tokenUsage;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Find components with high complexity
    const complexComponents = Array.from(this.components.values())
      .filter(c => c.complexity > 30);
    
    if (complexComponents.length > 0) {
      recommendations.push({
        type: 'refactor',
        priority: 'high',
        message: `${complexComponents.length} components are highly complex and should be broken down`,
        components: complexComponents.map(c => c.name)
      });
    }
    
    // Find potential design system violations
    const inconsistentTokens = this.findInconsistentTokenUsage();
    if (inconsistentTokens.length > 0) {
      recommendations.push({
        type: 'standardization',
        priority: 'medium',
        message: 'Inconsistent design token usage detected',
        details: inconsistentTokens
      });
    }
    
    return recommendations;
  }

  findInconsistentTokenUsage() {
    // This would analyze token usage patterns and find inconsistencies
    // For now, return empty array
    return [];
  }

  getAverageComplexity() {
    const complexities = Array.from(this.components.values()).map(c => c.complexity);
    return complexities.reduce((sum, c) => sum + c, 0) / complexities.length;
  }
}

// 2. COMPONENT REORGANIZATION SCRIPT
class ComponentReorganizer {
  constructor(catalog) {
    this.catalog = catalog;
    this.newStructure = this.planNewStructure();
  }

  planNewStructure() {
    return {
      'components/': {
        'pixels/': ['button', 'input', 'icon', 'typography'],
        'molecules/': ['card', 'form-field', 'navigation-item'],
        'organisms/': ['navigation', 'header', 'sidebar', 'carousel'],
        'templates/': ['layout', 'page-template'],
        'pages/': ['page']
      },
      'design-system/': {
        'tokens/': ['colors', 'spacing', 'typography', 'shadows'],
        'utils/': ['design-utils', 'theme-provider'],
        'hooks/': ['use-design-system', 'use-theme']
      },
      'features/': {
        'auth/': ['login', 'signup'],
        'shop/': ['product-card', 'checkout'],
        'dashboard/': ['dashboard', 'stats']
      }
    };
  }

  async reorganizeComponents() {
    console.log('🗂️  Reorganizing components...');
    
    const moves = [];
    
    for (const [componentName, component] of Object.entries(this.catalog.componentsByType)) {
      const newLocation = this.getNewLocation(component);
      moves.push({
        from: component.filePath,
        to: newLocation,
        component: componentName
      });
    }
    
    // Generate move script
    const moveScript = this.generateMoveScript(moves);
    await fs.writeFile('reorganize-components.sh', moveScript);
    
    console.log('📝 Generated reorganization script: reorganize-components.sh');
    return moves;
  }

  getNewLocation(components) {
    // Determine new location based on component type and complexity
    const component = Array.isArray(components) ? components[0] : components;
    
    switch (component.type) {
      case 'button':
        return 'src/components/pixels/buttons/';
      case 'card':
        return 'src/components/molecules/cards/';
      case 'navigation':
        return 'src/components/organisms/navigation/';
      case 'page':
        return 'src/pages/';
      case 'provider':
        return 'src/design-system/providers/';
      default:
        return 'src/components/molecules/';
    }
  }

  generateMoveScript(moves) {
    let script = '#!/bin/bash';
    script += '# Component Reorganization Script';
    script += '# Run this to reorganize your components';
    
    // Create directories
    const directories = [...new Set(moves.map(move => path.dirname(move.to)))];
    directories.forEach(dir => {
      script += `mkdir -p "${dir}"`;
    });
    
    script += '';
    
    // Move files
    moves.forEach(move => {
      script += `mv "${move.from}" "${move.to}"`;
    });
    
    script += 'echo "✅ Component reorganization complete!"';
    
    return script;
  }
}

// 3. EXPORT THE SYSTEM
module.exports = {
  ComponentExtractor,
  ComponentReorganizer,
  
  // Quick start function
  async analyzeProject(sourceDir = './src') {
    console.log('🚀 Starting component analysis...');
    
    const extractor = new ComponentExtractor(sourceDir);
    const catalog = await extractor.generateComponentCatalog();
    
    const reorganizer = new ComponentReorganizer(catalog);
    await reorganizer.reorganizeComponents();
    
    console.log('✅ Analysis complete! Check these files:');
    console.log('   📊 component-catalog.json - Full component analysis');
    console.log('   📝 reorganize-components.sh - Reorganization script');
    
    return catalog;
  }
};

// 4. USAGE EXAMPLES
/*
// Run analysis
const { analyzeProject } = require('./component-extraction-system');
analyzeProject('./src').then(catalog => {
  console.log('Components found:', catalog.metadata.totalComponents);
  console.log('Reusable components:', catalog.reusableComponents.length);
});

// Or use individual classes
const extractor = new ComponentExtractor('./src');
extractor.extractComponents().then(components => {
  console.log('Found components:', components.size);
});
*/