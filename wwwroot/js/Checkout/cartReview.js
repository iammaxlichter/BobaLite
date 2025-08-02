let cartItems = [];
let cartTotal = 0;

/**
 * Loads the cart review section, rendering items, total cost, and updating UI state.
 */
export async function loadCartReview() {
    const resp = await fetch('/api/cart');
    if (!resp.ok) throw new Error('Could not load cart');
    const dto = await resp.json();

    const listEl = document.getElementById('checkout-cart-items');
    const totEl = document.getElementById('checkout-cart-total');
    const nextBtn = document.getElementById('next-step');
    if (!listEl || !totEl || !nextBtn) return;

    cartItems = dto.items.map(i => ({
        productId: i.productId,
        attribute: i.attribute,
        quantity: i.quantity,
        name: i.productName,
        price: i.unitPrice,
        img: i.imageUrl,
        customText: i.customText || ''
    }));

    cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (cartItems.length > 0) {
        listEl.innerHTML = cartItems
            .map(i => `
                <div class="checkout-review-item">
                    <img src="${i.img}" alt="${i.name}" class="review-img" />
                    <div class="review-details">
                        ${i.name} (${i.attribute}) × ${i.quantity} — $${(i.price * i.quantity).toFixed(2)}
                        ${i.customText ? `<div class="custom-message">Message: ${i.customText}</div>` : ''}
                    </div>
                </div>
            `)
            .join('');

        const existing = document.getElementById('go-shop');
        if (existing) existing.remove();

        nextBtn.disabled = false;
    } else {
        listEl.innerHTML = '<div class="empty-msg">Your cart is empty.</div>';
        nextBtn.disabled = true;

        if (!document.getElementById('go-shop')) {
            const btn = document.createElement('button');
            btn.id = 'go-shop';
            btn.className = 'go-shop-btn';
            btn.textContent = 'Go to Shop';
            btn.onclick = () => (window.location.href = '/Shop');
            nextBtn.parentElement.appendChild(btn);
        }
    }

    totEl.textContent = `$${cartTotal.toFixed(2)}`;
}

/**
 * Returns the current cart items.
 * @returns {Array} Array of cart item objects.
 */
export function getCartItems() {
    return cartItems;
}
