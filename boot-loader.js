(function () {
  const loader = document.querySelector("[data-boot-loader]");
  if (!loader) {
    document.body.classList.remove("site-loading");
    return;
  }

  const percentNode = loader.querySelector("[data-boot-percent]");
  const statusNode = loader.querySelector("[data-boot-status]");
  const progressNode = loader.querySelector("[data-boot-progress]");
  const enterButton = loader.querySelector("[data-boot-enter]");
  const statuses = ["LOADING ASSETS", "INITIALIZING MATERIALS", "BUILDING SCENE", "RENDERING PREVIEW"];
  const duration = 2200;
  const start = performance.now();
  let ready = false;

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function enterSite() {
    if (!ready) {
      return;
    }

    window.dispatchEvent(new CustomEvent("boot:enter"));
    loader.classList.add("is-complete");
    document.body.classList.remove("site-loading");
    window.setTimeout(() => loader.remove(), 780);
  }

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const percent = Math.min(Math.round(easeOutCubic(progress) * 100), 100);
    const statusIndex = Math.min(Math.floor(progress * statuses.length), statuses.length - 1);

    loader.style.setProperty("--boot-progress", `${percent}%`);
    if (progressNode) {
      progressNode.style.width = `${percent}%`;
    }
    if (percentNode) {
      percentNode.textContent = `${percent}%`;
    }
    if (statusNode) {
      statusNode.textContent = statuses[statusIndex];
    }

    if (progress < 1) {
      window.requestAnimationFrame(update);
      return;
    }

    ready = true;
    loader.classList.add("is-ready");
    if (statusNode) {
      statusNode.textContent = "READY";
    }
  }

  enterButton?.addEventListener("click", enterSite);
  enterButton?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      enterSite();
    }
  });

  window.requestAnimationFrame(update);
})();
