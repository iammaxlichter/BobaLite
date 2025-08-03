/**
 * Handles promotional slide functionality.
 * 
 * - Initializes the promo slider if a `.promo-wrapper` exists.
 * - Automatically cycles through slides every 7.5s.
 * - Updates slide counters and handles manual next/prev navigation.
 */

export function loadPromo() {
  const wrapper = document.querySelector('.promo-wrapper');
  if (!wrapper) return;

  initPromo();
}

/**
 * Initializes the promotional slider behavior.
 */
function initPromo() {
  const wrapper = document.querySelector('.promo-wrapper');
  if (!wrapper) return;

  const slides = Array.from(wrapper.querySelectorAll('.promo-slide'));
  let current = 0;
  const total = slides.length;
  const AUTO_MS = 7500;
  let autoTimer;

  /**
   * Displays the slide at the given index.
   * @param {number} idx - Index of the slide to display.
   */
  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);

      const counterEl = slide.querySelector('.promo-counter');
      if (counterEl) counterEl.textContent = `${idx + 1} / ${total}`;
    });
  }

  /**
   * Schedules the next automatic slide transition.
   */
  function scheduleNext() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      current = (current + 1) % total;
      showSlide(current);
      scheduleNext();
    }, AUTO_MS);
  }

  /**
   * Handles click events for next/prev buttons.
   */
  wrapper.addEventListener('click', (e) => {
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
