const API_KEY = "7c8978cd662af28d882cd655a14b88ce";

let currentUnit = "metric";
let currentCity = "";
let searchHistory = [];

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const geoBtn = document.getElementById("geoBtn");
const statusMessage = document.getElementById("statusMessage");
const weatherContent = document.getElementById("weatherContent");
const skeleton = document.getElementById("skeleton");
const historyPills = document.getElementById("historyPills");

const cityNameEl = document.getElementById("cityName");
const temperatureEl = document.getElementById("temperature");
const weatherIconEl = document.getElementById("weatherIcon");
const descriptionEl = document.getElementById("description");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const pressureEl = document.getElementById("pressure");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const localTimeEl = document.getElementById("localTime");
const localDateEl = document.getElementById("localDate");
const forecastStrip = document.getElementById("forecastStrip");
const uvIndexEl = document.getElementById("uvIndex");
const uvBarEl = document.getElementById("uvBar");
const cloudCoverEl = document.getElementById("cloudCover");
const cloudFillEl = document.getElementById("cloudFill");
const minMaxEl = document.getElementById("minMax");

const unitMetricBtn = document.getElementById("unitMetricBtn");
const unitImperialBtn = document.getElementById("unitImperialBtn");
const themeToggle = document.getElementById("themeToggle");
const appBody = document.body;

// Load saved data
function loadSavedData() {
  const savedHistory = localStorage.getItem("weatherSearchHistory");
  if (savedHistory) {
    try {
      searchHistory = JSON.parse(savedHistory);
    } catch {
      searchHistory = [];
    }
    renderHistoryPills();
  }
  const savedUnit = localStorage.getItem("weatherUnit");
  if (savedUnit === "metric" || savedUnit === "imperial") {
    currentUnit = savedUnit;
  }
  setActiveUnitButton();

  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) appBody.classList.add("dark");
}

// ... (rest of your original JS remains unchanged - only minor fixes below)

function setActiveUnitButton() {
  unitMetricBtn.classList.toggle("active", currentUnit === "metric");
  unitImperialBtn.classList.toggle("active", currentUnit === "imperial");
}

// Visibility was missing in original HTML - added above
// Rest of functions are kept as you provided (searchWeather, displayCurrentWeather, etc.)

// Initial load
window.addEventListener("load", () => {
  loadSavedData();
  const lastCity = searchHistory[0];
  if (lastCity) {
    cityInput.value = lastCity;
    searchWeather(lastCity);
  } else {
    cityInput.value = "London";
    searchWeather("London");
  }
});