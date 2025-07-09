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


let productList = [];

export function initSearch() {
  const searchToggle = document.getElementById('search-toggle');
  const searchDrawer = document.getElementById('search-drawer');
  const searchInput = document.getElementById('search-input');
  const resultsList = document.getElementById('search-results');

  if (!(searchToggle && searchDrawer && searchInput && resultsList)) return;

  searchToggle.addEventListener('click', () => {
    searchDrawer.classList.toggle('active');
    if (searchDrawer.classList.contains('active')) {
      searchInput.focus();
    }
  });

  fetch('/api/products/search')
    .then(res => res.json())
    .then(data => productList = data);

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    resultsList.innerHTML = '';

    if (!query) return;

    const matches = productList
      .filter(p => p.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aStarts = aName.startsWith(query) ? -1 : 1;
        const bStarts = bName.startsWith(query) ? -1 : 1;
        return aStarts - bStarts;
      });



    matches.forEach(product => {
      const li = document.createElement('li');
      li.textContent = product.name;
      li.addEventListener('click', () => {
        window.location.href = `/Product/Details/${product.id}`;
      });
      resultsList.appendChild(li);
    });
  });
}
