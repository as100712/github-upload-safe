(function () {
  const finalText = "CHL";
  const title = document.querySelector("[data-split-flap]");
  const mosaic = document.querySelector(".hero-mosaic");

  if (!title) {
    return;
  }

  title.setAttribute("aria-label", finalText);
  title.textContent = "";

  const tiles = Array.from(finalText).map((char) => {
    const tile = document.createElement("span");
    tile.className = "flap-tile";
    tile.textContent = char;
    title.appendChild(tile);
    return tile;
  });

  function buildMosaic() {
    if (!mosaic || mosaic.children.length) {
      return;
    }

    const cols = 14;
    const rows = 3;
    for (let index = 0; index < cols * rows; index += 1) {
      const block = document.createElement("span");
      block.style.gridColumn = String((index % cols) + 1);
      block.style.gridRow = String(Math.floor(index / cols) + 1);
      block.style.transitionDelay = `${(index % cols) * 42 + Math.floor(index / cols) * 86}ms`;
      mosaic.appendChild(block);
    }
  }

  function startReveal() {
    buildMosaic();
    const hero = document.querySelector(".hero");

    window.setTimeout(() => {
      hero?.classList.add("is-band-visible");
    }, 320);

    window.setTimeout(() => {
      hero?.classList.add("is-mosaic-visible");
    }, 720);

    window.setTimeout(() => {
      mosaic?.classList.add("is-clearing");
    }, 1320);

  }

  if (document.body.classList.contains("site-loading")) {
    tiles.forEach((tile) => tile.classList.add("is-flipping"));
    window.addEventListener("boot:enter", () => window.setTimeout(startReveal, 980), { once: true });
  } else {
    startReveal();
  }
})();
