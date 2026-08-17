(function () {
  const title = document.querySelector("[data-text-pressure]");
  const cursor = document.querySelector(".glow-cursor");
  let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let eased = { ...pointer };

  function setCursorPosition(x, y) {
    if (cursor) {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;
    }
  }

  setCursorPosition(pointer.x, pointer.y);

  function updatePointer(event) {
    pointer = { x: event.clientX, y: event.clientY };
    setCursorPosition(event.clientX, event.clientY);
    updateCursorHover(event);
  }

  function playCursorClick() {
    if (!cursor) {
      return;
    }

    cursor.classList.remove("is-clicking");
    void cursor.offsetWidth;
    cursor.classList.add("is-clicking");
    window.setTimeout(() => cursor.classList.remove("is-clicking"), 430);
  }

  function updateCursorHover(event) {
    if (!cursor) {
      return;
    }

    const target = event.target;
    const isHoveringAction = target instanceof Element && target.closest("a, button, [role='button'], input, textarea, select, summary, [tabindex]");
    cursor.classList.toggle("is-hovering", Boolean(isHoveringAction));
  }

  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("pointerover", updateCursorHover, { passive: true });
  window.addEventListener("pointerout", updateCursorHover, { passive: true });
  window.addEventListener("pointerdown", playCursorClick, { passive: true });

  if (!title) {
    return;
  }

  const text = title.textContent.trim();
  const chars = Array.from(text);
  let isTitleVisible = false;
  let animationFrame = 0;

  title.textContent = "";
  const spans = chars.map((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    title.appendChild(span);
    return span;
  });

  function distance(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function mapDistance(value, maxDistance, min, max) {
    const amount = max - Math.abs((max * value) / maxDistance);
    return Math.max(min, amount + min);
  }

  function animate() {
    if (!isTitleVisible) {
      animationFrame = 0;
      return;
    }

    eased.x += (pointer.x - eased.x) / 12;
    eased.y += (pointer.y - eased.y) / 12;

    const titleRect = title.getBoundingClientRect();
    const maxDistance = Math.max(1, titleRect.width / 2);

    spans.forEach((span) => {
      const rect = span.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const d = distance(eased, center);
      const weight = Math.floor(mapDistance(d, maxDistance, 100, 800));
      const squeeze = mapDistance(d, maxDistance, 0.78, 1.18).toFixed(2);

      span.style.fontWeight = weight;
      span.style.transform = `scaleY(${squeeze})`;
    });

    animationFrame = window.requestAnimationFrame(animate);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isTitleVisible = entries.some((entry) => entry.isIntersecting);
        if (isTitleVisible && !animationFrame) {
          animationFrame = window.requestAnimationFrame(animate);
        }
      },
      { rootMargin: "160px 0px", threshold: 0.05 }
    );
    observer.observe(title);
  } else {
    isTitleVisible = true;
    animationFrame = window.requestAnimationFrame(animate);
  }
})();
