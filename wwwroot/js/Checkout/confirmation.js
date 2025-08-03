// wwwroot/js/Checkout/confirmation.js

import { getCartItems } from './cartReview.js';
import { getShippingData } from './shippingForm.js';
import { getPaymentData } from './paymentForm.js';
import { clearCartApi } from '../Shared/cart.js';

/**
 * Initializes the confirmation panel.
 * Renders the summary when reaching step 4 of checkout.
 */
export function initConfirmation() {
    const summaryEl = document.getElementById('confirmation-summary');
    if (!summaryEl) return;

    document.addEventListener('checkoutStepChange', e => {
        if (e.detail.step === 3) renderSummary();
    });
}

/**
 * Submits the order to the server and handles response.
 * Validates payment, shipping, and billing information before posting.
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
        const shippingAddress = getShippingData();
        const billingAddress = payData.useBillingAsShipping ? shippingAddress : payData.billing;

        if (!payData.cardNumber || !payData.expiry || !payData.cvc) {
            throw new Error('Payment information is incomplete');
        }
        if (!isAddressComplete(shippingAddress)) {
            throw new Error('Shipping address is incomplete');
        }
        if (!payData.useBillingAsShipping && !isAddressComplete(billingAddress)) {
            throw new Error('Billing address is incomplete');
        }

        const cartItems = getCartItems();
        const order = buildOrderPayload(cartItems, shippingAddress, billingAddress, payData);

        if (summaryEl) summaryEl.textContent = 'Sending order…';

        const resp = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(order)
        });

        if (resp.ok) {
            await resp.json().catch(() => {});
            await clearCartApi();

            summaryEl.innerHTML = '<p class="success-msg">Thank you! Your order was received. You will be receiving a confirmation email in the next couple of minutes!</p>';

            const placeBtn = document.getElementById('place-order');
            const prevBtn = document.getElementById('prev-step');
            if (placeBtn) placeBtn.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';
        } else {
            if (summaryEl) summaryEl.innerHTML = '<p class="error-msg">Something went wrong. Please try again.</p>';
        }
    } catch (err) {
        if (summaryEl) summaryEl.innerHTML = `<p class="error-msg">Error: ${err.message}</p>`;
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Place Order';
        }
    }
}

/**
 * Renders the summary of items, shipping, billing (if different), payment, and total cost.
 */
function renderSummary() {
    const summaryEl = document.getElementById('confirmation-summary');
    let html = '';

    try {
        const cart = getCartItems();
        const ship = getShippingData();
        const pay = getPaymentData();
        const billData = pay.useBillingAsShipping ? ship : pay.billing;

        html += renderItems(cart);
        html += renderAddress('Shipping', ship);
        if (!pay.useBillingAsShipping) html += renderAddress('Billing', billData);
        html += renderPayment(pay);
        html += renderTotal(cart);
    } catch (err) {
        html = '<p class="error-msg">Error loading order summary</p>';
    }

    summaryEl.innerHTML = html;
}

/**
 * Checks if an address object has all required fields.
 */
function isAddressComplete(address) {
    return address.firstName && address.lastName && address.address1 &&
           address.city && address.state && address.zipCode &&
           address.phone && address.email;
}

/**
 * Builds the order payload to be sent to the server.
 */
function buildOrderPayload(cartItems, shippingAddress, billingAddress, payData) {
    return {
        items: cartItems.map(i => ({
            variantId:   i.variantId,
            attribute: i.attribute || '',
            quantity: i.quantity || 1,
            price: i.price,
            productName: i.name,
            imageUrl: `https://bobalite.onrender.com${i.img}`,
            customText: i.customText || null
        })),
        ShippingAddress: formatAddress(shippingAddress),
        BillingAddress: formatAddress(billingAddress),
        payment: {
            cardFirstName: payData.cardFirstName,
            cardLastName: payData.cardLastName,
            cardNumber: payData.cardNumber.replace(/\s/g, ''),
            expiry: payData.expiry,
            cvc: payData.cvc
        }
    };
}

/**
 * Formats an address object for the order payload.
 */
function formatAddress(addr) {
    return {
        FullName: `${addr.firstName} ${addr.lastName}`,
        Address1: addr.address1,
        Address2: addr.address2 || '',
        City: addr.city,
        State: addr.state,
        PostalCode: addr.zipCode,
        Phone: addr.phone,
        Email: addr.email
    };
}

/**
 * Renders the items section of the confirmation summary.
 */
function renderItems(cart) {
    let html = '<div class="confirm-section"><h4>Items</h4><div class="confirm-items">';
    cart.forEach(i => {
        html += `
            <div class="confirm-item">
                <img src="${i.img || '/images/placeholder.jpg'}" alt="${i.name || 'Item'}" class="confirm-item-img"/>
                <div class="confirm-item-details">
                    <p class="item-name">${i.name || 'Product'}${i.attribute ? ` (${i.attribute})` : ''}</p>
                    <p class="item-qty-price">x ${i.quantity || 1} — $${((i.price || 0) * (i.quantity || 1)).toFixed(2)}</p>
                    ${(i.customText && i.customText.trim()) ? `<p class="item-custom">Message: ${i.customText}</p>` : ''}
                </div>
            </div>`;
    });
    html += '</div></div>';
    return html;
}

/**
 * Renders an address section (Shipping or Billing).
 */
function renderAddress(title, data) {
    let html = `<div class="confirm-section"><h4>${title}</h4><div class="confirm-section-content">`;
    html += `<p>${data.firstName} ${data.lastName}</p>`;
    html += `<p>${data.address1}</p>`;
    if (data.address2) html += `<p>${data.address2}</p>`;
    html += `<p>${data.city}, ${data.state} ${data.zipCode}</p>`;
    html += `<p>${data.phone}</p>`;
    html += `<p>${data.email}</p>`;
    html += '</div></div>';
    return html;
}

/**
 * Renders the payment section of the confirmation summary.
 */
function renderPayment(pay) {
    const digits = pay.cardNumber.replace(/\D/g, '').slice(-4);
    return `
        <div class="confirm-section"><h4>Payment</h4><div class="confirm-section-content">
            <p>Name: ${pay.cardFirstName} ${pay.cardLastName}</p>
            <p>Card: <span class="masked">•••• •••• •••• ${digits}</span></p>
            <p>Expires: ${pay.expiry}</p>
        </div></div>`;
}

/**
 * Renders the total cost section of the confirmation summary.
 */
function renderTotal(cart) {
    const total = cart.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 1)), 0);
    return `
        <div class="confirm-section total-section">
            <h4>Total</h4>
            <p class="total-amount">$${total.toFixed(2)}</p>
        </div>`;
}
