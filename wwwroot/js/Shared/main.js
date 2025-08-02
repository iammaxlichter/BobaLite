/**
 * @fileoverview
 * Main initializer for global site functionality.
 * Handles loading footer content, initializing the navbar drawer,
 * cart drawer, and search functionality after the DOM is ready.
 */

import { loadFooter } from './footer.js';
import { initDrawer, initSearch } from './navbar.js';
import { initCartDrawer } from './cart.js';

/**
 * Initializes all global page components once the DOM is fully loaded.
 * This includes:
 *  - Footer initialization
 *  - Navbar drawer setup
 *  - Cart drawer setup
 *  - Search bar functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  loadFooter();
  initDrawer();
  initCartDrawer();
  initSearch();
});
