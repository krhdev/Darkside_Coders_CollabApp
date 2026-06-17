# Darkside Coders Weather Wear

**Darkside Coders Weather Wear** is a beautiful, responsive weather dashboard that answers the question:  
**"What shall I wear today?"**

Search any city or use your current location to get real-time weather conditions, a 5-day forecast, and practical details like feels-like temperature, wind, humidity, sunrise/sunset, and more.

---

## Features

- ✅ Clean and modern UI with dynamic background that changes based on weather
- ✅ Search by city name with input validation
- ✅ "Use My Location" using browser geolocation
- ✅ Current weather with temperature, feels-like, humidity, wind, pressure, visibility, etc.
- ✅ 5-Day Forecast strip
- ✅ UV Index and Cloud Cover visual meters
- ✅ °C / °F unit toggle (persisted)
- ✅ Dark mode toggle (persisted)
- ✅ Search history (last 8 cities, saved in browser)
- ✅ Fully responsive (mobile + desktop)
- ✅ Graceful error handling and loading states

---

## Live Demo

Once deployed to GitHub Pages, the live app will be available at:

```
https://krhdev.github.io/Darkside_Coders_CollabApp/
```


## Tech Stack & API

| Layer | Choice |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS (custom properties, no framework) |
| Logic | Vanilla JavaScript (`fetch`, `async/await`, DOM manipulation) |
| Data | [OpenWeatherMap API](https://openweathermap.org/api) — Current Weather Data + 5 Day / 3 Hour Forecast endpoints |
| Storage | Browser `localStorage` for search history, unit preference, and theme |
| Hosting | GitHub Pages |

We chose OpenWeatherMap because its free tier (no credit card required) covers everything this dashboard needs: current conditions and a 5-day forecast for any city name or coordinate pair, at a rate limit far beyond what a small class project will ever hit.

## Project Structure

```
weather-wear/
├── index.htm                  # Main HTML page
├── README.md                  # This file
└── assets/
    ├── css/
    │   └── style.css          # All app styling, themes, and responsive rules
    ├── js/
    │   └── script.js          # API calls, DOM rendering, event handling
    └── img/
        └── weatherWearLogo.png
```

## Configuration

| Setting | Where | Notes |
|---|---|---|
| API key | `assets/js/script.js` → `API_KEY` | Required for any data to load |
| Default city | `assets/js/script.js` → bottom of file | Defaults to "London" if no search history exists |
| Units | Toggled in-app (°C / °F) | Saved to `localStorage` as `weatherUnit` |
| Theme | Toggled in-app (🌙) | Saved to `localStorage` as `darkMode` |

## How It Works

1. The user types a city name (or taps the location button) and submits.
2. `script.js` validates the input, then calls the OpenWeatherMap **Current Weather** endpoint and **5 Day / 3 Hour Forecast** endpoint with `fetch()`.
3. While waiting, a skeleton loading state is shown.
4. On success, the JSON response is parsed and used to populate the DOM: the current-conditions card, the 5-day forecast strip, and the UV/cloud meters.
5. The searched city is saved to `localStorage` and added to the history pills.
6. On failure (city not found, network issue, rate limit), a clear error message is shown instead of leaving the user looking at a blank or broken screen.

## Known Limitations

- The free OpenWeatherMap current-weather endpoint doesn't return a UV index, so the UV meter currently displays a **placeholder/demo value**, not real data. A future iteration could swap this for OpenWeatherMap's One Call API (which does include UV) or another UV-specific source.
- The API key is stored client-side in plain JavaScript, which is fine for a class project but is not a pattern to use for production apps with paid or sensitive API keys.
- Geolocation accuracy depends entirely on the browser/device and requires the user to grant permission.

## License

This project was built for educational purposes as part of a team coding project. No license has been formally applied.