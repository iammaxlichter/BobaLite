import { loadCartReview } from './cartReview.js';
import { initBillingForm } from './billingForm.js';
import { initPaymentForm } from './paymentForm.js';
import { initCheckoutStepper } from './stepper.js';
import { initConfirmation } from './confirmation.js';

/**
 * Initializes the checkout page:
 * - Loads cart review
 * - Initializes billing and payment forms
 * - Sets up the stepper navigation
 * - Prepares the confirmation panel
 */
document.addEventListener('DOMContentLoaded', () => {
  loadCartReview();
  initBillingForm();
  initPaymentForm();
  initCheckoutStepper();
  initConfirmation();
});
