
class GlassThemeQAValidator {
    constructor() {
        this.results = {
            cssLoadingOrder: [],
            tokenAvailability: {},
            missingDependencies: [],
            glassEffectConsistency: {},
            appleHIGCompliance: {},
            layoutValidation: {},
            overallScore: 0
        };
        
        this.requiredCSSFiles = [
            'QuantumFoundation.css',
            'quantumspatial-color-tokens.css', 
            'facets.css',
            'global-glass-theme.css',
            'base.css'
        ];
        
        this.requiredSnippets = [
            'foundation-integration',
            'liquid-glass-foundation-tokens',
            'ultra-dark-typography'
        ];
        
        this.criticalTokens = [
            '--foundation-background-primary',
            '--foundation-foreground-primary',
            '--foundation-glass-subtle',
            '--foundation-glass-medium',
            '--foundation-glass-prominent',
            '--liquid-glass-subtle',
            '--liquid-glass-medium',
            '--liquid-glass-prominent',
            '--ultra-dark-text-primary',
            '--ultra-dark-text-secondary'
        ];
    }
    
    /**
     * PHASE 1: CSS LOADING ORDER VALIDATION
     * Verify proper cascade and dependency resolution
     */
    validateCSSLoadingOrder() {
        console.log('🔍 PHASE 1: CSS Loading Order Validation');
        
        const cssOrder = [];
        const linkElements = document.querySelectorAll('link[rel="stylesheet"], style');
        
        linkElements.forEach((element, index) => {
            if (element.tagName === 'LINK') {
                const href = element.getAttribute('href');
                const filename = href ? href.split('/').pop() : 'unknown';
                cssOrder.push({
                    index,
                    type: 'external',
                    file: filename,
                    href: href,
                    loaded: element.sheet !== null
                });
            } else if (element.tagName === 'STYLE') {
                const content = element.textContent || element.innerHTML;
                const isFoundationIntegration = content.includes('FOUNDATION VARIABLE INTEGRATION');
                const isLiquidGlass = content.includes('LIQUID GLASS FOUNDATION TOKENS');
                const isUltraDark = content.includes('ULTRA DARK MODE TYPOGRAPHY');
                
                let snippetType = 'unknown';
                if (isFoundationIntegration) snippetType = 'foundation-integration';
                else if (isLiquidGlass) snippetType = 'liquid-glass-foundation-tokens';
                else if (isUltraDark) snippetType = 'ultra-dark-typography';
                
                cssOrder.push({
                    index,
                    type: 'inline',
                    snippet: snippetType,
                    size: content.length,
                    loaded: true
                });
            }
        });
        
        this.results.cssLoadingOrder = cssOrder;
        
        // Validate required files are present
        const missingFiles = this.requiredCSSFiles.filter(file => 
            !cssOrder.some(item => item.file && item.file.includes(file))
        );
        
        const missingSnippets = this.requiredSnippets.filter(snippet =>
            !cssOrder.some(item => item.snippet === snippet)
        );
        
        this.results.missingDependencies = [...missingFiles, ...missingSnippets];
        
        console.log('✅ CSS Order:', cssOrder.length, 'stylesheets loaded');
        console.log('❌ Missing Dependencies:', this.results.missingDependencies);
        
        return cssOrder.length > 0 && this.results.missingDependencies.length === 0;
    }
    
    /**
     * PHASE 2: TOKEN AVAILABILITY VALIDATION
     * Test critical CSS variables are available globally
     */
    validateTokenAvailability() {
        console.log('🔍 PHASE 2: Token Availability Validation');
        
        const tokenResults = {};
        const computedStyle = getComputedStyle(document.documentElement);
        
        this.criticalTokens.forEach(token => {
            const value = computedStyle.getPropertyValue(token);
            tokenResults[token] = {
                available: value.trim() !== '',
                value: value.trim(),
                inherited: value.includes('inherit') || value.includes('initial')
            };
        });
        
        this.results.tokenAvailability = tokenResults;
        
        const availableTokens = Object.values(tokenResults).filter(t => t.available).length;
        const totalTokens = this.criticalTokens.length;
        
        console.log(`✅ Token Availability: ${availableTokens}/${totalTokens} tokens available`);
        
        // Log specific missing tokens
        Object.entries(tokenResults).forEach(([token, data]) => {
            if (!data.available) {
                console.warn(`❌ Missing Token: ${token}`);
            }
        });
        
        return availableTokens === totalTokens;
    }
    
    /**
     * PHASE 3: GLASS EFFECT CONSISTENCY VALIDATION
     * Verify glassmorphism effects render properly
     */
    validateGlassEffectConsistency() {
        console.log('🔍 PHASE 3: Glass Effect Consistency Validation');
        
        const glassElements = document.querySelectorAll(`
            .liquid-glass-subtle,
            .liquid-glass-medium, 
            .liquid-glass-prominent,
            .liquid-glass-nav,
            .liquid-glass-card,
            .liquid-glass-button,
            [class*="glass"]
        `);
        
        const effectResults = {
            totalElements: glassElements.length,
            backdropFilterSupport: CSS.supports('backdrop-filter', 'blur(1px)'),
            webkitBackdropSupport: CSS.supports('-webkit-backdrop-filter', 'blur(1px)'),
            elementsWithBackdrop: 0,
            elementsWithBorder: 0,
            elementsWithBackground: 0
        };
        
        glassElements.forEach(element => {
            const style = getComputedStyle(element);
            
            if (style.backdropFilter !== 'none' || style.webkitBackdropFilter !== 'none') {
                effectResults.elementsWithBackdrop++;
            }
            
            if (style.border !== 'none' && style.borderWidth !== '0px') {
                effectResults.elementsWithBorder++;
            }
            
            if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                effectResults.elementsWithBackground++;
            }
        });
        
        this.results.glassEffectConsistency = effectResults;
        
        console.log('✅ Glass Elements:', effectResults.totalElements);
        console.log('✅ Backdrop Filter Support:', effectResults.backdropFilterSupport);
        console.log('✅ Elements with Effects:', effectResults.elementsWithBackdrop);
        
        return effectResults.backdropFilterSupport && effectResults.elementsWithBackdrop > 0;
    }
    
    /**
     * PHASE 4: APPLE HIG COMPLIANCE VALIDATION
     * Verify touch targets and accessibility standards
     */
    validateAppleHIGCompliance() {
        console.log('🔍 PHASE 4: Apple HIG Compliance Validation');
        
        const interactiveElements = document.querySelectorAll(`
            button,
            [role="button"],
            input[type="submit"],
            input[type="button"],
            .button,
            a
        `);
        
        const complianceResults = {
            totalInteractiveElements: interactiveElements.length,
            touchTargetCompliant: 0,
            colorContrastValid: 0,
            focusIndicatorPresent: 0,
            minTouchTarget: 44 // Apple HIG standard
        };
        
        interactiveElements.forEach(element => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            // Touch target validation (44px minimum)
            const minDimension = Math.min(rect.width, rect.height);
            if (minDimension >= complianceResults.minTouchTarget) {
                complianceResults.touchTargetCompliant++;
            }
            
            // Focus indicator validation
            element.addEventListener('focus', () => {
                const focusStyle = getComputedStyle(element);
                if (focusStyle.outline !== 'none' || focusStyle.boxShadow.includes('0 0 0')) {
                    complianceResults.focusIndicatorPresent++;
                }
            }, { once: true });
        });
        
        this.results.appleHIGCompliance = complianceResults;
        
        console.log('✅ Interactive Elements:', complianceResults.totalInteractiveElements);
        console.log('✅ Touch Target Compliant:', complianceResults.touchTargetCompliant);
        
        return complianceResults.touchTargetCompliant > 0;
    }
    
    /**
     * PHASE 5: LAYOUT VALIDATION
     * Verify max-width, centering, and responsive behavior
     */
    validateLayoutConsistency() {
        console.log('🔍 PHASE 5: Layout Consistency Validation');
        
        const layoutElements = document.querySelectorAll(`
            .content-for-layout,
            .main-content,
            .page-width,
            .container,
            main,
            .collection-content
        `);
        
        const layoutResults = {
            elementsWithMaxWidth: 0,
            elementsWithProperCentering: 0,
            globalMaxWidth: '1800px',
            totalLayoutElements: layoutElements.length
        };
        
        layoutElements.forEach(element => {
            const style = getComputedStyle(element);
            
            if (style.maxWidth && style.maxWidth !== 'none') {
                layoutResults.elementsWithMaxWidth++;
                
                // Check for proper centering
                if (style.marginLeft === 'auto' && style.marginRight === 'auto') {
                    layoutResults.elementsWithProperCentering++;
                }
            }
        });
        
        this.results.layoutValidation = layoutResults;
        
        console.log('✅ Layout Elements:', layoutResults.totalLayoutElements);
        console.log('✅ Elements with Max Width:', layoutResults.elementsWithMaxWidth);
        console.log('✅ Properly Centered:', layoutResults.elementsWithProperCentering);
        
        return layoutResults.elementsWithMaxWidth > 0;
    }
    
    /**
     * COMPREHENSIVE QA REPORT GENERATION
     * Apple Intelligence Strategic Director format
     */
    generateQAReport() {
        const scores = {
            cssLoading: this.validateCSSLoadingOrder() ? 100 : 0,
            tokenAvailability: Object.values(this.results.tokenAvailability).filter(t => t.available).length / this.criticalTokens.length * 100,
            glassEffects: this.validateGlassEffectConsistency() ? 100 : 0,
            appleHIG: this.validateAppleHIGCompliance() ? 100 : 0,
            layout: this.validateLayoutConsistency() ? 100 : 0
        };
        
        this.results.overallScore = Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length;
        
        console.log('📊 FINAL QA REPORT - Glass Theme v4');
        console.log('=====================================');
        console.log(`Overall Score: ${this.results.overallScore.toFixed(1)}%`);
        console.log('Component Scores:');
        Object.entries(scores).forEach(([category, score]) => {
            const status = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
            console.log(`${status} ${category}: ${score.toFixed(1)}%`);
        });
        
        console.log('Detailed Results:');
        console.log('CSS Loading Order:', this.results.cssLoadingOrder.length, 'stylesheets');
        console.log('Missing Dependencies:', this.results.missingDependencies);
        console.log('Token Availability:', Object.values(this.results.tokenAvailability).filter(t => t.available).length, '/', this.criticalTokens.length);
        console.log('Glass Elements:', this.results.glassEffectConsistency.totalElements);
        console.log('Touch Target Compliance:', this.results.appleHIGCompliance.touchTargetCompliant);
        
        if (this.results.overallScore >= 90) {
            console.log('🎉 QA VALIDATION PASSED - Theme ready for production!');
        } else if (this.results.overallScore >= 70) {
            console.log('⚠️ QA VALIDATION PARTIAL - Some issues need attention');
        } else {
            console.log('❌ QA VALIDATION FAILED - Critical issues require resolution');
        }
        
        return this.results;
    }
    
    /**
     * AUTOMATIC QA EXECUTION
     * Run all validation phases and generate report
     */
    async runFullValidation() {
        console.log('🚀 Starting Glass Theme v4 QA Validation...');
        console.log('Apple Intelligence Strategic Director Framework');
        console.log('=============================================');
        
        try {
            // Execute all validation phases
            this.validateCSSLoadingOrder();
            this.validateTokenAvailability();
            this.validateGlassEffectConsistency();
            this.validateAppleHIGCompliance();
            this.validateLayoutConsistency();
            
            // Generate comprehensive report
            return this.generateQAReport();
            
        } catch (error) {
            console.error('❌ QA Validation Error:', error);
            return { error: error.message, overallScore: 0 };
        }
    }
}

// Auto-execute when DOM is ready
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const validator = new GlassThemeQAValidator();
            validator.runFullValidation();
        });
    } else {
        const validator = new GlassThemeQAValidator();
        validator.runFullValidation();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlassThemeQAValidator;
}