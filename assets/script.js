const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1';
const MAX_DAILY_FORECAST = 5;

function getRecommendations(weather, temp) {

    let outfit = "";
    let dontForget = [];

    if (temp < 5) {
        outfit = "Heavy coat, gloves, scarf and boots.";
        dontForget.push("🧤 Gloves");
        dontForget.push("🧣 Scarf");
    }
    else if (temp < 12) {
        outfit = "Jacket, jeans and trainers.";
    }
    else if (temp < 20) {
        outfit = "Light jumper and trousers.";
    }
    else {
        outfit = "T-shirt, shorts and sunglasses.";
        dontForget.push("🕶️ Sunglasses");
        dontForget.push("🧴 Sun Cream");
    }

    const weatherCondition = weather.toLowerCase();

    if (
        weatherCondition.includes("rain") ||
        weatherCondition.includes("drizzle") ||
        weatherCondition.includes("shower")
    ) {
        dontForget.push("☂️ Umbrella");
    }

    if (
        weatherCondition.includes("snow")
    ) {
        dontForget.push("🥾 Winter Boots");
        dontForget.push("🧤 Gloves");
    }

    if (
        weatherCondition.includes("wind")
    ) {
        dontForget.push("🧥 Windproof Jacket");
    }

    return {
        outfit,
        dontForget
    };
}

async function getWeather(city) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error(`Weather API returned ${response.status}`);
    }

    return await response.json();
}

document.getElementById("searchBtn").addEventListener("click", async () => {

    const city = document.getElementById("searchInput").value.trim();

    if (!city) {
        alert("Please enter a city");
        return;
    }

    try {

        const weatherData = await getWeather(city);

        const recommendation = getRecommendations(
            weatherData.weather[0].main,
            weatherData.main.temp
        );

        document.getElementById("results").innerHTML = `
            <h2>${weatherData.name}</h2>

            <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>

            <p><strong>Temperature:</strong> ${Math.round(weatherData.main.temp)}°C</p>

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

        document.getElementById("results").innerHTML = `
            <p>Error: ${error.message}</p>
        `;
    }

});