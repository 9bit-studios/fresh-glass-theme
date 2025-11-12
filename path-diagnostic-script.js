#!/usr/bin/env node

/**
 * Path Diagnostic & Auto-Setup Script
 * Finds your exact directory structure and sets up validation integration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PathDiagnosticSetup {
    constructor() {
        this.findings = {
            petersenGames: null,
            oksanaPlatform: null,
            validators: [],
            cssIssues: [],
            recommendations: []
        };
    }

    async runDiagnostic() {
        console.log('🔍 Path Diagnostic & Auto-Setup');
        console.log('================================');
        
        // 1. Find Petersen Games theme location
        await this.findPetersenGamesLocation();
        
        // 2. Find OksanaPlatform location
        await this.findOksanaPlatformLocation();
        
        // 3. Locate validation files
        await this.findValidationFiles();
        
        // 4. Check CSS issues
        await this.checkCSSIssues();
        
        // 5. Generate setup recommendations
        await this.generateSetupRecommendations();
        
        // 6. Auto-create fixes
        await this.autoCreateFixes();
        
        return this.findings;
    }

    async findPetersenGamesLocation() {
        console.log('🎮 Finding Petersen Games theme...');
        
        const searchPaths = [
            '/Users/pennyplatt/9bit-studios/petersen-games',
            '/Users/pennyplatt/9bit-studios/fresh-glass-theme',
            '/Users/pennyplatt/9bit-studios/Oksana/scripts/services/frontend-design',
            process.cwd()
        ];
        
        for (const searchPath of searchPaths) {
            try {
                if (fs.existsSync(searchPath)) {
                    // Look for Shopify theme indicators
                    const indicators = ['petersen-qa-service.js', 'config.yml', 'theme.liquid', 'sections', 'snippets'];
                    let score = 0;
                    
                    for (const indicator of indicators) {
                        const indicatorPath = path.join(searchPath, indicator);
                        if (fs.existsSync(indicatorPath)) {
                            score++;
                            console.log(`    ✅ Found ${indicator} in ${searchPath}`);
                        }
                    }
                    
                    if (score >= 2) {
                        this.findings.petersenGames = searchPath;
                        console.log(`  🎯 Petersen Games theme located: ${searchPath}`);
                        break;
                    }
                }
            } catch (error) {
                // Skip inaccessible paths
            }
        }
        
        if (!this.findings.petersenGames) {
            console.log('  ❌ Petersen Games theme not found in expected locations');
            console.log('  💡 Will use current directory and create structure');
            this.findings.petersenGames = process.cwd();
        }
    }

    async findOksanaPlatformLocation() {
        console.log('🔷 Finding OksanaPlatform...');
        
        const searchPaths = [
            '/Users/pennyplatt/9bit-studios/Oksana',
            '/Users/pennyplatt/9bit-studios/oksana-platform-foundation-model',
            path.resolve(this.findings.petersenGames, '../../Oksana'),
            path.resolve(this.findings.petersenGames, '../Oksana')
        ];
        
        for (const searchPath of searchPaths) {
            try {
                if (fs.existsSync(searchPath)) {
                    const indicators = ['scripts', 'apple-intelligence-strategic-director', 'quantum-spatial-design-system', 'tsconfig.json'];
                    let score = 0;
                    
                    for (const indicator of indicators) {
                        if (fs.existsSync(path.join(searchPath, indicator))) {
                            score++;
                            console.log(`    ✅ Found ${indicator} in ${searchPath}`);
                        }
                    }
                    
                    if (score >= 2) {
                        this.findings.oksanaPlatform = searchPath;
                        console.log(`  🎯 OksanaPlatform located: ${searchPath}`);
                        break;
                    }
                }
            } catch (error) {
                // Skip inaccessible paths
            }
        }
        
        if (!this.findings.oksanaPlatform) {
            console.log('  ❌ OksanaPlatform not found');
            this.findings.recommendations.push('Create OksanaPlatform directory structure');
        }
    }

    async findValidationFiles() {
        console.log('🔧 Finding validation files...');
        
        const validationFiles = [
            'petersen-qa-service.js',
            'enhanced-hig-qa-validator.ts',
            'oksana-platform-validation-system.ts',
            'enhanced-frontend-service.js',
            'comprehensive-qa-validator.js'
        ];
        
        const searchLocations = [
            this.findings.petersenGames,
            this.findings.oksanaPlatform,
            path.join(this.findings.oksanaPlatform || '', 'scripts', 'services', 'frontend-design'),
            path.join(this.findings.petersenGames, 'scripts')
        ].filter(Boolean);
        
        for (const validationFile of validationFiles) {
            let found = false;
            
            for (const location of searchLocations) {
                const filePath = path.join(location, validationFile);
                if (fs.existsSync(filePath)) {
                    this.findings.validators.push({
                        name: validationFile,
                        path: filePath,
                        location: location,
                        status: 'FOUND'
                    });
                    console.log(`  ✅ ${validationFile}: ${filePath}`);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                this.findings.validators.push({
                    name: validationFile,
                    path: null,
                    location: null,
                    status: 'MISSING'
                });
                console.log(`  ❌ ${validationFile}: NOT FOUND`);
            }
        }
    }

    async checkCSSIssues() {
        console.log('🎨 Checking CSS injection issues...');
        
        if (!this.findings.petersenGames) return;
        
        // Find JavaScript files with CSS injections
        const jsFiles = this.findFilesRecursive(this.findings.petersenGames, '.js');
        
        for (const jsFile of jsFiles.slice(0, 10)) { // Limit to first 10 files
            try {
                const content = fs.readFileSync(jsFile, 'utf8');
                
                // Check for CSS injections
                const cssInjections = this.findCSSPatterns(content);
                if (cssInjections.length > 0) {
                    this.findings.cssIssues.push({
                        file: path.relative(this.findings.petersenGames, jsFile),
                        injections: cssInjections.length,
                        patterns: cssInjections.slice(0, 3) // First 3 patterns
                    });
                    console.log(`  🔧 ${path.basename(jsFile)}: ${cssInjections.length} CSS injections`);
                }
            } catch (error) {
                // Skip unreadable files
            }
        }
        
        // Check for embedded styles in Liquid files
        const liquidFiles = this.findFilesRecursive(this.findings.petersenGames, '.liquid');
        
        for (const liquidFile of liquidFiles.slice(0, 10)) { // Limit to first 10 files
            try {
                const content = fs.readFileSync(liquidFile, 'utf8');
                
                if (content.includes('<style>') || content.includes('style=')) {
                    this.findings.cssIssues.push({
                        file: path.relative(this.findings.petersenGames, liquidFile),
                        type: 'embedded-styles',
                        hasStyleTags: content.includes('<style>'),
                        hasInlineStyles: content.includes('style=')
                    });
                    console.log(`  📄 ${path.basename(liquidFile)}: embedded styles detected`);
                }
            } catch (error) {
                // Skip unreadable files
            }
        }
    }

    findCSSPatterns(content) {
        const patterns = [];
        
        // setProperty calls
        const setPropMatches = content.match(/setProperty\s*\(\s*['"`][^'"`]+['"`]\s*,\s*['"`][^'"`]+['"`]\s*\)/g) || [];
        patterns.push(...setPropMatches);
        
        // style assignments
        const styleMatches = content.match(/\.style\.\w+\s*=\s*['"`][^'"`]+['"`]/g) || [];
        patterns.push(...styleMatches);
        
        // CSS text injections
        const cssTextMatches = content.match(/innerHTML\s*=\s*['"`][^'"`]*<style[^'"`]*['"`]/g) || [];
        patterns.push(...cssTextMatches);
        
        return patterns;
    }

    async generateSetupRecommendations() {
        console.log('💡 Generating setup recommendations...');
        
        const recommendations = [];
        
        // Path recommendations
        if (!this.findings.oksanaPlatform) {
            recommendations.push({
                priority: 'HIGH',
                category: 'SETUP',
                action: 'Create OksanaPlatform directory structure',
                command: 'mkdir -p ~/9bit-studios/Oksana'
            });
        }
        
        // Missing validator recommendations
        const missingValidators = this.findings.validators.filter(v => v.status === 'MISSING');
        if (missingValidators.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                category: 'VALIDATORS',
                action: `Create ${missingValidators.length} missing validation files`,
                files: missingValidators.map(v => v.name)
            });
        }
        
        // CSS issue recommendations
        if (this.findings.cssIssues.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                category: 'CSS_CLEANUP',
                action: `Resolve ${this.findings.cssIssues.length} CSS injection/embedding issues`,
                impact: 'Prevents clean foundation CSS implementation'
            });
        }
        
        this.findings.recommendations = recommendations;
        
        recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. [${rec.priority}] ${rec.action}`);
        });
    }

    async autoCreateFixes() {
        console.log('🛠️  Auto-creating fixes...');
        
        if (!this.findings.petersenGames) {
            console.log('  ❌ Cannot create fixes - Petersen Games location unknown');
            return;
        }
        
        // 1. Create scripts directory
        const scriptsDir = path.join(this.findings.petersenGames, 'scripts');
        if (!fs.existsSync(scriptsDir)) {
            fs.mkdirSync(scriptsDir, { recursive: true });
            console.log('  ✅ Created scripts directory');
        }
        
        // 2. Create correct tsconfig.json
        await this.createTSConfig();
        
        // 3. Create package.json scripts if missing
        await this.updatePackageJsonScripts();
        
        // 4. Create minimal validation bridge
        await this.createValidationBridge();
        
        console.log('  🎉 Auto-fixes completed!');
    }

    async createTSConfig() {
        const tsconfigPath = path.join(this.findings.petersenGames, 'tsconfig.json');
        
        const oksanaRelativePath = this.findings.oksanaPlatform 
            ? path.relative(this.findings.petersenGames, this.findings.oksanaPlatform)
            : '../../Oksana';
        
        const tsconfig = {
            extends: `${oksanaRelativePath}/tsconfig.json`,
            compilerOptions: {
                baseUrl: ".",
                paths: {
                    "@/oksana/*": [`${oksanaRelativePath}/*`],
                    "@/strategic-director/*": [`${oksanaRelativePath}/scripts/services/*`],
                    "@/apple-hig/*": [`${oksanaRelativePath}/apple-intelligence-strategic-director/*`],
                    "@/quantum-spatial/*": [`${oksanaRelativePath}/quantum-spatial-design-system/*`],
                    "@/shopify/*": ["./scripts/*", "./assets/*"],
                    "@/liquid/*": ["./sections/*", "./snippets/*", "./templates/*"],
                    "@/validators/*": [`${oksanaRelativePath}/scripts/services/frontend-design/*`]
                },
                typeRoots: [
                    `${oksanaRelativePath}/types`,
                    "./types",
                    "./node_modules/@types"
                ],
                skipLibCheck: true,
                allowJs: true,
                checkJs: false
            },
            include: [
                "**/*.ts",
                "**/*.js",
                "scripts/**/*",
                "types/**/*"
            ],
            exclude: [
                "node_modules",
                "assets/dist"
            ]
        };
        
        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
        console.log(`  ✅ Created tsconfig.json with correct paths`);
        console.log(`     OksanaPlatform path: ${oksanaRelativePath}`);
    }

    async updatePackageJsonScripts() {
        const packageJsonPath = path.join(this.findings.petersenGames, 'package.json');
        
        let packageJson = {};
        if (fs.existsSync(packageJsonPath)) {
            packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        }
        
        // Add validation scripts
        packageJson.scripts = packageJson.scripts || {};
        
        const validationScripts = {
            "validate:integrated": "node scripts/validation-bridge.js",
            "validate:petersen": "node petersen-qa-service.js",
            "validate:paths": "npx tsc --noEmit",
            "validate:all": "npm run validate:paths && npm run validate:integrated",
            "fix:paths": "node scripts/validation-bridge.js --fix-paths",
            "precommit": "npm run validate:all"
        };
        
        let added = 0;
        for (const [scriptName, scriptValue] of Object.entries(validationScripts)) {
            if (!packageJson.scripts[scriptName]) {
                packageJson.scripts[scriptName] = scriptValue;
                added++;
            }
        }
        
        if (added > 0) {
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log(`  ✅ Added ${added} validation scripts to package.json`);
        }
    }

    async createValidationBridge() {
        const bridgePath = path.join(this.findings.petersenGames, 'scripts', 'validation-bridge.js');
        
        const bridgeContent = `#!/usr/bin/env node

/**
 * Validation Bridge - Auto-generated by Path Diagnostic
 * Connects available validation systems
 */

const fs = require('fs');
const path = require('path');

class ValidationBridge {
    constructor() {
        this.projectRoot = process.cwd();
        this.oksanaPath = "${this.findings.oksanaPlatform || '../../Oksana'}";
        this.validationSystems = new Map();
        this.results = { passed: true, errors: [], warnings: [] };
    }

    async runValidation() {
        console.log('🔗 Validation Bridge');
        console.log('===================');
        
        // Load available validation systems
        await this.loadAvailableValidators();
        
        // Run validations
        await this.runAvailableValidations();
        
        // Display results
        this.displayResults();
        
        return this.results;
    }

    async loadAvailableValidators() {
        console.log('📋 Loading available validators...');
        
        // Try to load Petersen QA Service
        const petersenQAPath = path.join(this.projectRoot, 'petersen-qa-service.js');
        if (fs.existsSync(petersenQAPath)) {
            try {
                const PetersenQAService = require(petersenQAPath);
                this.validationSystems.set('petersenQA', new PetersenQAService());
                console.log('  ✅ Petersen QA Service loaded');
            } catch (error) {
                console.log(\`  ⚠️  Petersen QA Service found but failed to load: \${error.message}\`);
                this.results.warnings.push('Petersen QA Service load failed');
            }
        } else {
            console.log('  ❌ Petersen QA Service not found');
        }
        
        // Check TypeScript compilation
        try {
            const { execSync } = require('child_process');
            execSync('npx tsc --version', { stdio: 'pipe' });
            this.validationSystems.set('typescript', true);
            console.log('  ✅ TypeScript available');
        } catch (error) {
            console.log('  ⚠️  TypeScript not available');
        }
    }

    async runAvailableValidations() {
        console.log('🔄 Running available validations...');
        
        // Run TypeScript check
        if (this.validationSystems.has('typescript')) {
            console.log('  📘 Running TypeScript validation...');
            try {
                const { execSync } = require('child_process');
                execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: this.projectRoot });
                console.log('    ✅ TypeScript validation passed');
            } catch (error) {
                console.log('    ❌ TypeScript validation failed');
                this.results.passed = false;
                this.results.errors.push('TypeScript compilation errors');
            }
        }
        
        // Run Petersen QA if available
        if (this.validationSystems.has('petersenQA')) {
            console.log('  🎮 Running Petersen QA validation...');
            try {
                const qaService = this.validationSystems.get('petersenQA');
                const result = await qaService.runFullValidation();
                
                if (result.passed) {
                    console.log('    ✅ Petersen QA validation passed');
                } else {
                    console.log('    ❌ Petersen QA validation failed');
                    this.results.passed = false;
                    this.results.errors.push(\`Petersen QA: \${result.criticalErrors.length} critical errors\`);
                }
            } catch (error) {
                console.log(\`    ❌ Petersen QA validation error: \${error.message}\`);
                this.results.passed = false;
                this.results.errors.push('Petersen QA validation error');
            }
        }
    }

    displayResults() {
        console.log('\' + '='.repeat(50));
        console.log('📊 VALIDATION RESULTS');
        console.log('='.repeat(50));
        
        const statusIcon = this.results.passed ? '✅' : '❌';
        console.log(\`\\${statusIcon} Overall Status: \${this.results.passed ? 'PASSED' : 'FAILED'}\`);
        
        if (this.results.errors.length > 0) {
            console.log('\❌ Errors:');
            this.results.errors.forEach((error, index) => {
                console.log(\`  \${index + 1}. \${error}\`);
            });
        }
        
        if (this.results.warnings.length > 0) {
            console.log('\⚠️  Warnings:');
            this.results.warnings.forEach((warning, index) => {
                console.log(\`  \${index + 1}. \${warning}\`);
            });
        }
        
        console.log('\🎯 Next Steps:');
        if (this.results.passed) {
            console.log('  1. ✅ All available validations passed');
            console.log('  2. 🔧 Add more validation systems as needed');
            console.log('  3. 📊 Monitor for regressions');
        } else {
            console.log('  1. 🔧 Fix errors listed above');
            console.log('  2. 🔄 Re-run validation');
            console.log('  3. 📋 Check individual validation logs');
        }
        
        console.log('='.repeat(50));
    }
}

// CLI execution
if (require.main === module) {
    const bridge = new ValidationBridge();
    
    bridge.runValidation()
        .then(results => {
            process.exit(results.passed ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Validation bridge failed:', error);
            process.exit(1);
        });
}

module.exports = ValidationBridge;
`;
        
        fs.writeFileSync(bridgePath, bridgeContent);
        fs.chmodSync(bridgePath, '755'); // Make executable
        console.log('  ✅ Created validation bridge');
    }

    findFilesRecursive(dir, extension) {
        const files = [];
        
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    files.push(...this.findFilesRecursive(fullPath, extension));
                } else if (stat.isFile() && item.endsWith(extension)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Skip inaccessible directories
        }
        
        return files;
    }

    displayResults() {
        console.log('\' + '='.repeat(60));
        console.log('📊 PATH DIAGNOSTIC RESULTS');
        console.log('='.repeat(60));
        
        console.log('\📁 Directory Locations:');
        console.log(\`  Petersen Games: \${this.findings.petersenGames || 'NOT FOUND'}\`);
        console.log(\`  OksanaPlatform: \${this.findings.oksanaPlatform || 'NOT FOUND'}\`);
        
        console.log('\🔧 Validation Files:');
        this.findings.validators.forEach(validator => {
            const statusIcon = validator.status === 'FOUND' ? '✅' : '❌';
            console.log(\`  \${statusIcon} \${validator.name}\`);
            if (validator.path) {
                console.log(\`      \${validator.path}\`);
            }
        });
        
        if (this.findings.cssIssues.length > 0) {
            console.log(\`\🎨 CSS Issues Found: \${this.findings.cssIssues.length}\`);
            this.findings.cssIssues.slice(0, 5).forEach(issue => {
                console.log(\`  📄 \${issue.file}: \${issue.injections || 'embedded styles'}\`);
            });
            if (this.findings.cssIssues.length > 5) {
                console.log(\`  ... and \${this.findings.cssIssues.length - 5} more files\`);
            }
        }
        
        if (this.findings.recommendations.length > 0) {
            console.log('\💡 Recommendations:');
            this.findings.recommendations.forEach((rec, index) => {
                console.log(\`  \${index + 1}. [\${rec.priority}] \${rec.action}\`);
            });
        }
        
        console.log('\🚀 Next Steps:');
        console.log('  1. Run: npm run validate:all');
        console.log('  2. Fix any validation errors');
        console.log('  3. Add missing validation files as needed');
        console.log('  4. Resolve CSS injection/embedding issues');
        
        console.log('='.repeat(60));
    }
}

// CLI execution
if (require.main === module) {
    const diagnostic = new PathDiagnosticSetup();
    
    diagnostic.runDiagnostic()
        .then(findings => {
            diagnostic.displayResults();
            
            const hasIssues = findings.recommendations.some(r => r.priority === 'HIGH');
            process.exit(hasIssues ? 1 : 0);
        })
        .catch(error => {
            console.error('❌ Diagnostic failed:', error);
            process.exit(1);
        });
}

module.exports = PathDiagnosticSetup;