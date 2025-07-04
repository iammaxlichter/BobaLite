// banner.js
export function initBanner() {
  const banner      = document.getElementById('banner');
  const bannerClose = document.getElementById('banner-close');
  if (!(banner && bannerClose)) return;

  bannerClose.addEventListener('click', () => {
    banner.style.display = 'none';
  });
}
