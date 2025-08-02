import { loadCartReview } from './cartReview.js';
import { initShippingForm } from './shippingForm.js';
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
  initShippingForm();
  initPaymentForm();
  initCheckoutStepper();
  initConfirmation();
});
