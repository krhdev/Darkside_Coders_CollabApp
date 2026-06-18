// outfit-recommender.js
console.log("chatgpt.js loaded");

const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
const OPENAI_API_KEY = "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";

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }

    return response.json();
}

async function getOutfitSuggestion(weatherData) {
    const temperature = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const condition = weatherData.weather[0].main;
    const description = weatherData.weather[0].description;
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;

    const prompt = `
Current weather:
- Temperature: ${temperature}°C
- Feels Like: ${feelsLike}°C
- Condition: ${condition}
- Description: ${description}
- Wind Speed: ${windSpeed} m/s
- Humidity: ${humidity}%

Suggest a practical outfit for today.
Include:
- Top
- Bottom
- Footwear
- Outerwear (if needed)
- Accessories (if needed)

Keep the response concise and friendly.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a fashion assistant that provides practical outfit recommendations based on weather conditions."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 250
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function main() {
    try {
        const city = "Doncaster";

        console.log(`Getting weather for ${city}...`);

        const weather = await getWeather(city);

        console.log(
            `Weather: ${weather.weather[0].description}, ${weather.main.temp}°C`
        );

        const outfit = await getOutfitSuggestion(weather);

        console.log("\n=== Outfit Recommendation ===\n");
        console.log(outfit);

    } catch (error) {
        console.error("Error:", error.message);
    }
}


main();