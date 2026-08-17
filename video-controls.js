(function () {
  const video = document.querySelector(".hero-video");
  const audio = document.querySelector("[data-hero-audio]");
  const volumeButton = document.querySelector("[data-volume-toggle]");
  const volumeLabel = document.querySelector("[data-volume-label]");
  const replayButton = document.querySelector("[data-video-replay]");

  if (!video || !volumeButton || !replayButton) {
    return;
  }

  video.loop = false;
  video.muted = true;
  video.volume = 1;
  let soundUnlocked = false;
  if (audio) {
    audio.muted = false;
    audio.volume = 1;
  }

  function updateVolumeButton() {
    const soundTarget = audio?.getAttribute("src") ? audio : video;
    const isMuted = soundTarget.muted || soundTarget.volume === 0;
    const icon = volumeButton.querySelector(".control-icon");
    if (icon) {
      icon.textContent = isMuted ? "◌" : "◉";
    }
    if (volumeLabel) {
      volumeLabel.textContent = isMuted ? "Sound Off" : "Sound On";
    }
    volumeButton.setAttribute("aria-label", isMuted ? "打开声音" : "关闭声音");
  }

  function playVideo() {
    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {});
    }
    if (soundUnlocked && audio?.getAttribute("src")) {
      const audioAttempt = audio.play();
      if (audioAttempt && typeof audioAttempt.catch === "function") {
        audioAttempt.catch(() => {});
      }
    }
  }

  function isHomeInteraction(event) {
    const home = document.querySelector("#home");
    if (!home) {
      return false;
    }

    if (event?.target?.closest?.("#home")) {
      return true;
    }

    return window.scrollY < Math.max(120, home.offsetHeight * 0.72);
  }

  function unlockSoundOnce(event) {
    if (!audio?.getAttribute("src")) {
      return;
    }

    if (soundUnlocked) {
      return;
    }

    if (!isHomeInteraction(event)) {
      return;
    }

    soundUnlocked = true;
    audio.currentTime = video.currentTime || 0;
    const audioAttempt = audio.play();
    if (audioAttempt && typeof audioAttempt.catch === "function") {
      audioAttempt.catch(() => {});
    }
    updateVolumeButton();
  }

  volumeButton.addEventListener("click", () => {
    const soundTarget = audio?.getAttribute("src") ? audio : video;
    soundTarget.muted = !soundTarget.muted;
    if (soundTarget === audio && !soundTarget.muted) {
      soundUnlocked = true;
    }
    if (!video.paused) {
      playVideo();
    }
    updateVolumeButton();
  });

  replayButton.addEventListener("click", () => {
    video.currentTime = 0;
    if (audio?.getAttribute("src")) {
      soundUnlocked = true;
      audio.currentTime = 0;
    }
    updateVolumeButton();
    playVideo();
  });

  video.addEventListener("ended", () => {
    video.pause();
    if (audio?.getAttribute("src")) {
      audio.pause();
    }
  });

  video.addEventListener("pause", () => {
    if (audio?.getAttribute("src") && !audio.paused) {
      audio.pause();
    }
  });

  video.addEventListener("play", () => {
    if (audio?.getAttribute("src")) {
      audio.currentTime = video.currentTime || 0;
    }
  });

  updateVolumeButton();
  playVideo();
  document.addEventListener("pointerdown", unlockSoundOnce);
  document.addEventListener("wheel", unlockSoundOnce, { passive: true });
  document.addEventListener("touchstart", unlockSoundOnce, { passive: true });
  document.addEventListener("keydown", unlockSoundOnce);
})();
