/**
 * Initializes payment form validation and field behavior.
 * - Formats and validates card number, expiry date, and CVC.
 * - Formats billing phone number.
 * - Toggles billing address fields when "Same as shipping" is checked.
 */
export function initPaymentForm() {
    const form = document.getElementById('payment-form');
    if (!form) return;

    const cardInput = form.querySelector('input[name="cardNumber"]');
    if (cardInput) {
        cardInput.maxLength = 19;
        cardInput.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 16);
            const groups = v.match(/.{1,4}/g);
            e.target.value = groups ? groups.join(' ') : v;
            e.target.setCustomValidity(v.length < 16 ? 'Card number must be 16 digits' : '');
            document.dispatchEvent(new Event('formValidationChange'));
        });
    }

    const expiryInput = form.querySelector('input[name="expiry"]');
    if (expiryInput) {
        expiryInput.maxLength = 5;
        expiryInput.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 4);
            if (v.length >= 2) {
                let m = Math.min(12, Math.max(1, parseInt(v.slice(0, 2), 10)));
                v = (m < 10 ? '0' : '') + m + v.slice(2);
            }
            if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
            e.target.value = v;

            if (v.length < 5) {
                e.target.setCustomValidity('Expiry must be in MM/YY format');
            } else {
                const [mo, yr] = v.split('/').map(n => parseInt(n, 10));
                const now = new Date();
                const cy = now.getFullYear() % 100;
                const cm = now.getMonth() + 1;
                e.target.setCustomValidity(
                    yr < cy || (yr === cy && mo < cm) ? 'Card has expired' : ''
                );
            }
            document.dispatchEvent(new Event('formValidationChange'));
        });
    }

    const cvcInput = form.querySelector('input[name="cvc"]');
    if (cvcInput) {
        cvcInput.maxLength = 3;
        cvcInput.addEventListener('input', e => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
            e.target.setCustomValidity(
                e.target.value.length < 3 ? 'CVC must be 3 digits' : ''
            );
            document.dispatchEvent(new Event('formValidationChange'));
        });
    }

    const billingPhoneInput = form.querySelector('[name="billingPhone"]');
    if (billingPhoneInput) {
        billingPhoneInput.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 10);
            if (v.length >= 6) {
                v = `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6)}`;
            } else if (v.length >= 3) {
                v = `(${v.slice(0, 3)}) ${v.slice(3)}`;
            }
            e.target.value = v;
        });
    }

    const billingSame = form.querySelector('#billing-same');
    const billingFields = form.querySelector('#billing-address-fields');
    if (billingSame && billingFields) {
        billingSame.addEventListener('change', () => {
            const show = !billingSame.checked;
            billingFields.style.display = show ? '' : 'none';
            billingFields.querySelectorAll('input').forEach(i => {
                if (i.name !== 'billingAddress2') i.required = show;
            });
            form.dispatchEvent(new Event('input'));
            document.dispatchEvent(new Event('formValidationChange'));
        });

        billingSame.dispatchEvent(new Event('change'));
    }
}

/**
 * Gathers all payment and billing data from the form.
 * @returns {Object} Payment and billing information.
 */
export function getPaymentData() {
    const f = document.getElementById('payment-form');
    if (!f) return {};

    const useBillingAsShipping = f.querySelector('#billing-same')?.checked || false;

    const billing = {
        firstName: f.querySelector('input[name="billingFirstName"]')?.value.trim() || '',
        lastName: f.querySelector('input[name="billingLastName"]')?.value.trim() || '',
        address1: f.querySelector('input[name="billingAddress1"]')?.value.trim() || '',
        address2: f.querySelector('input[name="billingAddress2"]')?.value.trim() || '',
        city: f.querySelector('input[name="billingCity"]')?.value.trim() || '',
        state: f.querySelector('input[name="billingState"]')?.value.trim() || '',
        zipCode: f.querySelector('input[name="billingZipCode"]')?.value.trim() || '',
        phone: f.querySelector('input[name="billingPhone"]')?.value.trim() || '',
        email: f.querySelector('input[name="billingEmail"]')?.value.trim() || '',
    };

    return {
        cardFirstName: f.querySelector('input[name="cardFirstName"]')?.value.trim() || '',
        cardLastName: f.querySelector('input[name="cardLastName"]')?.value.trim() || '',
        cardNumber: f.querySelector('[name="cardNumber"]')?.value.trim() || '',
        expiry: f.querySelector('[name="expiry"]')?.value.trim() || '',
        cvc: f.querySelector('[name="cvc"]')?.value.trim() || '',
        useBillingAsShipping,
        billing
    };
}

/**
 * Validates the payment form fields.
 * @returns {boolean} True if valid, false otherwise.
 */
export function isPaymentFormValid() {
    const form = document.getElementById('payment-form');
    if (!form) return false;

    const cardNumberInput = form.querySelector('[name="cardNumber"]');
    const expiryInput = form.querySelector('[name="expiry"]');
    const cvcInput = form.querySelector('[name="cvc"]');

    if (!cardNumberInput || !expiryInput || !cvcInput) return false;

    const num = cardNumberInput.value.replace(/\D/g, '');
    const exp = expiryInput.value;
    const cvc = cvcInput.value;

    if (num.length !== 16) return false;
    if (!/^\d\d\/\d\d$/.test(exp)) return false;

    const [mo, yr] = exp.split('/').map(n => parseInt(n, 10));
    const now = new Date();
    const cy = now.getFullYear() % 100;
    const cm = now.getMonth() + 1;

    if (yr < cy || (yr === cy && mo < cm)) return false;
    if (cvc.length !== 3) return false;

    const billingSame = form.querySelector('#billing-same');
    if (billingSame && !billingSame.checked) {
        const requiredBillingFields = [
            'billingFirstName', 'billingLastName', 'billingAddress1',
            'billingCity', 'billingState', 'billingZipCode', 'billingPhone', 'billingEmail'
        ];
        for (const fieldName of requiredBillingFields) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field && !field.value.trim()) return false;
        }
    }

    return form.checkValidity();
}
