// wwwroot/js/Shop/filters.js

// Initialize filter modal functionality
export function initFilterModal() {
    const filterToggle = document.getElementById('filterToggle');
    const filterModal = document.getElementById('filterModal');
    const closeModal = document.getElementById('closeModal');

    if (!filterToggle || !filterModal || !closeModal) return;

    // Modal controls
    filterToggle.addEventListener('click', () => {
        filterModal.classList.add('active');
        // Expand first category by default if none expanded
        if (!document.querySelector('.filter-category.expanded')) {
            const firstCategory = document.querySelector('.filter-category');
            if (firstCategory) {
                firstCategory.classList.add('expanded');
            }
        }
    });

    closeModal.addEventListener('click', () => {
        filterModal.classList.remove('active');
    });

    filterModal.addEventListener('click', (e) => {
        if (e.target === filterModal) {
            filterModal.classList.remove('active');
        }
    });
}

// Initialize category expansion functionality
export function initCategoryExpansion() {
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            const category = header.parentElement;
            category.classList.toggle('expanded');
        });
    });
}

// Initialize filter reset functionality
export function initFilterReset() {
    const resetFilters = document.getElementById('resetFilters');
    
    if (!resetFilters) return;

    resetFilters.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    });
}

// Initialize keyboard controls
export function initFilterKeyboardControls() {
    const filterModal = document.getElementById('filterModal');
    
    if (!filterModal) return;

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filterModal.classList.contains('active')) {
            filterModal.classList.remove('active');
        }
    });
}

// Auto-expand categories with active filters
export function initActiveFilterExpansion() {
    document.querySelectorAll('.filter-category').forEach(category => {
        const hasActiveFilter = category.querySelectorAll('input[type="checkbox"]:checked').length > 0;
        if (hasActiveFilter) {
            category.classList.add('expanded');
        }
    });
}

// Initialize all filter functionality
export function initFilters() {
    initFilterModal();
    initCategoryExpansion();
    initFilterReset();
    initFilterKeyboardControls();
    initActiveFilterExpansion();
}