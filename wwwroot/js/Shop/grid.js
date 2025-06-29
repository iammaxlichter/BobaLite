// wwwroot/js/grid.js

// Import addItem from the cart module
import { addItemApi, refreshCart } from '../Shared/cart.js';

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

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

export function initAttributeSwitcher() {
  document.addEventListener('click', function (e) {
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

    // Toggle active state
    attributeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Animate price change
    priceEl.classList.add('updating');
    setTimeout(() => {
      priceEl.textContent = `$${formatPrice(newPrice)}`;
      priceEl.classList.remove('updating');
    }, 150);

    // Update image and cart button
    animateImageChange(canImage, slug, newAttribute);
    cartIcon.dataset.attribute = btn.dataset.attribute;
    cartIcon.dataset.price = newPrice; // Update cart button price

    // Handle stock status
    updateStockStatus(card, newStock, cartIcon);

    // Disable sold-out attribute buttons
    attributeBtns.forEach(b => {
      b.disabled = Number(b.dataset.stock) === 0;
    });
  });
}

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

export function initAddToCartAnimations() {
  document.addEventListener('click', async function (e) {
    const btn = e.target.closest('.add-cart-icon');
    if (!btn || btn.disabled) return;

    const img = btn.querySelector('img');
    const card = btn.closest('.product-card');

    // Get current active attribute button to get the right price
    const activeAttributeBtn = card.querySelector('.attribute-btn.active');
    const currentPrice = activeAttributeBtn ? activeAttributeBtn.dataset.price : btn.dataset.price;
    const currentAttribute = activeAttributeBtn ? activeAttributeBtn.dataset.attribute : btn.dataset.attribute;
    const currentStock = activeAttributeBtn ? activeAttributeBtn.dataset.stock : '0';

    console.log('Adding to cart:', {
      id: card.dataset.id,
      name: card.dataset.name,
      attribute: currentAttribute,
      price: currentPrice,
      stock: currentStock,
      img: card.querySelector('.can-image').src
    });

    // 1) animate icon
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

    // 2) add to cart state
    await addItemApi({
      id:        Number(card.dataset.id),
      attribute: currentAttribute
    });
    await refreshCart();

  });
}

function animateImageChange(imgEl, slug, attributeNumber) {
  const card = imgEl.closest('.product-card');
  const isApparel = card.dataset.type === 'Apparel';

  let newSrc;
  if (isApparel) {
    newSrc = imgEl.src.replace(
      /\/[^/]+\.png$/,
      `/${slug}.png`
    );
  } else {
    newSrc = imgEl.src.replace(
      /\/([^\/]+)-[^-]+-pack\.png$/,
      `/${slug}-${attributeNumber}.png`
    );
  }

  imgEl.classList.add('switching');

  const preloadImg = new Image();

  preloadImg.onload = () => {
    setTimeout(() => {
      imgEl.src = newSrc;
      imgEl.classList.remove('switching');
      imgEl.classList.add('transitioning');

      setTimeout(() => {
        imgEl.classList.remove('transitioning');
      }, 400);
    }, 100);
  };

  preloadImg.onerror = () => {
    imgEl.classList.remove('switching');
  };

  preloadImg.src = newSrc;

  // Fallback timeout
  setTimeout(() => {
    if (imgEl.classList.contains('switching')) {
      imgEl.src = newSrc;
      imgEl.classList.remove('switching');
      imgEl.classList.add('transitioning');
      setTimeout(() => imgEl.classList.remove('transitioning'), 400);
    }
  }, 500);
}

export function initShopEnhancements() {
  // Fade in images when loaded
  document.querySelectorAll('.can-image').forEach(img => {
    if (!img.complete) {
      img.style.opacity = 0;
      img.addEventListener('load', () => {
        img.style.opacity = 1;
      });
    }
  });

  // Animate cards on scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
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