(function () {
  const revealClass = "is-revealed";
  const watchedClass = "is-reveal-watched";
  const items = new Set();
  let frame = 0;
  let enabled = !document.body.classList.contains("site-loading");

  function collect(scope = document) {
    scope.querySelectorAll?.(`.reveal-item:not(.${watchedClass})`).forEach((item) => {
      item.classList.add(watchedClass);
      items.add(item);
    });
  }

  function reveal(item, index) {
    const isContactItem = Boolean(item.closest("#contact"));
    const step = isContactItem ? 140 : 70;
    const maxDelay = isContactItem ? 840 : 280;
    item.style.setProperty("--reveal-delay", `${Math.min(index * step, maxDelay)}ms`);
    item.classList.add(revealClass);
    items.delete(item);
  }

  function update() {
    if (!enabled) {
      frame = 0;
      return;
    }

    frame = 0;

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const pageBottom = window.scrollY + viewportHeight >= document.documentElement.scrollHeight - 8;
    const ready = [];

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const triggerRatio = item.classList.contains("bounce-card") ? 1.08 : 0.84;
      const nearMiddle = rect.top <= viewportHeight * triggerRatio && rect.bottom >= viewportHeight * 0.02;
      const visibleAtPageBottom = pageBottom && rect.top < viewportHeight;

      if (nearMiddle || visibleAtPageBottom) {
        ready.push(item);
      }
    });

    ready
      .sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        return aRect.top === bRect.top ? aRect.left - bRect.left : aRect.top - bRect.top;
      })
      .forEach(reveal);
  }

  function scheduleUpdate() {
    if (!frame) {
      frame = requestAnimationFrame(update);
    }
  }

  if (enabled) {
    collect();
    update();
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          if (node.classList.contains("reveal-item") && !node.classList.contains(watchedClass)) {
            node.classList.add(watchedClass);
            items.add(node);
          }
          collect(node);
        }
      });
    });
    scheduleUpdate();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener(
    "boot:enter",
    () => {
      enabled = true;
      collect();
      scheduleUpdate();
    },
    { once: true }
  );
})();
