import { initAttributeSwitcher, initAddToCartAnimations, initShopEnhancements, initPriceFormatting } from '../Shop/grid.js';
import { initFilters } from '../Shop/filters.js';
import { initPdp, zoomLens } from '../Pdp/details.js';

document.addEventListener('DOMContentLoaded', () => {
  initPriceFormatting();
  initAttributeSwitcher();
  initAddToCartAnimations();
  initShopEnhancements();
  initFilters();
  initPdp();
  zoomLens();
});
