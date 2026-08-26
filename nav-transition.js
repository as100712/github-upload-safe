(function () {
  const links = document.querySelectorAll(".side-dock .dock-item");
  const overlay = document.querySelector(".nav-transition");
  const root = document.documentElement;
  const body = document.body;

  if (!links.length || !overlay) {
    return;
  }

  let timer = 0;
  const clickAudio = new Audio("assets/ui-click.mp3");
  const transitionAudio = new Audio("assets/nav-transition.mp3");
  const panels = Array.from(overlay.querySelectorAll("span"));
  const emojis = [":)", ":D", ":P", ":O", ":/", ";)", "XD", "-_-", "T_T", "O_O", "o_o", "^_^", ">_<", "=]"];
  clickAudio.preload = "auto";
  clickAudio.volume = 0.42;
  transitionAudio.preload = "auto";
  transitionAudio.volume = 0.55;

  panels.forEach((panel) => {
    if (!panel.querySelector(".nav-transition__face")) {
      const face = document.createElement("i");
      face.className = "nav-transition__face";
      face.setAttribute("aria-hidden", "true");
      panel.appendChild(face);
    }
  });

  function randomizeFaces() {
    panels.forEach((panel) => {
      const face = panel.querySelector(".nav-transition__face");
      if (!face) {
        return;
      }

      const rotate = Math.floor(Math.random() * 13) - 6;
      const size = 0.82 + Math.random() * 0.28;

      face.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      face.style.setProperty("--face-rotate", `${rotate}deg`);
      face.style.setProperty("--face-scale", size.toFixed(2));
    });
  }

  function clearTransition() {
    body.classList.remove("is-nav-transitioning");
    root.classList.remove("is-nav-jump");
  }

  function jumpTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    root.classList.add("is-nav-jump");
    target.scrollIntoView({ behavior: "auto", block: "start" });
    history.replaceState(null, "", `#${targetId}`);
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) {
        return;
      }

      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      window.clearTimeout(timer);
      randomizeFaces();
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
      transitionAudio.currentTime = 0;
      window.setTimeout(() => {
        transitionAudio.play().catch(() => {});
        body.classList.add("is-nav-transitioning");
      }, 500);

      timer = window.setTimeout(() => {
        jumpTo(targetId);
      }, 920);

      window.setTimeout(() => {
        clearTransition();
      }, 1480);
    });
  });
})();
