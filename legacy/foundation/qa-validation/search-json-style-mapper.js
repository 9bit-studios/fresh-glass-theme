// Search JSON Style Mapper - Maps inline styles to CSS classes
// Apple Intelligence Strategic Director
// Version: 1.0.0

const fs = require('fs');
const path = require('path');

class SearchJSONStyleMapper {
    constructor() {
        this.themePath = '/Users/pennyplatt/Documents/9BitStudios/petersen-portal/petersen-glass-theme/';
        this.searchJsonPath = path.join(this.themePath, 'templates/search.json');
        this.cssFiles = [];
        this.inlineStyles = [];
        this.cssClasses = new Map();
        this.recommendations = [];
    }

    // Find all CSS files in the theme
    findCSSFiles() {
        const assetsPath = path.join(this.themePath, 'assets');
        this.cssFiles = fs.readdirSync(assetsPath)
            .filter(file => file.endsWith('.css'))
            .map(file => path.join(assetsPath, file));
        
        console.log(`Found ${this.cssFiles.length} CSS files`);
        return this.cssFiles;
    }

    // Extract CSS classes from files
    extractCSSClasses() {
        console.log('📋 Extracting CSS Classes from Theme...');
        
        const classPatterns = [
            /\.([a-zA-Z0-9-_]+)\s*{/g,  // Regular classes
            /\.quantum-spatial-[a-zA-Z0-9-_]+/g,  // QuantumSpatial classes
            /\.glass-[a-zA-Z0-9-_]+/g,  // Glass theme classes
            /\.foundation-[a-zA-Z0-9-_]+/g  // Foundation classes
        ];

        this.cssFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            const fileName = path.basename(file);
            
            classPatterns.forEach(pattern => {
                let match;
                while ((match = pattern.exec(content)) !== null) {
                    const className = match[1] || match[0].substring(1);
                    if (!this.cssClasses.has(className)) {
                        this.cssClasses.set(className, {
                            file: fileName,
                            count: 1
                        });
                    } else {
                        this.cssClasses.get(className).count++;
                    }
                }
            });
        });

        console.log(`✅ Found ${this.cssClasses.size} unique CSS classes`);
    }

    // Analyze search.json for inline styles
    analyzeSearchJSON() {
        console.log('📋 Analyzing search.json...');
        
        const searchContent = fs.readFileSync(this.searchJsonPath, 'utf8');
        const searchData = JSON.parse(searchContent);
        
        this.extractInlineStyles(searchData, '');
        
        console.log(`✅ Found ${this.inlineStyles.length} inline style instances`);
    }

    // Recursively extract inline styles from JSON
    extractInlineStyles(obj, path) {
        for (const key in obj) {
            const currentPath = path ? `${path}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.extractInlineStyles(obj[key], currentPath);
            } else if (this.isStyleProperty(key)) {
                this.inlineStyles.push({
                    path: currentPath,
                    property: key,
                    value: obj[key],
                    recommendation: this.getRecommendation(key, obj[key])
                });
            }
        }
    }

    // Check if property is a style property
    isStyleProperty(key) {
        const styleProperties = [
            'font_size', 'line_height', 'letter_spacing', 'padding', 
            'padding-block-start', 'padding-block-end', 
            'padding-inline-start', 'padding-inline-end',
            'margin', 'gap', 'color', 'background_color',
            'border_radius', 'width', 'custom_width', 'height'
        ];
        
        return styleProperties.includes(key);
    }

    // Get recommendation for style property
    getRecommendation(property, value) {
        const recommendations = {
            'font_size': {
                '1rem': 'Use: var(--foundation-font-body)',
                '1.125rem': 'Use: var(--foundation-font-lg)',
                '1.5rem': 'Use: var(--foundation-font-xl)',
                '2rem': 'Use: var(--foundation-font-2xl)',
                '3rem': 'Use: var(--foundation-font-3xl)'
            },
            'padding-block-start': {
                '0': 'Use: var(--foundation-space-0)',
                '8': 'Use: var(--foundation-xs)',
                '16': 'Use: var(--foundation-sm)',
                '24': 'Use: var(--foundation-md)',
                '32': 'Use: var(--foundation-lg)',
                '40': 'Use: var(--foundation-xl)',
                '48': 'Use: var(--foundation-xxl)'
            },
            'gap': {
                '4': 'Use: var(--foundation-tiny)',
                '8': 'Use: var(--foundation-xs)',
                '16': 'Use: var(--foundation-sm)',
                '24': 'Use: var(--foundation-md)'
            },
            'color': {
                'var(--color-foreground)': 'Use: var(--foundation-foreground-primary)',
                '#000': 'Use: var(--foundation-foreground-primary)',
                '#fff': 'Use: var(--foundation-background-primary)'
            }
        };

        if (recommendations[property] && recommendations[property][value]) {
            return recommendations[property][value];
        }

        // Generic recommendations
        if (property.includes('padding')) {
            return `Consider using var(--foundation-*) spacing tokens`;
        }
        if (property === 'font_size') {
            return `Consider using var(--foundation-font-*) tokens`;
        }
        if (property === 'color') {
            return `Consider using var(--foundation-foreground-*) or var(--foundation-background-*)`;
        }

        return null;
    }

    // Map inline styles to existing classes
    mapStylesToClasses() {
        console.log('📋 Mapping Inline Styles to CSS Classes...');
        
        const mappings = [];
        
        // Check for search-specific classes
        const searchClasses = Array.from(this.cssClasses.keys()).filter(cls => 
            cls.includes('search') || 
            cls.includes('product-grid') || 
            cls.includes('filter') ||
            cls.includes('facet')
        );

        console.log(`🔍 Found ${searchClasses.length} search-related CSS classes:`);
        searchClasses.forEach(cls => {
            console.log(`  - .${cls} (in ${this.cssClasses.get(cls).file})`);
        });

        // Suggest glass theme classes
        const glassClasses = Array.from(this.cssClasses.keys()).filter(cls => 
            cls.includes('glass-')
        );

        console.log(`🔍 Found ${glassClasses.length} glass theme classes available`);

        // Suggest QuantumSpatial classes
        const quantumClasses = Array.from(this.cssClasses.keys()).filter(cls => 
            cls.includes('quantum-spatial')
        );

        console.log(`🔍 Found ${quantumClasses.length} QuantumSpatial classes available`);

        return {
            searchClasses,
            glassClasses,
            quantumClasses
        };
    }

    // Generate report
    generateReport() {
        console.log('📊 SEARCH.JSON STYLE ANALYSIS REPORT');
        console.log('=====================================');

        console.log('🎯 Inline Styles Found:');
        this.inlineStyles.forEach(style => {
            console.log(`  Path: ${style.path}`);
            console.log(`  Property: ${style.property}`);
            console.log(`  Value: ${style.value}`);
            if (style.recommendation) {
                console.log(`  ✨ Recommendation: ${style.recommendation}`);
            }
        });

        const classes = this.mapStylesToClasses();

        console.log('💡 RECOMMENDATIONS FOR SEARCH.JSON:');
        console.log('=====================================');

        console.log('1. Replace inline padding values with QuantumFoundation tokens:');
        console.log('   Instead of: "padding-block-start": 40');
        console.log('   Use: "padding-block-start": "var(--foundation-xl)"');

        console.log('2. Apply existing CSS classes to components:');
        console.log('   - Add "color_scheme": "glass-theme" to sections');
        console.log('   - Use "inherit_color_scheme": true for nested blocks');

        console.log('3. For the search header:');
        console.log('   - Apply class: "search-header" or "glass-header"');
        console.log('   - Use "alignment": "center" for centered layout');

        console.log('4. For product grid:');
        console.log('   - Apply class: "product-grid" or "collection-grid"');
        console.log('   - Use "columns_gap_horizontal": "var(--foundation-card-gap)"');

        console.log('5. For filters:');
        console.log('   - Apply existing facets classes');
        console.log('   - Add "filter_style": "horizontal" for mobile');
        console.log('   - Add sidebar for desktop via section include');

        return {
            inlineStyles: this.inlineStyles,
            availableClasses: classes,
            totalInlineStyles: this.inlineStyles.length
        };
    }

    // Run the analysis
    run() {
        console.log('🚀 Starting Search JSON Style Analysis...');
        
        this.findCSSFiles();
        this.extractCSSClasses();
        this.analyzeSearchJSON();
        
        return this.generateReport();
    }
}

// Execute if run directly
if (require.main === module) {
    const mapper = new SearchJSONStyleMapper();
    mapper.run();
}

module.exports = SearchJSONStyleMapper;