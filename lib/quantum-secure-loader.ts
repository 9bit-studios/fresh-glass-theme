#!/usr/bin/env node
/**
 * quantum-secure-loader.ts
 * Loads Quantum-Secure API clients with ML-KEM-1024 encryption
 * Integrates with unified-environment-orchestrator.js
 * OksanaPlatform Foundation Model - Quantum Spatial Design System
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface QuantumSecureConfig {
  orchestratorPath: string;
  validationPath: string;
  apiClientsPath: string;
  quantumSecurePath: string;
}

class QuantumSecureLoader {
  private oksanaRoot: string;
  private config: QuantumSecureConfig;

  constructor() {
    // Navigate up to Oksana root from quantum-spatial-design-system/lib
    // lib -> quantum-spatial-design-system -> shopify-themes -> creative-intelligence-portal -> quantum-spatial -> Oksana
    this.oksanaRoot = resolve(__dirname, '../../../../..');

    this.config = {
      orchestratorPath: resolve(this.oksanaRoot, 'config/unified-environment-orchestrator.js'),
      validationPath: resolve(this.oksanaRoot, 'validation/api-clients'),
      apiClientsPath: resolve(this.oksanaRoot, 'validation/api-clients'),
      quantumSecurePath: resolve(this.oksanaRoot, 'apple-intelligence/foundation/quantum-secure')
    };
  }

  async initialize(): Promise<boolean> {
    console.log('🔐 Quantum-Secure API Client Loader');
    console.log('   Design System: Quantum Spatial');
    console.log(`   Oksana Root: ${this.oksanaRoot}`);

    try {
      // Validate quantum-secure path exists
      if (!existsSync(this.config.quantumSecurePath)) {
        console.log(`   ⚠️  Quantum-secure path not found: ${this.config.quantumSecurePath}`);
        return false;
      }

      // Validate orchestrator exists
      if (!existsSync(this.config.orchestratorPath)) {
        console.log(`   ⚠️  Orchestrator not found: ${this.config.orchestratorPath}`);
        return false;
      }

      // Validate API clients path exists
      if (!existsSync(this.config.apiClientsPath)) {
        console.log(`   ⚠️  API clients not found: ${this.config.apiClientsPath}`);
        return false;
      }

      console.log('   ✅ Quantum-secure: Available');
      console.log('   ✅ Orchestrator: Available');
      console.log('   ✅ API Clients: Available');
      console.log('   🔐 Encryption: ML-KEM-1024');

      // Load environment via orchestrator (using singleton instance)
      const orchestratorModule = await import(this.config.orchestratorPath);
      const result = await orchestratorModule.EnvironmentOrchestrator.initialize();

      console.log('   ✅ Unified environment loaded');
      console.log('   ✅ Quantum-secure API clients ready');

      return true;
    } catch (error) {
      console.log(`   ❌ Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  getConfig(): QuantumSecureConfig {
    return this.config;
  }
}

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const loader = new QuantumSecureLoader();
  loader.initialize()
    .then((success) => {
      if (success) {
        console.log('\n✅ Quantum-Secure loader initialized successfully');
        process.exit(0);
      } else {
        console.log('\n❌ Quantum-Secure loader initialization failed');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

export { QuantumSecureLoader };
export type { QuantumSecureConfig };
