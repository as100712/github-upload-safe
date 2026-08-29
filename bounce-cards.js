(function () {
  const galleries = document.querySelectorAll(".gallery-shell");

  if (!galleries.length) {
    return;
  }

  function initGallery(shell) {
    const gallery = shell.querySelector(".bounce-cards");
    const cards = shell.querySelectorAll(".bounce-card");
    const prevButton = shell.querySelector("[data-gallery-prev]");
    const nextButton = shell.querySelector("[data-gallery-next]");
    const dots = document.createElement("div");
    const dotButtons = [];

    if (!gallery || !cards.length) {
      return;
    }

    cards.forEach((card) => card.classList.add("is-visible"));
    dots.className = "gallery-dots";
    dots.setAttribute("aria-label", "作品位置");
    cards.forEach((card, index) => {
      const dot = document.createElement("button");
      dot.className = "gallery-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `第 ${index + 1} 个作品`);
      dot.addEventListener("click", () => {
        pauseAutoScroll();
        card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
      dotButtons.push(dot);
      dots.appendChild(dot);
    });
    shell.appendChild(dots);

    let isDragging = false;
    let isInteracting = false;
    let didDrag = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let wheelTarget = gallery.scrollLeft;
    let wheelFrame = 0;
    let pauseTimer = 0;
    let autoTarget = gallery.scrollLeft;
    let isAutoMoving = false;
    let scrollSyncTimer = 0;
    let isInView = true;

    function pauseAutoScroll(duration = 900) {
      isInteracting = true;
      window.clearTimeout(pauseTimer);
      pauseTimer = window.setTimeout(() => {
        if (!isDragging) {
          isInteracting = false;
        }
      }, duration);
    }

    function scrollGallery(direction) {
      const firstCard = cards[0];
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 360;
      const styles = window.getComputedStyle(gallery);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      pauseAutoScroll();
      gallery.scrollBy({
        left: direction * (cardWidth + gap),
        behavior: "smooth",
      });
    }

    function updateDots() {
      if (!dotButtons.length) {
        return;
      }

      const galleryRect = gallery.getBoundingClientRect();
      const galleryCenter = galleryRect.left + galleryRect.width / 2;
      let activeIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(center - galleryCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeIndex = index;
        }
      });

      dotButtons.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
      });
    }

    function animateWheelScroll() {
      const distance = wheelTarget - gallery.scrollLeft;
      gallery.scrollLeft += distance * 0.12;
      autoTarget = gallery.scrollLeft;

      if (Math.abs(distance) > 0.5) {
        wheelFrame = requestAnimationFrame(animateWheelScroll);
      } else {
        gallery.scrollLeft = wheelTarget;
        autoTarget = gallery.scrollLeft;
        wheelFrame = 0;
      }
    }

    function normalizeLoop(value) {
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;
      if (maxScroll <= 0) {
        return 0;
      }

      if (value >= maxScroll - 1) {
        return 0;
      }

      if (value <= 1) {
        return maxScroll;
      }

      return value;
    }

    function autoScrollGallery() {
      if (isInView && !isInteracting && gallery.scrollWidth > gallery.clientWidth && !document.querySelector("dialog[open]")) {
        gallery.classList.add("is-auto-scrolling");
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;
        autoTarget = autoTarget >= maxScroll ? 0 : autoTarget + 0.7;
        isAutoMoving = true;
        gallery.scrollLeft = autoTarget;
        requestAnimationFrame(() => {
          isAutoMoving = false;
        });
        wheelTarget = gallery.scrollLeft;
      } else {
        gallery.classList.remove("is-auto-scrolling");
      }

      window.setTimeout(autoScrollGallery, 34);
    }

    prevButton?.addEventListener("click", () => scrollGallery(-1));
    nextButton?.addEventListener("click", () => scrollGallery(1));

    gallery.addEventListener(
      "wheel",
      (event) => {
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

        if (!delta) {
          return;
        }

        event.preventDefault();
        pauseAutoScroll();
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;
        wheelTarget = normalizeLoop(Math.max(0, Math.min(maxScroll, wheelTarget + delta * 0.75)));

        if (!wheelFrame) {
          wheelFrame = requestAnimationFrame(animateWheelScroll);
        }
      },
      { passive: false }
    );

    gallery.addEventListener("scroll", () => {
      updateDots();
      if (isAutoMoving || isDragging || wheelFrame) {
        return;
      }

      autoTarget = gallery.scrollLeft;
      wheelTarget = gallery.scrollLeft;
      isInteracting = true;
      window.clearTimeout(scrollSyncTimer);
      scrollSyncTimer = window.setTimeout(() => {
        if (!isDragging) {
          isInteracting = false;
        }
      }, 1400);
    });

    gallery.addEventListener("pointerdown", (event) => {
      if (event.target.closest("[data-card-zoom], [data-media-element], [data-view-all], [data-gallery-prev], [data-gallery-next], .gallery-dot")) {
        return;
      }

      isDragging = true;
      isInteracting = true;
      didDrag = false;
      dragStartX = event.clientX;
      dragStartScroll = gallery.scrollLeft;
      wheelTarget = gallery.scrollLeft;
      gallery.classList.add("is-dragging");
      gallery.setPointerCapture(event.pointerId);
    });

    gallery.addEventListener("pointermove", (event) => {
      if (!isDragging) {
        return;
      }

      const dragDistance = event.clientX - dragStartX;
      if (Math.abs(dragDistance) < 6) {
        return;
      }

      didDrag = true;
      gallery.scrollLeft = normalizeLoop(dragStartScroll - dragDistance * 1.05);
      wheelTarget = gallery.scrollLeft;
      autoTarget = gallery.scrollLeft;
    });

    function stopDragging(event) {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      gallery.classList.remove("is-dragging");
      if (gallery.hasPointerCapture(event.pointerId)) {
        gallery.releasePointerCapture(event.pointerId);
      }
      pauseAutoScroll(700);
    }

    gallery.addEventListener("pointerup", stopDragging);
    gallery.addEventListener("pointercancel", stopDragging);
    gallery.addEventListener(
      "click",
      (event) => {
        const wasDrag = didDrag;
        didDrag = false;

        if (wasDrag) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          isInView = entries.some((entry) => entry.isIntersecting);
        },
        { rootMargin: "180px 0px", threshold: 0.05 }
      );
      observer.observe(shell);
    }

    updateDots();
    window.setTimeout(autoScrollGallery, 34);
  }

  galleries.forEach(initGallery);
})();
