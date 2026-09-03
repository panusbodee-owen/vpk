/**
 * Site-wide theme widget — floating light/dark toggle + accent color picker.
 * Pairs with theme.css (CSS variables) and the tiny inline anti-flash script
 * that must run in <head> before any stylesheet (sets data-theme/data-accent
 * on <html> synchronously from localStorage so the page never flashes the
 * wrong theme on load).
 */
(function () {
  "use strict";

  var STORAGE_KEY_THEME = "vpk-theme"; // "dark" | "light"
  var STORAGE_KEY_ACCENT = "vpk-accent"; // "aurora" | "ocean" | "forest" | "sunset"

  var ACCENTS = [
    { id: "aurora", grad: "linear-gradient(135deg, #ed9b4c, #f472b6, #a78bfa)", label: "Aurora" },
    { id: "ocean", grad: "linear-gradient(135deg, #22d3ee, #38bdf8, #6366f1)", label: "Ocean" },
    { id: "forest", grad: "linear-gradient(135deg, #a3e635, #4ade80, #16a34a)", label: "Forest" },
    { id: "sunset", grad: "linear-gradient(135deg, #fb923c, #f43f5e, #ec4899)", label: "Sunset" },
  ];

  function getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY_THEME) || "dark";
    } catch (e) {
      return "dark";
    }
  }

  function getAccent() {
    try {
      return localStorage.getItem(STORAGE_KEY_ACCENT) || "aurora";
    } catch (e) {
      return "aurora";
    }
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {
      /* private browsing / storage disabled — theme still applies for this load */
    }
  }

  function setAccent(accent) {
    if (accent === "aurora") {
      delete document.documentElement.dataset.accent;
    } else {
      document.documentElement.dataset.accent = accent;
    }
    try {
      localStorage.setItem(STORAGE_KEY_ACCENT, accent);
    } catch (e) {
      /* ignore */
    }
  }

  function buildWidget() {
    var wrap = document.createElement("div");
    wrap.className = "theme-widget";

    var toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "theme-widget__toggle";
    toggleBtn.setAttribute("aria-label", "สลับโหมดสว่าง/มืด");
    toggleBtn.textContent = getTheme() === "light" ? "☀️" : "🌙";
    toggleBtn.addEventListener("click", function () {
      var next = getTheme() === "light" ? "dark" : "light";
      setTheme(next);
      toggleBtn.textContent = next === "light" ? "☀️" : "🌙";
    });

    var swatchWrap = document.createElement("div");
    swatchWrap.className = "theme-widget__swatches";

    var currentAccent = getAccent();
    var swatchButtons = [];
    ACCENTS.forEach(function (accent) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "theme-widget__swatch" + (accent.id === currentAccent ? " is-active" : "");
      btn.style.setProperty("--swatch-grad", accent.grad);
      btn.setAttribute("aria-label", "โทนสี " + accent.label);
      btn.title = accent.label;
      btn.addEventListener("click", function () {
        setAccent(accent.id);
        swatchButtons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
      });
      swatchButtons.push(btn);
      swatchWrap.appendChild(btn);
    });

    wrap.appendChild(toggleBtn);
    wrap.appendChild(swatchWrap);
    document.body.appendChild(wrap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();
