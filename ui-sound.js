(function () {
  const clickAudio = new Audio("assets/ui-click.mp3");
  const cooldown = 500;
  let lastPlayedAt = 0;

  clickAudio.preload = "auto";
  clickAudio.volume = 0.42;

  function isClickable(target) {
    return target instanceof Element && target.closest("a, button, [role='button'], summary");
  }

  function playClickSound(event) {
    if (event.target instanceof Element && event.target.closest(".side-dock .dock-item")) {
      return;
    }

    if (!isClickable(event.target)) {
      return;
    }

    const now = performance.now();
    if (now - lastPlayedAt < cooldown) {
      return;
    }

    lastPlayedAt = now;
    clickAudio.currentTime = 0;
    clickAudio.play().catch(() => {});
  }

  document.addEventListener("pointerdown", playClickSound, { passive: true });
})();
