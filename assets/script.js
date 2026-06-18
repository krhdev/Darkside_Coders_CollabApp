const API_KEY = "YOUR_OPENWEATHER_KEY";

function getOutfit(weather, temp) {

    if (temp < 5) {
        return "Heavy coat, gloves, scarf and boots.";
    }

    if (temp < 12) {
        return "Jacket, jeans and trainers.";
    }

    if (temp < 20) {
        return "Light jumper and trousers.";
    }

    return "T-shirt, shorts and sunglasses.";
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

        const outfit = getOutfit(
            weatherData.weather[0].main,
            weatherData.main.temp
        );

        document.getElementById("resultclothes").innerHTML = `
            <p><strong>Recommended outfit:</strong> ${outfit}</p>
        `;

        document.getElementById("resulttemp").innerHTML = `
            <p>Temperature: ${weatherData.main.temp}°C</p>
        `;

    } catch (error) {
        console.error(error);
        document.getElementById("results").innerHTML =
            `<p>${error.message}</p>`;
    }

});