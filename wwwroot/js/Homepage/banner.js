/**
 * Initializes the dismissible banner.
 * 
 * - Hides the banner when the close button is clicked.
 * - Safely exits if banner elements are not found.
 */
export function initBanner() {
  const banner = document.getElementById('banner');
  const bannerClose = document.getElementById('banner-close');

  if (!banner || !bannerClose) return;

  bannerClose.addEventListener('click', () => {
    banner.style.display = 'none';
  });
}
