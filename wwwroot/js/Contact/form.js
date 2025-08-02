/**
 * Auto-dismiss alerts after a delay, with an optional fade-out.
 *
 * Automatically fades out and removes a matching alert element from the DOM after
 * a specified timeout period.
 *
 * @param {Object} options
 * @param {string} options.selector      - CSS selector for the alert element.
 * @param {number} options.timeout       - Milliseconds to wait before dismissal.
 * @param {number} options.fadeDuration  - Milliseconds for fade-out animation.
 */
export function autoDismissAlert({
  selector = '.alert-success',
  timeout = 5000,
  fadeDuration = 500,
} = {}) {
  document.addEventListener('DOMContentLoaded', () => {
    const alertElement = document.querySelector(selector);
    if (!alertElement) return;

    setTimeout(() => {
      alertElement.style.transition = `opacity ${fadeDuration}ms ease`;
      alertElement.style.opacity = '0';

      setTimeout(() => {
        alertElement.remove();
      }, fadeDuration);
    }, timeout);
  });
}
