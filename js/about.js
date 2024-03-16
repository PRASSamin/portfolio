window.onload = function () {
  const progressBars = document.querySelectorAll(".bar");
  const numberElements = document.querySelectorAll(".number");
  const targetPercentages = [96, 95, 80, 80, 40, 75];
  const animationDuration = 1000;
  const intervalDurations = targetPercentages.map(
    (percent) => animationDuration / percent
  );

  function updateProgressBar(
    progressBar,
    numberElement,
    targetPercentage,
    intervalDuration
  ) {
    let currentPercentage = 0;
    const interval = setInterval(function () {
      if (currentPercentage >= targetPercentage) {
        clearInterval(interval);
      } else {
        currentPercentage++;
        progressBar.style.setProperty("--percent", currentPercentage);
        numberElement.setAttribute("data-number", currentPercentage + "%");
      }
    }, intervalDuration);
  }

  progressBars.forEach((progressBar, index) => {
    updateProgressBar(
      progressBar,
      numberElements[index],
      targetPercentages[index],
      intervalDurations[index]
    );
  });
};

document.addEventListener("DOMContentLoaded", function () {
  function animateCounter(counterElement, targetValue, duration) {
    let currentValue = 0;
    const interval = 10;
    const steps = duration / interval;
    const increment = targetValue / steps;

    const counterInterval = setInterval(function () {
      if (currentValue >= targetValue) {
        clearInterval(counterInterval);
      } else {
        currentValue += increment;
        counterElement.textContent = Math.round(currentValue) + "%";
      }
    }, interval);
  }

  const htmlProgressBar = document.querySelector(".html");
  const htmlCounter = document.getElementById("htmlCounter");
  animateCounter(htmlCounter, 96, 1500);
  htmlProgressBar.style.width = "96%";

  const cssProgressBar = document.querySelector(".css");
  const cssCounter = document.getElementById("cssCounter");
  animateCounter(cssCounter, 95, 1500);
  cssProgressBar.style.width = "95%";

  const jsProgressBar = document.querySelector(".js");
  const jsCounter = document.getElementById("jsCounter");
  animateCounter(jsCounter, 79, 1500);
  jsProgressBar.style.width = "80%";

  const nodejsProgressBar = document.querySelector(".nodejs");
  const nodejsCounter = document.getElementById("nodejsCounter");
  animateCounter(nodejsCounter, 79, 1500);
  nodejsProgressBar.style.width = "80%";

  const flutterProgressBar = document.querySelector(".flutter");
  const flutterCounter = document.getElementById("flutterCounter");
  animateCounter(flutterCounter, 40, 1500);
  flutterProgressBar.style.width = "40%";

  const reactjs = document.querySelector(".reactjs");
  const reactjsCounter = document.getElementById("reactjsCounter");
  animateCounter(reactjsCounter, 75, 1500);
  reactjs.style.width = "75%";
});
