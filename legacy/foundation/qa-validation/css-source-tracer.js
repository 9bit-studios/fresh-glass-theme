/**
 * CSS SOURCE TRACER - Deep Style Origin Detection
 * Identifies exact sources of all CSS loading, including mysterious domain-only entries
 * Solves the "https://shop.petersengames.com:4934" mystery in DevTools
 */

class CSSSourceTracer {
    constructor() {
        this.cssSourceMap = {
            stylesheets: [],
            inlineStyles: [],
            computedSources: [],
            mysteriousSources: [],
            domainOnlyEntries: [],
            loadingOrder: [],
            sourceBreakdown: {}
        };
        
        this.domainPattern = /^https?:\/\/[^\/]+\/?$/;
        this.suspiciousPatterns = [
            /:\d{4}\/?$/,  // Port numbers (like :4934)
            /^https?:\/\/[^\/]+$/,  // Domain-only URLs
            /\.css\?\d+$/,  // Cache-busted CSS
            /data:text\/css/,  // Data URLs
            /blob:/  // Blob URLs
        ];
    }
    
    /**
     * PHASE 1: Map all stylesheet sources
     * Identifies every CSS loading method and source
     */
    traceStylesheetSources() {
        console.log('🔍 TRACING STYLESHEET SOURCES...');
        
        const stylesheets = [];
        
        // Method 1: Link elements
        const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
        linkElements.forEach((link, index) => {
            const href = link.getAttribute('href');
            const source = {
                index,
                type: 'LINK_ELEMENT',
                href: href,
                filename: this.extractFilename(href),
                loaded: link.sheet !== null,
                disabled: link.disabled,
                media: link.media,
                crossOrigin: link.crossOrigin,
                integrity: link.integrity,
                element: link,
                sourceLocation: this.getElementLocation(link)
            };
            
            // Check if it's a mysterious domain-only entry
            if (this.isDomainOnlyUrl(href)) {
                source.suspicious = true;
                source.suspicionReason = 'DOMAIN_ONLY_URL';
                this.cssSourceMap.domainOnlyEntries.push(source);
            }
            
            stylesheets.push(source);
        });
        
        // Method 2: Style elements with @import
        const styleElements = document.querySelectorAll('style');
        styleElements.forEach((style, index) => {
            const content = style.textContent || style.innerHTML;
            const imports = this.extractImports(content);
            
            imports.forEach(importUrl => {
                const source = {
                    index: `style-${index}-import`,
                    type: 'STYLE_IMPORT',
                    href: importUrl,
                    filename: this.extractFilename(importUrl),
                    parentStyle: style,
                    content: content.substring(0, 200) + '...',
                    sourceLocation: this.getElementLocation(style)
                };
                
                if (this.isDomainOnlyUrl(importUrl)) {
                    source.suspicious = true;
                    source.suspicionReason = 'DOMAIN_ONLY_IMPORT';
                    this.cssSourceMap.domainOnlyEntries.push(source);
                }
                
                stylesheets.push(source);
            });
        });
        
        // Method 3: Document.styleSheets API (catches all)
        Array.from(document.styleSheets).forEach((sheet, index) => {
            const source = {
                index: `sheet-${index}`,
                type: 'STYLESHEET_OBJECT',
                href: sheet.href,
                filename: this.extractFilename(sheet.href),
                ownerNode: sheet.ownerNode,
                disabled: sheet.disabled,
                media: sheet.media.mediaText,
                rules: sheet.cssRules ? sheet.cssRules.length : 'ACCESS_DENIED',
                sourceLocation: sheet.ownerNode ? this.getElementLocation(sheet.ownerNode) : 'UNKNOWN'
            };
            
            // This often catches the mysterious entries
            if (!sheet.href || this.isDomainOnlyUrl(sheet.href)) {
                source.suspicious = true;
                source.suspicionReason = sheet.href ? 'DOMAIN_ONLY_STYLESHEET' : 'NO_HREF_STYLESHEET';
                source.investigation = this.investigateMysteryStyesheet(sheet);
                this.cssSourceMap.mysteriousSources.push(source);
            }
            
            stylesheets.push(source);
        });
        
        this.cssSourceMap.stylesheets = stylesheets;
        return stylesheets;
    }
    
    /**
     * PHASE 2: Deep investigation of mysterious stylesheets
     * Analyzes domain-only and suspicious CSS sources
     */
    investigateMysteryStyesheet(stylesheet) {
        console.log('🕵️ INVESTIGATING MYSTERIOUS STYLESHEET...');
        
        const investigation = {
            ownerNodeType: null,
            ownerNodeAttributes: {},
            cssRulesCount: 0,
            sampleRules: [],
            sourceHints: [],
            likelyOrigin: 'UNKNOWN'
        };
        
        try {
            // Analyze owner node
            if (stylesheet.ownerNode) {
                const node = stylesheet.ownerNode;
                investigation.ownerNodeType = node.tagName;
                
                // Capture all attributes
                if (node.attributes) {
                    Array.from(node.attributes).forEach(attr => {
                        investigation.ownerNodeAttributes[attr.name] = attr.value;
                    });
                }
                
                // Check parent context
                investigation.parentElement = node.parentElement ? node.parentElement.tagName : null;
                investigation.innerHTML = node.innerHTML ? node.innerHTML.substring(0, 200) : null;
            }
            
            // Analyze CSS rules (if accessible)
            if (stylesheet.cssRules) {
                investigation.cssRulesCount = stylesheet.cssRules.length;
                
                // Sample first few rules for analysis
                for (let i = 0; i < Math.min(5, stylesheet.cssRules.length); i++) {
                    const rule = stylesheet.cssRules[i];
                    investigation.sampleRules.push({
                        type: rule.type,
                        cssText: rule.cssText.substring(0, 100),
                        selector: rule.selectorText || 'N/A'
                    });
                }
                
                // Look for identifying patterns in rules
                Array.from(stylesheet.cssRules).forEach(rule => {
                    const cssText = rule.cssText;
                    
                    if (cssText.includes('shopify')) {
                        investigation.sourceHints.push('SHOPIFY_GENERATED');
                    }
                    if (cssText.includes('liquid')) {
                        investigation.sourceHints.push('LIQUID_TEMPLATE');
                    }
                    if (cssText.includes('foundation')) {
                        investigation.sourceHints.push('FOUNDATION_CSS');
                    }
                    if (cssText.includes('facets')) {
                        investigation.sourceHints.push('FACETS_CSS');
                    }
                    if (cssText.includes('glass')) {
                        investigation.sourceHints.push('GLASS_THEME');
                    }
                });
            }
            
            // Determine likely origin
            if (investigation.sourceHints.includes('SHOPIFY_GENERATED')) {
                investigation.likelyOrigin = 'SHOPIFY_SYSTEM_CSS';
            } else if (investigation.sourceHints.includes('LIQUID_TEMPLATE')) {
                investigation.likelyOrigin = 'LIQUID_TEMPLATE_GENERATED';
            } else if (investigation.ownerNodeType === 'STYLE') {
                investigation.likelyOrigin = 'INLINE_STYLE_BLOCK';
            } else if (investigation.ownerNodeAttributes.href) {
                investigation.likelyOrigin = 'EXTERNAL_STYLESHEET';
            }
            
        } catch (error) {
            investigation.error = error.message;
            investigation.likelyOrigin = 'CORS_BLOCKED_EXTERNAL';
        }
        
        return investigation;
    }
    
    /**
     * PHASE 3: Trace inline style sources
     * Maps all inline CSS and its origins
     */
    traceInlineStyleSources() {
        console.log('🔍 TRACING INLINE STYLE SOURCES...');
        
        const inlineStyles = [];
        
        // Method 1: Elements with style attributes
        const styledElements = document.querySelectorAll('[style]');
        styledElements.forEach((element, index) => {
            const styleValue = element.getAttribute('style');
            inlineStyles.push({
                index,
                type: 'STYLE_ATTRIBUTE',
                element: element.tagName.toLowerCase(),
                selector: this.generateElementSelector(element),
                styles: styleValue,
                location: this.getElementLocation(element),
                sourceHint: this.guessInlineStyleSource(element, styleValue)
            });
        });
        
        // Method 2: Style elements (inline CSS blocks)
        const styleElements = document.querySelectorAll('style');
        styleElements.forEach((style, index) => {
            const content = style.textContent || style.innerHTML;
            if (content.trim()) {
                inlineStyles.push({
                    index: `block-${index}`,
                    type: 'STYLE_BLOCK',
                    element: 'style',
                    content: content,
                    size: content.length,
                    location: this.getElementLocation(style),
                    sourceHint: this.guessStyleBlockSource(content),
                    isApproved: this.isApprovedStyleBlock(content)
                });
            }
        });
        
        this.cssSourceMap.inlineStyles = inlineStyles;
        return inlineStyles;
    }
    
    /**
     * PHASE 4: Analyze computed style sources
     * Traces where final computed values come from
     */
    analyzeComputedStyleSources(targetElement) {
        console.log('🔍 ANALYZING COMPUTED STYLE SOURCES...');
        
        const element = targetElement || document.documentElement;
        const computedStyle = getComputedStyle(element);
        const sourceAnalysis = {
            element: this.generateElementSelector(element),
            totalProperties: 0,
            sourceBreakdown: {},
            criticalTokenSources: {},
            unknownSources: []
        };
        
        // Analyze critical CSS custom properties
        const criticalTokens = [
            '--foundation-background-primary',
            '--foundation-foreground-primary',
            '--foundation-glass-subtle',
            '--liquid-glass-subtle',
            '--ultra-dark-text-primary'
        ];
        
        criticalTokens.forEach(token => {
            const value = computedStyle.getPropertyValue(token);
            if (value.trim()) {
                sourceAnalysis.criticalTokenSources[token] = {
                    value: value.trim(),
                    likelySource: this.traceCSSVariableSource(token)
                };
            }
        });
        
        this.cssSourceMap.computedSources.push(sourceAnalysis);
        return sourceAnalysis;
    }
    
    /**
     * UTILITY: Detect domain-only URLs
     */
    isDomainOnlyUrl(url) {
        if (!url) return false;
        return this.domainPattern.test(url) || url.match(/:\d{4}\/?$/);
    }
    
    /**
     * UTILITY: Extract filename from URL
     */
    extractFilename(url) {
        if (!url) return 'UNKNOWN';
        if (url.startsWith('data:')) return 'DATA_URL';
        if (url.startsWith('blob:')) return 'BLOB_URL';
        
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];
        return filename.split('?')[0] || 'DOMAIN_ONLY';
    }
    
    /**
     * UTILITY: Extract @import statements
     */
    extractImports(cssContent) {
        const importRegex = /@import\s+(?:url\()?['"]?([^'"\)]+)['"]?\)?/g;
        const imports = [];
        let match;
        
        while ((match = importRegex.exec(cssContent)) !== null) {
            imports.push(match[1]);
        }
        
        return imports;
    }
    
    /**
     * UTILITY: Generate element selector
     */
    generateElementSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) {
            const classes = element.className.split(' ').filter(c => c.trim());
            if (classes.length > 0) return `.${classes[0]}`;
        }
        
        let selector = element.tagName.toLowerCase();
        const parent = element.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(child => child.tagName === element.tagName);
            if (siblings.length > 1) {
                const index = siblings.indexOf(element) + 1;
                selector += `:nth-of-type(${index})`;
            }
        }
        
        return selector;
    }
    
    /**
     * UTILITY: Get element location in DOM
     */
    getElementLocation(element) {
        const path = [];
        let current = element;
        
        while (current && current !== document) {
            const selector = current.id ? `#${current.id}` : 
                           current.className ? `.${current.className.split(' ')[0]}` :
                           current.tagName.toLowerCase();
            path.unshift(selector);
            current = current.parentElement;
        }
        
        return path.join(' > ');
    }
    
    /**
     * UTILITY: Guess inline style source
     */
    guessInlineStyleSource(element, styleValue) {
        if (styleValue.includes('display: none') || styleValue.includes('visibility: hidden')) {
            return 'DYNAMIC_HIDE_SHOW';
        }
        if (styleValue.includes('transform') || styleValue.includes('translate')) {
            return 'ANIMATION_FRAMEWORK';
        }
        if (styleValue.includes('width') || styleValue.includes('height')) {
            return 'DYNAMIC_SIZING';
        }
        if (element.getAttribute('data-shopify')) {
            return 'SHOPIFY_GENERATED';
        }
        
        return 'UNKNOWN_INLINE';
    }
    
    /**
     * UTILITY: Guess style block source
     */
    guessStyleBlockSource(content) {
        if (content.includes('FOUNDATION VARIABLE INTEGRATION')) return 'FOUNDATION_INTEGRATION';
        if (content.includes('LIQUID GLASS FOUNDATION TOKENS')) return 'LIQUID_GLASS_TOKENS';
        if (content.includes('ULTRA DARK MODE TYPOGRAPHY')) return 'ULTRA_DARK_TYPOGRAPHY';
        if (content.includes('shopify')) return 'SHOPIFY_SYSTEM';
        if (content.includes('liquid')) return 'LIQUID_TEMPLATE';
        
        return 'UNKNOWN_STYLE_BLOCK';
    }
    
    /**
     * UTILITY: Check if style block is approved
     */
    isApprovedStyleBlock(content) {
        const approvedPatterns = [
            'FOUNDATION VARIABLE INTEGRATION',
            'LIQUID GLASS FOUNDATION TOKENS',
            'ULTRA DARK MODE TYPOGRAPHY'
        ];
        
        return approvedPatterns.some(pattern => content.includes(pattern));
    }
    
    /**
     * UTILITY: Trace CSS variable source
     */
    traceCSSVariableSource(variableName) {
        // Try to find where the CSS variable is defined
        for (const stylesheet of document.styleSheets) {
            try {
                if (stylesheet.cssRules) {
                    for (const rule of stylesheet.cssRules) {
                        if (rule.style && rule.style.getPropertyValue(variableName)) {
                            return {
                                stylesheet: stylesheet.href || 'INLINE',
                                filename: this.extractFilename(stylesheet.href),
                                rule: rule.cssText.substring(0, 100)
                            };
                        }
                    }
                }
            } catch (error) {
                // CORS or access denied
                continue;
            }
        }
        
        return 'SOURCE_NOT_FOUND';
    }
    
    /**
     * COMPREHENSIVE SOURCE REPORT
     * Detailed breakdown of all CSS sources
     */
    generateSourceReport() {
        console.log('📊 COMPREHENSIVE CSS SOURCE REPORT');
        console.log('===================================');
        
        // Trace all sources
        this.traceStylesheetSources();
        this.traceInlineStyleSources();
        this.analyzeComputedStyleSources();
        
        console.log(`📁 STYLESHEET SOURCES (${this.cssSourceMap.stylesheets.length} total):`);
        this.cssSourceMap.stylesheets.forEach(sheet => {
            const status = sheet.loaded ? '✅' : '❌';
            const suspicious = sheet.suspicious ? '🚨' : '';
            console.log(`${status}${suspicious} ${sheet.type}: ${sheet.filename || sheet.href || 'NO_SOURCE'}`);
            
            if (sheet.suspicious) {
                console.log(`   ⚠️  Suspicious: ${sheet.suspicionReason}`);
                if (sheet.investigation) {
                    console.log(`   🔍 Likely Origin: ${sheet.investigation.likelyOrigin}`);
                    if (sheet.investigation.sourceHints.length > 0) {
                        console.log(`   💡 Hints: ${sheet.investigation.sourceHints.join(', ')}`);
                    }
                }
            }
        });
        
        console.log(`🎨 INLINE STYLES (${this.cssSourceMap.inlineStyles.length} total):`);
        this.cssSourceMap.inlineStyles.forEach(style => {
            const approved = style.isApproved ? '✅' : '❌';
            console.log(`${approved} ${style.type}: ${style.selector || 'style block'}`);
            console.log(`   📍 Source Hint: ${style.sourceHint}`);
            if (!style.isApproved && style.type === 'STYLE_ATTRIBUTE') {
                console.log(`   ⚠️  Inline CSS Violation: ${style.styles}`);
            }
        });
        
        // Mysterious sources breakdown
        if (this.cssSourceMap.domainOnlyEntries.length > 0) {
            console.log(`🕵️ MYSTERIOUS DOMAIN-ONLY SOURCES (${this.cssSourceMap.domainOnlyEntries.length} total):`);
            this.cssSourceMap.domainOnlyEntries.forEach(source => {
                console.log(`🚨 ${source.href || 'NO_HREF'}`);
                if (source.investigation) {
                    console.log(`   🔍 Investigation: ${source.investigation.likelyOrigin}`);
                    console.log(`   📝 Rules: ${source.investigation.cssRulesCount}`);
                    if (source.investigation.sampleRules.length > 0) {
                        console.log(`   📄 Sample: ${source.investigation.sampleRules[0].cssText}`);
                    }
                }
            });
        }
        
        // Critical token sources
        console.log(`🎯 CRITICAL TOKEN SOURCES:`);
        if (this.cssSourceMap.computedSources.length > 0) {
            const tokenSources = this.cssSourceMap.computedSources[0].criticalTokenSources;
            Object.entries(tokenSources).forEach(([token, info]) => {
                console.log(`✅ ${token}: ${info.value}`);
                if (info.likelySource !== 'SOURCE_NOT_FOUND') {
                    console.log(`   📁 Source: ${info.likelySource.filename || info.likelySource}`);
                }
            });
        }
        
        return this.cssSourceMap;
    }
    
    /**
     * QUICK DOMAIN-ONLY DETECTIVE
     * Specifically targets the mystery entries
     */
    solveDomainOnlyMystery() {
        console.log('🕵️ SOLVING DOMAIN-ONLY MYSTERY...');
        console.log('Investigating: https://shop.petersengames.com:4934 entries');
        
        const mysteryEntries = [];
        
        Array.from(document.styleSheets).forEach((sheet, index) => {
            if (!sheet.href || this.isDomainOnlyUrl(sheet.href)) {
                const investigation = this.investigateMysteryStyesheet(sheet);
                mysteryEntries.push({
                    index,
                    href: sheet.href || 'NO_HREF',
                    investigation,
                    solution: this.proposeSolution(investigation)
                });
            }
        });
        
        console.log(`🎯 MYSTERY SOLVED - Found ${mysteryEntries.length} domain-only entries:`);
        mysteryEntries.forEach(entry => {
            console.log(`🔍 Entry ${entry.index}: ${entry.href}`);
            console.log(`   💡 Solution: ${entry.solution}`);
            console.log(`   📝 Origin: ${entry.investigation.likelyOrigin}`);
        });
        
        return mysteryEntries;
    }
    
    /**
     * UTILITY: Propose solution for mysterious CSS
     */
    proposeSolution(investigation) {
        if (investigation.likelyOrigin === 'SHOPIFY_SYSTEM_CSS') {
            return 'This is Shopify-generated CSS - normal behavior';
        }
        if (investigation.likelyOrigin === 'LIQUID_TEMPLATE_GENERATED') {
            return 'Check .liquid templates for {% style %} tags';
        }
        if (investigation.likelyOrigin === 'INLINE_STYLE_BLOCK') {
            return 'Move inline <style> content to external CSS file';
        }
        if (investigation.likelyOrigin === 'CORS_BLOCKED_EXTERNAL') {
            return 'External CSS blocked by CORS - check server headers';
        }
        
        return 'Unknown source - requires manual investigation';
    }
}

// Node.js Server-Side CSS Analysis
class ServerSideCSSAnalyzer extends CSSSourceTracer {
    constructor() {
        super();
        this.fs = require('fs');
        this.path = require('path');
        this.glob = require('glob');
    }
    
    async analyzeProjectCSS(projectPath) {
        console.log('🔍 ANALYZING PROJECT CSS SOURCES...');
        console.log(`Project: ${projectPath}`);
        
        const analysis = {
            cssFiles: [],
            liquidFiles: [],
            inlineViolations: [],
            suspiciousPatterns: [],
            foundationTokens: [],
            recommendations: []
        };
        
        try {
            // Find all CSS files
            const cssFiles = await this.findCSSFiles(projectPath);
            analysis.cssFiles = cssFiles;
            
            // Find all Liquid files  
            const liquidFiles = await this.findLiquidFiles(projectPath);
            analysis.liquidFiles = liquidFiles;
            
            // Analyze each file for violations
            for (const file of liquidFiles) {
                const violations = await this.analyzeFileForViolations(file);
                analysis.inlineViolations.push(...violations);
            }
            
            // Generate recommendations
            analysis.recommendations = this.generateRecommendations(analysis);
            
            this.generateServerSideReport(analysis);
            return analysis;
            
        } catch (error) {
            console.error('Analysis failed:', error.message);
            return { error: error.message };
        }
    }
    
    async findCSSFiles(projectPath) {
        const files = [];
        
        try {
            // Use recursive directory scanning instead of glob
            const cssFiles = await this.scanDirectory(projectPath, ['.css', '.scss', '.sass']);
            
            return cssFiles.map(file => ({
                path: file,
                filename: this.path.basename(file),
                size: this.getFileSize(file),
                type: this.path.extname(file)
            }));
        } catch (error) {
            console.log('CSS file scan error:', error.message);
            return [];
        }
    }
    
    async findLiquidFiles(projectPath) {
        try {
            const liquidFiles = await this.scanDirectory(projectPath, ['.liquid']);
            
            return liquidFiles.map(file => ({
                path: file,
                filename: this.path.basename(file),
                size: this.getFileSize(file)
            }));
        } catch (error) {
            console.log('Liquid file scan error:', error.message);
            return [];
        }
    }
    
    async scanDirectory(dirPath, extensions) {
        const files = [];
        
        try {
            const items = this.fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = this.path.join(dirPath, item);
                const stat = this.fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Skip node_modules and .git directories
                    if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
                        const subFiles = await this.scanDirectory(fullPath, extensions);
                        files.push(...subFiles);
                    }
                } else if (stat.isFile()) {
                    const ext = this.path.extname(item);
                    if (extensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            // Directory access error, skip
        }
        
        return files;
    }
    
    async analyzeFileForViolations(file) {
        const violations = [];
        
        try {
            const content = this.fs.readFileSync(file.path, 'utf8');
            
            // Check for style attributes
            const styleMatches = content.match(/style\s*=\s*["'][^"']*["']/gi);
            if (styleMatches) {
                violations.push({
                    file: file.path,
                    type: 'INLINE_STYLE_ATTRIBUTE',
                    count: styleMatches.length,
                    samples: styleMatches.slice(0, 3),
                    severity: 'CRITICAL'
                });
            }
            
            // Check for <style> tags
            const styleTagMatches = content.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
            if (styleTagMatches) {
                const approved = styleTagMatches.filter(style => 
                    this.isApprovedStyleBlock(style)
                );
                const unapproved = styleTagMatches.filter(style => 
                    !this.isApprovedStyleBlock(style)
                );
                
                if (unapproved.length > 0) {
                    violations.push({
                        file: file.path,
                        type: 'UNAPPROVED_STYLE_BLOCK',
                        count: unapproved.length,
                        approved: approved.length,
                        samples: unapproved.slice(0, 2).map(s => s.substring(0, 100)),
                        severity: 'HIGH'
                    });
                }
            }
            
            // Check for {% style %} tags
            const liquidStyleMatches = content.match(/{%\s*style\s*%}[\s\S]*?{%\s*endstyle\s*%}/gi);
            if (liquidStyleMatches) {
                violations.push({
                    file: file.path,
                    type: 'LIQUID_STYLE_TAG',
                    count: liquidStyleMatches.length,
                    samples: liquidStyleMatches.slice(0, 2).map(s => s.substring(0, 100)),
                    severity: 'HIGH',
                    solution: 'Move {% style %} content to external CSS file'
                });
            }
            
        } catch (error) {
            // File read error, skip
        }
        
        return violations;
    }
    
    getFileSize(filePath) {
        try {
            const stats = this.fs.statSync(filePath);
            return stats.size;
        } catch (error) {
            return 0;
        }
    }
    
    generateRecommendations(analysis) {
        const recommendations = [];
        
        // Critical violations
        const criticalViolations = analysis.inlineViolations.filter(v => v.severity === 'CRITICAL');
        if (criticalViolations.length > 0) {
            recommendations.push({
                priority: 'CRITICAL',
                action: 'Remove all inline style attributes',
                reason: 'Prevents QA failures and development delays',
                files: criticalViolations.length,
                solution: 'Extract styles to CSS classes and move to external files'
            });
        }
        
        // Liquid style violations
        const liquidViolations = analysis.inlineViolations.filter(v => v.type === 'LIQUID_STYLE_TAG');
        if (liquidViolations.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Move {% style %} content to assets/theme.css',
                reason: 'Improves maintainability and performance',
                files: liquidViolations.length,
                solution: 'Convert Liquid style tags to external CSS with proper class names'
            });
        }
        
        // General optimization
        if (analysis.cssFiles.length > 5) {
            recommendations.push({
                priority: 'MEDIUM',
                action: 'Consider CSS consolidation',
                reason: 'Multiple CSS files can impact performance',
                files: analysis.cssFiles.length,
                solution: 'Merge related CSS files and optimize loading order'
            });
        }
        
        return recommendations;
    }
    
    generateServerSideReport(analysis) {
        console.log('📊 SERVER-SIDE CSS ANALYSIS REPORT');
        console.log('===================================');
        
        console.log(`📁 CSS FILES (${analysis.cssFiles.length} total):`);
        analysis.cssFiles.forEach(file => {
            console.log(`✅ ${file.filename} (${Math.round(file.size/1024)}KB)`);
        });
        
        console.log(`📄 LIQUID FILES (${analysis.liquidFiles.length} total):`);
        analysis.liquidFiles.slice(0, 10).forEach(file => {
            console.log(`📝 ${file.filename}`);
        });
        if (analysis.liquidFiles.length > 10) {
            console.log(`   ... and ${analysis.liquidFiles.length - 10} more`);
        }
        
        console.log(`🚨 VIOLATIONS FOUND (${analysis.inlineViolations.length} total):`);
        analysis.inlineViolations.forEach(violation => {
            const icon = violation.severity === 'CRITICAL' ? '🚨' : '⚠️';
            console.log(`${icon} ${violation.type}: ${violation.count} instances`);
            console.log(`   📁 File: ${this.path.basename(violation.file)}`);
            if (violation.solution) {
                console.log(`   💡 Solution: ${violation.solution}`);
            }
        });
        
        console.log(`🎯 RECOMMENDATIONS (${analysis.recommendations.length} total):`);
        analysis.recommendations.forEach(rec => {
            const icon = rec.priority === 'CRITICAL' ? '🚨' : rec.priority === 'HIGH' ? '⚠️' : 'ℹ️';
            console.log(`${icon} ${rec.priority}: ${rec.action}`);
            console.log(`   📝 Reason: ${rec.reason}`);
            console.log(`   🔧 Solution: ${rec.solution}`);
        });
        
        return analysis;
    }
}

// Auto-execute and expose globally
if (typeof window !== 'undefined') {
    window.CSSSourceTracer = CSSSourceTracer;
    
    // Quick execution functions
    window.traceCSSources = function() {
        const tracer = new CSSSourceTracer();
        return tracer.generateSourceReport();
    };
    
    window.solveDomainMystery = function() {
        const tracer = new CSSSourceTracer();
        return tracer.solveDomainOnlyMystery();
    };
    
    // Auto-run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 CSS Source Tracer Ready - Run traceCSSources() or solveDomainMystery()');
        });
    } else {
        console.log('🚀 CSS Source Tracer Ready - Run traceCSSources() or solveDomainMystery()');
    }
} else {
    // Node.js execution
    const analyzer = new ServerSideCSSAnalyzer();
    
    // CLI usage
    if (require.main === module) {
        const projectPath = process.argv[2] || '/Users/pennyplatt/Documents//petersen-portal/glass-theme-v4';
        
        console.log('🚀 Starting Server-Side CSS Analysis...');
        analyzer.analyzeProjectCSS(projectPath)
            .then(analysis => {
                if (analysis.error) {
                    console.error('❌ Analysis failed:', analysis.error);
                    process.exit(1);
                } else {
                    console.log('✅ Analysis complete!');
                    process.exit(0);
                }
            })
            .catch(error => {
                console.error('❌ Unexpected error:', error.message);
                process.exit(1);
            });
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CSSSourceTracer, ServerSideCSSAnalyzer };
}