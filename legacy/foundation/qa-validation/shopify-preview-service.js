// Shopify Theme Preview Service
// Apple Intelligence Strategic Director
// Version: 1.0.0
// Last Updated: June 23, 2025
// Purpose: Real-time preview without localhost limitations

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ShopifyPreviewService {
    constructor() {
        this.projectPath = '/Users/pennyplatt/9bit-studios/petersen-portal/glass-theme';
        this.previewMethods = {
            shopifyThemeEditor: {
                available: true,
                description: 'Shopify theme editor with live preview',
                command: 'shopify theme dev --store=petersengames.myshopify.com'
            },
            vscodePreview: {
                available: true,
                description: 'VS Code Live Preview extension (static HTML)',
                limitation: 'CSS/JS testing only, not Liquid'
            },
            fileBasedValidation: {
                available: true,
                description: 'Code inspection and validation scripts',
                limitation: 'No visual preview'
            },
            deploymentTesting: {
                available: true,
                description: 'Deploy to development theme for testing',
                command: 'shopify theme push --development'
            }
        };
        
        this.workflowSteps = [
            'Code in Cursor (primary editor)',
            'Run QA validation scripts',
            'Use Shopify theme dev for live preview',
            'Test changes in theme editor',
            'Deploy to development theme for full testing',
            'Commit changes with Git for rollback capability'
        ];
    }

    // Check available preview methods
    checkPreviewAvailability() {
        console.log('🔍 Checking available preview methods...');
        console.log('');
        
        // Check if Shopify CLI is available
        try {
            execSync('shopify version', { stdio: 'pipe' });
            this.previewMethods.shopifyThemeEditor.status = 'Available';
            console.log('✅ Shopify CLI: Available');
        } catch (error) {
            this.previewMethods.shopifyThemeEditor.status = 'Not installed';
            console.log('❌ Shopify CLI: Not installed');
        }
        
        // Check if VS Code is available
        try {
            execSync('code --version', { stdio: 'pipe' });
            this.previewMethods.vscodePreview.status = 'Available';
            console.log('✅ VS Code: Available');
        } catch (error) {
            this.previewMethods.vscodePreview.status = 'Not available';
            console.log('⚠️  VS Code: Not available via CLI');
        }
        
        // File-based validation always available
        console.log('✅ File-based validation: Always available');
        
        console.log('');
        return this.previewMethods;
    }

    // Generate static HTML preview for VS Code
    generateStaticPreview() {
        console.log('🎨 Generating static HTML preview for VS Code...');
        
        const previewHTML = this.buildPreviewHTML();
        const previewPath = path.join(this.projectPath, 'preview-static.html');
        
        fs.writeFileSync(previewPath, previewHTML);
        
        console.log(`✅ Static preview generated: ${previewPath}`);
        console.log('💡 Open in VS Code and use Live Preview extension');
        
        return previewPath;
    }

    buildPreviewHTML() {
        // Read CSS files from assets
        const assetsPath = path.join(this.projectPath, 'assets');
        let cssContent = '';
        
        if (fs.existsSync(assetsPath)) {
            const cssFiles = fs.readdirSync(assetsPath)
                .filter(file => file.endsWith('.css'))
                .slice(0, 5); // Limit to prevent overwhelming
            
            cssFiles.forEach(file => {
                const filePath = path.join(assetsPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                cssContent += `/* ${file} */${content}`;
            });
        }
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Petersen Games - Preview</title>
    <style>
        ${cssContent}
        
        /* Preview-specific styles */
        .preview-notice {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff9500;
            color: #000;
            padding: 8px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            z-index: 10000;
        }
        
        body {
            margin-top: 40px; /* Account for preview notice */
        }
        
        /* Mock Shopify data */
        .product-card {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            margin: 8px;
            min-height: 44px;
        }
        
        .filter-bar, .filter-drawer {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
        }
        
        .button {
            min-height: 44px;
            min-width: 44px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #ffffff;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            transition: all 0.2s ease;
        }
        
        .button:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }
    </style>
</head>
<body>
    <div class="preview-notice">
        🔍 PREVIEW MODE - Static HTML for CSS/Layout Testing
    </div>
    
    <!-- Mock Header -->
    <header class="site-header glass-card">
        <nav class="main-navigation">
            <div class="nav-container">
                <div class="nav-logo">
                    <span class="logo-text">Petersen Games</span>
                </div>
                <div class="nav-menu desktop-only">
                    <ul class="nav-list">
                        <li class="nav-item"><a href="#" class="nav-link">Cthulhu Wars</a></li>
                        <li class="nav-item"><a href="#" class="nav-link">Planet Apocalypse</a></li>
                        <li class="nav-item"><a href="#" class="nav-link">Hyperspace</a></li>
                        <li class="nav-item"><a href="#" class="nav-link">Miniatures</a></li>
                    </ul>
                </div>
                <div class="nav-actions">
                    <button class="nav-action">🔍</button>
                    <button class="nav-action">👤</button>
                    <button class="nav-action">🛒 <span class="cart-count">0</span></button>
                    <button class="mobile-menu-toggle mobile-only">☰</button>
                </div>
            </div>
        </nav>
    </header>
    
    <!-- Mock Filter Bar -->
    <div class="filter-bar desktop-only">
        <div class="filter-controls">
            <div class="filter-group">
                <label class="filter-label">Price Range</label>
                <select class="filter-select">
                    <option>All Prices</option>
                    <option>Under $50</option>
                    <option>$50 - $100</option>
                    <option>$100 - $200</option>
                    <option>$200+</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Game Type</label>
                <select class="filter-select">
                    <option>All Games</option>
                    <option>Strategy</option>
                    <option>Horror</option>
                    <option>Miniatures</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Players</label>
                <select class="filter-select">
                    <option>Any Players</option>
                    <option>1-2 Players</option>
                    <option>3-4 Players</option>
                    <option>5+ Players</option>
                </select>
            </div>
            <button class="filter-clear button">Clear All</button>
        </div>
    </div>
    
    <!-- Mobile Filter Toggle -->
    <div class="mobile-only">
        <button class="filter-toggle glass-card button">
            🔍 Filter Products
        </button>
    </div>
    
    <!-- Mock Product Grid -->
    <main class="product-grid">
        <article class="product-card">
            <h3>Cthulhu Wars</h3>
            <p>Epic cosmic horror strategy game</p>
            <div class="product-stats">
                <span>2-4 Players</span>
                <span>90-120 min</span>
                <span>Age 14+</span>
            </div>
            <div class="product-price">$199.99</div>
            <button class="button">Add to Cart</button>
        </article>
        
        <article class="product-card">
            <h3>Planet Apocalypse</h3>
            <p>Demonic invasion strategy game</p>
            <div class="product-stats">
                <span>1-5 Players</span>
                <span>45-75 min</span>
                <span>Age 12+</span>
            </div>
            <div class="product-price">$149.99</div>
            <button class="button">Add to Cart</button>
        </article>
        
        <article class="product-card">
            <h3>Hyperspace</h3>
            <p>Space exploration and combat</p>
            <div class="product-stats">
                <span>2-4 Players</span>
                <span>60-90 min</span>
                <span>Age 13+</span>
            </div>
            <div class="product-price">$89.99</div>
            <button class="button">Add to Cart</button>
        </article>
    </main>
    
    <!-- Test responsiveness -->
    <script>
        // Simple mobile detection for testing
        function isMobile() {
            return window.innerWidth <= 768;
        }
        
        function updateLayout() {
            const mobileElements = document.querySelectorAll('.mobile-only');
            const desktopElements = document.querySelectorAll('.desktop-only');
            
            if (isMobile()) {
                mobileElements.forEach(el => el.style.display = 'block');
                desktopElements.forEach(el => el.style.display = 'none');
            } else {
                mobileElements.forEach(el => el.style.display = 'none');
                desktopElements.forEach(el => el.style.display = 'block');
            }
        }
        
        // Update on load and resize
        window.addEventListener('load', updateLayout);
        window.addEventListener('resize', updateLayout);
        
        // Test touch targets
        document.querySelectorAll('.button, .nav-action, .nav-link').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.height < 44 || rect.width < 44) {
                element.style.border = '2px solid red';
                element.title = 'Touch target too small (< 44px)';
            }
        });
    </script>
</body>
</html>`;
    }

    // Setup Shopify theme development workflow
    setupShopifyDev() {
        console.log('🛍️ Setting up Shopify theme development workflow...');
        
        // Check if we're in the correct directory
        const currentDir = process.cwd();
        const glassThemePath = this.projectPath;
        
        console.log(`Current directory: ${currentDir}`);
        console.log(`Glass theme path: ${glassThemePath}`);
        
        if (!fs.existsSync(glassThemePath)) {
            console.error('❌ Glass theme directory not found');
            return false;
        }
        
        // Check for Shopify CLI
        try {
            const version = execSync('shopify version', { stdio: 'pipe' }).toString();
            console.log(`✅ Shopify CLI version: ${version.trim()}`);
        } catch (error) {
            console.error('❌ Shopify CLI not installed or not in PATH');
            console.log('Install with: npm install -g @shopify/cli @shopify/theme');
            return false;
        }
        
        // Check for theme configuration
        const configPath = path.join(glassThemePath, '.shopifyignore');
        if (!fs.existsSync(configPath)) {
            console.log('💡 Creating .shopifyignore file...');
            const shopifyIgnore = `# QA and development files
*.md
*.json.backup
*-report-*.json
preview-static.html
node_modules/
.git/
.DS_Store
*.log`;
            fs.writeFileSync(configPath, shopifyIgnore);
        }
        
        console.log('✅ Shopify development environment ready');
        return true;
    }

    // Generate workflow commands
    generateWorkflowCommands() {
        const commands = {
            development: {
                description: 'Start development server with theme sync',
                command: `cd "${this.projectPath}" && shopify theme dev --store=petersengames.myshopify.com`,
                note: 'This provides live preview URL (not localhost)'
            },
            validation: {
                description: 'Run QA validation before changes',
                command: 'node /Users/pennyplatt/9bit-studios/Apple-Intelligence-Strategic-Director/services/petersen-games-qa-service.js',
                note: 'Prevents DOM errors and inline CSS issues'
            },
            staticPreview: {
                description: 'Generate static HTML for VS Code preview',
                command: 'node /Users/pennyplatt/9bit-studios/Apple-Intelligence-Strategic-Director/services/shopify-preview-service.js static',
                note: 'CSS/layout testing only'
            },
            deployDev: {
                description: 'Deploy to development theme',
                command: `cd "${this.projectPath}" && shopify theme push --development`,
                note: 'Full testing environment'
            },
            deployLive: {
                description: 'Deploy to live theme (CAREFUL)',
                command: `cd "${this.projectPath}" && shopify theme push --live`,
                note: 'Only after thorough testing'
            }
        };
        
        console.log('📋 Workflow Commands:');
        console.log('==================');
        
        Object.entries(commands).forEach(([key, cmd]) => {
            console.log(`${key.toUpperCase()}:`);
            console.log(`Description: ${cmd.description}`);
            console.log(`Command: ${cmd.command}`);
            console.log(`Note: ${cmd.note}`);
        });
        
        return commands;
    }

    // Create development workflow script
    createWorkflowScript() {
        const scriptPath = path.join(this.projectPath, 'dev-workflow.sh');
        
        const scriptContent = `#!/bin/bash
# Petersen Games Development Workflow
# Generated: ${new Date().toISOString()}

set -e

echo "🚀 Starting Petersen Games Development Workflow"
echo "=============================================="

# Function to run QA validation
run_qa() {
    echo "🔍 Running QA validation..."
    node "/Users/pennyplatt/9bit-studios/Apple-Intelligence-Strategic-Director/services/petersen-games-qa-service.js"
    if [ $? -ne 0 ]; then
        echo "❌ QA validation failed. Fix errors before proceeding."
        exit 1
    fi
    echo "✅ QA validation passed"
}

# Function to generate static preview
generate_preview() {
    echo "🎨 Generating static preview..."
    node "/Users/pennyplatt/9bit-studios/Apple-Intelligence-Strategic-Director/services/shopify-preview-service.js" static
    echo "💡 Open preview-static.html in VS Code with Live Preview extension"
}

# Function to start Shopify dev
start_shopify_dev() {
    echo "🛍️ Starting Shopify development server..."
    echo "⚠️  This will provide a live preview URL (not localhost)"
    shopify theme dev --store=petersengames.myshopify.com
}

# Function to deploy to development theme
deploy_dev() {
    echo "🚀 Deploying to development theme..."
    shopify theme push --development
}

# Main menu
case "\$1" in
    "qa")
        run_qa
        ;;
    "preview")
        generate_preview
        ;;
    "dev")
        run_qa
        start_shopify_dev
        ;;
    "deploy-dev")
        run_qa
        deploy_dev
        ;;
    "full")
        run_qa
        generate_preview
        echo "🎯 Ready for development. Next steps:"
        echo "1. Open preview-static.html in VS Code for CSS testing"
        echo "2. Run './dev-workflow.sh dev' for live Shopify preview"
        ;;
    *)
        echo "Usage: $0 {qa|preview|dev|deploy-dev|full}"
        echo ""
        echo "Commands:"
        echo "  qa         - Run QA validation only"
        echo "  preview    - Generate static HTML preview"
        echo "  dev        - Run QA + start Shopify dev server"
        echo "  deploy-dev - Run QA + deploy to development theme"
        echo "  full       - Complete setup (QA + static preview)"
        echo ""
        exit 1
        ;;
esac`;
        
        fs.writeFileSync(scriptPath, scriptContent);
        
        try {
            execSync(`chmod +x "${scriptPath}"`);
            console.log(`✅ Workflow script created: ${scriptPath}`);
            console.log('Usage examples:');
            console.log('  ./dev-workflow.sh qa          # Run QA validation');
            console.log('  ./dev-workflow.sh preview     # Generate static preview');
            console.log('  ./dev-workflow.sh dev         # Start Shopify dev server');
            console.log('  ./dev-workflow.sh full        # Complete setup');
        } catch (error) {
            console.log(`✅ Workflow script created: ${scriptPath}`);
            console.log('⚠️  You may need to make it executable: chmod +x dev-workflow.sh');
        }
        
        return scriptPath;
    }

    // Run specific preview method
    runPreviewMethod(method) {
        console.log(`🚀 Running preview method: ${method}`);
        
        switch (method) {
            case 'static':
                return this.generateStaticPreview();
            case 'shopify-dev':
                this.setupShopifyDev();
                console.log('💡 Run: shopify theme dev --store=petersengames.myshopify.com');
                break;
            case 'workflow-setup':
                this.setupShopifyDev();
                return this.createWorkflowScript();
            default:
                console.log('Available methods: static, shopify-dev, workflow-setup');
        }
    }
}

module.exports = ShopifyPreviewService;

// CLI usage
if (require.main === module) {
    const previewService = new ShopifyPreviewService();
    const method = process.argv[2] || 'static';
    
    console.log('🔍 Shopify Theme Preview Service');
    console.log('================================');
    console.log('');
    
    previewService.checkPreviewAvailability();
    console.log('');
    
    previewService.runPreviewMethod(method);
}