// wwwroot/js/Checkout/confirmation.js

import { getCartItems } from './cartReview.js';
import { getBillingData } from './billingForm.js';
import { getPaymentData } from './paymentForm.js';
import { clearCartApi } from '../Shared/cart.js';

/**
 * Initializes the confirmation panel: renders the summary when we hit step 4.
 * The stepper handles the "Place Order" button functionality.
 */
export function initConfirmation() {
    const summaryEl = document.getElementById('confirmation-summary');
    if (!summaryEl) return;

    document.addEventListener('checkoutStepChange', e => {
        // step index 3 === 4th panel === Confirmation
        if (e.detail.step === 3) {
            renderSummary();
        }
    });
}

/**
 * Handles the order submission - called by the stepper's Place Order button
 */
export async function submitOrder() {
    const summaryEl = document.getElementById('confirmation-summary');
    const btn = document.getElementById('place-order');

    try {
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Processing...';
        }

        const payData = getPaymentData();
        const shippingAddress = getBillingData();
        const billingAddress = payData.useBillingAsShipping
            ? shippingAddress
            : payData.billing;

        // ─── Basic Validation ─────────────────────────────
        if (!payData.cardNumber || !payData.expiry || !payData.cvc) {
            throw new Error('Payment information is incomplete');
        }
        if (
            !shippingAddress.firstName ||
            !shippingAddress.lastName ||
            !shippingAddress.address1 ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.zipCode ||
            !shippingAddress.phone ||
            !shippingAddress.email
        ) {
            throw new Error('Shipping address is incomplete');
        }
        if (!payData.useBillingAsShipping) {
            if (
                !billingAddress.firstName ||
                !billingAddress.lastName ||
                !billingAddress.address1 ||
                !billingAddress.city ||
                !billingAddress.state ||
                !billingAddress.zipCode ||
                !billingAddress.phone ||
                !billingAddress.email
            ) {
                throw new Error('Billing address is incomplete');
            }
        }

        // ─── Build Order Payload ───────────────────────────
        const order = {
            items: getCartItems().map(i => ({
                variantId: i.productId || i.id,
                attribute: i.attribute || '',
                quantity: i.quantity || 1
            })),
            ShippingAddress: {
                FullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                Address1: shippingAddress.address1,
                Address2: shippingAddress.address2 || '',
                City: shippingAddress.city,
                State: shippingAddress.state,
                PostalCode: shippingAddress.zipCode,
                Phone: shippingAddress.phone,
                Email: shippingAddress.email
            },
            BillingAddress: {
                FullName: `${billingAddress.firstName} ${billingAddress.lastName}`,
                Address1: billingAddress.address1,
                Address2: billingAddress.address2 || '',
                City: billingAddress.city,
                State: billingAddress.state,
                PostalCode: billingAddress.zipCode,
                Phone: billingAddress.phone,
                Email: billingAddress.email
            },
            payment: {
                cardNumber: payData.cardNumber.replace(/\s/g, ''),
                expiry: payData.expiry,
                cvc: payData.cvc
            }
        };

        console.log('ORDER PAYLOAD:', JSON.stringify(order, null, 2));
        if (summaryEl) {
            summaryEl.textContent = 'Sending order…';
        }

        const resp = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (resp.ok) {
            await resp.json().catch(() => { });

            // FIRST: Clear the cart immediately (both server and local)
            await clearCartApi();

            // THEN: Show success message and hide buttons
            summaryEl.innerHTML = '<p class="success-msg">Thank you! Your order was received. You will be receiving a confirmation email in the next couple of minutes!</p>';
            console.log('Order successful');

            const placeBtn = document.getElementById('place-order');
            const prevBtn = document.getElementById('prev-step');
            if (placeBtn) placeBtn.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';

            return;
        } else {
            const errText = await resp.text().catch(() => 'Unknown error');
            console.error('Order failed:', resp.status, errText);
            if (summaryEl) {
                summaryEl.innerHTML = '<p class="error-msg">Something went wrong. Please try again.</p>';
            }
        }

    } catch (err) {
        console.error('Order error:', err);
        if (summaryEl) {
            summaryEl.innerHTML = `<p class="error-msg">Error: ${err.message}</p>`;
        }
    } finally {
        // restore button
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Place Order';
        }
    }
}

/**
 * Renders the summary of items, shipping, (optional) billing, payment, and total.
 */
function renderSummary() {
    const summaryEl = document.getElementById('confirmation-summary');
    let html = '';
    try {
        const cart = getCartItems();
        const ship = getBillingData();
        const pay = getPaymentData();
        const billData = pay.useBillingAsShipping ? ship : pay.billing;

        // Items
        html += '<div class="confirm-section"><h4>Items</h4><div class="confirm-items">';
        cart.forEach(i => {
            html += `
        <div class="confirm-item">
          <img src="${i.img || '/images/placeholder.jpg'}"
               alt="${i.name || 'Item'}"
               class="confirm-item-img"/>
          <div class="confirm-item-details">
            <p class="item-name">
              ${i.name || 'Product'}${i.attribute ? ` (${i.attribute})` : ''}
            </p>
            <p class="item-qty-price">
              × ${i.quantity || 1} — $${((i.price || 0) * (i.quantity || 1)).toFixed(2)}
            </p>
          </div>
        </div>`;
        });
        html += '</div></div>';

        // Shipping
        html += '<div class="confirm-section"><h4>Shipping</h4><div class="confirm-section-content">';
        html += `<p>${ship.firstName} ${ship.lastName}</p>`;
        html += `<p>${ship.address1}</p>`;
        if (ship.address2) html += `<p>${ship.address2}</p>`;
        html += `<p>${ship.city}, ${ship.state} ${ship.zipCode}</p>`;
        html += `<p>${ship.phone}</p>`;
        html += `<p>${ship.email}</p>`;
        html += '</div></div>';

        // Billing (if different)
        if (!pay.useBillingAsShipping) {
            html += '<div class="confirm-section"><h4>Billing</h4><div class="confirm-section-content">';
            html += `<p>${billData.firstName} ${billData.lastName}</p>`;
            html += `<p>${billData.address1}</p>`;
            if (billData.address2) html += `<p>${billData.address2}</p>`;
            html += `<p>${billData.city}, ${billData.state} ${billData.zipCode}</p>`;
            html += `<p>${billData.phone}</p>`;
            html += `<p>${billData.email}</p>`;
            html += '</div></div>';
        }

        // Payment
        const digits = pay.cardNumber.replace(/\D/g, '').slice(-4);
        html += '<div class="confirm-section"><h4>Payment</h4><div class="confirm-section-content">';
        html += `<p>Card: <span class="masked">•••• •••• •••• ${digits}</span></p>`;
        html += `<p>Expires: ${pay.expiry}</p>`;
        html += '</div></div>';

        // Total
        const total = cart.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 1)), 0);
        html += '<div class="confirm-section total-section">';
        html += `<h4>Total</h4><p class="total-amount">$${total.toFixed(2)}</p>`;
        html += '</div>';

    } catch (err) {
        console.error('Error rendering summary:', err);
        html = '<p class="error-msg">Error loading order summary</p>';
    }

    summaryEl.innerHTML = html;
}