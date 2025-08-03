/**
 * Main entry point for initializing global page scripts.
 * 
 * - Initializes the banner close button.
 * - Loads feature-related functionality.
 * - Loads promotional content.
 * - Loads product customization logic.
 * - Loads universal/shared UI behavior.
 */

import { initBanner }    from './banner.js';
import { loadFeatures }  from './features.js';
import { loadPromo }     from './promo.js';
import { loadCustomize } from './customize.js';
import { loadUniversal } from './universal.js';

document.addEventListener('DOMContentLoaded', () => {
  initBanner();
  loadFeatures();
  loadPromo();
  loadCustomize();
  loadUniversal();
});
