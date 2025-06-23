// wwwroot/js/app.js
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    initBanner();
    loadFooter();
  });

  // ────────────────────────────────────────────────────────────────────────
  // NAVBAR + DRAWER
  // ────────────────────────────────────────────────────────────────────────
  function loadNavbar() {
    fetch('/partials/navbar.html')
      .then(r => r.text())
      .then(html => {
        document.getElementById('navbar').innerHTML = html;
        initDrawer();    // ← only now that the drawer is in the DOM
      })
      .catch(console.error);
  }

  function initDrawer() {
    const toggleBtn = document.getElementById('menu-toggle');
    const drawer    = document.getElementById('nav-drawer');
    const backdrop  = document.getElementById('drawer-backdrop');
    const closeBtn  = document.getElementById('drawer-close');
    if (!(toggleBtn && drawer && backdrop && closeBtn)) return;

    // open / close panel
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

    // accordion delegation: any .drawer-link toggle its parent <li>
    document.body.addEventListener('click', e => {
      const link = e.target.closest('.drawer-link');
      if (!link || !drawer.contains(link)) return;
      link.parentElement.classList.toggle('open');
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // BANNER
  // ────────────────────────────────────────────────────────────────────────
  function initBanner() {
    const banner      = document.getElementById('banner');
    const bannerClose = document.getElementById('banner-close');
    if (!(banner && bannerClose)) return;

    bannerClose.addEventListener('click', () => {
      banner.style.display = 'none';
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FOOTER
  // ────────────────────────────────────────────────────────────────────────
  function loadFooter() {
    const container = document.getElementById('footer');
    if (!container) return;

    fetch('/partials/footer.html')
      .then(r => r.text())
      .then(html => {
        container.innerHTML = html;
      })
      .catch(console.error);
  }
})();
