(function () {
  const cards = document.querySelectorAll("[data-profile-card]");

  cards.forEach((card) => {
    let frameId = null;
    const current = { x: 50, y: 50, rx: 0, ry: 0 };
    const target = { x: 50, y: 50, rx: 0, ry: 0 };

    function renderCard() {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      current.rx += (target.rx - current.rx) * 0.14;
      current.ry += (target.ry - current.ry) * 0.14;

      card.style.setProperty("--pointer-x", `${current.x.toFixed(2)}%`);
      card.style.setProperty("--pointer-y", `${current.y.toFixed(2)}%`);
      card.style.setProperty("--background-x", `${(35 + current.x * 0.3).toFixed(2)}%`);
      card.style.setProperty("--background-y", `${(35 + current.y * 0.3).toFixed(2)}%`);
      card.style.setProperty("--pointer-from-left", `${(current.x / 100).toFixed(3)}`);
      card.style.setProperty("--pointer-from-top", `${(current.y / 100).toFixed(3)}`);
      card.style.setProperty("--pointer-from-center", `${Math.min(Math.hypot(current.x - 50, current.y - 50) / 50, 1).toFixed(3)}`);
      card.style.setProperty("--rotate-x", `${current.rx.toFixed(2)}deg`);
      card.style.setProperty("--rotate-y", `${current.ry.toFixed(2)}deg`);

      const settled =
        Math.abs(target.x - current.x) < 0.05 &&
        Math.abs(target.y - current.y) < 0.05 &&
        Math.abs(target.rx - current.rx) < 0.02 &&
        Math.abs(target.ry - current.ry) < 0.02;

      frameId = settled ? null : window.requestAnimationFrame(renderCard);
    }

    function startRender() {
      if (!frameId) {
        frameId = window.requestAnimationFrame(renderCard);
      }
    }

    function setCardPointer(event) {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));
      const rotateX = (percentX - 50) / 8;
      const rotateY = -(percentY - 50) / 9;

      target.x = percentX;
      target.y = percentY;
      target.rx = rotateX;
      target.ry = rotateY;
      card.classList.add("is-active");
      startRender();
    }

    function resetCardPointer() {
      target.x = 50;
      target.y = 50;
      target.rx = 0;
      target.ry = 0;
      card.classList.remove("is-active");
      startRender();
    }

    card.addEventListener("pointermove", setCardPointer);
    card.addEventListener("pointerleave", resetCardPointer);
    card.addEventListener("pointerdown", () => {
      card.classList.toggle("is-flipped");
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.classList.toggle("is-flipped");
      }
    });
  });
})();
