// wwwroot/js/grid.js

// Function to format price to 2 decimal places
function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

// Initialize all cards on page load to ensure proper price formatting
export function initPriceFormatting() {
  document.querySelectorAll('.product-card').forEach(card => {
    const priceElement = card.querySelector('.price');
    const activeButton = card.querySelector('.pack-btn.active');
    
    // Ensure initial price is properly formatted
    if (activeButton && priceElement) {
      const price = activeButton.dataset.price;
      const pack = activeButton.dataset.pack;
      
      // Format the initial price display
      priceElement.textContent = `${pack} Pack – $${formatPrice(price)}`;
    }
  });
}

// Handles the 1/6/12 pack switching
export function initPackSwitcher() {
  document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('pack-btn')) return;

    const btn        = e.target;
    const card       = btn.closest('.product-card');
    const packBtns   = card.querySelectorAll('.pack-btn');
    const priceEl    = card.querySelector('.price');
    const canImage   = card.querySelector('.can-image');
    const cartIcon   = card.querySelector('.add-cart-icon');

    const newPack   = btn.dataset.pack;
    const newPrice  = btn.dataset.price;
    const newStock  = Number(btn.dataset.stock);
    const slug      = card.dataset.slug;

    // 1) toggle active class
    packBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 2) animate price
    priceEl.classList.add('updating');
    setTimeout(() => {
      priceEl.textContent = `${newPack} Pack – $${parseFloat(newPrice).toFixed(2)}`;
      priceEl.classList.remove('updating');
    }, 150);

    // 3) animate image
    animateImageChangeImproved(canImage, slug, newPack);

    // 4) update cart button
    cartIcon.dataset.pack = newPack;

    // 5) stock banner
    const lowThreshold = 10;
    let label = card.querySelector('.stock-label');
    if (!label) {
      label = document.createElement('div');
      label.className = 'stock-label';
      card.prepend(label);
    }

    if (newStock === 0) {
      card.classList.add('out-of-stock');
      card.classList.remove('low-stock');
      label.textContent = 'Out of Stock';
      cartIcon.disabled = true;
    } else {
      cartIcon.disabled = false;
      if (newStock <= lowThreshold) {
        card.classList.add('low-stock');
        card.classList.remove('out-of-stock');
        label.textContent = `Low stock: ${newStock} left`;
      } else {
        card.classList.remove('low-stock','out-of-stock');
        label.remove();
      }
    }

    // 6) *per-button* disabling* — never re-enable a sold-out pack
    packBtns.forEach(b => {
      const stock = Number(b.dataset.stock);
      b.disabled = stock === 0;
    });
  });
}


// Handles the cart-icon click with green success animation
export function initAddToCartAnimations() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.add-cart-icon');
    if (!btn) return;

    const img = btn.querySelector('img');
    
    // First do the pop animation
    btn.classList.add('pop');
    
    // Switch to checkmark after a short delay
    setTimeout(() => {
      img.src = img.dataset.check;
      btn.classList.remove('pop');
      
      // Add green success state
      btn.classList.add('success', 'success-pulse');
      
      // Remove success state and switch back to plus after 1.5 seconds
      setTimeout(() => {
        btn.classList.remove('success', 'success-pulse');
        img.src = img.dataset.plus;
      }, 1500);
    }, 200);
  });
}

// Improved image animation that doesn't wait for full load
function animateImageChangeImproved(imgEl, slug, packNumber) {
  const newSrc = imgEl.src.replace(
    /\/([^\/]+)-\d+-pack\.png$/,
    `/${slug}-${packNumber}-pack.png`
  );
  
  // Start the switching animation immediately
  imgEl.classList.add('switching');
  
  // Start loading the new image in background
  const preloadImg = new Image();
  
  preloadImg.onload = () => {
    // Image loaded successfully, switch it
    setTimeout(() => {
      imgEl.src = newSrc;
      imgEl.classList.remove('switching');
      imgEl.classList.add('transitioning');
      
      // Clean up transition class
      setTimeout(() => {
        imgEl.classList.remove('transitioning');
      }, 400);
    }, 100);
  };
  
  preloadImg.onerror = () => {
    // If image fails to load, just remove switching class
    imgEl.classList.remove('switching');
  };
  
  // Start preloading
  preloadImg.src = newSrc;
  
  // Fallback: if image takes too long, still show something
  setTimeout(() => {
    if (imgEl.classList.contains('switching')) {
      imgEl.src = newSrc;
      imgEl.classList.remove('switching');
      imgEl.classList.add('transitioning');
      setTimeout(() => imgEl.classList.remove('transitioning'), 400);
    }
  }, 500);
}

// Optional: image-load fade & intersection observer
export function initShopEnhancements() {
  // image loading fade
  document.querySelectorAll('.can-image').forEach(img => {
    if (!img.complete) {
      img.style.opacity = 0;
      img.addEventListener('load', () => {
        img.style.opacity = 1;
      });
    }
  });

  // scroll-in observer
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.product-card').forEach((card, i) => {
      card.classList.add('scroll-hidden');
      card.style.transitionDelay = `${i * 0.1}s`;
      obs.observe(card);
    });
  }
}