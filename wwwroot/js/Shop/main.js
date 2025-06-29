// wwwroot/js/Shop/main.js

import {
  initAttributeSwitcher,
  initAddToCartAnimations,
  initShopEnhancements,
  initPriceFormatting
} from './grid.js';

document.addEventListener('DOMContentLoaded', () => {
  initPriceFormatting();  
  initAttributeSwitcher();
  initAddToCartAnimations();
  initShopEnhancements();
});