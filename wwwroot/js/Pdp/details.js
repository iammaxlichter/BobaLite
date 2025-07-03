import { addItemApi } from '/js/Shared/cart.js';

export function zoomLens() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return; // mobile/touch check

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

  if (!variantSelect || !mainImage || !priceEl || !qtyInput || !addBtn) {
    return;
  }

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

    // Update image based on variant
    const imageElement = container.querySelector(
      `.thumb[data-variant-id="${variantId}"][data-url]`
    );
    if (imageElement && imageElement.dataset.url) {
      mainImage.src = imageElement.dataset.url;
      if (lens) lens.style.backgroundImage = `url(${mainImage.src})`;
    }
  }

  variantSelect.addEventListener('change', updatePdp);

  addBtn.addEventListener('click', async () => {
    const attribute = variantSelect.selectedOptions[0].dataset.attribute || '';
    const quantity = parseInt(qtyInput.value, 10) || 1;
    await addItemApi({ id: productId, attribute, quantity });
  });

  // Bind click events to all thumbnails
  container.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const variantId = thumb.dataset.variantId;
      const imgUrl = thumb.dataset.url;

      console.log('Thumbnail clicked:', { variantId, imgUrl }); // Debug log

      // Always update the main image first
      if (imgUrl) {
        mainImage.src = imgUrl;
        if (lens) lens.style.backgroundImage = `url(${imgUrl})`;
      }

      // Update select dropdown to match - convert both to strings for comparison
      const optionToSelect = Array.from(variantSelect.options).find(
        opt => String(opt.value) === String(variantId)
      );
      
      console.log('Found option:', optionToSelect); // Debug log
      
      if (optionToSelect) {
        variantSelect.value = variantId;
        updatePdp();
      }

      // Update active thumbnail styling
      container.querySelectorAll('.thumb-wrapper').forEach(wrapper => {
        wrapper.classList.remove('active');
      });
      thumb.closest('.thumb-wrapper')?.classList.add('active');
    });
  });

  // Initialize first thumbnail as active
  const firstThumb = container.querySelector('.thumb-wrapper');
  if (firstThumb) {
    firstThumb.classList.add('active');
  }

  updatePdp();
}