(function () {
  const title = document.querySelector("[data-contact-title]");
  const section = document.querySelector("#contact");

  if (!title || !section) {
    return;
  }

  let frame = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function render() {
    frame = 0;

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const rect = section.getBoundingClientRect();
    const progress = clamp((viewportHeight - rect.top) / (viewportHeight * 0.86), 0, 1);
    const scale = 0.82 + progress * 0.18;
    const opacity = 0.38 + progress * 0.62;

    title.style.setProperty("--contact-title-scale", scale.toFixed(3));
    title.style.setProperty("--contact-title-opacity", opacity.toFixed(3));
  }

  function scheduleRender() {
    if (!frame) {
      frame = requestAnimationFrame(render);
    }
  }

  window.addEventListener("scroll", scheduleRender, { passive: true });
  window.addEventListener("resize", scheduleRender);
  render();
})();
