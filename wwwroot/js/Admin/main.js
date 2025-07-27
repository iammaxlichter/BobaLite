import { initNewProductForm } from './newProduct.js';

document.addEventListener('DOMContentLoaded', () => {
  initNewProductForm();
});

document.addEventListener('click', e => {
  if (e.target.matches('.change-img')) {
    const id = e.target.dataset.for;
    document.getElementById(id).click();
  }
});