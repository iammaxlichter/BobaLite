/**
 * @fileoverview
 * Entry point for the Shop page.
 * Initializes:
 *  - Price formatting
 *  - Attribute switching
 *  - Add-to-cart animations
 *  - Shop enhancements (image fade-ins, scroll animations)
 *  - Filters
 */

import {
  initAttributeSwitcher,
  initAddToCartAnimations,
  initShopEnhancements,
  initPriceFormatting
} from './grid.js';

import { initFilters } from './filters.js';

document.addEventListener('DOMContentLoaded', () => {
  initPriceFormatting();
  initAttributeSwitcher();
  initAddToCartAnimations();
  initShopEnhancements();
  initFilters();
});
