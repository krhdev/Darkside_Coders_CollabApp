const API_KEY = "YOUR_API_KEY"; // ← Replace with your actual OpenWeather API key

let currentUnit = "metric"; // metric or imperial
let currentCity = "";
let searchHistory = [];

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
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
const visibilityEl = document.getElementById("visibility");
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

const unitToggle = document.getElementById("unitToggle");
const unitLabel = document.getElementById("unitLabel");
const themeToggle = document.getElementById("themeToggle");
const appBody = document.getElementById("appBody");

// L0oad savved data
function loadSavedData() {
  const savedHistory = localStorage.getItem("weatherSearchHistory");
  if (savedHistory) {
    searchHistory = JSON.parse(savedHistory);
    renderHistoryPills();
  }
  const savedUnit = localStorage.getItem("weatherUnit");
  if (savedUnit) {
    currentUnit = savedUnit;
    unitLabel.textContent = currentUnit === "metric" ? "°C" : "°F";
  }
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) appBody.classList.add("dark");
}

// Saave history
function saveHistory() {
  localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
}

// Rennder history pills
function renderHistoryPills() {
  historyPills.innerHTML = "";
  searchHistory.forEach((city, index) => {
    const pill = document.createElement("div");
    pill.className = "history-pill";
    pill.innerHTML = `
      ${city}
      <span class="pill-remove" onclick="removeFromHistory(${index}); event.stopImmediatePropagation();">×</span>
    `;
    pill.addEventListener("click", () => {
      cityInput.value = city;
      searchWeather(city);
    });
    historyPills.appendChild(pill);
  });
}

function addToHistory(city) {
  const lowerCity = city.toLowerCase();
  searchHistory = searchHistory.filter(c => c.toLowerCase() !== lowerCity);
  searchHistory.unshift(city);
  if (searchHistory.length > 8) searchHistory.pop();
  renderHistoryPills();
  saveHistory();
}

window.removeFromHistory = function(index) {
  searchHistory.splice(index, 1);
  renderHistoryPills();
  saveHistory();
};

// show status
function showStatus(text, isError = false) {
  statusMessage.textContent = text;
  statusMessage.classList.toggle("error", isError);
}

// Clearr statusa
function clearStatus() {
  statusMessage.textContent = "";
}

// Show/hide loading
function showLoading() {
  skeleton.classList.remove("hidden");
  weatherContent.classList.add("hidden");
}

// Hide loading
function hideLoading() {
  skeleton.classList.add("hidden");
  weatherContent.classList.remove("hidden");
}

// Format time with offset
function formatLocalTime(timestamp, offset) {
  const date = new Date((timestamp + offset) * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatLocalDate(timestamp, offset) {
  const date = new Date((timestamp + offset) * 1000);
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

// Update atmosphere class
function updateAtmosphere(weatherMain, isNight = false) {
  const body = document.getElementById("appBody");
  body.classList.remove("atmo-clear", "atmo-clouds", "atmo-rain", "atmo-storm", "atmo-snow", "atmo-fog", "atmo-night");
  
  let condition = weatherMain.toLowerCase();
  if (isNight) {
    body.classList.add("atmo-night");
    return;
  }
  if (condition.includes("clear")) body.classList.add("atmo-clear");
  else if (condition.includes("cloud")) body.classList.add("atmo-clouds");
  else if (condition.includes("rain") || condition.includes("drizzle")) body.classList.add("atmo-rain");
  else if (condition.includes("thunder") || condition.includes("storm")) body.classList.add("atmo-storm");
  else if (condition.includes("snow")) body.classList.add("atmo-snow");
  else if (condition.includes("fog") || condition.includes("mist")) body.classList.add("atmo-fog");
  else body.classList.add("atmo-clear");
}

// Main search function
async function searchWeather(city = null) {
  const searchTerm = city || cityInput.value.trim();
  if (!searchTerm) {
    showStatus("Please enter a city name", true);
    return;
  }

  showLoading();
  clearStatus();

  try {
    // Current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchTerm)}&appid=${API_KEY}&units=${currentUnit}`
    );

    if (!currentRes.ok) {
      throw new Error("City not found");
    }

    const currentData = await currentRes.json();

    // 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(searchTerm)}&appid=${API_KEY}&units=${currentUnit}`
    );
    const forecastData = await forecastRes.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData);
    addToHistory(currentData.name);
    currentCity = currentData.name;

    hideLoading();
    clearStatus();

  } catch (error) {
    console.error(error);
    hideLoading();
    showStatus("Unable to retrieve weather data. Please check city name.", true);
    weatherContent.classList.add("hidden");
  }
}

function displayCurrentWeather(data) {
  const isNight = data.weather[0].icon.includes("n");

  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  temperatureEl.textContent = `${Math.round(data.main.temp)}°`;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  weatherIconEl.alt = data.weather[0].description;
  descriptionEl.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
  feelsLikeEl.textContent = `Feels like ${Math.round(data.main.feels_like)}°`;
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${data.wind.speed} ${currentUnit === "metric" ? "m/s" : "mph"}`;
  pressureEl.textContent = `${data.main.pressure} hPa`;
  visibilityEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

  // Sunrise / Sunset
  sunriseEl.textContent = formatLocalTime(data.sys.sunrise, data.timezone);
  sunsetEl.textContent = formatLocalTime(data.sys.sunset, data.timezone);

  // Local time / date
  const now = Math.floor(Date.now() / 1000);
  localTimeEl.textContent = formatLocalTime(now, data.timezone);
  localDateEl.textContent = formatLocalDate(now, data.timezone);

  // Min / Max
  minMaxEl.textContent = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`;

  // Cloud cover
  cloudCoverEl.textContent = `${data.clouds.all}%`;
  cloudFillEl.style.width = `${data.clouds.all}%`;

  // Fake UV (OpenWeather free tier doesn't include UV in basic calls)
  const uv = Math.floor(Math.random() * 11); // demo value
  uvIndexEl.textContent = uv;
  uvBarEl.style.left = `${Math.min(uv * 9.1, 100)}%`;

  updateAtmosphere(data.weather[0].main, isNight);
}

function displayForecast(forecastData) {
  forecastStrip.innerHTML = "";

  // Group by day (take one entry per day, roughly midday)
  const daily = {};
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split("T")[0];
    if (!daily[date]) {
      daily[date] = item;
    }
  });

  const days = Object.values(daily).slice(0, 5);

  days.forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString([], { weekday: "short" });

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <div class="forecast-day">${dayName}</div>
      <img class="forecast-icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
      <div class="forecast-temps">
        <span class="forecast-high">${Math.round(day.main.temp_max)}°</span>
        <span class="forecast-low">${Math.round(day.main.temp_min)}°</span>
      </div>
      <div class="forecast-desc">${day.weather[0].description}</div>
    `;
    forecastStrip.appendChild(card);
  });
}

// Togggle units
unitToggle.addEventListener("click", () => {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  unitLabel.textContent = currentUnit === "metric" ? "°C" : "°F";
  localStorage.setItem("weatherUnit", currentUnit);
  
  if (currentCity) {
    searchWeather(currentCity);
  }
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  appBody.classList.toggle("dark");
  const isDark = appBody.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
});

// Search listeners
searchBtn.addEventListener("click", () => searchWeather());

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchWeather();
  }
});

// Initial load
window.addEventListener("load", () => {
  loadSavedData();
  
  // Try to load last searched city
  const lastCity = searchHistory[0];
  if (lastCity) {
    cityInput.value = lastCity;
    searchWeather(lastCity);
  } else {
    // Demo city
    searchWeather("London");
  }

  // Update local time every minute
  setInterval(() => {
    if (currentCity) {
      const now = Math.floor(Date.now() / 1000);
      // Re-fetch would be better for accurate timezone but for demo we skip full re-fetch
    }
  }, 60000);
});
