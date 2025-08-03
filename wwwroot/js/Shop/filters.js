/**
 * @fileoverview
 * Handles product filter UI functionality on the Shop page.
 * Includes:
 *  - Filter modal open/close behavior
 *  - Category expansion
 *  - Filter reset
 *  - Keyboard controls
 *  - Auto-expanding categories with active filters
 */

/**
 * Initializes filter modal functionality.
 * Handles opening and closing the modal and auto-expands the first category by default.
 */
export function initFilterModal() {
  const filterToggle = document.getElementById('filterToggle');
  const filterModal = document.getElementById('filterModal');
  const closeModal = document.getElementById('closeModal');

  if (!(filterToggle && filterModal && closeModal)) return;

  filterToggle.addEventListener('click', () => {
    filterModal.classList.add('active');
  });

  closeModal.addEventListener('click', () => {
    filterModal.classList.remove('active');
  });

  filterModal.addEventListener('click', e => {
    if (e.target === filterModal) {
      filterModal.classList.remove('active');
    }
  });
}

/**
 * Initializes category expansion functionality.
 * Toggles a category's expanded state when its header is clicked.
 */
export function initCategoryExpansion() {
  document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
      const category = header.parentElement;
      category.classList.toggle('expanded');
    });
  });
}

/**
 * Initializes filter reset functionality.
 * Unchecks all filter checkboxes when the reset button is clicked.
 */
export function initFilterReset() {
  const resetFilters = document.getElementById('resetFilters');

  if (!resetFilters) return;

  resetFilters.addEventListener('click', () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
  });
}

/**
 * Initializes keyboard controls for filter modal.
 * Closes the modal when the Escape key is pressed.
 */
export function initFilterKeyboardControls() {
  const filterModal = document.getElementById('filterModal');

  if (!filterModal) return;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && filterModal.classList.contains('active')) {
      filterModal.classList.remove('active');
    }
  });
}

/**
 * Automatically expands any filter category that has an active filter applied.
 */
export function initActiveFilterExpansion() {
  document.querySelectorAll('.filter-category').forEach(category => {
    const hasActiveFilter =
      category.querySelectorAll('input[type="checkbox"]:checked').length > 0;
    if (hasActiveFilter) {
      category.classList.add('expanded');
    }
  });
}

/**
 * Initializes all filter-related functionality.
 * Bundles all other filter initialization functions for easy setup.
 */
export function initFilters() {
  initFilterModal();
  initCategoryExpansion();
  initFilterReset();
  initFilterKeyboardControls();
  initActiveFilterExpansion();
}
