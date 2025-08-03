/**
 * Entry point for initializing shop-related scripts.
 *
 * - Initializes price formatting, attribute switching, and cart animations on the shop grid.
 * - Loads filter logic for product filtering.
 * - Sets up product details page (PDP) functionality and zoom lens.
 */

import { 
  initAttributeSwitcher, 
  initAddToCartAnimations, 
  initShopEnhancements, 
  initPriceFormatting 
} from '../Shop/grid.js';
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
