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
        console.log(`Updating next state for step ${currentStep}`); // Debug log
        
        if (currentStep === 1) {
            // On Shipping & Billing, disable until form is valid
            const isValid = billingForm && billingForm.checkValidity();
            console.log(`Billing form valid: ${isValid}`); // Debug log
            next.disabled = !isValid;
        } else if (currentStep === 2) {
            // On Payment, disable until form is valid with custom validation
            const isValid = paymentForm && isPaymentFormValid();
            console.log(`Payment form valid: ${isValid}`); // Debug log
            next.disabled = !isValid;
        } else {
            // Otherwise always enabled (cart review and confirmation)
            console.log(`Step ${currentStep}: Next enabled by default`); // Debug log
            next.disabled = false;
        }
        
        console.log(`Next button disabled: ${next.disabled}`); // Debug log
    }

    /** Show the panel at `idx`, update buttons, step indicator, and broadcast event */
    function showStep(idx) {
        console.log(`Showing step ${idx}`); // Debug log
        currentStep = idx;
        
        // Hide all panels, show current one
        panels.forEach((p, i) => {
            p.style.display = i === idx ? 'block' : 'none';
        });
        
        // Update step indicators
        steps.forEach((s, i) => {
            s.classList.toggle('active', i === idx);
        });
        
        // Update Previous button
        prev.disabled = idx === 0;
        
        // Update Next/Place Order button
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

    // Previous button handler
    if (prev) {
        prev.addEventListener('click', () => {
            console.log('Previous button clicked');
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    }

    // Next button handler
    if (next) {
        next.addEventListener('click', async (e) => {
            console.log(`Next button clicked on step ${currentStep}`);
            e.preventDefault(); // Prevent any default form submission
            
            // If we're on the final step (confirmation), place the order
            if (currentStep === panels.length - 1) {
                console.log('Placing order...');
                await submitOrder();
                return;
            }

            // Validate current step before advancing
            if (currentStep === 1) {
                if (!billingForm) {
                    console.error('Billing form not found!');
                    return;
                }
                if (!billingForm.checkValidity()) {
                    console.log('Billing form invalid, showing validation errors');
                    billingForm.reportValidity();
                    return;
                }
                console.log('Billing form valid, advancing...');
            }
            
            if (currentStep === 2) {
                if (!paymentForm) {
                    console.error('Payment form not found!');
                    return;
                }
                if (!isPaymentFormValid()) {
                    console.log('Payment form invalid, showing validation errors');
                    paymentForm.reportValidity();
                    return;
                }
                console.log('Payment form valid, advancing...');
            }

            // Advance to next step
            if (currentStep < panels.length - 1) {
                showStep(currentStep + 1);
            }
        });
    }

    // Listen for form validation changes
    document.addEventListener('formValidationChange', () => {
        console.log('Form validation change event received');
        updateNextState();
    });

    // Re‑check validity on input so Next toggles live
    if (billingForm) {
        billingForm.addEventListener('input', (e) => {
            console.log('Billing form input changed:', e.target.name);
            updateNextState();
        });
        
        // Also listen for change events (for dropdowns, etc.)
        billingForm.addEventListener('change', (e) => {
            console.log('Billing form change:', e.target.name);
            updateNextState();
        });
    }
    
    if (paymentForm) {
        // Use a more frequent check for payment form since we have custom validation
        paymentForm.addEventListener('input', (e) => {
            console.log('Payment form input changed:', e.target.name);
            // Small delay to allow formatting to complete
            setTimeout(updateNextState, 10);
        });
        
        paymentForm.addEventListener('keyup', (e) => {
            console.log('Payment form keyup:', e.target.name);
            setTimeout(updateNextState, 10);
        });
        
        paymentForm.addEventListener('change', (e) => {
            console.log('Payment form change:', e.target.name);
            setTimeout(updateNextState, 10);
        });
    }

    // Initialize - show first step
    console.log('Initializing stepper...');
    showStep(0);
    
    // Log some debug info
    console.log(`Found ${panels.length} panels and ${steps.length} steps`);
    console.log('Billing form:', billingForm);
    console.log('Payment form:', paymentForm);
}