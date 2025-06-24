// promo.js
export function loadPromo() {
  const container = document.getElementById('promo');
  if (!container) return;

  fetch('/partials/promo.html')
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      initPromo();
    })
    .catch(console.error);
}

function initPromo() {
  const wrapper = document.querySelector('.promo-wrapper');
  if (!wrapper) return;

  const slides = Array.from(wrapper.querySelectorAll('.promo-slide'));
  let current = 0;
  const total = slides.length;
  const AUTO_MS = 5000;
  let autoTimer;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
      const counterEl = slide.querySelector('.promo-counter');
      if (counterEl) counterEl.textContent = `${idx + 1} / ${total}`;
    });
  }

  function scheduleNext() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      current = (current + 1) % total;
      showSlide(current);
      scheduleNext();
    }, AUTO_MS);
  }

  wrapper.addEventListener('click', e => {
    if (e.target.closest('.promo-next')) {
      current = (current + 1) % total;
      showSlide(current);
      scheduleNext();
    }
    if (e.target.closest('.promo-prev')) {
      current = (current - 1 + total) % total;
      showSlide(current);
      scheduleNext();
    }
  });

  showSlide(current);
  scheduleNext();
}
