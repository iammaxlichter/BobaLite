import { loadNavbar }   from './navbar.js';
import { initBanner }   from './banner.js';
import { loadFeatures } from './features.js';
import { loadPromo }    from './promo.js';
import { loadFooter }   from './footer.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  initBanner();
  loadFeatures();
  loadPromo();
  loadFooter();
});