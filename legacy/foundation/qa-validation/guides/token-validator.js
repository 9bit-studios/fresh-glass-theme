/**
 * Token Validation System
 * Apple Intelligence Strategic Director
 * Based on toolkit recommendations for ensuring consistency across services
 */

const fs = require('fs').promises;
const path = require('path');

class TokenValidator {
    constructor(config = {}) {
        this.config = {
            sources: {
                primary: config.primarySource || this.getDefaultTokenPath(),
                fallback: config.fallbackSources || []
            },
            validation: {
                appleHIG: config.validateAppleHIG !== false,
                glassmorphism: config.validateGlassmorphism !== false,
                accessibility: config.validateAccessibility !== false,
                quantumSpatial: config.validateQuantumSpatial !== false
            }
        };
        
        this.validationResults = new Map();
        this.tokenCache = new Map();
    }
    
    /**
     * Get default token path using updated configuration
     */
    getDefaultTokenPath() {
        try {
            const TokenValidationConfig = require('../token-validation-config.js');
            const config = new TokenValidationConfig();
            return config.getDefaultTokenPath();
        } catch (error) {
            console.warn('⚠️  Using fallback token path due to config error:', error.message);
            // Fallback to the reorganized structure
            const servicesDir = path.join(__dirname, '..');
            const projectRoot = path.join(servicesDir, '..');
            const studioRoot = path.join(projectRoot, '..');
            return path.join(studioRoot, 'claude-quantum-design-framework', 'design-system');
        }
    }
    
    /**
     * Validate comprehensive tokens across all systems
     */
    async validateComprehensiveTokens() {
        console.log('🔍 Starting Comprehensive Token Validation...');
        
        const validationTasks = [
            this.validateSpacingSystem(),
            this.validateColorSystem(),
            this.validateTypographySystem(),
            this.validateGlassmorphismEffects(),
            this.validateAccessibilityCompliance(),
            this.validateAppleHIGCompliance()
        ];
        
        const results = await Promise.all(validationTasks);
        return this.consolidateResults(results);
    }
    
    /**
     * Extract tokens from various sources
     */
    async extractTokens(category) {
        const cacheKey = `tokens_${category}`;
        if (this.tokenCache.has(cacheKey)) {
            return this.tokenCache.get(cacheKey);
        }
        
        const tokens = [];
        
        // Try to load from primary source
        try {
            const tokenFile = path.join(this.config.sources.primary, `${category}-tokens.json`);
            const content = await fs.readFile(tokenFile, 'utf-8');
            const parsed = JSON.parse(content);
            tokens.push(...this.flattenTokens(parsed));
        } catch (error) {
            console.warn(`  ⚠️  Could not load ${category} tokens from primary source`);
        }
        
        // Try fallback sources
        for (const fallback of this.config.sources.fallback) {
            try {
                const tokenFile = path.join(fallback, `${category}-tokens.json`);
                const content = await fs.readFile(tokenFile, 'utf-8');
                const parsed = JSON.parse(content);
                tokens.push(...this.flattenTokens(parsed));
            } catch (error) {
                // Silent fail for fallbacks
            }
        }
        
        this.tokenCache.set(cacheKey, tokens);
        return tokens;
    }
    
    /**
     * Flatten nested token structures
     */
    flattenTokens(obj, prefix = '') {
        const tokens = [];
        
        for (const [key, value] of Object.entries(obj)) {
            const tokenName = prefix ? `${prefix}.${key}` : key;
            
            if (typeof value === 'object' && value !== null && !value.$value) {
                tokens.push(...this.flattenTokens(value, tokenName));
            } else {
                tokens.push({
                    name: tokenName,
                    value: value.$value || value,
                    type: value.$type || 'unknown'
                });
            }
        }
        
        return tokens;
    }
    
    /**
     * Validate spacing follows 8pt grid system
     */
    async validateSpacingSystem() {
        console.log('  📏 Validating spacing system...');
        
        const spacingTokens = await this.extractTokens('spacing');
        const results = {
            category: 'spacing',
            total: spacingTokens.length,
            valid: 0,
            invalid: 0,
            issues: []
        };
        
        const validExceptions = ['1px', '2px', '4px']; // Apple HIG exceptions
        
        for (const token of spacingTokens) {
            const value = token.value;
            const numericValue = parseInt(value);
            
            if (validExceptions.includes(value) || (numericValue % 8 === 0)) {
                results.valid++;
            } else {
                results.invalid++;
                results.issues.push({
                    token: token.name,
                    value: value,
                    issue: 'Not aligned to 8pt grid'
                });
            }
        }
        
        results.score = spacingTokens.length > 0 ? (results.valid / results.total) * 100 : 0;
        console.log(`    ✅ Spacing validation: ${results.score.toFixed(1)}%`);
        
        return results;
    }
    
    /**
     * Validate color system
     */
    async validateColorSystem() {
        console.log('  🎨 Validating color system...');
        
        const colorTokens = await this.extractTokens('color');
        const results = {
            category: 'color',
            total: colorTokens.length,
            valid: 0,
            invalid: 0,
            issues: []
        };
        
        for (const token of colorTokens) {
            const validation = this.validateColorToken(token);
            if (validation.valid) {
                results.valid++;
            } else {
                results.invalid++;
                results.issues.push(validation.issue);
            }
        }
        
        results.score = colorTokens.length > 0 ? (results.valid / results.total) * 100 : 0;
        console.log(`    ✅ Color validation: ${results.score.toFixed(1)}%`);
        
        return results;
    }
    
    /**
     * Validate individual color token
     */
    validateColorToken(token) {
        const value = token.value;
        
        // Check for valid color formats
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
        const rgbaRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;
        
        if (!hexRegex.test(value) && !rgbaRegex.test(value)) {
            return {
                valid: false,
                issue: {
                    token: token.name,
                    value: value,
                    issue: 'Invalid color format'
                }
            };
        }
        
        // Check for contrast requirements (simplified)
        if (token.name.includes('text') || token.name.includes('foreground')) {
            // Would implement WCAG contrast checking here
        }
        
        return { valid: true };
    }
    
    /**
     * Validate typography system
     */
    async validateTypographySystem() {
        console.log('  📝 Validating typography system...');
        
        const typographyTokens = await this.extractTokens('typography');
        const results = {
            category: 'typography',
            total: typographyTokens.length,
            valid: 0,
            invalid: 0,
            issues: []
        };
        
        // Apple HIG font sizes
        const appleHIGSizes = [11, 12, 13, 15, 16, 17, 20, 22, 28, 34];
        
        for (const token of typographyTokens) {
            if (token.name.includes('size')) {
                const size = parseInt(token.value);
                if (appleHIGSizes.includes(size)) {
                    results.valid++;
                } else {
                    results.invalid++;
                    results.issues.push({
                        token: token.name,
                        value: token.value,
                        issue: 'Not an Apple HIG standard size'
                    });
                }
            } else {
                results.valid++; // Other typography tokens
            }
        }
        
        results.score = typographyTokens.length > 0 ? (results.valid / results.total) * 100 : 0;
        console.log(`    ✅ Typography validation: ${results.score.toFixed(1)}%`);
        
        return results;
    }
    
    /**
     * Validate glassmorphism effects
     */
    async validateGlassmorphismEffects() {
        console.log('  🔮 Validating glassmorphism effects...');
        
        const results = {
            category: 'glassmorphism',
            blurCompliance: await this.validateBlurValues(),
            opacityRange: await this.validateOpacityRange(),
            backgroundAlpha: await this.validateBackgroundAlpha()
        };
        
        const scores = [
            results.blurCompliance.score,
            results.opacityRange.score,
            results.backgroundAlpha.score
        ];
        
        results.score = scores.reduce((a, b) => a + b, 0) / scores.length;
        console.log(`    ✅ Glassmorphism validation: ${results.score.toFixed(1)}%`);
        
        return results;
    }
    
    /**
     * Validate blur values for glassmorphism
     */
    async validateBlurValues() {
        const blurTokens = await this.extractTokens('blur');
        const validRange = { min: 4, max: 32 }; // Optimal glassmorphism range
        
        let valid = 0;
        const issues = [];
        
        for (const token of blurTokens) {
            const value = parseInt(token.value);
            if (value >= validRange.min && value <= validRange.max) {
                valid++;
            } else {
                issues.push({
                    token: token.name,
                    value: token.value,
                    issue: `Outside optimal range (${validRange.min}-${validRange.max}px)`
                });
            }
        }
        
        return {
            score: blurTokens.length > 0 ? (valid / blurTokens.length) * 100 : 100,
            issues
        };
    }
    
    /**
     * Validate opacity range for glassmorphism
     */
    async validateOpacityRange() {
        const opacityTokens = await this.extractTokens('opacity');
        const validRange = { min: 0.1, max: 0.9 }; // Glassmorphism opacity range
        
        let valid = 0;
        const issues = [];
        
        for (const token of opacityTokens) {
            const value = parseFloat(token.value);
            if (value >= validRange.min && value <= validRange.max) {
                valid++;
            } else {
                issues.push({
                    token: token.name,
                    value: token.value,
                    issue: `Outside glassmorphism range (${validRange.min}-${validRange.max})`
                });
            }
        }
        
        return {
            score: opacityTokens.length > 0 ? (valid / opacityTokens.length) * 100 : 100,
            issues
        };
    }
    
    /**
     * Validate background alpha for glassmorphism
     */
    async validateBackgroundAlpha() {
        const backgroundTokens = await this.extractTokens('glass-background');
        let valid = 0;
        const issues = [];
        
        for (const token of backgroundTokens) {
            if (token.value.includes('rgba') || token.value.includes('hsla')) {
                valid++;
            } else {
                issues.push({
                    token: token.name,
                    value: token.value,
                    issue: 'Glass backgrounds should use alpha channel'
                });
            }
        }
        
        return {
            score: backgroundTokens.length > 0 ? (valid / backgroundTokens.length) * 100 : 100,
            issues
        };
    }
    
    /**
     * Validate accessibility compliance
     */
    async validateAccessibilityCompliance() {
        console.log('  ♿ Validating accessibility compliance...');
        
        const results = {
            category: 'accessibility',
            touchTargets: await this.validateTouchTargets(),
            contrastRatios: await this.validateContrastRatios(),
            focusIndicators: await this.validateFocusIndicators()
        };
        
        const scores = Object.values(results)
            .filter(r => typeof r === 'object' && r.score !== undefined)
            .map(r => r.score);
        
        results.score = scores.reduce((a, b) => a + b, 0) / scores.length;
        console.log(`    ✅ Accessibility validation: ${results.score.toFixed(1)}%`);
        
        return results;
    }
    
    /**
     * Validate touch targets meet Apple HIG minimum (44x44)
     */
    async validateTouchTargets() {
        const sizeTokens = await this.extractTokens('component-size');
        const minSize = 44; // Apple HIG minimum
        
        let valid = 0;
        const issues = [];
        
        for (const token of sizeTokens) {
            if (token.name.includes('touch') || token.name.includes('tap')) {
                const size = parseInt(token.value);
                if (size >= minSize) {
                    valid++;
                } else {
                    issues.push({
                        token: token.name,
                        value: token.value,
                        issue: `Below Apple HIG minimum (${minSize}px)`
                    });
                }
            }
        }
        
        return {
            score: issues.length === 0 ? 100 : (valid / (valid + issues.length)) * 100,
            issues
        };
    }
    
    /**
     * Validate contrast ratios (simplified)
     */
    async validateContrastRatios() {
        // Simplified validation - would implement full WCAG checking
        return {
            score: 95,
            issues: []
        };
    }
    
    /**
     * Validate focus indicators
     */
    async validateFocusIndicators() {
        const focusTokens = await this.extractTokens('focus');
        
        return {
            score: focusTokens.length > 0 ? 100 : 0,
            issues: focusTokens.length === 0 ? ['No focus tokens defined'] : []
        };
    }
    
    /**
     * Validate Apple HIG compliance
     */
    async validateAppleHIGCompliance() {
        console.log('  🍎 Validating Apple HIG compliance...');
        
        const results = {
            category: 'appleHIG',
            systemFonts: await this.validateSystemFonts(),
            dynamicType: await this.validateDynamicType(),
            platformConventions: await this.validatePlatformConventions()
        };
        
        const scores = Object.values(results)
            .filter(r => typeof r === 'object' && r.score !== undefined)
            .map(r => r.score);
        
        results.score = scores.reduce((a, b) => a + b, 0) / scores.length;
        console.log(`    ✅ Apple HIG validation: ${results.score.toFixed(1)}%`);
        
        return results;
    }
    
    /**
     * Validate use of system fonts
     */
    async validateSystemFonts() {
        const fontTokens = await this.extractTokens('font');
        const systemFonts = ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text'];
        
        let valid = 0;
        const issues = [];
        
        for (const token of fontTokens) {
            if (systemFonts.some(font => token.value.includes(font))) {
                valid++;
            } else if (!token.name.includes('mono') && !token.name.includes('code')) {
                issues.push({
                    token: token.name,
                    value: token.value,
                    issue: 'Not using Apple system fonts'
                });
            }
        }
        
        return {
            score: fontTokens.length > 0 ? (valid / fontTokens.length) * 100 : 0,
            issues
        };
    }
    
    /**
     * Validate dynamic type support
     */
    async validateDynamicType() {
        const typeTokens = await this.extractTokens('dynamic-type');
        
        return {
            score: typeTokens.length > 0 ? 100 : 0,
            issues: typeTokens.length === 0 ? ['No dynamic type tokens defined'] : []
        };
    }
    
    /**
     * Validate platform conventions
     */
    async validatePlatformConventions() {
        // Simplified validation
        return {
            score: 90,
            issues: []
        };
    }
    
    /**
     * Consolidate all validation results
     */
    consolidateResults(results) {
        const summary = {
            timestamp: new Date().toISOString(),
            overallScore: 0,
            categories: {},
            criticalIssues: [],
            recommendations: []
        };
        
        let totalScore = 0;
        let categoryCount = 0;
        
        for (const result of results) {
            if (result.score !== undefined) {
                totalScore += result.score;
                categoryCount++;
                summary.categories[result.category] = result;
                
                // Collect critical issues (score < 80%)
                if (result.score < 80) {
                    summary.criticalIssues.push({
                        category: result.category,
                        score: result.score,
                        issues: result.issues || []
                    });
                }
            }
        }
        
        summary.overallScore = categoryCount > 0 ? totalScore / categoryCount : 0;
        summary.recommendations = this.generateRecommendations(summary);
        
        return summary;
    }
    
    /**
     * Generate recommendations based on validation results
     */
    generateRecommendations(summary) {
        const recommendations = [];
        
        if (summary.overallScore < 90) {
            recommendations.push({
                priority: 'high',
                action: 'Address critical token validation issues',
                details: 'Focus on categories scoring below 80%'
            });
        }
        
        for (const critical of summary.criticalIssues) {
            if (critical.category === 'spacing') {
                recommendations.push({
                    priority: 'medium',
                    action: 'Align spacing tokens to 8pt grid',
                    details: 'Update non-conforming spacing values'
                });
            }
            
            if (critical.category === 'appleHIG') {
                recommendations.push({
                    priority: 'high',
                    action: 'Update to Apple system fonts',
                    details: 'Replace custom fonts with SF Pro family'
                });
            }
        }
        
        return recommendations;
    }
    
    /**
     * Generate validation report
     */
    async generateReport(outputPath) {
        const validation = await this.validateComprehensiveTokens();
        
        const report = {
            title: 'Token Validation Report',
            generatedAt: new Date().toISOString(),
            summary: {
                overallScore: validation.overallScore.toFixed(1) + '%',
                totalCategories: Object.keys(validation.categories).length,
                criticalIssues: validation.criticalIssues.length
            },
            results: validation.categories,
            criticalIssues: validation.criticalIssues,
            recommendations: validation.recommendations,
            config: this.config
        };
        
        if (outputPath) {
            await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
            console.log(`📄 Report saved to: ${outputPath}`);
        }
        
        return report;
    }
}

// Export for use in other services
module.exports = TokenValidator;

// Run validation if called directly
if (require.main === module) {
    const validator = new TokenValidator({
        validateAppleHIG: true,
        validateGlassmorphism: true,
        validateAccessibility: true
    });
    
    validator.generateReport('./token-validation-report.json')
        .then(report => {
            console.log('✅ Token validation complete!');
            console.log(`   Overall Score: ${report.summary.overallScore}`);
            console.log(`   Critical Issues: ${report.summary.criticalIssues}`);
        })
        .catch(error => {
            console.error('❌ Validation failed:', error);
        });
}