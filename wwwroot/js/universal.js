export function loadUniversal() {
  const container = document.getElementById('universal');
  if (!container) return;
  fetch('/partials/universal.html')
    .then(r => r.text())
    .then(html => container.innerHTML = html)
    .catch(console.error);
}