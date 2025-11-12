#!/usr/bin/env node
/**
 * Test OksanaPlatform Services Integration
 * Demonstrates accessing OksanaPlatform services from Petersen Games project
 */

import { 
  OksanaServiceFactory,
  ServiceFormatters 
} from '../Oksana/scripts/services/index.js';

async function testOksanaServices() {
  console.log('🧪 Testing OksanaPlatform Service Integration');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Create Frontend Design Service
    console.log('📋 Test 1: Frontend Design Service');
    const frontendService = await OksanaServiceFactory.createFrontendDesignService();
    console.log('✅ Frontend Design Service created and initialized');
    
    // Generate design tokens for Petersen Games
    const tokens = await frontendService.generateQuickDesignTokens('heritage');
    console.log('✅ Generated heritage design tokens for Petersen Games');
    console.log('   Primary color:', tokens.colors.primary);
    console.log('   Typography:', tokens.typography.primary);
    
    // Test 2: Create Enhanced Shopify Service
    console.log('📋 Test 2: Enhanced Shopify Service');
    const shopifyService = await OksanaServiceFactory.createEnhancedShopifyService();
    console.log('✅ Enhanced Shopify Service created and initialized');
    
    // Test 3: Create QA Service
    console.log('📋 Test 3: Unified QA Service');
    const qaService = await OksanaServiceFactory.createUnifiedQAService();
    console.log('✅ Unified QA Service created and initialized');
    
    // Test 4: Run QA Validation
    console.log('📋 Test 4: QA Validation');
    const validation = await qaService.runCompleteValidation('apple-hig');
    console.log('✅ QA Validation completed');
    console.log('   Phase:', validation.phase);
    console.log('   Success:', validation.success ? '✅ Pass' : '❌ Fail');
    if (validation.score) {
      console.log('   Score:', validation.score + '%');
    }
    
    // Test 5: Service Health Checks
    console.log('📋 Test 5: Service Health Checks');
    const frontendHealth = await frontendService.healthCheck();
    console.log('✅ Frontend Service:', frontendHealth.status);
    
    const shopifyHealth = await shopifyService.healthCheck();
    console.log('✅ Shopify Service:', shopifyHealth.status);
    
    const qaHealth = await qaService.healthCheck();
    console.log('✅ QA Service:', qaHealth.status);
    
    console.log('' + '='.repeat(60));
    console.log('✅ All OksanaPlatform services successfully integrated!');
    console.log('🎉 Services are available across the entire ecosystem!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testOksanaServices().then(() => {
  console.log('✨ Test completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});