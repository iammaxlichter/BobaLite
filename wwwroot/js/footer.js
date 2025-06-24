// footer.js
export function loadFooter() {
  const container = document.getElementById('footer');
  if (!container) return;

  fetch('/partials/footer.html')
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
    })
    .catch(console.error);
}
