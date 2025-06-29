// wwwroot/js/Shop/main.js

import {
    initAttributeSwitcher,
    initAddToCartAnimations,
    initShopEnhancements,
    initPriceFormatting
} from './grid.js';

import {
    initFilters
} from './filters.js';

document.addEventListener('DOMContentLoaded', () => {
    initPriceFormatting();
    initAttributeSwitcher();
    initAddToCartAnimations();
    initShopEnhancements();
    initFilters(); 
});