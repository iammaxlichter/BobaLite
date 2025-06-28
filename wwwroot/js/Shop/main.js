// wwwroot/js/main.js

import {
  initPackSwitcher,
  initAddToCartAnimations,
  initShopEnhancements
} from './grid.js';

document.addEventListener('DOMContentLoaded', () => {
  initPackSwitcher();
  initAddToCartAnimations();
  initShopEnhancements();
});
