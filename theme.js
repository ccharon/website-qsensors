// Light/dark design: the stored choice wins, otherwise the system setting applies.
// Runs in <head>, so data-theme is set before the page is painted.
(function () {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const themeColors = { light: "#dfe9d6", dark: "#161a16" };

  function storedTheme() {
    try {
      const stored = localStorage.getItem("qsensors-theme");
      return stored === "light" || stored === "dark" ? stored : null;
    } catch (e) {
      return null;
    }
  }

  // Applies a design: CSS, browser toolbar color and the matching video.
  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.setAttribute("content", themeColors[theme]);
    });
    document.querySelectorAll(".preview-video").forEach(function (video) {
      if (video.classList.contains("theme-" + theme) && !reducedMotion.matches) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
  }

  root.dataset.theme = storedTheme() || (systemDark.matches ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".theme-toggle").addEventListener("click", function () {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("qsensors-theme", next);
      } catch (e) {}
      applyTheme(next);
    });

    // The system setting applies until the visitor picks a design.
    systemDark.addEventListener("change", function () {
      if (!storedTheme()) {
        applyTheme(systemDark.matches ? "dark" : "light");
      }
    });
    reducedMotion.addEventListener("change", function () {
      applyTheme(root.dataset.theme);
    });
    applyTheme(root.dataset.theme);
  });
})();
