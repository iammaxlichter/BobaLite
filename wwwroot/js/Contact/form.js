/**
 * Auto‐dismiss alerts after a delay, with an optional fade‐out.
 *
 * @param {Object} options
 * @param {string} options.selector      - CSS selector for the alert element.
 * @param {number} options.timeout       - Milliseconds to wait before dismiss.
 * @param {number} options.fadeDuration  - Milliseconds to fade out.
 */
export function autoDismissAlert({
  selector     = '.alert-success',
  timeout      = 5000,
  fadeDuration = 500,
} = {}) {
  document.addEventListener('DOMContentLoaded', () => {
    const alertEl = document.querySelector(selector);
    if (!alertEl) return;

    setTimeout(() => {
      // fade out
      alertEl.style.transition = `opacity ${fadeDuration}ms ease`;
      alertEl.style.opacity    = '0';

      // remove from DOM after fade
      setTimeout(() => alertEl.remove(), fadeDuration);
    }, timeout);
  });
}
