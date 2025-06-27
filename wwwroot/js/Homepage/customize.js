export function loadCustomize() {
  const container = document.getElementById('customize');
  if (!container) return;

  fetch('partials/customize.html')
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      initCustomize();
    })
    .catch(console.error);
}

function initCustomize() {
  const wrapper = document.querySelector('.customize-wrapper');
  if (!wrapper) return;

  const input = wrapper.querySelector('.customize-input');
  const btn   = wrapper.querySelector('.customize-btn');

  btn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }
    // TODO: wire up your “create cans” action
    console.log('Creating customized cans with:', text);
  });
}
