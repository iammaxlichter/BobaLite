import { loadNavbar }   from './navbar.js';
import { initBanner }   from './banner.js';
import { loadFeatures } from './features.js';
import { loadPromo }    from './promo.js';
import { loadFooter }   from './footer.js';
import { loadCustomize } from './customize.js';
import { loadUniversal } from './universal.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  initBanner();
  loadFeatures();
  loadPromo();
  loadCustomize();
  loadUniversal();
  loadFooter();
});