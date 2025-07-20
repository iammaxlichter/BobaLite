import { loadCartReview } from './cartReview.js';
import { initBillingForm } from './billingForm.js';
import { initPaymentForm } from './paymentForm.js';
import { initCheckoutStepper } from './stepper.js';
import { initConfirmation } from './confirmation.js';

document.addEventListener('DOMContentLoaded', () => { // Fixed typo: was 'DOMContentLaded'
  loadCartReview();
  initBillingForm();
  initPaymentForm();
  initCheckoutStepper();
  initConfirmation();
});