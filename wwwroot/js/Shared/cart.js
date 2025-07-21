// wwwroot/js/Shared/cart.js

const API_BASE = '/api/cart';
let cart = []; // in-memory mirror of server cart

// ─── API CALLS ─────────────────────────────────────────────

/** Pull the latest cart DTO from server and update our local `cart` */
async function refreshCart() {
  try {
    const resp = await fetch(API_BASE, { method: 'GET' });
    if (!resp.ok) throw new Error('Failed to fetch cart');
    const dto = await resp.json();
    // Map server DTO → our internal shape
    cart = dto.items.map(i => ({
      id: i.productId,
      name: i.productName,
      attribute: i.attribute,
      qty: i.quantity,
      price: i.unitPrice,
      stock: i.stock ?? Infinity, 
      img: i.imageUrl,
      customText: i.customText || null
    }));
    updateCartBadge(cart);
    renderCart();
  } catch (err) {
    console.error('refreshCart:', err);
  }
}

/** Tell server to add 1 of this variant */
async function addItemApi({ id, attribute, quantity = 1, customText = null }) {
  const body = {
    ProductId: id,        // ✅ Changed to PascalCase
    Attribute: attribute, // ✅ Changed to PascalCase
    Quantity: quantity,   // ✅ Changed to PascalCase
  };

  if (customText) {
    body.CustomText = customText; // ✅ Changed to PascalCase
  }

  const resp = await fetch(`${API_BASE}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!resp.ok) throw new Error('Failed to add item');
}

/** Tell server to update quantity */
async function updateQtyApi({ id, attribute, qty }) {
  const resp = await fetch(`${API_BASE}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: id, attribute, quantity: qty })
  });
  if (!resp.ok) throw new Error('Failed to update quantity');
}


/** Tell server to remove this variant entirely */
async function removeItemApi({ id, attribute }) {
  const resp = await fetch(API_BASE, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: id, attribute })
  });
  if (!resp.ok) throw new Error('Failed to remove item');
}

/** Clear cart on server and immediately update local state */
async function clearCartApi() {
  try {
    const resp = await fetch('/api/cart/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (!resp.ok) {
      console.warn('Failed to clear cart on server:', resp.status);
    }
    // Immediately clear local cart regardless of server response
    clearCartLocal();
  } catch (err) {
    console.warn('Error clearing cart:', err);
    // Still clear local cart even if server request fails
    clearCartLocal();
  }
}

/** Immediately clear local cart state and update UI */
function clearCartLocal() {
  cart = [];
  updateCartBadge(cart);
  renderCart();
}

// ─── DRAWER INITIALIZATION ─────────────────────────────────

export function initCartDrawer({
  drawerSelector = '#cart-drawer',
  openBtnSelector = '#cart-toggle',
  closeBtnSelector = '#cart-close'
} = {}) {
  const drawer = document.querySelector(drawerSelector);
  const openBtn = document.querySelector(openBtnSelector);
  const closeBtn = document.querySelector(closeBtnSelector);
  if (!drawer || !openBtn || !closeBtn) return;

  openBtn.addEventListener('click', async () => {
    drawer.classList.add('open');
    await refreshCart();
  });

  closeBtn.addEventListener('click', () => {
    drawer.classList.remove('open');
  });

  drawer.addEventListener('click', e => {
    if (e.target === drawer) drawer.classList.remove('open');
  });

  // bootstrap on page load
  refreshCart();
}

// ─── RENDERING ──────────────────────────────────────────────

function renderCart() {
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const checkout = document.querySelector('.checkout-btn');
  if (!list || !totalEl || !checkout) return;

  list.innerHTML = '';
  let grandTotal = 0;

  if (cart.length === 0) {
    list.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
    totalEl.textContent = '$0.00';
    checkout.disabled = true;
    return;
  }

  checkout.disabled = false;

  cart.forEach(item => {
    const lineTotal = item.price * item.qty;
    grandTotal += lineTotal;

    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">(${item.attribute})</div>
        <div class="cart-item-price">$${lineTotal.toFixed(2)}</div>
        ${item.customText ? `<div class="cart-item-custom">"${item.customText}"</div>` : ''}
        <div class="cart-item-actions">
          <div class="cart-item-qty">
            <button class="qty-decrease">−</button>
            <span>${item.qty}</span>
            <button class="qty-increase">+</button>
          </div>
          <button class="remove-item">✕</button>
        </div>
      </div>`;

    list.appendChild(li);

    // wire up the buttons
    const decBtn = li.querySelector('.qty-decrease');
    const incBtn = li.querySelector('.qty-increase');
    const remBtn = li.querySelector('.remove-item');

    decBtn.onclick = async () => {
      const newQty = item.qty - 1;
      if (newQty < 1) {
        await removeItemApi(item);
      } else {
        await updateQtyApi({ ...item, qty: newQty });
      }
      await refreshCart();
    };

    incBtn.onclick = async () => {
      await updateQtyApi({ ...item, qty: item.qty + 1 });
      await refreshCart();
    };

    remBtn.onclick = async () => {
      await removeItemApi(item);
      await refreshCart();
    };

    // optionally disable "+" if at stock cap
    if (item.qty >= item.stock) {
      incBtn.disabled = true;
    }
  });

  totalEl.textContent = `$${grandTotal.toFixed(2)}`;

  checkout.onclick = () => {
    window.location.href = '/Checkout';
  };
}

function updateCartBadge(cartItems) {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalQty > 0 ? totalQty : '';
}

export { refreshCart, addItemApi, updateQtyApi, removeItemApi, clearCartApi, clearCartLocal };