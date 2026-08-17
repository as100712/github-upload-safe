(function () {
  const finalText = "陈翰林";
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const title = document.querySelector("[data-split-flap]");

  if (!title) {
    return;
  }

  const chars = Array.from(finalText);
  const totalDuration = 4000;
  const flipsPerChar = 8;
  const stagger = 140;
  const flipDuration = Math.max(90, Math.floor((totalDuration - stagger * (chars.length - 1)) / flipsPerChar));

  title.setAttribute("aria-label", finalText);
  title.textContent = "";

  const tiles = chars.map(() => {
    const tile = document.createElement("span");
    tile.className = "flap-tile";
    title.appendChild(tile);
    return tile;
  });

  function randomChar() {
    return charset[Math.floor(Math.random() * charset.length)];
  }

  function setTile(tile, char) {
    tile.textContent = char;
  }

  function animateTile(tile, finalChar, delay) {
    window.setTimeout(() => {
      for (let flip = 1; flip <= flipsPerChar; flip += 1) {
        window.setTimeout(() => {
          setTile(tile, flip === flipsPerChar ? finalChar : randomChar());
          tile.classList.remove("is-flipping");
          void tile.offsetWidth;
          tile.classList.add("is-flipping");
        }, flip * flipDuration);
      }
    }, delay);
  }

  tiles.forEach((tile) => setTile(tile, randomChar()));
  tiles.forEach((tile, index) => animateTile(tile, chars[index], index * stagger));
})();
