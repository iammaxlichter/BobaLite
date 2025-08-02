/**
 * Initializes a custom video player with a play button.
 *
 * @param {string} videoId - The ID of the video element.
 * @param {string} playButtonId - The ID of the play button element.
 */
export function initCustomVideoPlayer(videoId, playButtonId) {
    const video = document.getElementById(videoId);
    const playButton = document.getElementById(playButtonId);

    if (!video || !playButton) return;

    playButton.addEventListener("click", () => {
        video.play();
        playButton.style.display = "none";
    });

    video.addEventListener("ended", () => {
        playButton.style.display = "flex";
    });
}
