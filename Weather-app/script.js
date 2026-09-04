const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");

function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Heavy rain showers",
    95: "Thunderstorm",
  };

  return descriptions[code] || "Unknown";
}

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    weatherResult.textContent = "Please enter a city.";
    return;
  }

  weatherResult.textContent = "Loading...";

  try {
    const locationResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    );

    if (!locationResponse.ok) {
      throw new Error("Could not search for the city.");
    }

    const locationData = await locationResponse.json();

    if (!locationData.results || locationData.results.length === 0) {
      throw new Error("City not found.");
    }

    const location = locationData.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
    );

    if (!weatherResponse.ok) {
      throw new Error("Could not get weather data.");
    }

    const weatherData = await weatherResponse.json();

    const current = weatherData.current;

    weatherResult.innerHTML = `
            <h2>${location.name}</h2>
            <p>${location.admin1 || ""}, ${location.country}</p>
            <p>Temperature: ${current.temperature_2m}°C</p>
            <p>Humidity: ${current.relative_humidity_2m}%</p>
            <p>Wind: ${current.wind_speed_10m} km/h</p>
            <p>Condition: ${getWeatherDescription(current.weather_code)}</p>`;
  } catch (error) {
    weatherResult.textContent = error.message;
  }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
