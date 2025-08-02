// wwwroot/js/Checkout/stepper.js
import { isPaymentFormValid } from './paymentForm.js';
import { submitOrder } from './confirmation.js';

/**
 * Initializes the checkout stepper functionality:
 * - Controls navigation between steps.
 * - Validates forms at each step.
 * - Updates button states and triggers order submission.
 */
export function initCheckoutStepper() {
    const panels = Array.from(document.querySelectorAll('.checkout-panel'));
    const steps = Array.from(document.querySelectorAll('.checkout-steps li'));
    const prev = document.getElementById('prev-step');
    const next = document.getElementById('next-step');
    let currentStep = 0;

    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');

    /**
     * Updates the "Next" button's enabled/disabled state:
     * - Step 1: Requires shipping form validity.
     * - Step 2: Requires payment form validity.
     * - Other steps: Always enabled.
     */
    function updateNextState() {

        if (currentStep === 1) {
            const isValid = shippingForm && shippingForm.checkValidity();
            next.disabled = !isValid;
        } else if (currentStep === 2) {
            const isValid = paymentForm && isPaymentFormValid();
            next.disabled = !isValid;
        } else {
            next.disabled = false;
        }
    }

    /**
     * Displays the panel for the specified step:
     * - Hides other panels and updates step indicators.
     * - Updates button labels and states.
     * - Triggers a custom event for step change.
     */
    function showStep(idx) {
        currentStep = idx;

        panels.forEach((p, i) => (p.style.display = i === idx ? 'block' : 'none'));
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

        document.dispatchEvent(new CustomEvent('checkoutStepChange', {
            detail: { step: currentStep }
        }));
    }

    /**
     * Handles the Previous button click:
     * - Moves one step backward if not already at the first step.
     */
    if (prev) {
        prev.addEventListener('click', () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    }

    /**
     * Handles the Next button click:
     * - If at the last step, submits the order.
     * - Validates forms before advancing.
     */
    if (next) {
        next.addEventListener('click', async (e) => {
            e.preventDefault();

            if (currentStep === panels.length - 1) {
                await submitOrder();
                return;
            }

            if (currentStep === 1) {
                if (!shippingForm) {
                    return;
                }
                if (!shippingForm.checkValidity()) {
                    shippingForm.reportValidity();
                    return;
                }
            }

            if (currentStep === 2) {
                if (!paymentForm) {
                    return;
                }
                if (!isPaymentFormValid()) {
                    paymentForm.reportValidity();
                    return;
                }
            }

            if (currentStep < panels.length - 1) {
                showStep(currentStep + 1);
            }
        });
    }

    /**
     * Listens for a custom validation change event:
     * - Updates the Next button whenever form validity changes externally.
     */
    document.addEventListener('formValidationChange', () => {
        updateNextState();
    });

    /**
     * Sets up live validation for the billing form:
     * - Updates the Next button on input and change events.
     */
    if (shippingForm) {
        shippingForm.addEventListener('input', (e) => {
            updateNextState();
        });

        shippingForm.addEventListener('change', (e) => {
            updateNextState();
        });
    }

    /**
     * Initializes the stepper:
     * - Shows the first step.
     * - Logs initial debug information.
     */
    showStep(0);
}
