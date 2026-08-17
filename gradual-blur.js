(function () {
  const topBlur = document.querySelector(".gradual-blur-top");
  const bottomBlur = document.querySelector(".gradual-blur-bottom");

  if (!topBlur || !bottomBlur) {
    return;
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function updateBlur() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;

    topBlur.classList.toggle("is-visible", y > 24);
    bottomBlur.classList.toggle("is-visible", y < maxScroll - 24);
  }

  window.addEventListener("scroll", updateBlur, { passive: true });
  window.addEventListener("resize", updateBlur);
  updateBlur();
})();
