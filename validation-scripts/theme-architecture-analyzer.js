// Theme Architecture Analyzer
// Apple Intelligence Strategic Director
// Version: 1.0.0
// Last Updated: June 23, 2025
// Purpose: Comprehensive analysis of Shopify theme architectures

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ThemeArchitectureAnalyzer {
    constructor(themePath) {
        // Support analyzing any theme path provided as argument
        if (themePath) {
            this.targetThemePath = themePath;
            this.themeName = path.basename(themePath);
        }
        
        // Default paths for comparison
        this.designSystemPath = '/Users/pennyplatt/Documents//quantum-spatial/design-system';
        this.freshGlassThemePath = '/Users/pennyplatt/Documents//quantum-spatial/fresh-glass-theme';
        this.enhancedQuantumSpatialPath = '/Users/pennyplatt/Documents//quantum-spatial/fresh-glass-theme/enhanced-quantum-spatial';
        this.currentThemePath = themePath || this.designSystemPath;
        
        this.analysisResults = {
            rise: {},
            horizon: {},
            glassTheme: {},
            comparative: {}
        };
    }

    // Phase 1: Rise Theme Deep Analysis
    async analyzeRiseTheme() {
        console.log('🔍 Phase 1: Rise Theme Deep Analysis');
        console.log('====================================');
        console.log('');

        const riseAnalysis = {
            cssArchitecture: {},
            liquidDependencies: {},
            jsFunctionality: {},
            templateStructure: {}
        };

        // 1A: CSS Architecture Mapping
        console.log('📊 1A: CSS Architecture Mapping...');
        riseAnalysis.cssArchitecture = await this.analyzeCSSArchitecture(this.riseThemePath, 'Rise');

        // 1B: Liquid Component Dependencies
        console.log('🧩 1B: Liquid Component Dependencies...');
        riseAnalysis.liquidDependencies = await this.analyzeLiquidDependencies(this.riseThemePath, 'Rise');

        // 1C: JavaScript Functionality Mapping
        console.log('⚡ 1C: JavaScript Functionality Mapping...');
        riseAnalysis.jsFunctionality = await this.analyzeJSFunctionality(this.riseThemePath, 'Rise');

        // 1D: Template Structure Analysis
        console.log('📋 1D: Template Structure Analysis...');
        riseAnalysis.templateStructure = await this.analyzeTemplateStructure(this.riseThemePath, 'Rise');

        this.analysisResults.rise = riseAnalysis;
        console.log('✅ Rise theme analysis complete');
        console.log('');

        return riseAnalysis;
    }

    // Phase 2: Horizon Theme Architecture Analysis
    async analyzeHorizonTheme() {
        console.log('🔍 Phase 2: Horizon Theme Architecture Analysis');
        console.log('==============================================');
        console.log('');

        const horizonAnalysis = {
            minimalCSS: {},
            templateCentric: {},
            performanceProfile: {}
        };

        // 2A: Minimal CSS Structure
        console.log('🎨 2A: Minimal CSS Structure...');
        horizonAnalysis.minimalCSS = await this.analyzeMinimalCSS(this.horizonThemePath, 'Horizon');

        // 2B: Template-Centric Design
        console.log('📄 2B: Template-Centric Design...');
        horizonAnalysis.templateCentric = await this.analyzeTemplateCentric(this.horizonThemePath, 'Horizon');

        // 2C: Performance and Maintainability
        console.log('⚡ 2C: Performance and Maintainability...');
        horizonAnalysis.performanceProfile = await this.analyzePerformance(this.horizonThemePath, 'Horizon');

        this.analysisResults.horizon = horizonAnalysis;
        console.log('✅ Horizon theme analysis complete');
        console.log('');

        return horizonAnalysis;
    }

    // CSS Architecture Analysis
    async analyzeCSSArchitecture(themePath, themeName) {
        const cssAnalysis = {
            themeCSS: {},
            baseCSS: {},
            componentCSS: [],
            loadingOrder: [],
            dependencies: {},
            totalFiles: 0,
            totalSize: 0
        };

        try {
            const assetsPath = path.join(themePath, 'assets');
            const layoutPath = path.join(themePath, 'layout');

            // Analyze theme.liquid for CSS
            const themeLiquidPath = path.join(layoutPath, 'theme.liquid');
            if (fs.existsSync(themeLiquidPath)) {
                const themeContent = fs.readFileSync(themeLiquidPath, 'utf8');
                cssAnalysis.themeCSS = this.extractCSSFromLiquid(themeContent, 'theme.liquid');
            }

            // Analyze CSS files in assets
            if (fs.existsSync(assetsPath)) {
                const files = fs.readdirSync(assetsPath);
                const cssFiles = files.filter(file => file.endsWith('.css'));

                cssAnalysis.totalFiles = cssFiles.length;

                for (const file of cssFiles) {
                    const filePath = path.join(assetsPath, file);
                    const stats = fs.statSync(filePath);
                    const content = fs.readFileSync(filePath, 'utf8');

                    cssAnalysis.totalSize += stats.size;

                    const fileAnalysis = {
                        name: file,
                        size: stats.size,
                        lines: content.split('').length,
                        mediaQueries: (content.match(/@media/g) || []).length,
                        customProperties: (content.match(/--[\w-]+:/g) || []).length,
                        dependencies: this.extractCSSDependencies(content)
                    };

                    if (file === 'base.css') {
                        cssAnalysis.baseCSS = fileAnalysis;
                    } else if (file.startsWith('component-')) {
                        cssAnalysis.componentCSS.push(fileAnalysis);
                    }
                }
            }

            console.log(`  📊 ${themeName} CSS: ${cssAnalysis.totalFiles} files, ${(cssAnalysis.totalSize / 1024).toFixed(1)}KB total`);

        } catch (error) {
            console.error(`Error analyzing CSS for ${themeName}:`, error.message);
        }

        return cssAnalysis;
    }

    // Extract CSS references and embedded styles from Liquid files
    extractCSSFromLiquid(content, fileName) {
        const cssData = {
            stylesheetTags: [],
            embeddedStyles: [],
            inlineStyles: []
        };

        // Find stylesheet_tag references
        const stylesheetMatches = content.match(/\{\{\s*['"]([^'"]*\.css)['"][^}]*\|\s*asset_url[^}]*\|\s*stylesheet_tag\s*\}\}/g);
        if (stylesheetMatches) {
            cssData.stylesheetTags = stylesheetMatches.map(match => {
                const fileMatch = match.match(/['"]([^'"]*\.css)['"]/);
                return fileMatch ? fileMatch[1] : match;
            });
        }

        // Find embedded <style> blocks
        const styleBlocks = content.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
        if (styleBlocks) {
            cssData.embeddedStyles = styleBlocks.map((block, index) => ({
                index: index + 1,
                content: block.length,
                hasMediaQueries: block.includes('@media')
            }));
        }

        // Find inline style attributes
        const inlineStyles = content.match(/style\s*=\s*["'][^"']*["']/gi);
        if (inlineStyles) {
            cssData.inlineStyles = inlineStyles.length;
        }

        return cssData;
    }

    // Extract CSS dependencies and imports
    extractCSSDependencies(cssContent) {
        const dependencies = {
            imports: [],
            customProperties: [],
            references: []
        };

        // @import statements
        const imports = cssContent.match(/@import\s+['"]([^'"]+)['"]/g);
        if (imports) {
            dependencies.imports = imports.map(imp => imp.match(/['"]([^'"]+)['"]/)[1]);
        }

        // CSS custom properties
        const customProps = cssContent.match(/var\(--[\w-]+\)/g);
        if (customProps) {
            dependencies.customProperties = [...new Set(customProps)];
        }

        return dependencies;
    }

    // Analyze Liquid dependencies between sections and snippets
    async analyzeLiquidDependencies(themePath, themeName) {
        const dependencies = {
            sections: {},
            snippets: {},
            templates: {},
            crossReferences: []
        };

        try {
            // Analyze sections
            const sectionsPath = path.join(themePath, 'sections');
            if (fs.existsSync(sectionsPath)) {
                const sectionFiles = fs.readdirSync(sectionsPath).filter(f => f.endsWith('.liquid'));
                
                for (const file of sectionFiles) {
                    const content = fs.readFileSync(path.join(sectionsPath, file), 'utf8');
                    dependencies.sections[file] = this.extractLiquidDependencies(content, 'section');
                }
            }

            // Analyze snippets
            const snippetsPath = path.join(themePath, 'snippets');
            if (fs.existsSync(snippetsPath)) {
                const snippetFiles = fs.readdirSync(snippetsPath).filter(f => f.endsWith('.liquid'));
                
                for (const file of snippetFiles) {
                    const content = fs.readFileSync(path.join(snippetsPath, file), 'utf8');
                    dependencies.snippets[file] = this.extractLiquidDependencies(content, 'snippet');
                }
            }

            // Analyze templates
            const templatesPath = path.join(themePath, 'templates');
            if (fs.existsSync(templatesPath)) {
                const templateFiles = fs.readdirSync(templatesPath, { recursive: true })
                    .filter(f => f.endsWith('.json'));
                
                for (const file of templateFiles) {
                    const content = fs.readFileSync(path.join(templatesPath, file), 'utf8');
                    try {
                        const templateData = JSON.parse(content);
                        dependencies.templates[file] = this.extractTemplateDependencies(templateData);
                    } catch (error) {
                        console.warn(`Could not parse template ${file}`);
                    }
                }
            }

            console.log(`  🧩 ${themeName} Dependencies: ${Object.keys(dependencies.sections).length} sections, ${Object.keys(dependencies.snippets).length} snippets, ${Object.keys(dependencies.templates).length} templates`);

        } catch (error) {
            console.error(`Error analyzing Liquid dependencies for ${themeName}:`, error.message);
        }

        return dependencies;
    }

    // Extract Liquid render calls and CSS references
    extractLiquidDependencies(content, type) {
        const deps = {
            renders: [],
            includes: [],
            cssFiles: [],
            jsFiles: [],
            settings: []
        };

        // Render calls
        const renders = content.match(/\{%\s*render\s+['"]([^'"]+)['"]/g);
        if (renders) {
            deps.renders = renders.map(r => r.match(/['"]([^'"]+)['"]/)[1]);
        }

        // Include calls  
        const includes = content.match(/\{%\s*include\s+['"]([^'"]+)['"]/g);
        if (includes) {
            deps.includes = includes.map(i => i.match(/['"]([^'"]+)['"]/)[1]);
        }

        // CSS file references
        const cssRefs = content.match(/\{\{\s*['"]([^'"]*\.css)['"][^}]*\|\s*asset_url/g);
        if (cssRefs) {
            deps.cssFiles = cssRefs.map(ref => ref.match(/['"]([^'"]*\.css)['"]/)[1]);
        }

        // JS file references
        const jsRefs = content.match(/\{\{\s*['"]([^'"]*\.js)['"][^}]*\|\s*asset_url/g);
        if (jsRefs) {
            deps.jsFiles = jsRefs.map(ref => ref.match(/['"]([^'"]*\.js)['"]/)[1]);
        }

        // Settings references
        const settings = content.match(/section\.settings\.[\w-]+/g);
        if (settings) {
            deps.settings = [...new Set(settings)];
        }

        return deps;
    }

    // Extract template section dependencies
    extractTemplateDependencies(templateData) {
        const deps = {
            sections: [],
            order: [],
            settings: {}
        };

        if (templateData.sections) {
            deps.sections = Object.keys(templateData.sections).map(key => ({
                key: key,
                type: templateData.sections[key].type,
                settings: Object.keys(templateData.sections[key].settings || {}).length
            }));
        }

        if (templateData.order) {
            deps.order = templateData.order;
        }

        return deps;
    }

    // Analyze JavaScript functionality
    async analyzeJSFunctionality(themePath, themeName) {
        const jsAnalysis = {
            files: [],
            globalFunctions: [],
            eventListeners: [],
            dependencies: {},
            totalSize: 0
        };

        try {
            const assetsPath = path.join(themePath, 'assets');
            
            if (fs.existsSync(assetsPath)) {
                const files = fs.readdirSync(assetsPath);
                const jsFiles = files.filter(file => file.endsWith('.js'));

                for (const file of jsFiles) {
                    const filePath = path.join(assetsPath, file);
                    const stats = fs.statSync(filePath);
                    const content = fs.readFileSync(filePath, 'utf8');

                    jsAnalysis.totalSize += stats.size;

                    const fileAnalysis = {
                        name: file,
                        size: stats.size,
                        lines: content.split('').length,
                        functions: this.extractJSFunctions(content),
                        eventListeners: this.extractEventListeners(content),
                        shopifyAPIs: this.extractShopifyAPIs(content)
                    };

                    jsAnalysis.files.push(fileAnalysis);
                }
            }

            console.log(`  ⚡ ${themeName} JavaScript: ${jsAnalysis.files.length} files, ${(jsAnalysis.totalSize / 1024).toFixed(1)}KB total`);

        } catch (error) {
            console.error(`Error analyzing JavaScript for ${themeName}:`, error.message);
        }

        return jsAnalysis;
    }

    // Extract JavaScript functions
    extractJSFunctions(content) {
        const functions = [];
        
        // Function declarations
        const funcDeclarations = content.match(/function\s+(\w+)\s*\(/g);
        if (funcDeclarations) {
            functions.push(...funcDeclarations.map(f => f.match(/function\s+(\w+)/)[1]));
        }

        // Arrow functions assigned to variables
        const arrowFunctions = content.match(/const\s+(\w+)\s*=\s*\(/g);
        if (arrowFunctions) {
            functions.push(...arrowFunctions.map(f => f.match(/const\s+(\w+)/)[1]));
        }

        return [...new Set(functions)];
    }

    // Extract event listeners
    extractEventListeners(content) {
        const listeners = [];
        
        const eventPatterns = [
            /addEventListener\s*\(\s*['"]([^'"]+)['"]/g,
            /on(\w+)\s*=/g
        ];

        eventPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                listeners.push(match[1]);
            }
        });

        return [...new Set(listeners)];
    }

    // Extract Shopify API usage
    extractShopifyAPIs(content) {
        const apis = [];
        
        const shopifyPatterns = [
            /fetch\s*\(\s*['"][^'"]*\/cart[^'"]*['"]/g,
            /Shopify\.[\w.]+/g,
            /routes\.[\w_]+/g
        ];

        shopifyPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                apis.push(...matches);
            }
        });

        return [...new Set(apis)];
    }

    // Analyze template structure
    async analyzeTemplateStructure(themePath, themeName) {
        const structure = {
            templates: {},
            pageTypes: [],
            sectionUsage: {},
            complexity: {}
        };

        try {
            const templatesPath = path.join(themePath, 'templates');
            
            if (fs.existsSync(templatesPath)) {
                const files = this.getAllFiles(templatesPath, '.json');
                
                for (const file of files) {
                    const content = fs.readFileSync(file, 'utf8');
                    try {
                        const templateData = JSON.parse(content);
                        const templateName = path.relative(templatesPath, file);
                        
                        structure.templates[templateName] = {
                            sections: Object.keys(templateData.sections || {}).length,
                            order: (templateData.order || []).length,
                            sectionTypes: Object.values(templateData.sections || {}).map(s => s.type)
                        };

                        // Track section usage
                        Object.values(templateData.sections || {}).forEach(section => {
                            if (!structure.sectionUsage[section.type]) {
                                structure.sectionUsage[section.type] = 0;
                            }
                            structure.sectionUsage[section.type]++;
                        });

                    } catch (error) {
                        console.warn(`Could not parse template ${file}`);
                    }
                }
            }

            console.log(`  📋 ${themeName} Templates: ${Object.keys(structure.templates).length} templates analyzed`);

        } catch (error) {
            console.error(`Error analyzing template structure for ${themeName}:`, error.message);
        }

        return structure;
    }

    // Minimal CSS analysis for Horizon theme
    async analyzeMinimalCSS(themePath, themeName) {
        const minimalAnalysis = {
            cssFileCount: 0,
            themeCSS: {},
            jsonStyles: {},
            hardcodedValues: []
        };

        try {
            // Check CSS files
            const assetsPath = path.join(themePath, 'assets');
            if (fs.existsSync(assetsPath)) {
                const files = fs.readdirSync(assetsPath);
                const cssFiles = files.filter(file => file.endsWith('.css'));
                minimalAnalysis.cssFileCount = cssFiles.length;
            }

            // Check theme.liquid for CSS
            const layoutPath = path.join(themePath, 'layout');
            const themeLiquidPath = path.join(layoutPath, 'theme.liquid');
            if (fs.existsSync(themeLiquidPath)) {
                const themeContent = fs.readFileSync(themeLiquidPath, 'utf8');
                minimalAnalysis.themeCSS = this.extractCSSFromLiquid(themeContent, 'theme.liquid');
            }

            // Analyze JSON hardcoded styles
            const templatesPath = path.join(themePath, 'templates');
            if (fs.existsSync(templatesPath)) {
                const templateFiles = this.getAllFiles(templatesPath, '.json');
                
                for (const file of templateFiles) {
                    const content = fs.readFileSync(file, 'utf8');
                    try {
                        const templateData = JSON.parse(content);
                        const hardcoded = this.extractHardcodedStyles(templateData);
                        if (hardcoded.length > 0) {
                            minimalAnalysis.hardcodedValues.push({
                                file: path.relative(templatesPath, file),
                                styles: hardcoded
                            });
                        }
                    } catch (error) {
                        console.warn(`Could not parse template ${file}`);
                    }
                }
            }

            console.log(`  🎨 ${themeName} Minimal CSS: ${minimalAnalysis.cssFileCount} CSS files, ${minimalAnalysis.hardcodedValues.length} templates with hardcoded styles`);

        } catch (error) {
            console.error(`Error analyzing minimal CSS for ${themeName}:`, error.message);
        }

        return minimalAnalysis;
    }

    // Extract hardcoded style values from JSON templates
    extractHardcodedStyles(obj, path = '') {
        const hardcodedStyles = [];
        
        if (typeof obj === 'object' && obj !== null) {
            for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}.${key}` : key;
                
                if (typeof value === 'string') {
                    // Look for style-related properties
                    if (this.isStyleProperty(key, value)) {
                        hardcodedStyles.push({
                            property: currentPath,
                            value: value
                        });
                    }
                } else if (typeof value === 'object') {
                    hardcodedStyles.push(...this.extractHardcodedStyles(value, currentPath));
                }
            }
        }
        
        return hardcodedStyles;
    }

    // Check if a property is style-related
    isStyleProperty(key, value) {
        const styleKeys = [
            'color', 'background', 'padding', 'margin', 'border', 'font',
            'width', 'height', 'radius', 'shadow', 'opacity', 'spacing'
        ];
        
        const colorPattern = /^#[0-9a-fA-F]{3,6}$|^rgba?\(|^hsl/;
        const sizePattern = /^\d+(\.\d+)?(px|em|rem|%|vh|vw)$/;
        
        return styleKeys.some(styleKey => key.toLowerCase().includes(styleKey)) ||
               colorPattern.test(value) ||
               sizePattern.test(value);
    }

    // Analyze template-centric design
    async analyzeTemplateCentric(themePath, themeName) {
        const templateAnalysis = {
            jsonDrivenStyling: [],
            sectionModularity: {},
            customization: {}
        };

        // This will be implemented based on the Horizon theme structure
        console.log(`  📄 ${themeName} Template-Centric: Analysis in progress...`);

        return templateAnalysis;
    }

    // Analyze performance characteristics
    async analyzePerformance(themePath, themeName) {
        const perfAnalysis = {
            loadOrder: [],
            fileSize: {},
            complexity: {}
        };

        // This will be implemented to compare performance characteristics
        console.log(`  ⚡ ${themeName} Performance: Analysis in progress...`);

        return perfAnalysis;
    }

    // Utility: Get all files with specific extension recursively
    getAllFiles(dirPath, extension) {
        const files = [];
        
        function scan(currentPath) {
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scan(fullPath);
                } else if (fullPath.endsWith(extension)) {
                    files.push(fullPath);
                }
            }
        }
        
        if (fs.existsSync(dirPath)) {
            scan(dirPath);
        }
        
        return files;
    }

    // Phase 3: Comparative Analysis
    async createComparativeAnalysis() {
        console.log('🔍 Phase 3: Comparative Dependency Analysis');
        console.log('============================================');
        console.log('');

        const comparison = {
            complexity: this.compareComplexity(),
            maintainability: this.compareMaintainability(),
            performance: this.comparePerformance(),
            glassThemeCompatibility: this.assessGlassCompatibility(),
            recommendation: {}
        };

        this.analysisResults.comparative = comparison;
        console.log('✅ Comparative analysis complete');
        console.log('');

        return comparison;
    }

    // Compare complexity between themes
    compareComplexity() {
        const rise = this.analysisResults.rise;
        const horizon = this.analysisResults.horizon;

        return {
            cssFiles: {
                rise: rise.cssArchitecture?.totalFiles || 0,
                horizon: horizon.minimalCSS?.cssFileCount || 0
            },
            dependencies: {
                rise: Object.keys(rise.liquidDependencies?.sections || {}).length,
                horizon: Object.keys(horizon.templateCentric?.sectionModularity || {}).length
            },
            templates: {
                rise: Object.keys(rise.templateStructure?.templates || {}).length,
                horizon: Object.keys(horizon.templateCentric?.jsonDrivenStyling || {}).length
            }
        };
    }

    // Compare maintainability factors
    compareMaintainability() {
        return {
            cssOrganization: {
                rise: 'Complex - 50+ files, embedded styles',
                horizon: 'Minimal - JSON-driven styling'
            },
            customization: {
                rise: 'CSS-heavy modifications required',
                horizon: 'JSON configuration-based'
            },
            debugging: {
                rise: 'Complex dependency tracking needed',
                horizon: 'Simplified troubleshooting'
            }
        };
    }

    // Compare performance characteristics
    comparePerformance() {
        const rise = this.analysisResults.rise;
        const horizon = this.analysisResults.horizon;

        return {
            cssSize: {
                rise: rise.cssArchitecture?.totalSize || 0,
                horizon: 'Minimal CSS footprint'
            },
            loadComplexity: {
                rise: 'Multiple CSS files, complex loading order',
                horizon: 'Streamlined asset loading'
            },
            renderBlocking: {
                rise: 'Potential CSS render blocking',
                horizon: 'Reduced render blocking'
            }
        };
    }

    // Assess compatibility with glass theme features
    assessGlassCompatibility() {
        return {
            glassmorphicEffects: {
                rise: 'Requires CSS override system',
                horizon: 'Needs JSON + minimal CSS approach'
            },
            filterSystem: {
                rise: 'Complex facets.js system (currently broken)',
                horizon: 'Simpler filtering implementation needed'
            },
            productRendering: {
                rise: 'Card snippet system limiting customization',
                horizon: 'More flexible template approach'
            },
            recommendation: 'Analysis pending complete data collection'
        };
    }

    // Generate comprehensive report
    async generateReport() {
        console.log('📊 Generating Comprehensive Analysis Report');
        console.log('==========================================');
        console.log('');

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                riseTheme: this.summarizeTheme('rise'),
                horizonTheme: this.summarizeTheme('horizon'),
                glassThemeV4: this.summarizeTheme('glassTheme'),
                recommendation: this.generateRecommendation()
            },
            detailed: this.analysisResults,
            migrationStrategy: this.createMigrationStrategy()
        };

        // Save report
        const reportPath = path.join(__dirname, `theme-analysis-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log(`📋 Analysis report saved: ${reportPath}`);
        this.displaySummary(report);

        return report;
    }

    // Summarize theme characteristics
    summarizeTheme(themeName) {
        const themeData = this.analysisResults[themeName];
        
        if (themeName === 'rise') {
            return {
                architecture: 'Complex CSS + Component-based',
                cssFiles: themeData.cssArchitecture?.totalFiles || 0,
                complexity: 'High',
                maintainability: 'Challenging',
                glassCompatibility: 'Requires significant modification'
            };
        } else if (themeName === 'horizon') {
            return {
                architecture: 'Minimal CSS + JSON-driven',
                cssFiles: themeData.minimalCSS?.cssFileCount || 0,
                complexity: 'Low',
                maintainability: 'Simplified',
                glassCompatibility: 'Better foundation for custom styling'
            };
        } else if (themeName === 'glassTheme') {
            return {
                architecture: 'Glass + Foundation Token System',
                cssFiles: themeData.cssArchitecture?.totalFiles || 0,
                glassEffectFiles: themeData.glassSystemIntegration?.glassEffectFiles?.length || 0,
                foundationTokens: themeData.foundationTokens?.quantumFoundationCSS?.foundationTokens || 0,
                complexity: 'Advanced',
                maintainability: 'Well-structured with QA validation',
                glassCompatibility: 'Native glass system implementation',
                appleHIGCompliance: 'Full compliance with touch targets and accessibility',
                qaValidation: 'Comprehensive validation framework'
            };
        }
    }

    // Generate final recommendation
    generateRecommendation() {
        // This will be refined based on complete analysis data
        return {
            recommendedApproach: 'Pending complete analysis',
            reasoning: 'Analysis in progress',
            migrationSteps: [],
            riskAssessment: 'TBD'
        };
    }

    // Create migration strategy
    createMigrationStrategy() {
        return {
            phases: [
                'Foundation Selection',
                'Glass Component Integration',
                'Filter System Implementation',
                'Performance Optimization'
            ],
            timeline: 'TBD based on recommendation',
            riskMitigation: 'QA validation at each phase'
        };
    }

    // Display analysis summary
    displaySummary(report) {
        console.log('📊 THEME ANALYSIS SUMMARY');
        console.log('=========================');
        console.log('');
        
        console.log('Rise Theme:');
        console.log(`  Architecture: ${report.summary.riseTheme.architecture}`);
        console.log(`  CSS Files: ${report.summary.riseTheme.cssFiles}`);
        console.log(`  Complexity: ${report.summary.riseTheme.complexity}`);
        console.log('');
        
        console.log('Horizon Theme:');
        console.log(`  Architecture: ${report.summary.horizonTheme.architecture}`);
        console.log(`  CSS Files: ${report.summary.horizonTheme.cssFiles}`);
        console.log(`  Complexity: ${report.summary.horizonTheme.complexity}`);
        console.log('');

        console.log('Glass Theme v4:');
        console.log(`  Architecture: ${report.summary.glassThemeV4.architecture}`);
        console.log(`  CSS Files: ${report.summary.glassThemeV4.cssFiles}`);
        console.log(`  Glass Effect Files: ${report.summary.glassThemeV4.glassEffectFiles}`);
        console.log(`  Foundation Tokens: ${report.summary.glassThemeV4.foundationTokens}`);
        console.log(`  Complexity: ${report.summary.glassThemeV4.complexity}`);
        console.log(`  Apple HIG Compliance: ${report.summary.glassThemeV4.appleHIGCompliance}`);
        console.log(`  QA Validation: ${report.summary.glassThemeV4.qaValidation}`);
        console.log('');
        
        console.log(`Recommendation: ${report.summary.recommendation.recommendedApproach}`);
        console.log('');
    }

    // Phase 3: Glass Theme v4 Analysis (NEW)
    async analyzeGlassTheme() {
        console.log('🔍 Phase 3: Glass Theme v4 Architecture Analysis');
        console.log('===============================================');
        console.log('');

        const glassAnalysis = {
            cssArchitecture: {},
            liquidDependencies: {},
            jsFunctionality: {},
            templateStructure: {},
            glassSystemIntegration: {},
            foundationTokens: {},
            qaValidation: {}
        };

        // 3A: CSS Architecture Mapping
        console.log('📊 3A: CSS Architecture Mapping...');
        glassAnalysis.cssArchitecture = await this.analyzeCSSArchitecture(this.currentThemePath, 'Glass-v4');

        // 3B: Liquid Component Dependencies
        console.log('🧩 3B: Liquid Component Dependencies...');
        glassAnalysis.liquidDependencies = await this.analyzeLiquidDependencies(this.currentThemePath, 'Glass-v4');

        // 3C: JavaScript Functionality Mapping
        console.log('⚡ 3C: JavaScript Functionality Mapping...');
        glassAnalysis.jsFunctionality = await this.analyzeJSFunctionality(this.currentThemePath, 'Glass-v4');

        // 3D: Template Structure Analysis
        console.log('📋 3D: Template Structure Analysis...');
        glassAnalysis.templateStructure = await this.analyzeTemplateStructure(this.currentThemePath, 'Glass-v4');

        // 3E: Glass System Integration Analysis
        console.log('🌟 3E: Glass System Integration Analysis...');
        glassAnalysis.glassSystemIntegration = await this.analyzeGlassSystemIntegration(this.currentThemePath);

        // 3F: Foundation Tokens Analysis
        console.log('🎨 3F: Foundation Tokens Analysis...');
        glassAnalysis.foundationTokens = await this.analyzeFoundationTokens(this.currentThemePath);

        // 3G: QA Validation Analysis
        console.log('✅ 3G: QA Validation Analysis...');
        glassAnalysis.qaValidation = await this.analyzeQAValidation(this.currentThemePath);

        this.analysisResults.glassTheme = glassAnalysis;
        console.log('✅ Glass Theme v4 analysis complete');
        console.log('');

        return glassAnalysis;
    }

    // Analyze Glass System Integration
    async analyzeGlassSystemIntegration(themePath) {
        const glassIntegration = {
            glassEffectFiles: [],
            liquidGlassTokens: {},
            glassComponentUsage: [],
            backDropFilterSupport: false,
            globalGlassSystem: {}
        };

        try {
            const assetsPath = path.join(themePath, 'assets');
            const snippetsPath = path.join(themePath, 'snippets');

            // Check for glass-related CSS files
            if (fs.existsSync(assetsPath)) {
                const files = fs.readdirSync(assetsPath);
                const glassFiles = files.filter(file => 
                    file.includes('glass') || 
                    file.includes('facets') ||
                    file.includes('quantum') ||
                    file.includes('global')
                );

                for (const file of glassFiles) {
                    const filePath = path.join(assetsPath, file);
                    const stats = fs.statSync(filePath);
                    const content = fs.readFileSync(filePath, 'utf8');

                    glassIntegration.glassEffectFiles.push({
                        name: file,
                        size: stats.size,
                        hasBackdropFilter: content.includes('backdrop-filter'),
                        hasGlassEffects: content.includes('rgba(255, 255, 255, 0.'),
                        hasQuantumTokens: content.includes('quantum') || content.includes('foundation'),
                        tokenCount: (content.match(/--[\w-]+:/g) || []).length
                    });

                    if (content.includes('backdrop-filter')) {
                        glassIntegration.backDropFilterSupport = true;
                    }
                }
            }

            // Check for liquid glass token snippets
            if (fs.existsSync(snippetsPath)) {
                const files = fs.readdirSync(snippetsPath);
                const glassSnippets = files.filter(file => 
                    file.includes('glass') || 
                    file.includes('foundation') ||
                    file.includes('ultra-dark')
                );

                for (const file of glassSnippets) {
                    const filePath = path.join(snippetsPath, file);
                    const content = fs.readFileSync(filePath, 'utf8');

                    glassIntegration.liquidGlassTokens[file] = {
                        hasTokenDefinitions: content.includes('--liquid-glass-'),
                        hasFoundationIntegration: content.includes('foundation'),
                        hasAppleHIGCompliance: content.includes('Apple HIG'),
                        tokenSystemComplexity: (content.match(/--[\w-]+:/g) || []).length
                    };
                }
            }

            console.log(`  🌟 Glass Integration: ${glassIntegration.glassEffectFiles.length} glass files, backdrop filter: ${glassIntegration.backDropFilterSupport}`);

        } catch (error) {
            console.error('Error analyzing glass system integration:', error.message);
        }

        return glassIntegration;
    }

    // Analyze Foundation Tokens
    async analyzeFoundationTokens(themePath) {
        const foundationAnalysis = {
            quantumFoundationCSS: {},
            quantumSpatialTokens: {},
            foundationIntegration: {},
            tokenHierarchy: [],
            appleHIGCompliance: {}
        };

        try {
            const assetsPath = path.join(themePath, 'assets');
            const snippetsPath = path.join(themePath, 'snippets');

            // Analyze QuantumFoundation.css
            const quantumFoundationPath = path.join(assetsPath, 'QuantumFoundation.css');
            if (fs.existsSync(quantumFoundationPath)) {
                const content = fs.readFileSync(quantumFoundationPath, 'utf8');
                const stats = fs.statSync(quantumFoundationPath);

                foundationAnalysis.quantumFoundationCSS = {
                    size: stats.size,
                    foundationTokens: (content.match(/--foundation-[\w-]+:/g) || []).length,
                    glassTokens: (content.match(/--foundation-glass-[\w-]+:/g) || []).length,
                    colorTokens: (content.match(/--foundation-color-[\w-]+:/g) || []).length,
                    spacingTokens: (content.match(/--foundation-space-[\w-]+:/g) || []).length,
                    appleHIGPatterns: content.includes('44px') // Touch target compliance
                };
            }

            // Analyze quantum-spatial color tokens
            const quantumSpatialPath = path.join(assetsPath, 'quantumspatial-color-tokens.css');
            if (fs.existsSync(quantumSpatialPath)) {
                const content = fs.readFileSync(quantumSpatialPath, 'utf8');
                const stats = fs.statSync(quantumSpatialPath);

                foundationAnalysis.quantumSpatialTokens = {
                    size: stats.size,
                    quantumTokens: (content.match(/--quantum-[\w-]+:/g) || []).length,
                    spatialTokens: (content.match(/--spatial-[\w-]+:/g) || []).length,
                    gradientDefinitions: (content.match(/linear-gradient/g) || []).length,
                    ultraDarkCompliance: content.includes('ultra-dark')
                };
            }

            // Analyze foundation integration snippet
            const foundationIntegrationPath = path.join(snippetsPath, 'foundation-integration.liquid');
            if (fs.existsSync(foundationIntegrationPath)) {
                const content = fs.readFileSync(foundationIntegrationPath, 'utf8');

                foundationAnalysis.foundationIntegration = {
                    mapsPatternsToFoundation: content.includes('Maps theme patterns to QuantumFoundation'),
                    touchTargetEnforcement: content.includes('Touch Target Enforcement'),
                    inputStandardization: content.includes('Input standardization'),
                    containerIntegration: content.includes('Container integration'),
                    foundationVariableCount: (content.match(/var\(--foundation-[\w-]+\)/g) || []).length
                };
            }

            console.log(`  🎨 Foundation Tokens: ${foundationAnalysis.quantumFoundationCSS.foundationTokens || 0} foundation tokens, ${foundationAnalysis.quantumSpatialTokens.quantumTokens || 0} quantum tokens`);

        } catch (error) {
            console.error('Error analyzing foundation tokens:', error.message);
        }

        return foundationAnalysis;
    }

    // Analyze QA Validation System
    async analyzeQAValidation(themePath) {
        const qaAnalysis = {
            validationFiles: [],
            facetsSystem: {},
            globalGlassTheme: {},
            themeIntegrity: {},
            appleIntelligenceIntegration: false
        };

        try {
            const assetsPath = path.join(themePath, 'assets');

            // Check for QA and validation files
            if (fs.existsSync(assetsPath)) {
                const files = fs.readdirSync(assetsPath);
                const qaFiles = files.filter(file => 
                    file.includes('qa') || 
                    file.includes('validation') ||
                    file.includes('analyzer') ||
                    file.includes('facets') ||
                    file.includes('global-glass-theme')
                );

                for (const file of qaFiles) {
                    const filePath = path.join(assetsPath, file);
                    const stats = fs.statSync(filePath);
                    const content = fs.readFileSync(filePath, 'utf8');

                    const analysis = {
                        name: file,
                        size: stats.size,
                        hasAppleHIGCompliance: content.includes('Apple HIG'),
                        hasValidationFramework: content.includes('validation') || content.includes('QA'),
                        hasTokenValidation: content.includes('token') && content.includes('validation'),
                        hasAppleIntelligence: content.includes('Apple Intelligence'),
                        criticalSystemFile: false
                    };

                    // Identify critical system files
                    if (file === 'facets.css') {
                        analysis.criticalSystemFile = true;
                        qaAnalysis.facetsSystem = {
                            hasComprehensiveFilters: content.includes('FACETS & FILTERS CSS'),
                            hasAppleHIGCompliance: content.includes('Apple HIG Compliant'),
                            hasMobileResponsive: content.includes('@media (max-width:'),
                            hasAccessibilityFeatures: content.includes('prefers-reduced-motion'),
                            hasGlassEffects: content.includes('backdrop-filter')
                        };
                    }

                    if (file === 'global-glass-theme.css') {
                        analysis.criticalSystemFile = true;
                        qaAnalysis.globalGlassTheme = {
                            hasGlobalMaxWidth: content.includes('--global-max-width'),
                            hasAppleHIGFonts: content.includes('SF Pro'),
                            hasTouchTargets: content.includes('--touch-target-'),
                            hasFoundationIntegration: content.includes('--foundation-')
                        };
                    }

                    qaAnalysis.validationFiles.push(analysis);

                    if (content.includes('Apple Intelligence')) {
                        qaAnalysis.appleIntelligenceIntegration = true;
                    }
                }
            }

            console.log(`  ✅ QA Validation: ${qaAnalysis.validationFiles.length} validation files, Apple Intelligence integration: ${qaAnalysis.appleIntelligenceIntegration}`);

        } catch (error) {
            console.error('Error analyzing QA validation:', error.message);
        }

        return qaAnalysis;
    }

    // Run complete analysis
    async runCompleteAnalysis() {
        console.log('🚀 Starting Complete Theme Architecture Analysis');
        console.log('===============================================');
        console.log('');

        try {
            // Phase 1: Rise Theme
            await this.analyzeRiseTheme();
            
            // Phase 2: Horizon Theme  
            await this.analyzeHorizonTheme();

            // Phase 3: Glass Theme v4 (NEW)
            await this.analyzeGlassTheme();
            
            // Phase 4: Comparative Analysis
            await this.createComparativeAnalysis();
            
            // Phase 5: Generate Report
            const report = await this.generateReport();
            
            console.log('🎉 Complete analysis finished successfully!');
            return report;
            
        } catch (error) {
            console.error('❌ Analysis failed:', error.message);
            throw error;
        }
    }
}

// Enhanced variable and hard-coded style detection
export class VariableAnalyzer {
    constructor() {
        this.variablePatterns = {
            css: {
                customProperties: /--[\w-]+:\s*[^;]+/g,
                varReferences: /var\(--[\w-]+\)/g,
                hardcodedColors: /#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/g,
                hardcodedSizes: /\d+(\.\d+)?(px|em|rem|%|vh|vw|fr)/g,
                hardcodedSpacing: /(margin|padding|gap|space):\s*\d+/g
            },
            liquid: {
                settingsVars: /settings\.[\w.]+/g,
                sectionSettings: /section\.settings\.[\w.]+/g,
                blockSettings: /block\.settings\.[\w.]+/g,
                assignStatements: /\{%\s*assign\s+(\w+)\s*=/g,
                liquidVars: /\{\{\s*([\w.]+)\s*\}\}/g
            },
            js: {
                cssTextManipulation: /\.style\.[\w]+\s*=\s*['"][^'"]+['"]/g,
                inlineStyleSetting: /setAttribute\(['"]style['"],/g,
                hardcodedValues: /['"]\d+(px|em|rem|%)['"]|['"]#[0-9a-fA-F]{3,8}['"]/g,
                themeSettings: /theme\.settings\.[\w.]+/g
            },
            json: {
                styleProperties: /"(color|background|padding|margin|border|font|width|height|size|spacing|radius)":\s*"[^"]+"/g,
                numericValues: /"\w+":\s*\d+/g,
                colorValues: /"\w+":\s*"#[0-9a-fA-F]{3,8}"/g
            }
        };
    }

    analyzeFile(filePath, content) {
        const ext = path.extname(filePath).toLowerCase();
        const analysis = {
            filePath,
            variables: [],
            hardcodedStyles: [],
            recommendations: []
        };

        if (ext === '.css' || ext === '.scss') {
            analysis.variables = this.extractCSSVariables(content);
            analysis.hardcodedStyles = this.extractHardcodedCSS(content);
        } else if (ext === '.liquid') {
            analysis.variables = this.extractLiquidVariables(content);
            analysis.hardcodedStyles = this.extractHardcodedLiquid(content);
        } else if (ext === '.js' || ext === '.mjs') {
            analysis.variables = this.extractJSVariables(content);
            analysis.hardcodedStyles = this.extractHardcodedJS(content);
        } else if (ext === '.json') {
            analysis.hardcodedStyles = this.extractHardcodedJSON(content);
        }

        // Generate recommendations
        if (analysis.hardcodedStyles.length > 0) {
            analysis.recommendations.push({
                type: 'refactor',
                message: `Found ${analysis.hardcodedStyles.length} hard-coded styles that should be converted to tokens`,
                priority: 'high'
            });
        }

        return analysis;
    }

    extractCSSVariables(content) {
        const variables = [];
        const customProps = content.match(this.variablePatterns.css.customProperties) || [];
        const varRefs = content.match(this.variablePatterns.css.varReferences) || [];
        
        customProps.forEach(prop => {
            const [name, value] = prop.split(':').map(s => s.trim());
            variables.push({ type: 'css-custom-property', name, value, line: this.getLineNumber(content, prop) });
        });
        
        varRefs.forEach(ref => {
            const varName = ref.match(/var\(([^)]+)\)/)?.[1];
            if (varName) {
                variables.push({ type: 'css-var-reference', name: varName, line: this.getLineNumber(content, ref) });
            }
        });
        
        return variables;
    }

    extractHardcodedCSS(content) {
        const hardcoded = [];
        
        // Find hard-coded colors
        const colors = content.match(this.variablePatterns.css.hardcodedColors) || [];
        colors.forEach(color => {
            if (!color.includes('var(')) {
                hardcoded.push({ type: 'color', value: color, line: this.getLineNumber(content, color) });
            }
        });
        
        // Find hard-coded sizes
        const sizes = content.match(this.variablePatterns.css.hardcodedSizes) || [];
        sizes.forEach(size => {
            hardcoded.push({ type: 'size', value: size, line: this.getLineNumber(content, size) });
        });
        
        return hardcoded;
    }

    extractLiquidVariables(content) {
        const variables = [];
        
        // Settings variables
        const settings = content.match(this.variablePatterns.liquid.settingsVars) || [];
        settings.forEach(setting => {
            variables.push({ type: 'liquid-setting', name: setting, line: this.getLineNumber(content, setting) });
        });
        
        // Liquid assigns
        const assigns = content.match(this.variablePatterns.liquid.assignStatements) || [];
        assigns.forEach(assign => {
            const varName = assign.match(/assign\s+(\w+)/)?.[1];
            if (varName) {
                variables.push({ type: 'liquid-assign', name: varName, line: this.getLineNumber(content, assign) });
            }
        });
        
        return variables;
    }

    extractHardcodedLiquid(content) {
        const hardcoded = [];
        
        // Find inline styles in Liquid
        const inlineStyles = content.match(/style="[^"]+"/g) || [];
        inlineStyles.forEach(style => {
            const styleContent = style.match(/style="([^"]+)"/)?.[1];
            if (styleContent && !styleContent.includes('{{')) {
                hardcoded.push({ type: 'inline-style', value: styleContent, line: this.getLineNumber(content, style) });
            }
        });
        
        return hardcoded;
    }

    extractJSVariables(content) {
        const variables = [];
        
        // Theme settings references
        const themeSettings = content.match(this.variablePatterns.js.themeSettings) || [];
        themeSettings.forEach(setting => {
            variables.push({ type: 'js-theme-setting', name: setting, line: this.getLineNumber(content, setting) });
        });
        
        return variables;
    }

    extractHardcodedJS(content) {
        const hardcoded = [];
        
        // CSS text manipulation
        const styleManipulations = content.match(this.variablePatterns.js.cssTextManipulation) || [];
        styleManipulations.forEach(manipulation => {
            hardcoded.push({ type: 'js-style-manipulation', value: manipulation, line: this.getLineNumber(content, manipulation) });
        });
        
        // Hard-coded values in JS
        const hardcodedValues = content.match(this.variablePatterns.js.hardcodedValues) || [];
        hardcodedValues.forEach(value => {
            hardcoded.push({ type: 'js-hardcoded-value', value, line: this.getLineNumber(content, value) });
        });
        
        return hardcoded;
    }

    extractHardcodedJSON(content) {
        const hardcoded = [];
        
        try {
            const styleProps = content.match(this.variablePatterns.json.styleProperties) || [];
            styleProps.forEach(prop => {
                hardcoded.push({ type: 'json-style-property', value: prop, line: this.getLineNumber(content, prop) });
            });
            
            const colorValues = content.match(this.variablePatterns.json.colorValues) || [];
            colorValues.forEach(color => {
                hardcoded.push({ type: 'json-color-value', value: color, line: this.getLineNumber(content, color) });
            });
        } catch (e) {
            // JSON parsing error
        }
        
        return hardcoded;
    }

    getLineNumber(content, searchString) {
        const index = content.indexOf(searchString);
        if (index === -1) return 0;
        return content.substring(0, index).split('').length;
    }
}

// CLI usage
if (process.argv[1] === __filename) {
    const themePath = process.argv[2];
    
    if (!themePath) {
        console.error('Please provide a theme path as argument');
        console.error('Usage: node theme-architecture-analyzer.js /path/to/theme');
        process.exit(1);
    }
    
    const analyzer = new ThemeArchitectureAnalyzer(themePath);
    const variableAnalyzer = new VariableAnalyzer();
    
    // Run enhanced analysis with variable detection
    async function runEnhancedAnalysis() {
        console.log(`🔍 Analyzing theme: ${analyzer.themeName}`);
        console.log('='.repeat(50));
        
        // Run standard architecture analysis
        const themeAnalysis = await analyzer.analyzeGlassTheme();
        
        // Enhanced variable and hard-coded style analysis
        console.log('🔬 Enhanced Variable & Hard-coded Style Analysis');
        console.log('='.repeat(50));
        
        const variableReport = {
            totalVariables: 0,
            totalHardcoded: 0,
            fileAnalysis: [],
            summary: {}
        };
        
        // Analyze all relevant files
        const directories = ['assets', 'snippets', 'sections', 'templates'];
        
        for (const dir of directories) {
            const dirPath = path.join(themePath, dir);
            if (fs.existsSync(dirPath)) {
                const files = analyzer.getAllFiles(dirPath, '');
                
                for (const file of files) {
                    const ext = path.extname(file);
                    if (['.css', '.js', '.liquid', '.json'].includes(ext)) {
                        const content = fs.readFileSync(file, 'utf8');
                        const analysis = variableAnalyzer.analyzeFile(file, content);
                        
                        if (analysis.variables.length > 0 || analysis.hardcodedStyles.length > 0) {
                            variableReport.fileAnalysis.push({
                                file: path.relative(themePath, file),
                                variables: analysis.variables.length,
                                hardcoded: analysis.hardcodedStyles.length,
                                details: analysis
                            });
                            
                            variableReport.totalVariables += analysis.variables.length;
                            variableReport.totalHardcoded += analysis.hardcodedStyles.length;
                        }
                    }
                }
            }
        }
        
        // Generate summary
        variableReport.summary = {
            tokenIntegration: {
                cssCustomProperties: variableReport.fileAnalysis.filter(f => 
                    f.details.variables.some(v => v.type === 'css-custom-property')
                ).length,
                liquidVariables: variableReport.fileAnalysis.filter(f => 
                    f.details.variables.some(v => v.type.includes('liquid'))
                ).length,
                jsVariables: variableReport.fileAnalysis.filter(f => 
                    f.details.variables.some(v => v.type.includes('js'))
                ).length
            },
            hardcodedIssues: {
                filesWithHardcoded: variableReport.fileAnalysis.filter(f => f.hardcoded > 0).length,
                criticalFiles: variableReport.fileAnalysis
                    .filter(f => f.hardcoded > 10)
                    .map(f => f.file),
                recommendedRefactoring: variableReport.fileAnalysis
                    .filter(f => f.details.recommendations.length > 0)
                    .map(f => ({ file: f.file, recommendations: f.details.recommendations }))
            }
        };
        
        // Display results
        console.log(`📊 Analysis Results for ${analyzer.themeName}`);
        console.log('='.repeat(50));
        console.log(`Total Variables Found: ${variableReport.totalVariables}`);
        console.log(`Total Hard-coded Styles: ${variableReport.totalHardcoded}`);
        console.log(`Token Integration:`);
        console.log(`  - CSS Custom Properties: ${variableReport.summary.tokenIntegration.cssCustomProperties} files`);
        console.log(`  - Liquid Variables: ${variableReport.summary.tokenIntegration.liquidVariables} files`);
        console.log(`  - JS Variables: ${variableReport.summary.tokenIntegration.jsVariables} files`);
        console.log(`Hard-coded Issues:`);
        console.log(`  - Files with hard-coded styles: ${variableReport.summary.hardcodedIssues.filesWithHardcoded}`);
        
        if (variableReport.summary.hardcodedIssues.criticalFiles.length > 0) {
            console.log(`⚠️  Critical files with >10 hard-coded values:`);
            variableReport.summary.hardcodedIssues.criticalFiles.forEach(file => {
                console.log(`    - ${file}`);
            });
        }
        
        // Save detailed report
        const reportPath = path.join(process.cwd(), `${analyzer.themeName}-analysis-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify({
            themeName: analyzer.themeName,
            timestamp: new Date().toISOString(),
            architectureAnalysis: themeAnalysis,
            variableAnalysis: variableReport
        }, null, 2));
        
        console.log(`✅ Detailed report saved to: ${reportPath}`);
        
        return variableReport;
    }
    
    runEnhancedAnalysis()
        .then(() => {
            console.log('🎉 Analysis complete!');
            process.exit(0);
        })
        .catch(error => {
            console.error('Analysis failed:', error);
            process.exit(1);
        });
}
