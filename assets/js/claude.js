/* ──────────────────────────────────────────────
   CONFIG — keep these server-side in production!
────────────────────────────────────────────── */
const WEATHER_API_KEY   = 'YOUR_OPENWEATHERMAP_API_KEY';
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY';

/* ── Trigger this from your search button ── */
async function handleSearch() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) return;

  try {
    const weather = await fetchWeather(city);
    displayWeather(weather);          // wire up your own UI function
    await streamOutfitAdvice(weather);
  } catch (err) {
    console.error(err.message);
  }
}

/* ── 1. OpenWeatherMap ── */
async function fetchWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather` +
    `?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `City "${city}" not found.`);
  }
  return res.json();
}

/* ── 2. Claude streaming ── */
async function streamOutfitAdvice(weather) {
  const { name, sys, main, weather: [cond], wind } = weather;

  const prompt =
    `Current weather in ${name}, ${sys.country}:\n` +
    `• Condition: ${cond.description}\n` +
    `• Temperature: ${Math.round(main.temp)}°C (feels like ${Math.round(main.feels_like)}°C)\n` +
    `• Humidity: ${main.humidity}%\n` +
    `• Wind: ${Math.round(wind.speed)} m/s\n\n` +
    `Give friendly, practical outfit advice for going outside today. ` +
    `Be specific about layers, fabrics, and accessories. Keep it under 120 words.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      stream: true,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Claude API error.');
  }

  // Stream response chunks into your output element
  const outputEl = document.getElementById('advice-output'); // your element
  const reader   = res.body.getReader();
  const decoder  = new TextDecoder();
  let buffer     = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // hold incomplete line

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const json = JSON.parse(data);
        if (json.type === 'content_block_delta' && json.delta?.text) {
          outputEl.textContent += json.delta.text;
        }
      } catch { /* skip malformed chunks */ }
    }
  }
}

// Bind to your button
document.getElementById('search-btn').addEventListener('click', handleSearch);
document.getElementById('city-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});