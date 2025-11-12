/**
 * Layout Diagnostic Tool
 * Diagnoses grid layout and product visibility issues
 */

const fs = require('fs').promises;
const path = require('path');

class LayoutDiagnostic {
  constructor() {
    this.baseDir = '/Users/pennyplatt/9bit-studios/petersen-portal/fresh-glass-theme/petersen-glass-theme';
    this.issues = [];
    this.fixes = [];
  }

  async diagnoseLayout() {
    console.log('🔍 Diagnosing Layout and Product Visibility Issues...');
    
    // Check 1: Collection configuration
    await this.checkCollectionSetup();
    
    // Check 2: CSS conflicts
    await this.checkCSSConflicts();
    
    // Check 3: Grid layout structure
    await this.checkGridStructure();
    
    // Generate fixes
    await this.generateQuickFixes();
    
    this.reportFindings();
  }

  async checkCollectionSetup() {
    console.log('📋 Checking Collection Setup...');
    
    try {
      const indexContent = await fs.readFile(path.join(this.baseDir, 'templates/index.liquid'), 'utf8');
      
      // Check for collection assignment
      if (indexContent.includes("collections['all']")) {
        this.issues.push({
          type: 'COLLECTION',
          severity: 'HIGH',
          issue: "Using collections['all'] which may not exist",
          location: 'templates/index.liquid:24',
          impact: 'No products will display if "all" collection is empty or missing'
        });
        
        this.fixes.push({
          type: 'COLLECTION_FIX',
          title: 'Use specific collection or products',
          code: `{% assign featured_collection = collections.frontpage %}
{% comment %} OR {% endcomment %}
{% assign featured_collection = collections[settings.featured_collection] %}
{% comment %} OR for all products {% endcomment %}
{% assign all_products = collections.all.products %}`
        });
      }
      
      console.log('   ✅ Collection assignment found');
    } catch (error) {
      console.log('   ❌ Could not read index.liquid');
    }
  }

  async checkCSSConflicts() {
    console.log('📋 Checking CSS Conflicts...');
    
    try {
      const priorityCSS = await fs.readFile(path.join(this.baseDir, 'assets/priority-foundation.css'), 'utf8');
      
      // Check for potential visibility issues
      const visibilityIssues = [
        { pattern: /opacity:\s*0/, issue: 'Elements set to opacity: 0' },
        { pattern: /display:\s*none/, issue: 'Elements set to display: none' },
        { pattern: /visibility:\s*hidden/, issue: 'Elements set to visibility: hidden' },
        { pattern: /height:\s*0/, issue: 'Elements with height: 0' },
        { pattern: /max-height:\s*0/, issue: 'Elements with max-height: 0' }
      ];
      
      visibilityIssues.forEach(check => {
        if (check.pattern.test(priorityCSS)) {
          this.issues.push({
            type: 'CSS_VISIBILITY',
            severity: 'MEDIUM',
            issue: check.issue,
            location: 'assets/priority-foundation.css',
            impact: 'May cause products to be hidden'
          });
        }
      });
      
      // Check for grid conflicts
      if (priorityCSS.includes('.product-grid') || priorityCSS.includes('.products-grid')) {
        console.log('   ⚠️ Grid styles found in priority CSS');
      }
      
      console.log('   ✅ CSS conflict check complete');
    } catch (error) {
      console.log('   ❌ Could not read priority-foundation.css');
    }
  }

  async checkGridStructure() {
    console.log('📋 Checking Grid Structure...');
    
    try {
      const indexContent = await fs.readFile(path.join(this.baseDir, 'templates/index.liquid'), 'utf8');
      
      // Check for proper grid structure
      const gridChecks = [
        { pattern: /class="layout-with-sidebar"/, name: 'Main layout wrapper' },
        { pattern: /class="content-area"/, name: 'Content area' },
        { pattern: /class="product-grid-container"/, name: 'Product grid container' },
        { pattern: /class="product-card"/, name: 'Product cards' }
      ];
      
      gridChecks.forEach(check => {
        if (check.pattern.test(indexContent)) {
          console.log(`   ✅ ${check.name} found`);
        } else {
          this.issues.push({
            type: 'STRUCTURE',
            severity: 'HIGH',
            issue: `Missing ${check.name}`,
            location: 'templates/index.liquid',
            impact: 'Grid layout will not work properly'
          });
        }
      });
      
    } catch (error) {
      console.log('   ❌ Could not read index.liquid');
    }
  }

  async generateQuickFixes() {
    console.log('📋 Generating Quick Fixes...');
    
    // Fix 1: Collection debug
    this.fixes.push({
      type: 'DEBUG_COLLECTION',
      title: 'Add collection debug to index.liquid',
      description: 'Add this at the top of index.liquid to see what collections are available',
      code: `{% comment %} DEBUG: Show available collections {% endcomment %}
<div style="background: red; color: white; padding: 10px; position: fixed; top: 0; left: 0; z-index: 9999;">
  DEBUG: Collections count: {{ collections.size }}<br>
  All collection exists: {{ collections.all != blank }}<br>
  All collection products: {{ collections.all.products.size }}<br>
  Available collections: 
  {% for collection in collections limit: 5 %}
    {{ collection.handle }}({{ collection.products.size }}){% unless forloop.last %}, {% endunless %}
  {% endfor %}
</div>`
    });
    
    // Fix 2: Simple product display
    this.fixes.push({
      type: 'SIMPLE_PRODUCTS',
      title: 'Use simple product display',
      description: 'Replace the complex collection logic with simple product loop',
      code: `<!-- Simple product display for testing -->
<div class="content-area">
  <div class="product-grid-container">
    {% for product in collections.all.products limit: 12 %}
      <div class="product-card">
        <h3>{{ product.title }}</h3>
        <p>{{ product.price | money }}</p>
      </div>
    {% else %}
      <p style="color: red;">No products found in collections.all</p>
    {% endfor %}
  </div>
</div>`
    });
    
    // Fix 3: CSS visibility reset
    this.fixes.push({
      type: 'CSS_RESET',
      title: 'Add visibility reset to priority-foundation.css',
      description: 'Ensure product cards are visible',
      code: `/* Product Visibility Reset */
.product-card {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}

.product-grid-container {
  display: grid !important;
}

.products-grid {
  display: block !important;
}`
    });
  }

  reportFindings() {
    console.log('🎯 DIAGNOSTIC REPORT');
    console.log('===================');
    
    if (this.issues.length === 0) {
      console.log('✅ No issues detected!');
    } else {
      console.log(`❌ Found ${this.issues.length} potential issues:`);
      
      this.issues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity}] ${issue.issue}`);
        console.log(`   Location: ${issue.location}`);
        console.log(`   Impact: ${issue.impact}`);
      });
    }
    
    console.log('🔧 RECOMMENDED FIXES');
    console.log('====================');
    
    this.fixes.forEach((fix, index) => {
      console.log(`${index + 1}. ${fix.title}`);
      if (fix.description) {
        console.log(`   ${fix.description}`);
      }
      console.log(`   ${fix.code}`);
      console.log('   ' + '-'.repeat(50) + '');
    });
    
    console.log('🎯 IMMEDIATE ACTION PLAN');
    console.log('========================');
    console.log('1. Add the DEBUG collection code to index.liquid');
    console.log('2. Refresh the page and check the red debug box');
    console.log('3. If collections.all is empty, use a different collection');
    console.log('4. If CSS is hiding products, add the visibility reset');
    console.log('5. Test with the simple product display code');
  }
}

// Run diagnostic
if (require.main === module) {
  const diagnostic = new LayoutDiagnostic();
  diagnostic.diagnoseLayout()
    .then(() => {
      console.log('✅ Diagnostic complete!');
    })
    .catch(error => {
      console.error('❌ Diagnostic failed:', error.message);
    });
}

module.exports = { LayoutDiagnostic };