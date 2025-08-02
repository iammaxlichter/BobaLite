/**
 * @fileoverview
 * Handles product grid interactions, including:
 *  - Price formatting
 *  - Attribute switching
 *  - Stock status updates
 *  - Add-to-cart animations
 *  - Product image switching
 *  - Scroll animations for product cards
 */

import { addItemApi, refreshCart } from '../Shared/cart.js';

/**
 * Formats a price value into a string with two decimal places.
 * @param {string|number} price - The price to format.
 * @returns {string} The formatted price.
 */
function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

/**
 * Initializes price formatting for all products on page load.
 */
export function initPriceFormatting() {
  document.querySelectorAll('.product-card').forEach(card => {
    const priceElement = card.querySelector('.price');
    const activeButton = card.querySelector('.attribute-btn.active');

    if (activeButton && priceElement) {
      const price = activeButton.dataset.price;
      priceElement.textContent = `$${formatPrice(price)}`;
    }
  });
}

/**
 * Initializes attribute switching functionality.
 * Updates price, stock, and product image when a user selects a different attribute.
 */
export function initAttributeSwitcher() {
  document.addEventListener('click', e => {
    if (!e.target.classList.contains('attribute-btn')) return;

    const btn = e.target;
    const card = btn.closest('.product-card');
    const attributeBtns = card.querySelectorAll('.attribute-btn');
    const priceEl = card.querySelector('.price');
    const canImage = card.querySelector('.can-image');
    const cartIcon = card.querySelector('.add-cart-icon');
    const newPrice = btn.dataset.price;
    const newStock = Number(btn.dataset.stock);
    const slug = card.dataset.slug;
    const newAttribute = btn.dataset.attribute;

    attributeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    priceEl.classList.add('updating');
    setTimeout(() => {
      priceEl.textContent = `$${formatPrice(newPrice)}`;
      priceEl.classList.remove('updating');
    }, 150);

    animateImageChange(canImage, slug, newAttribute);
    cartIcon.dataset.attribute = newAttribute;
    cartIcon.dataset.price = newPrice;

    updateStockStatus(card, newStock, cartIcon);

    attributeBtns.forEach(b => {
      b.disabled = Number(b.dataset.stock) === 0;
    });
  });
}

/**
 * Updates the stock status for a product.
 * @param {HTMLElement} card - The product card element.
 * @param {number} stock - The current stock quantity.
 * @param {HTMLElement} cartIcon - The cart button element.
 */
function updateStockStatus(card, stock, cartIcon) {
  const lowThreshold = 10;
  let label = card.querySelector('.stock-label');

  if (!label) {
    label = document.createElement('div');
    label.className = 'stock-label';
    card.prepend(label);
  }

  if (stock === 0) {
    updateStockState(card, label, 'out-of-stock', 'Out of Stock');
    cartIcon.disabled = true;
  } else {
    cartIcon.disabled = false;
    if (stock < lowThreshold) {
      updateStockState(card, label, 'low-stock', `Low stock: ${stock} left`);
    } else {
      updateStockState(card, label, '', '');
    }
  }
}

/**
 * Updates the stock label and card classes based on stock state.
 * @param {HTMLElement} card - The product card element.
 * @param {HTMLElement} label - The stock label element.
 * @param {string} stockClass - The CSS class for stock state.
 * @param {string} labelText - The text for the stock label.
 */
function updateStockState(card, label, stockClass, labelText) {
  card.classList.remove('out-of-stock', 'low-stock');

  if (stockClass && labelText) {
    card.classList.add(stockClass);

    if (label.textContent !== labelText) {
      label.style.opacity = '0';
      setTimeout(() => {
        label.textContent = labelText;
        label.style.opacity = '1';
      }, 150);
    }
  } else {
    label.style.opacity = '0';
    setTimeout(() => {
      if (label.parentNode) {
        label.remove();
      }
    }, 300);
  }
}

/**
 * Initializes add-to-cart animations and handles cart updates.
 */
export function initAddToCartAnimations() {
  document.addEventListener('click', async e => {
    const btn = e.target.closest('.add-cart-icon');
    if (!btn || btn.disabled) return;

    const img = btn.querySelector('img');
    const card = btn.closest('.product-card');

    const activeAttributeBtn = card.querySelector('.attribute-btn.active');
    const currentPrice = activeAttributeBtn ? activeAttributeBtn.dataset.price : btn.dataset.price;
    const currentAttribute = activeAttributeBtn ? activeAttributeBtn.dataset.attribute : btn.dataset.attribute;
    const currentStock = activeAttributeBtn ? activeAttributeBtn.dataset.stock : '0';

    const customTextInput = card.querySelector('input[name="custom-text"]');
    const customText = customTextInput?.value || null;

    btn.classList.add('pop');
    setTimeout(() => {
      if (img.dataset.check) {
        img.src = img.dataset.check;
      }
      btn.classList.remove('pop');
      btn.classList.add('success', 'success-pulse');

      setTimeout(() => {
        btn.classList.remove('success', 'success-pulse');
        if (img.dataset.plus) {
          img.src = img.dataset.plus;
        }
      }, 1500);
    }, 200);

    await addItemApi({
      id: Number(card.dataset.id),
      attribute: currentAttribute,
      quantity: 1,
      customText: customText
    });
    await refreshCart();
  });
}

/**
 * Animates product image changes based on selected attribute.
 * @param {HTMLImageElement} imgEl - The image element to update.
 * @param {string} slug - The product slug for building the image path.
 * @param {string} attributeNumber - The selected attribute identifier.
 */
function animateImageChange(imgEl, slug, attributeNumber) {
  const card = imgEl.closest('.product-card');
  const isApparel = card.dataset.type === 'Apparel';

  const newSrc = isApparel
    ? imgEl.src.replace(/\/[^/]+\.png$/, `/${slug}.png`)
    : imgEl.src.replace(/\/([^/]+)-[^-]+-pack\.png$/, `/${slug}-${attributeNumber}.png`);

  imgEl.classList.add('switching');

  const preloadImg = new Image();
  preloadImg.onload = () => {
    setTimeout(() => {
      imgEl.src = newSrc;
      imgEl.classList.remove('switching');
      imgEl.classList.add('transitioning');
      setTimeout(() => imgEl.classList.remove('transitioning'), 400);
    }, 100);
  };

  preloadImg.onerror = () => {
    imgEl.classList.remove('switching');
  };

  preloadImg.src = newSrc;

  setTimeout(() => {
    if (imgEl.classList.contains('switching')) {
      imgEl.src = newSrc;
      imgEl.classList.remove('switching');
      imgEl.classList.add('transitioning');
      setTimeout(() => imgEl.classList.remove('transitioning'), 400);
    }
  }, 500);
}

/**
 * Initializes additional shop enhancements.
 * Handles lazy-loading image fade-ins and scroll animations for product cards.
 */
export function initShopEnhancements() {
  document.querySelectorAll('.can-image').forEach(img => {
    if (!img.complete) {
      img.style.opacity = 0;
      img.addEventListener('load', () => {
        img.style.opacity = 1;
      });
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.product-card').forEach((card, index) => {
      card.classList.add('scroll-hidden');
      card.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });
  }
}
