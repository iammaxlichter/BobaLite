export function initNewProductForm() {
  const typeSelect = document.getElementById('productType');
  const variantContainer = document.getElementById('variantFileInputs');

  const variantOptions = {
    Drink: ['1-pack', '6-pack', '12-pack'],
    Apparel: ['S', 'M', 'L', 'XL']
  };

  typeSelect.addEventListener('change', () => {
    const selectedType = typeSelect.value;
    const variants = variantOptions[selectedType] || [];

    variantContainer.innerHTML = '';

    for (const variant of variants) {
      const safeId = variant.replace(/[^a-z0-9]/gi, '');

      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <label>
          <input type="checkbox" name="variantEnabled" value="${variant}" checked />
          <strong>${variant}:</strong>
        </label>
        <input type="file" name="variantImages" accept="image/*" />
      `;
      variantContainer.appendChild(wrapper);
    }
  });
}
