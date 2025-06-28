import { initBanner }   from './banner.js';
import { loadFeatures } from './features.js';
import { loadPromo }    from './promo.js';
import { loadCustomize } from './customize.js';
import { loadUniversal } from './universal.js';

document.addEventListener('DOMContentLoaded', () => {
  initBanner();
  loadFeatures();
  loadPromo();
  loadCustomize();
  loadUniversal();
});