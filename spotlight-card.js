(function () {
  const cards = document.querySelectorAll(".spotlight-card");

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    });
  });
})();
