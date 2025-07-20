// wwwroot/js/Checkout/stepper.js
import { isPaymentFormValid } from './paymentForm.js';
import { submitOrder } from './confirmation.js';

export function initCheckoutStepper() {
    const panels = Array.from(document.querySelectorAll('.checkout-panel'));
    const steps = Array.from(document.querySelectorAll('.checkout-steps li'));
    const prev = document.getElementById('prev-step');
    const next = document.getElementById('next-step');
    let currentStep = 0;

    const billingForm = document.getElementById('billing-form');
    const paymentForm = document.getElementById('payment-form');

    /** Enable/disable Next based on which step we're on */
    function updateNextState() {
        if (currentStep === 1) {
            // On Shipping & Billing, disable until form is valid
            next.disabled = !(billingForm && billingForm.checkValidity());
        } else if (currentStep === 2) {
            // On Payment, disable until form is valid with custom validation
            next.disabled = !(paymentForm && isPaymentFormValid());
        } else {
            // Otherwise always enabled
            next.disabled = false;
        }
    }

    /** Show the panel at `idx`, update buttons, step indicator, and broadcast event */
    function showStep(idx) {
        currentStep = idx;
        panels.forEach((p, i) => p.style.display = i === idx ? '' : 'none');
        steps.forEach((s, i) => s.classList.toggle('active', i === idx));
        prev.disabled = idx === 0;
        
        if (idx === panels.length - 1) {
            next.textContent = 'Place Order';
            next.id = 'place-order';
        } else {
            next.textContent = 'Next →';
            next.id = 'next-step';
        }

        updateNextState();

        // Broadcast that we've moved to a new step (detail.step is zero‑based)
        document.dispatchEvent(new CustomEvent('checkoutStepChange', {
            detail: { step: currentStep }
        }));
    }

    if (prev) {
        prev.addEventListener('click', () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    }

    if (next) {
        next.addEventListener('click', async () => {
            // If we're on the final step (confirmation), place the order
            if (currentStep === panels.length - 1) {
                await submitOrder();
                return;
            }

            // Prevent advancing if the current form is invalid
            if (currentStep === 1 && billingForm && !billingForm.checkValidity()) {
                billingForm.reportValidity();
                return;
            }
            if (currentStep === 2 && paymentForm && !isPaymentFormValid()) {
                paymentForm.reportValidity();
                return;
            }

            // Advance to next step
            if (currentStep < panels.length - 1) {
                showStep(currentStep + 1);
            }
        });
    }

    // Listen for form validation changes
    document.addEventListener('formValidationChange', updateNextState);

    // Re‑check validity on input so Next toggles live
    if (billingForm) {
        billingForm.addEventListener('input', updateNextState);
    }
    if (paymentForm) {
        // Use a more frequent check for payment form since we have custom validation
        paymentForm.addEventListener('input', () => {
            // Small delay to allow formatting to complete
            setTimeout(updateNextState, 10);
        });
        paymentForm.addEventListener('keyup', () => {
            setTimeout(updateNextState, 10);
        });
    }

    // Kick it off
    showStep(0);
}