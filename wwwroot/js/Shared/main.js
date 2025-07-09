import { loadFooter }   from './footer.js';
import { initDrawer  }   from './navbar.js';
import { initSearch  }   from './navbar.js';
import { initCartDrawer  }   from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  loadFooter();
  initDrawer();
  initCartDrawer();
  initSearch();
});