// wwwroot/js/grid.js

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

export function initPriceFormatting() {
  document.querySelectorAll('.product-card').forEach(card => {
    const priceElement = card.querySelector('.price');
    const activeButton = card.querySelector('.pack-btn.active');

    if (activeButton && priceElement) {
      const price = activeButton.dataset.price;
      priceElement.textContent = `$${formatPrice(price)}`;
    }
  });
}

export function initPackSwitcher() {
  document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('pack-btn')) return;

    const btn = e.target;
    const card = btn.closest('.product-card');
    const packBtns = card.querySelectorAll('.pack-btn');
    const priceEl = card.querySelector('.price');
    const canImage = card.querySelector('.can-image');
    const cartIcon = card.querySelector('.add-cart-icon');
    const newPrice = btn.dataset.price;
    const newStock = Number(btn.dataset.stock);
    const slug = card.dataset.slug;
    const newPack = btn.dataset.pack.split('-')[0];

    // Toggle active state
    packBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Animate price change
    priceEl.classList.add('updating');
    setTimeout(() => {
      priceEl.textContent = `$${formatPrice(newPrice)}`;
      priceEl.classList.remove('updating');
    }, 150);

    // Update image and cart button
    animateImageChange(canImage, slug, newPack);
    cartIcon.dataset.pack = btn.dataset.pack;

    // Handle stock status
    updateStockStatus(card, newStock, cartIcon);

    // Disable sold-out pack buttons
    packBtns.forEach(b => {
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
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.add-cart-icon');
    if (!btn) return;

    const img = btn.querySelector('img');

    btn.classList.add('pop');

    setTimeout(() => {
      img.src = img.dataset.check;
      btn.classList.remove('pop');
      btn.classList.add('success', 'success-pulse');

      setTimeout(() => {
        btn.classList.remove('success', 'success-pulse');
        img.src = img.dataset.plus;
      }, 1500);
    }, 200);
  });
}

function animateImageChange(imgEl, slug, packNumber) {
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
      /\/([^\/]+)-\d+-pack\.png$/,
      `/${slug}-${packNumber}-pack.png`
    );
  }

  imgEl.classList.add('switching');

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