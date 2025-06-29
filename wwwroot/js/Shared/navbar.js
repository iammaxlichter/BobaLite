// navbar.js
export function loadNavbar() {
  const container = document.getElementById('navbar');
  if (!container) return;

  initDrawer();
}

export function initDrawer() {
  const toggleBtn = document.getElementById('menu-toggle');
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');
  if (!(toggleBtn && drawer && backdrop && closeBtn)) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.add('open');
    backdrop.classList.add('active');
  });
  closeBtn.addEventListener('click', () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
  });
  backdrop.addEventListener('click', () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
  });
  
  document.body.addEventListener('click', e => {
    const link = e.target.closest('.drawer-link');
    if (!link || !drawer.contains(link)) return;
    link.parentElement.classList.toggle('open');
  });
}
