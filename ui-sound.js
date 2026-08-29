(function () {
  const clickAudio = new Audio("assets/ui-click.mp3");

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

    clickAudio.currentTime = 0;
    clickAudio.play().catch(() => {});
  }

  document.addEventListener("pointerdown", playClickSound, { passive: true });
})();
