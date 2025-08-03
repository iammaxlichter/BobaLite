/**
 * Loads the customization UI if the container exists.
 * Initializes the customization logic for creating personalized cans.
 */
export function loadCustomize() {
  const container = document.getElementById('customize');
  if (!container) return;

  initCustomize();
}

/**
 * Initializes the customization input and button behavior.
 * - Focuses the input if empty when clicking the button.
 * - Logs the customization text (placeholder for future wiring).
 */
function initCustomize() {
  const wrapper = document.querySelector('.customize-wrapper');
  if (!wrapper) return;

  const input = wrapper.querySelector('.customize-input');
  const btn = wrapper.querySelector('.customize-btn');

  if (!input || !btn) return;

  btn.addEventListener('click', () => {
    const text = input.value.trim();

    if (!text) {
      input.focus();
      return;
    }
  });
}
