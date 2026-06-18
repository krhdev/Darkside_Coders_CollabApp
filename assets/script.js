
const WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1';

function getRecommendations(weather, temp) {

    let outfit = "";
    let dontForget = [];

    if (temp < 5) {
        outfit = "Heavy coat, gloves, scarf and boots.";
        dontForget.push("🧤 Gloves");
        dontForget.push("🧣 Scarf");
    } else if (temp < 12) {
        outfit = "Jacket, jeans and trainers.";
    } else if (temp < 20) {
        outfit = "Light jumper and trousers.";
    } else {
        outfit = "T-shirt, shorts and sunglasses.";
        dontForget.push("🕶️ Sunglasses");
        dontForget.push("🧴 Sun Cream");
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
        dontForget.push("🧤 Gloves");
    }

    if (
        condition.includes("thunderstorm") ||
        condition.includes("storm")
    ) {
        dontForget.push("⚡ Waterproof Jacket");
    }

    return {
        outfit,
        dontForget
    };
}

async function getWeather(city) {

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Weather API returned ${response.status}`);
    }

    return await response.json();
}

async function searchWeather() {

    const city = document.getElementById("searchInput").value.trim();

    if (!city) {
        alert("Please enter a city");
        return;
    }

    const results = document.getElementById("results");

    try {

        console.log("Searching:", city);

        results.innerHTML = "<p>Loading...</p>";

        const weatherData = await getWeather(city);

        const recommendation = getRecommendations(
            weatherData.weather[0].main,
            weatherData.main.temp
        );

        results.innerHTML = `
            <h2>${weatherData.name}</h2>

            <p>
                <strong>Weather:</strong>
                ${weatherData.weather[0].description}
            </p>

            <p>
                <strong>Temperature:</strong>
                ${Math.round(weatherData.main.temp)}°C
            </p>

            <h3>What to Wear</h3>
            <p>${recommendation.outfit}</p>

            <h3>Don't Forget</h3>

            <ul>
                ${
                    recommendation.dontForget.length
                        ? recommendation.dontForget
                            .map(item => `<li>${item}</li>`)
                            .join("")
                        : "<li>Nothing special needed today.</li>"
                }
            </ul>
        `;

    } catch (error) {

        console.error(error);

        results.innerHTML = `
            <p>Error: ${error.message}</p>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {

    console.log("Weather Wear loaded");

    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");

    searchBtn.addEventListener("click", searchWeather);

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchWeather();
        }
    });

});