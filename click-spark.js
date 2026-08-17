(function () {
  const options = {
    sparkColor: "#ffe45e",
    sparkSize: 8,
    sparkRadius: 14,
    sparkCount: 6,
    duration: 500,
    easing: "ease-out",
    extraScale: 1,
  };

  function createSpark(x, y, index) {
    const angle = (Math.PI * 2 * index) / options.sparkCount;
    const distance = options.sparkRadius * options.extraScale;
    const spark = document.createElement("span");

    spark.className = "click-spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.width = `${options.sparkSize}px`;
    spark.style.background = options.sparkColor;

    document.body.appendChild(spark);

    const rotation = `rotate(${angle}rad)`;
    const animation = spark.animate(
      [
        {
          opacity: 1,
          transform: `translateY(-1px) ${rotation} scaleX(0.25)`,
        },
        {
          opacity: 1,
          transform: `translateY(-1px) ${rotation} translateX(${distance}px) scaleX(1)`,
          offset: 0.45,
        },
        {
          opacity: 0,
          transform: `translateY(-1px) ${rotation} translateX(${distance}px) scaleX(0)`,
        },
      ],
      {
        duration: options.duration,
        easing: options.easing,
        fill: "forwards",
      },
    );

    animation.addEventListener("finish", () => spark.remove());
  }

  window.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    for (let index = 0; index < options.sparkCount; index += 1) {
      createSpark(event.clientX, event.clientY, index);
    }
  });
})();
