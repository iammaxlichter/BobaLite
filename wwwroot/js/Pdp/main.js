import { initAttributeSwitcher, initAddToCartAnimations, initShopEnhancements, initPriceFormatting } from './grid.js';
import { initFilters } from './filters.js';
import { initPdp } from '../Pdp/details.js';

document.addEventListener('DOMContentLoaded', () => {
  initPriceFormatting();
  initAttributeSwitcher();
  initAddToCartAnimations();
  initShopEnhancements();
  initFilters();

  // <-- and this:
  initPdp();
});
