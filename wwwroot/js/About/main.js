import { initCustomVideoPlayer } from './whatwedo.js';

/**
 * Initializes the custom video player once the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    initCustomVideoPlayer("about-video", "play-video");
});
