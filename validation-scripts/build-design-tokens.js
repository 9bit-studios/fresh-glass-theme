#!/usr/bin/env node

/**
 * Build Design Tokens for Petersen Games Shopify Theme
 * Generates CSS variables and Liquid includes from Quantum Spatial Design System
 */

import * as fs from 'fs/promises';
import * as path from 'path';

class PetersenGamesTokenBuilder {
  constructor() {
    this.tokens = [];
    this.outputDir = path.join(process.cwd(), 'assets', 'design-tokens');
  }

  async build() {
    console.log('🎨 Building Design Tokens for Petersen Games...');
    console.log('='.repeat(50));

    try {
      // Load quantum spatial tokens
      await this.loadQuantumSpatialTokens();
      
      // Generate CSS variables
      await this.generateCSSVariables();
      
      // Generate Liquid includes
      await this.generateLiquidIncludes();
      
      // Generate TypeScript definitions
      await this.generateTypeScriptDefinitions();
      
      console.log('✅ Design tokens built successfully!');
      console.log(`📁 Output directory: ${this.outputDir}`);
      
    } catch (error) {
      console.error('❌ Token build failed:', error.message);
      process.exit(1);
    }
  }

  async loadQuantumSpatialTokens() {
    console.log('📦 Loading Quantum Spatial Design Tokens...');
    
    // Define Petersen Games specific tokens
    this.tokens = [
      // Colors - Cosmic Horror Theme
      { name: 'primary-cosmic', value: '#1a0e2e', type: 'color', category: 'primary' },
      { name: 'primary-void', value: '#0d0617', type: 'color', category: 'primary' },
      { name: 'accent-eldritch', value: '#6a3093', type: 'color', category: 'accent' },
      { name: 'accent-ethereal', value: '#a044a0', type: 'color', category: 'accent' },
      { name: 'text-primary', value: '#f8f9fa', type: 'color', category: 'text' },
      { name: 'text-secondary', value: '#adb5bd', type: 'color', category: 'text' },
      
      // Glass Effects
      { name: 'glass-bg', value: 'rgba(255, 255, 255, 0.1)', type: 'color', category: 'glass' },
      { name: 'glass-border', value: 'rgba(255, 255, 255, 0.2)', type: 'color', category: 'glass' },
      { name: 'glass-blur', value: '20px', type: 'shadow', category: 'glass' },
      
      // Spacing
      { name: 'space-xs', value: '0.25rem', type: 'spacing', category: 'spacing' },
      { name: 'space-sm', value: '0.5rem', type: 'spacing', category: 'spacing' },
      { name: 'space-md', value: '1rem', type: 'spacing', category: 'spacing' },
      { name: 'space-lg', value: '1.5rem', type: 'spacing', category: 'spacing' },
      { name: 'space-xl', value: '2rem', type: 'spacing', category: 'spacing' },
      
      // Typography
      { name: 'font-primary', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', type: 'typography', category: 'fonts' },
      { name: 'font-display', value: '"Cinzel", serif', type: 'typography', category: 'fonts' },
      { name: 'text-xs', value: '0.75rem', type: 'typography', category: 'sizes' },
      { name: 'text-sm', value: '0.875rem', type: 'typography', category: 'sizes' },
      { name: 'text-base', value: '1rem', type: 'typography', category: 'sizes' },
      { name: 'text-lg', value: '1.125rem', type: 'typography', category: 'sizes' },
      { name: 'text-xl', value: '1.25rem', type: 'typography', category: 'sizes' },
      
      // Shadows
      { name: 'shadow-sm', value: '0 1px 2px rgba(0, 0, 0, 0.05)', type: 'shadow', category: 'shadows' },
      { name: 'shadow-md', value: '0 4px 6px rgba(0, 0, 0, 0.1)', type: 'shadow', category: 'shadows' },
      { name: 'shadow-lg', value: '0 10px 15px rgba(0, 0, 0, 0.1)', type: 'shadow', category: 'shadows' },
      { name: 'shadow-cosmic', value: '0 0 20px rgba(106, 48, 147, 0.3)', type: 'shadow', category: 'shadows' },
    ];
    
    console.log(`  ✅ Loaded ${this.tokens.length} design tokens`);
  }

  async generateCSSVariables() {
    console.log('🎨 Generating CSS Variables...');
    
    const cssContent = [
      '/**',
      ' * Petersen Games Design Tokens',
      ' * Generated with Apple Intelligence + Quantum Spatial Design System',
      ' */',
      '',
      ':root {',
      ...this.tokens.map(token => `  --${token.name}: ${token.value};`),
      '}',
      '',
      '/* Glass morphism utility classes */',
      '.glass-effect {',
      '  background: var(--glass-bg);',
      '  border: 1px solid var(--glass-border);',
      '  backdrop-filter: blur(var(--glass-blur));',
      '  border-radius: 12px;',
      '}',
      '',
      '/* Cosmic theme utilities */',
      '.cosmic-bg {',
      '  background: linear-gradient(135deg, var(--primary-cosmic), var(--primary-void));',
      '}',
      '',
      '.eldritch-glow {',
      '  box-shadow: var(--shadow-cosmic);',
      '}',
    ].join('');

    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.writeFile(path.join(this.outputDir, 'petersen-design-tokens.css'), cssContent);
    
    console.log('  ✅ CSS variables generated');
  }

  async generateLiquidIncludes() {
    console.log('💧 Generating Liquid Includes...');
    
    // Generate Liquid snippet for design tokens
    const liquidContent = [
      '{%- comment -%}',
      '  Petersen Games Design Tokens - Liquid Include',
      '  Generated with Apple Intelligence',
      '{%- endcomment -%}',
      '',
      '<style>',
      '  :root {',
      ...this.tokens.map(token => `    --${token.name}: ${token.value};`),
      '  }',
      '',
      '  .petersen-glass {',
      '    background: var(--glass-bg);',
      '    border: 1px solid var(--glass-border);',
      '    backdrop-filter: blur(var(--glass-blur));',
      '    border-radius: 12px;',
      '  }',
      '</style>',
    ].join('');

    const snippetsDir = path.join(process.cwd(), 'snippets');
    await fs.mkdir(snippetsDir, { recursive: true });
    await fs.writeFile(path.join(snippetsDir, 'petersen-design-tokens.liquid'), liquidContent);
    
    console.log('  ✅ Liquid includes generated');
  }

  async generateTypeScriptDefinitions() {
    console.log('📘 Generating TypeScript Definitions...');
    
    const tsContent = [
      '/**',
      ' * Petersen Games Design Token Types',
      ' * Generated with Apple Intelligence',
      ' */',
      '',
      'export interface PetersenDesignTokens {',
      ...this.tokens.map(token => `  '${token.name}': string;`),
      '}',
      '',
      'export const petersenTokens: PetersenDesignTokens = {',
      ...this.tokens.map(token => `  '${token.name}': '${token.value}',`),
      '};',
      '',
      'export default petersenTokens;',
    ].join('');

    const typesDir = path.join(process.cwd(), 'types');
    await fs.mkdir(typesDir, { recursive: true });
    await fs.writeFile(path.join(typesDir, 'design-tokens.ts'), tsContent);
    
    console.log('  ✅ TypeScript definitions generated');
  }
}

// Run the token builder
const builder = new PetersenGamesTokenBuilder();
builder.build().catch(console.error);