// features.js
export function loadFeatures() {
  const container = document.getElementById('features');
  if (!container) return;

  fetch('/partials/features.html')
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
    })
    .catch(console.error);
}
