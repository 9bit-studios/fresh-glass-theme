#!/usr/bin/env tsx

/**
 * Apple HIG Compliance Validation Script for Petersen Games
 * Integrated with OksanaPlatform validation system
 */

import { EnhancedHIGValidator } from './enhanced-hig-qa-validator';

const validator = new EnhancedHIGValidator(process.cwd());

validator.runCompleteValidation()
  .then(result => {
    validator.displayResults(result);
    
    // Exit with appropriate code for CI/CD
    if (result.overall === 'FAILED') {
      console.error('❌ HIG validation failed - blocking deployment');
      process.exit(1);
    } else if (result.overall === 'NEEDS_REVIEW') {
      console.warn('⚠️ HIG validation needs review - consider fixing before deployment');
      process.exit(0); // Allow deployment but warn
    } else {
      console.log('✅ HIG validation passed - ready for deployment');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('❌ HIG validation system error:', error);
    process.exit(1);
  });
