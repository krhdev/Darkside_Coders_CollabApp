const WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1';
console.log("script.js loaded");
function getRecommendations(weather, temp) {
    let outfit = "";
    const dontForget = [];
    if (temp < 5) {
        outfit = "Heavy coat, gloves, scarf and boots.";
        dontForget.push("🧤 Gloves", "🧣 Scarf");
    } else if (temp < 12) {
        outfit = "Jacket, jeans and trainers.";
    } else if (temp < 20) {
        outfit = "Light jumper and trousers.";
    } else {
        outfit = "T-shirt, shorts and sunglasses.";
        dontForget.push("🕶️ Sunglasses", "🧴 Sun Cream");
    }
    const condition = weather.toLowerCase();
    if (
        condition.includes("rain") ||
        condition.includes("drizzle") ||
        condition.includes("shower")
    ) {
        dontForget.push("☂️ Umbrella");
    }
    if (condition.includes("snow")) {
        dontForget.push("🥾 Winter Boots");
    }
    return { outfit, dontForget };
}
async function getWeather(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("City not found. Please check the name and try again.");
        }
        throw new Error(`Weather API Error (${response.status})`);
    }
    return response.json();
}
async function searchWeather() {
    console.log("Search button clicked");
    const city = document.getElementById("searchInput").value.trim();
    const resultTemp = document.getElementById("resulttemp");
    const resultClothes = document.getElementById("resultclothes");
    const resultAccessories = document.getElementById("resultaccessories");
    if (!city) {
        alert("Please enter a city");
        return;
    }
    const cityRegex = /^[a-zA-ZÀ-ÿ\s\-'\.]{2,}$/;
    if (!cityRegex.test(city)) {
        resultTemp.innerHTML = "<p>Please enter a valid city name.</p>";
        resultClothes.innerHTML = "";
        resultAccessories.innerHTML = "";
        return;
    }
    try {
        resultTemp.innerHTML = "<p>Loading...</p>";
        resultClothes.innerHTML = "";
        resultAccessories.innerHTML = "";
        const weatherData = await getWeather(city);
        const recommendation = getRecommendations(
            weatherData.weather[0].main,
            weatherData.main.temp
        );
        resultTemp.innerHTML = `${Math.round(weatherData.main.temp)}°C — ${weatherData.weather[0].description}`;
        resultClothes.innerHTML = recommendation.outfit;
        resultAccessories.innerHTML = recommendation.dontForget.length
            ? recommendation.dontForget.map(item => `<li>${item}</li>`).join("")
            : "Nothing special needed today.";
    } catch (error) {
        console.error(error);
        resultTemp.innerHTML = `<p>Error: ${error.message}</p>`;
        resultClothes.innerHTML = "";
        resultAccessories.innerHTML = "";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    if (!searchBtn) {
        console.error("searchBtn not found");
        return;
    }
    if (!searchInput) {
        console.error("searchInput not found");
        return;
    }
    searchBtn.addEventListener("click", searchWeather);
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            searchWeather();
        }
    });
});