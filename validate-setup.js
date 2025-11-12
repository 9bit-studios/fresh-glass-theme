#!/usr/bin/env node

/**
 * Petersen Games Package & Environment Validator
 * Quick validation for today's development work
 */

import { promises as fs } from 'fs';
import { SafeEnvironmentLoader } from './safe-env-loader.js';

class PetersenValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passed = [];
    }

    async validateEverything() {
        console.log('🎯 Petersen Games Validation System');
        console.log('==================================');
        console.log('');

        await this.validatePackageJson();
        await this.validateEnvironment();
        await this.validateDirectoryStructure();
        await this.validateGitIgnore();

        this.displayResults();
        return this.errors.length === 0;
    }

    async validatePackageJson() {
        console.log('📦 Validating package.json...');

        try {
            const packageContent = await fs.readFile('package.json', 'utf-8');
            const packageJson = JSON.parse(packageContent);

            // Check essential fields
            const required = ['name', 'version', 'scripts', 'dependencies'];
            for (const field of required) {
                if (packageJson[field]) {
                    this.passed.push(`package.json has ${field}`);
                } else {
                    this.errors.push(`package.json missing ${field}`);
                }
            }

            // Check scripts
            const requiredScripts = ['build', 'dev', 'qa'];
            for (const script of requiredScripts) {
                if (packageJson.scripts && packageJson.scripts[script]) {
                    this.passed.push(`Script '${script}' defined`);
                } else {
                    this.warnings.push(`Script '${script}' not defined`);
                }
            }

            // Check for Shopify dependencies
            const shopifyDeps = ['@shopify/theme-language-server-node', '@shopify/prettier-plugin-liquid'];
            for (const dep of shopifyDeps) {
                if (packageJson.dependencies && packageJson.dependencies[dep] || 
                    packageJson.devDependencies && packageJson.devDependencies[dep]) {
                    this.passed.push(`Shopify dependency '${dep}' installed`);
                } else {
                    this.warnings.push(`Shopify dependency '${dep}' not found`);
                }
            }

            this.passed.push('package.json structure valid');

        } catch (error) {
            this.errors.push(`Failed to read package.json: ${error.message}`);
        }
    }

    async validateEnvironment() {
        console.log('🔐 Validating environment...');

        try {
            const envLoader = new SafeEnvironmentLoader();
            await envLoader.loadEnvironment();

            if (envLoader.isConfigured()) {
                this.passed.push('Environment configuration complete');
            } else {
                this.warnings.push('Environment configuration incomplete');
            }

            if (envLoader.canStartDevelopment()) {
                this.passed.push('Ready for development');
            } else {
                this.errors.push('Missing essential environment variables');
            }

            // Check specific variables
            const env = envLoader.getEnvironment();
            
            if (env.APPLE_HIG_ENABLED === 'true') {
                this.passed.push('Apple HIG compliance enabled');
            } else {
                this.warnings.push('Apple HIG compliance not enabled');
            }

            if (env.OKSANA_PLATFORM_ENABLED === 'true') {
                this.passed.push('OksanaPlatform integration enabled');
            } else {
                this.warnings.push('OksanaPlatform integration not enabled');
            }

        } catch (error) {
            this.errors.push(`Environment validation failed: ${error.message}`);
        }
    }

    async validateDirectoryStructure() {
        console.log('📁 Validating directory structure...');

        const requiredDirs = ['assets', 'config', 'layout', 'sections', 'snippets', 'templates'];
        const optionalDirs = ['src', 'scripts', 'types'];

        for (const dir of requiredDirs) {
            try {
                await fs.access(dir);
                this.passed.push(`Directory '${dir}' exists`);
            } catch (error) {
                this.warnings.push(`Directory '${dir}' not found`);
            }
        }

        for (const dir of optionalDirs) {
            try {
                await fs.access(dir);
                this.passed.push(`Optional directory '${dir}' exists`);
            } catch (error) {
                // Optional directories don't generate warnings
            }
        }
    }

    async validateGitIgnore() {
        console.log('🔒 Validating .gitignore...');

        try {
            const gitignoreContent = await fs.readFile('.gitignore', 'utf-8');
            
            const requiredEntries = ['.env.local', 'node_modules', '*.log'];
            for (const entry of requiredEntries) {
                if (gitignoreContent.includes(entry)) {
                    this.passed.push(`gitignore includes '${entry}'`);
                } else {
                    this.warnings.push(`gitignore missing '${entry}'`);
                }
            }

        } catch (error) {
            this.warnings.push('.gitignore not found');
        }
    }

    displayResults() {
        console.log('');
        console.log('📊 Validation Results');
        console.log('====================');
        console.log('');

        if (this.passed.length > 0) {
            console.log('✅ Passed:');
            this.passed.forEach(item => console.log(`   • ${item}`));
            console.log('');
        }

        if (this.warnings.length > 0) {
            console.log('⚠️ Warnings:');
            this.warnings.forEach(item => console.log(`   • ${item}`));
            console.log('');
        }

        if (this.errors.length > 0) {
            console.log('❌ Errors:');
            this.errors.forEach(item => console.log(`   • ${item}`));
            console.log('');
        }

        // Summary
        const total = this.passed.length + this.warnings.length + this.errors.length;
        console.log('📈 Summary:');
        console.log(`   Total Checks: ${total}`);
        console.log(`   ✅ Passed: ${this.passed.length}`);
        console.log(`   ⚠️ Warnings: ${this.warnings.length}`);
        console.log(`   ❌ Errors: ${this.errors.length}`);
        console.log('');

        if (this.errors.length === 0) {
            console.log('🎉 Validation Complete - Ready for Development!');
            console.log('');
            console.log('🚀 Next Steps:');
            console.log('   1. npm install (if needed)');
            console.log('   2. Copy .env.example to .env.local and add API keys');
            console.log('   3. npm run dev (start development)');
            console.log('   4. npm run qa (run quality assurance)');
        } else {
            console.log('⚠️ Fix errors above before proceeding');
        }
    }
}

// Run validation
async function main() {
    const validator = new PetersenValidator();
    const success = await validator.validateEverything();
    process.exit(success ? 0 : 1);
}

main().catch(error => {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
});
