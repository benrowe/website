document.addEventListener("DOMContentLoaded", function () {
  var bg = document.querySelector(".tron-bg");
  if (!bg) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var targetX = 0, targetY = 0;
  var currentX = 0, currentY = 0;

  document.addEventListener("mousemove", function (e) {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function tick() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    var scrollOffset = window.scrollY * 0.05;

    bg.style.setProperty("--px", currentX.toFixed(3));
    bg.style.setProperty("--py", (currentY + scrollOffset).toFixed(3));

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}, false);
