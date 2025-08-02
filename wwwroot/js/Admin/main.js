import { initNewProductForm, initImageChangeHandler } from './newProduct.js';

/**
 * Initializes the new product form and image change handlers when the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    initNewProductForm();
    initImageChangeHandler();
});
