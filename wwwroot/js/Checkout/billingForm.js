export function initBillingForm() {
  const form = document.getElementById('billing-form');
  if (!form) return;
  
  // Add phone number formatting
  const phoneInput = form.querySelector('[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (v.length >= 6) {
        v = `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`;
      } else if (v.length >= 3) {
        v = `(${v.slice(0,3)}) ${v.slice(3)}`;
      }
      e.target.value = v;
    });
  }
  
  // Add validation
  form.addEventListener('input', () => {
    // Dispatch event to update stepper validation
    document.dispatchEvent(new Event('formValidationChange'));
  });
}

export function getBillingData() {
  const f = document.getElementById('billing-form');
  if (!f) return {};
  
  return {
    firstName: f.querySelector('[name="firstName"]')?.value.trim() || '',
    lastName: f.querySelector('[name="lastName"]')?.value.trim() || '',
    address1: f.querySelector('[name="address1"]')?.value.trim() || '',
    address2: f.querySelector('[name="address2"]')?.value.trim() || '',
    city: f.querySelector('[name="city"]')?.value.trim() || '',
    state: f.querySelector('[name="state"]')?.value.trim() || '',
    zipCode: f.querySelector('[name="zipCode"]')?.value.trim() || '',
    phone: f.querySelector('[name="phone"]')?.value.trim() || '',
    email: f.querySelector('[name="email"]')?.value.trim() || '',
  };
}