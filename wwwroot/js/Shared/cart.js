/**
 * cart.js
 * 
 * Handles cart state, server synchronization, and UI rendering.
 * Provides APIs for adding, updating, and removing items, as well as managing the cart drawer.
 */

const API_BASE = '/api/cart';
let cart = []; 

/**
 * Fetches the latest cart data from the server and updates the local cart state.
 * Renders the updated cart and updates the cart badge.
 */
async function refreshCart() {
  try {
    const response = await fetch(API_BASE, { method: 'GET' });
    if (!response.ok) throw new Error('Failed to fetch cart');

    const dto = await response.json();
    cart = dto.items.map(item => ({
      id: item.productId,
      name: item.productName,
      attribute: item.attribute,
      qty: item.quantity,
      price: item.unitPrice,
      stock: item.stock ?? Infinity,
      img: item.imageUrl,
      customText: item.customText || null
    }));

    updateCartBadge(cart);
    renderCart();
  } catch (err) {
    console.error('Failed to refresh cart:', err);
  }
}

/**
 * Adds a product variant to the server-side cart.
 * @param {Object} params 
 * @param {number} params.id - Product ID
 * @param {string} params.attribute - Variant attribute
 * @param {number} [params.quantity=1] - Quantity to add
 * @param {string|null} [params.customText=null] - Custom text if applicable
 */
async function addItemApi({ id, attribute, quantity = 1, customText = null }) {
  const body = {
    ProductId: id,
    Attribute: attribute,
    Quantity: quantity
  };

  if (customText) {
    body.CustomText = customText;
  }

  const response = await fetch(`${API_BASE}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error('Failed to add item');
}

/**
 * Updates the quantity of a specific product variant in the cart.
 * @param {Object} params 
 * @param {number} params.id - Product ID
 * @param {string} params.attribute - Variant attribute
 * @param {number} params.qty - New quantity
 * @param {string|null} [params.customText=null] - Custom text to identify the specific item
 */
async function updateQtyApi({ id, attribute, qty, customText = null }) {
  const body = {
    ProductId: id,
    Attribute: attribute,
    Quantity: qty
  };

  if (customText) {
    body.CustomText = customText;
  }

  const response = await fetch(`${API_BASE}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error('Failed to update quantity');
}

/**
 * Removes a specific product variant from the cart.
 * @param {Object} params 
 * @param {number} params.id - Product ID
 * @param {string} params.attribute - Variant attribute
 * @param {string|null} [params.customText=null] - Custom text to identify the specific item
 */
async function removeItemApi({ id, attribute, customText = null }) {
  const body = {
    ProductId: id,
    Attribute: attribute
  };

  if (customText) {
    body.CustomText = customText;
  }

  const response = await fetch(API_BASE, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error('Failed to remove item');
}

/**
 * Clears the cart on the server and immediately updates the local state.
 */
async function clearCartApi() {
  try {
    const response = await fetch('/api/cart/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    clearCartLocal();
  } catch (err) {
    clearCartLocal();
  }
}

/**
 * Clears the local cart state and updates the UI.
 */
function clearCartLocal() {
  cart = [];
  updateCartBadge(cart);
  renderCart();
}

/**
 * Initializes the cart drawer and binds open/close events.
 * @param {Object} config 
 * @param {string} [config.drawerSelector='#cart-drawer'] - Selector for the cart drawer element
 * @param {string} [config.openBtnSelector='#cart-toggle'] - Selector for the button that opens the cart
 * @param {string} [config.closeBtnSelector='#cart-close'] - Selector for the button that closes the cart
 */
export function initCartDrawer({
  drawerSelector = '#cart-drawer',
  openBtnSelector = '#cart-toggle',
  closeBtnSelector = '#cart-close'
} = {}) {
  const drawer = document.querySelector(drawerSelector);
  const openButton = document.querySelector(openBtnSelector);
  const closeButton = document.querySelector(closeBtnSelector);

  if (!drawer || !openButton || !closeButton) return;

  openButton.addEventListener('click', async () => {
    drawer.classList.add('open');
    await refreshCart();
  });

  closeButton.addEventListener('click', () => {
    drawer.classList.remove('open');
  });

  drawer.addEventListener('click', e => {
    if (e.target === drawer) drawer.classList.remove('open');
  });

  refreshCart();
}

/**
 * Renders the cart items, updates the total price, and manages quantity controls.
 */
function renderCart() {
  const listElement = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');
  const checkoutButton = document.querySelector('.checkout-btn');

  if (!listElement || !totalElement || !checkoutButton) return;

  listElement.innerHTML = '';
  let grandTotal = 0;

  if (cart.length === 0) {
    listElement.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
    totalElement.textContent = '$0.00';
    checkoutButton.disabled = true;
    return;
  }

  checkoutButton.disabled = false;

  cart.forEach(item => {
    const lineTotal = item.price * item.qty;
    grandTotal += lineTotal;

    const listItem = document.createElement('li');
    listItem.className = 'cart-item';
    listItem.innerHTML = `
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

    listElement.appendChild(listItem);

    const decreaseButton = listItem.querySelector('.qty-decrease');
    const increaseButton = listItem.querySelector('.qty-increase');
    const removeButton = listItem.querySelector('.remove-item');

    decreaseButton.onclick = async () => {
      const newQty = item.qty - 1;
      if (newQty < 1) {
        await removeItemApi({ 
          id: item.id, 
          attribute: item.attribute, 
          customText: item.customText 
        });
      } else {
        await updateQtyApi({ 
          id: item.id, 
          attribute: item.attribute, 
          qty: newQty, 
          customText: item.customText 
        });
      }
      await refreshCart();
    };

    increaseButton.onclick = async () => {
      await updateQtyApi({ 
        id: item.id, 
        attribute: item.attribute, 
        qty: item.qty + 1, 
        customText: item.customText 
      });
      await refreshCart();
    };

    removeButton.onclick = async () => {
      await removeItemApi({ 
        id: item.id, 
        attribute: item.attribute, 
        customText: item.customText 
      });
      await refreshCart();
    };

    if (item.qty >= item.stock) {
      increaseButton.disabled = true;
    }
  });

  totalElement.textContent = `$${grandTotal.toFixed(2)}`;

  checkoutButton.onclick = () => {
    window.location.href = '/Checkout';
  };
}

/**
 * Updates the cart badge with the total quantity of items.
 * @param {Array} cartItems - List of cart items
 */
function updateCartBadge(cartItems) {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalQty > 0 ? totalQty : '';
}

export { refreshCart, addItemApi, updateQtyApi, removeItemApi, clearCartApi, clearCartLocal };