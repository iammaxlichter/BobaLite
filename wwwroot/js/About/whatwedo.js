export function initCustomVideoPlayer(videoId, playButtonId) {
  const video = document.getElementById(videoId);
  const playButton = document.getElementById(playButtonId);

  if (!video || !playButton) return;

  playButton.addEventListener("click", () => {
    video.play();
    playButton.style.display = "none";
  });

  // Optional: show the button again when video ends
  video.addEventListener("ended", () => {
    playButton.style.display = "flex";
  });
}
