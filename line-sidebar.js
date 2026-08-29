(function () {
  const sidebar = document.querySelector("[data-line-sidebar]");
  if (!sidebar) return;

  const items = Array.from(sidebar.querySelectorAll(".line-sidebar__item"));
  if (!items.length) return;

  const targets = items.map(() => 0);
  const current = items.map(() => 0);
  let frame = 0;
  let lastTime = 0;

  function run(now) {
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const ease = 1 - Math.exp(-delta / 0.1);
    let moving = false;

    items.forEach((item, index) => {
      const target = targets[index];
      const next = current[index] + (target - current[index]) * ease;
      const settled = Math.abs(target - next) < 0.0015;
      current[index] = settled ? target : next;
      item.style.setProperty("--effect", current[index].toFixed(4));
      if (!settled) moving = true;
    });

    frame = moving ? requestAnimationFrame(run) : 0;
  }

  function start() {
    if (frame) cancelAnimationFrame(frame);
    lastTime = performance.now();
    frame = requestAnimationFrame(run);
  }

  sidebar.addEventListener("pointerleave", () => {
    targets.fill(0);
    start();
  });

  items.forEach((item, index) => {
    item.addEventListener("pointerenter", () => {
      targets.fill(0);
      targets[index] = 1;
      start();
    });

    item.addEventListener("pointerleave", () => {
      targets[index] = 0;
      start();
    });

    item.addEventListener("focus", () => {
      targets.fill(0);
      targets[index] = 1;
      start();
    });

    item.addEventListener("blur", () => {
      targets[index] = 0;
      start();
    });
  });
})();
