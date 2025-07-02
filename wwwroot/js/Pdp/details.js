import { addItemApi } from '/js/Shared/cart.js';

export function initPdp() {
  const container     = document.getElementById('pdp-container');
  if (!container) return;

  const productId     = Number(container.dataset.productId);
  const variantSelect = container.querySelector('#variant-select');
  const mainImage     = container.querySelector('#main-image');
  const priceEl       = container.querySelector('#pdp-price');
  const stockEl       = container.querySelector('#pdp-stock');
  const qtyInput      = container.querySelector('#pdp-quantity');
  const addBtn        = container.querySelector('#pdp-add-to-cart');

  if (!variantSelect || !mainImage || !priceEl || !stockEl || !qtyInput || !addBtn) {
    return;
  }

  function updatePdp() {
    const opt       = variantSelect.selectedOptions[0];
    const price     = parseFloat(opt.dataset.price) || 0;
    const stock     = parseInt(opt.dataset.stock, 10) || 0;
    const variantId = opt.value;

    priceEl.textContent = price.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD'
    });

    stockEl.textContent = stock > 0
      ? `${stock} in stock`
      : 'Out of stock';

    qtyInput.max     = stock;
    qtyInput.value   = Math.min(parseInt(qtyInput.value) || 1, stock);
    addBtn.disabled  = stock <= 0;

    const thumb = container.querySelector(
      `.thumb[data-variant-id='${variantId}']`
    );
    if (thumb && thumb.dataset.url) {
      mainImage.src = thumb.dataset.url;
    }
  }

  variantSelect.addEventListener('change', updatePdp);

  addBtn.addEventListener('click', async () => {
    const attribute = variantSelect.selectedOptions[0].dataset.attribute || '';
    const quantity  = parseInt(qtyInput.value, 10) || 1;
    await addItemApi({ id: productId, attribute, quantity });
  });

  // initialize the UI state
  updatePdp();
}
