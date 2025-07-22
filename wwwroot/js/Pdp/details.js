import { addItemApi, refreshCart } from '/js/Shared/cart.js';

export function zoomLens() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const mainImage = document.getElementById('main-image');
  const lens = document.getElementById('zoom-lens');
  const container = document.querySelector('.zoom-container');

  if (!mainImage || !lens || !container) return;

  container.addEventListener('mousemove', moveLens);
  container.addEventListener('mouseenter', showLens);
  container.addEventListener('mouseleave', hideLens);

  function showLens() {
    lens.style.visibility = 'visible';
    lens.style.backgroundImage = `url(${mainImage.src})`;
    const zoomScale = 2.0;
    lens.style.backgroundSize = `${mainImage.width * zoomScale}px ${mainImage.height * zoomScale}px`;
  }

  function hideLens() {
    lens.style.visibility = 'hidden';
  }

  function moveLens(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - lens.offsetWidth / 2;
    const y = e.clientY - rect.top - lens.offsetHeight / 2;

    const boundedX = Math.max(0, Math.min(x, container.offsetWidth - lens.offsetWidth));
    const boundedY = Math.max(0, Math.min(y, container.offsetHeight - lens.offsetHeight));

    lens.style.left = `${boundedX}px`;
    lens.style.top = `${boundedY}px`;

    const zoomScale = 2.0;
    const bgX = -(boundedX * zoomScale - lens.offsetWidth / 2);
    const bgY = -(boundedY * zoomScale - lens.offsetHeight / 2);

    lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
  }
}

export function initPdp() {
  const container = document.getElementById('pdp-container');
  if (!container) return;

  const productId = Number(container.dataset.productId);
  const variantSelect = container.querySelector('#variant-select');
  const mainImage = container.querySelector('#main-image');
  const priceEl = container.querySelector('#pdp-price');
  const qtyInput = container.querySelector('#pdp-quantity');
  const addBtn = container.querySelector('#pdp-add-to-cart');
  const lens = container.querySelector('#zoom-lens');

  if (!variantSelect || !mainImage || !priceEl || !qtyInput || !addBtn) return;

  qtyInput.addEventListener('keydown', e => {
    const invalidKeys = ['e', 'E', '+', '-', '.'];
    if (invalidKeys.includes(e.key)) e.preventDefault();
  });

  function updatePdp() {
    const opt = variantSelect.selectedOptions[0];
    const price = parseFloat(opt.dataset.price) || 0;
    const stock = parseInt(opt.dataset.stock, 10) || 0;
    const variantId = opt.value;

    priceEl.textContent = price.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD'
    });

    qtyInput.max = stock;
    qtyInput.value = Math.min(parseInt(qtyInput.value) || 1, stock);
    addBtn.disabled = stock <= 0;

    const imageElement = container.querySelector(`.thumb[data-variant-id="${variantId}"][data-url]`);
    if (imageElement && imageElement.dataset.url) {
      const newSrc = imageElement.dataset.url;
      mainImage.src = newSrc;
      if (lens) lens.style.backgroundImage = `url(${newSrc})`;

      // Re-highlight the matching thumbnail
      container.querySelectorAll('.thumb-wrapper').forEach(wrapper => {
        wrapper.classList.remove('active');
      });

      const allThumbs = container.querySelectorAll(`.thumb[data-variant-id="${variantId}"]`);
      for (const thumb of allThumbs) {
        if (thumb.dataset.url === newSrc) {
          thumb.closest('.thumb-wrapper')?.classList.add('active');
          break;
        }
      }
    }

  }

  variantSelect.addEventListener('change', updatePdp);

  addBtn.addEventListener('click', async () => {
    const opt = variantSelect.selectedOptions[0];
    const attribute = opt.dataset.attribute || '';
    const quantity = parseInt(qtyInput.value, 10) || 1;
    const customTextInput = container.querySelector('input[name="customText"]');
    const customText = customTextInput?.value ?? null;

    addBtn.disabled = true;
    const originalText = addBtn.textContent;
    addBtn.textContent = 'Adding...';

    try {
      await addItemApi({ id: productId, attribute, quantity, customText });
      await refreshCart();

      addBtn.classList.add('success');
      addBtn.textContent = 'Added!';
      setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.classList.remove('success');
        addBtn.disabled = false;
      }, 1200);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      addBtn.textContent = 'Error!';
      setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.disabled = false;
      }, 2000);
    }
  });


  container.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (thumb.dataset.disabled === 'true') return; 

      const variantId = thumb.dataset.variantId;
      const imgUrl = thumb.dataset.url;

      if (imgUrl) {
        mainImage.src = imgUrl;
        if (lens) lens.style.backgroundImage = `url(${imgUrl})`;
      }

      const optionToSelect = Array.from(variantSelect.options).find(
        opt => String(opt.value) === String(variantId)
      );

      if (optionToSelect && !optionToSelect.disabled) {
        variantSelect.value = variantId;
        updatePdp();
      }
    });
  });


  const firstThumb = container.querySelector('.thumb-wrapper');
  if (firstThumb) firstThumb.classList.add('active');

  updatePdp();
}
