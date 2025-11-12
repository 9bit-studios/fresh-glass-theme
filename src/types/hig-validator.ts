// Apple HIG Runtime Validator
// Based on your existing type definitions

interface HIGValidationResult {
  isCompliant: boolean;
  score: number;
  violations: HIGViolation[];
  touchTargets: TouchTargetValidation[];
}

interface HIGViolation {
  type: 'touch-target' | 'color-contrast' | 'spacing' | 'typography';
  element: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  recommendation: string;
}

interface TouchTargetValidation {
  minHeight: number;
  minWidth: number;
  element: HTMLElement;
  isCompliant: boolean;
}

class AppleHIGValidator {
  private readonly MIN_TOUCH_TARGET = 44;
  private readonly MIN_TOUCH_TARGET_MOBILE = 56;
  private readonly GRID_BASE = 8;

  validateElement(element: HTMLElement): HIGValidationResult {
    const violations: HIGViolation[] = [];
    const touchTargets: TouchTargetValidation[] = [];

    // Touch target validation
    const touchTarget = this.validateTouchTarget(element);
    touchTargets.push(touchTarget);
    
    if (!touchTarget.isCompliant) {
      violations.push({
        type: 'touch-target',
        element: this.getElementSelector(element),
        description: `Touch target too small: ${touchTarget.minHeight}x${touchTarget.minWidth}px`,
        severity: 'error',
        recommendation: `Increase to minimum ${this.MIN_TOUCH_TARGET}x${this.MIN_TOUCH_TARGET}px (${this.MIN_TOUCH_TARGET_MOBILE}px on mobile)`
      });
    }

    // Spacing validation (8pt grid)
    this.validateSpacing(element, violations);

    // Typography validation
    this.validateTypography(element, violations);

    // Calculate compliance score
    const score = this.calculateComplianceScore(violations);

    return {
      isCompliant: violations.filter(v => v.severity === 'error').length === 0,
      score,
      violations,
      touchTargets
    };
  }

  private validateTouchTarget(element: HTMLElement): TouchTargetValidation {
    const styles = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    const minHeight = Math.max(
      parseInt(styles.minHeight) || 0,
      rect.height
    );
    
    const minWidth = Math.max(
      parseInt(styles.minWidth) || 0,
      rect.width
    );

    const isMobile = window.innerWidth <= 744;
    const requiredSize = isMobile ? this.MIN_TOUCH_TARGET_MOBILE : this.MIN_TOUCH_TARGET;

    return {
      minHeight,
      minWidth,
      element,
      isCompliant: minHeight >= requiredSize && minWidth >= requiredSize
    };
  }

  private validateSpacing(element: HTMLElement, violations: HIGViolation[]): void {
    const styles = getComputedStyle(element);
    const spacingProperties = ['padding', 'margin', 'gap'];
    
    spacingProperties.forEach(prop => {
      const value = styles.getPropertyValue(prop);
      if (value && value !== '0px') {
        const pixels = parseInt(value);
        if (!isNaN(pixels) && pixels % this.GRID_BASE !== 0) {
          violations.push({
            type: 'spacing',
            element: this.getElementSelector(element),
            description: `${prop}: ${value} not aligned to ${this.GRID_BASE}px grid`,
            severity: 'warning',
            recommendation: `Use ${Math.round(pixels / this.GRID_BASE) * this.GRID_BASE}px instead`
          });
        }
      }
    });
  }

  private validateTypography(element: HTMLElement, violations: HIGViolation[]): void {
    const styles = getComputedStyle(element);
    const fontSize = parseInt(styles.fontSize);
    
    // Apple HIG minimum font size
    if (fontSize < 11) {
      violations.push({
        type: 'typography',
        element: this.getElementSelector(element),
        description: `Font size ${fontSize}px below Apple HIG minimum`,
        severity: 'error',
        recommendation: 'Use minimum 11px font size for accessibility'
      });
    }

    // Check for system fonts
    const fontFamily = styles.fontFamily.toLowerCase();
    const hasSystemFont = fontFamily.includes('-apple-system') || 
                         fontFamily.includes('sf pro') ||
                         fontFamily.includes('system-ui');
    
    if (!hasSystemFont) {
      violations.push({
        type: 'typography',
        element: this.getElementSelector(element),
        description: 'Not using Apple system fonts',
        severity: 'info',
        recommendation: 'Consider using -apple-system, SF Pro, or system-ui for better Apple platform integration'
      });
    }
  }

  private calculateComplianceScore(violations: HIGViolation[]): number {
    const weights = { error: -20, warning: -10, info: -5 };
    const penalty = violations.reduce((sum, v) => sum + weights[v.severity], 0);
    return Math.max(0, 100 + penalty);
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  // Validate entire page
  validatePage(): HIGValidationResult {
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], input, select, textarea, a[href]'
    );
    
    const allViolations: HIGViolation[] = [];
    const allTouchTargets: TouchTargetValidation[] = [];
    
    interactiveElements.forEach(element => {
      const result = this.validateElement(element as HTMLElement);
      allViolations.push(...result.violations);
      allTouchTargets.push(...result.touchTargets);
    });

    const overallScore = this.calculateComplianceScore(allViolations);
    
    return {
      isCompliant: allViolations.filter(v => v.severity === 'error').length === 0,
      score: overallScore,
      violations: allViolations,
      touchTargets: allTouchTargets
    };
  }

  // Generate compliance report
  generateReport(): string {
    const result = this.validatePage();
    let report = `=== Apple HIG Compliance Report ===`;
    report += `Overall Score: ${result.score}/100`;
    report += `Compliance Status: ${result.isCompliant ? 'PASS' : 'FAIL'}`;
    
    if (result.violations.length > 0) {
      report += `Violations Found: ${result.violations.length}`;
      
      result.violations.forEach((violation, index) => {
        report += `${index + 1}. [${violation.severity.toUpperCase()}] ${violation.element}`;
        report += `   Issue: ${violation.description}`;
        report += `   Fix: ${violation.recommendation}`;
      });
    } else {
      report += `✅ No violations found! Excellent Apple HIG compliance.`;
    }
    
    return report;
  }
}

// Make it globally available
window.HIGValidator = new AppleHIGValidator();

// Auto-validate on load (development only)
if (process.env.NODE_ENV === 'development') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const report = window.HIGValidator.generateReport();
      console.log(report);
    }, 1000);
  });
}

// Usage examples:
// window.HIGValidator.validatePage()
// window.HIGValidator.generateReport()
// window.HIGValidator.validateElement(document.querySelector('.my-button'))