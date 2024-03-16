const Dark = document.getElementById("switchDark");
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme("light");
}

function applyTheme(theme) {
  if (theme === "dark") {
    console.log("dark mode");

    document.documentElement.setAttribute("data-theme", "dark");

    const Icon = document.getElementById("switchIcon");

    Icon.classList.remove("fa-moon");
    Icon.classList.add("fa-sun");

    document.documentElement.style.setProperty("--mtext", "#ffffff");
    document.documentElement.style.setProperty("--bg", "#1a1922");
    document.documentElement.style.setProperty("--s-border", "#ffffff");
    document.documentElement.style.setProperty("--allpro-b", "#c7c9d3");
    document.documentElement.style.setProperty("--stext", "#c7c9d3");
    document.documentElement.style.setProperty(
      "--d-button-bg",
      "rgba(255, 255, 255, 0.8)"
    );
    document.documentElement.style.setProperty("--d-button-color", "#000000");
    document.documentElement.style.setProperty("--d-button-hover", "#ffffff");
    document.documentElement.style.setProperty(
      "--social-bg",
      "rgba(255, 255, 255, 0.8)"
    );
    document.documentElement.style.setProperty(
      "--social-icon",
      "rgb(75, 75, 75)"
    );
    document.documentElement.style.setProperty(
      "--social-icon-hover",
      "rgb(0, 0, 0)"
    );
    document.documentElement.style.setProperty(
      "--bottom-icon",
      "rgba(179, 179, 179, 0.8)"
    );
    document.documentElement.style.setProperty(
      "--bottom-icon-hover",
      "rgb(255, 255, 255)"
    );
    document.documentElement.style.setProperty("--blog-button", "#fff");
    document.documentElement.style.setProperty("--blog-button-hover", "#000");
    document.documentElement.style.setProperty(
      "--bgImg",
      "url(../images/dark-bg.svg)"
    );
    document.documentElement.style.setProperty(
      "--gtop",
      "rgba(245, 245, 241, 0)"
    );
    document.documentElement.style.setProperty("--gbottom", "#f5f5f11c");
    document.documentElement.style.setProperty(
      "--pras-logo",
      "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7454%) hue-rotate(22deg) brightness(101%) contrast(86%)"
    );
    document.documentElement.style.setProperty(
      "--blog-g-top",
      "rgba(1,3,20,0)"
    );
    document.documentElement.style.setProperty(
      "--blog-g-bottom",
      "rgba(0,0,0,1)"
    );
    document.documentElement.style.setProperty("--bottom-border", "#c7c9d3");
    document.documentElement.style.setProperty("--pras-htext", "#39FF14");
    document.documentElement.style.setProperty("--pras-h-border", "#127700");
    document.documentElement.style.setProperty("--pras-soc-bad-text", "#000");
    document.documentElement.style.setProperty(
      "--pras-himg",
      "brightness(0) saturate(100%) invert(65%) sepia(43%) saturate(1633%) hue-rotate(63deg) brightness(114%) contrast(103%)"
    );
    document.documentElement.style.setProperty("--shahtml", "#542a19");
    document.documentElement.style.setProperty("--shacss", "#17414f");
    document.documentElement.style.setProperty("--shajs", "#59590c");
    document.documentElement.style.setProperty("--shanode", "#4b690b");
    document.documentElement.style.setProperty("--shaflut", "#4e517e");
    document.documentElement.style.setProperty("--shareact", "#093f51");
  } else {
    const Icon = document.getElementById("switchIcon");

    Icon.classList.add("fa-moon");
    Icon.classList.remove("fa-sun");

    console.log("light mode");
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.style.setProperty("--mtext", "#000");
    document.documentElement.style.setProperty("--bg", "#ffffff");
    document.documentElement.style.setProperty("--s-border", "#000");
    document.documentElement.style.setProperty("--allpro-b", "#444444");
    document.documentElement.style.setProperty("--stext", "#444444");
    document.documentElement.style.setProperty(
      "--d-button-bg",
      "rgba(0, 0, 0, 0.800)"
    );
    document.documentElement.style.setProperty("--d-button-color", "#fff");
    document.documentElement.style.setProperty("--d-button-hover", "#000000");
    document.documentElement.style.setProperty(
      "--social-bg",
      "rgba(0, 0, 0, 0.800)"
    );
    document.documentElement.style.setProperty(
      "--social-icon",
      "rgba(255, 255, 255, 0.5)"
    );
    document.documentElement.style.setProperty("--social-icon-hover", "#fff");
    document.documentElement.style.setProperty(
      "--bottom-icon",
      "rgba(90, 90, 90, 0.8)"
    );
    document.documentElement.style.setProperty("--bottom-icon-hover", "#000");
    document.documentElement.style.setProperty("--blog-button", "#000");
    document.documentElement.style.setProperty(
      "--blog-button-hover",
      "#ffffff"
    );
    document.documentElement.style.setProperty(
      "--bgImg",
      "url(../images/white-bg.svg)"
    );
    document.documentElement.style.setProperty(
      "--gtop",
      "rgba(245, 245, 241, 0)"
    );
    document.documentElement.style.setProperty(
      "--gbottom",
      "rgb(212, 212, 212)"
    );
    document.documentElement.style.setProperty(
      "--pras-logo",
      "brightness(0) saturate(100%) invert(0%) sepia(100%) saturate(0%) hue-rotate(21deg) brightness(97%) contrast(103%)"
    );
    document.documentElement.style.setProperty(
      "--blog-g-top",
      "rgba(1,3,20,0)"
    );
    document.documentElement.style.setProperty(
      "--blog-g-bottom",
      "rgba(255,255,255,1)"
    );
    document.documentElement.style.setProperty("--bottom-border", "#000");
    document.documentElement.style.setProperty("--pras-htext", "#FF6700");
    document.documentElement.style.setProperty("--pras-h-border", "#833807");
    document.documentElement.style.setProperty("--pras-soc-bad-text", "#fff");
    document.documentElement.style.setProperty(
      "--pras-himg",
      "brightness(0) saturate(100%) invert(47%) sepia(42%) saturate(6216%) hue-rotate(4deg) brightness(108%) contrast(101%)"
    );
    document.documentElement.style.setProperty("--shahtml", "#ffa78487");
    document.documentElement.style.setProperty("--shacss", "#71d8fa8c");
    document.documentElement.style.setProperty("--shajs", "#ffff747e");
    document.documentElement.style.setProperty("--shanode", "#d5ff7b8a");
    document.documentElement.style.setProperty("--shaflut", "#939aff7d");
    document.documentElement.style.setProperty("--shareact", "#93e4ff77");
  }
}

Dark.addEventListener("click", function () {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  applyTheme(currentTheme);

  localStorage.setItem("theme", currentTheme);
});
