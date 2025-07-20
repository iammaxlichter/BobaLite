// wwwroot/js/Checkout/cartReview.js

let cartItems = [];
let cartTotal = 0;

/**
 * Loads the cart from the server, renders it, and updates the Next button state.
 */
export async function loadCartReview() {
  const resp  = await fetch('/api/cart');
  if (!resp.ok) throw new Error('Could not load cart');
  const dto   = await resp.json();

  const listEl  = document.getElementById('checkout-cart-items');
  const totEl   = document.getElementById('checkout-cart-total');
  const nextBtn = document.getElementById('next-step');
  if (!listEl || !totEl || !nextBtn) return;

  // build our cartItems & total
  cartItems = dto.items.map(i => ({
    productId: i.productId,
    attribute: i.attribute,
    quantity:  i.quantity,
    name:      i.productName,
    price:     i.unitPrice,
    img:       i.imageUrl
  }));
  cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (cartItems.length > 0) {
    // render each cart item with image
    listEl.innerHTML = cartItems
      .map(i => `
        <div class="checkout-review-item">
          <img src="${i.img}" alt="${i.name}" class="review-img" />
          <div class="review-details">
            ${i.name} (${i.attribute}) × ${i.quantity} — $${(i.price * i.quantity).toFixed(2)}
          </div>
        </div>`)
      .join('');

    // remove “Go to Shop” if present
    const existing = document.getElementById('go-shop');
    if (existing) existing.remove();

    // enable Next button
    nextBtn.disabled = false;
  } else {
    // empty cart message
    listEl.innerHTML = '<div class="empty-msg">Your cart is empty.</div>';
    nextBtn.disabled = true;

    // add “Go to Shop” button if missing
    if (!document.getElementById('go-shop')) {
      const btn = document.createElement('button');
      btn.id        = 'go-shop';
      btn.className = 'go-shop-btn';
      btn.textContent = 'Go to Shop';
      btn.onclick   = () => window.location.href = '/Shop';
      nextBtn.parentElement.appendChild(btn);
    }
  }

  // always update the total display
  totEl.textContent = `$${cartTotal.toFixed(2)}`;
}

/**
 * Returns the current cart items in memory.
 */
export function getCartItems() {
  return cartItems;
}

/**
 * Clears the cart both server-side and client-side,
 * then re-renders an empty cart state.
 */
export async function clearCart() {
  // 1) Clear server-side cart
  await fetch('/api/cart', { method: 'DELETE' });

  // 2) Clear client-side data
  cartItems = [];
  cartTotal = 0;

  const listEl  = document.getElementById('checkout-cart-items');
  const totEl   = document.getElementById('checkout-cart-total');
  const nextBtn = document.getElementById('next-step');

  if (listEl) listEl.innerHTML = '<div class="empty-msg">Your cart is empty.</div>';
  if (totEl)  totEl.textContent = '$0.00';
  if (nextBtn) {
    nextBtn.disabled = true;
    // remove Go to Shop button if it was previously added
    const goShop = document.getElementById('go-shop');
    if (goShop) goShop.remove();
  }
}
