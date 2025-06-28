// wwwroot/js/grid.js

// Handles the 1/6/12 pack switching
export function initPackSwitcher() {
  document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('pack-btn')) return;

    const clickedBtn   = e.target;
    const card         = clickedBtn.closest('.product-card');
    const packOptions  = card.querySelector('.pack-options');
    const priceElement = card.querySelector('.price');
    const canImage     = card.querySelector('.can-image');
    const cartIcon     = card.querySelector('.add-cart-icon');

    if (clickedBtn.classList.contains('active')) return;

    const newPack  = clickedBtn.dataset.pack;
    const newPrice = clickedBtn.dataset.price;
    const slug     = card.dataset.slug;

    // toggle active state
    packOptions.querySelectorAll('.pack-btn').forEach(b => b.classList.remove('active'));
    clickedBtn.classList.add('active');

    // animate price change
    priceElement.classList.add('updating');
    setTimeout(() => {
      priceElement.textContent = `${newPack} Pack – $${newPrice}`;
      priceElement.classList.remove('updating');
    }, 150);

    // animate image change with improved loading
    animateImageChangeImproved(canImage, slug, newPack);

    // update cart-icon pack data
    cartIcon.dataset.pack = newPack;
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