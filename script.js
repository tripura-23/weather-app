async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    document.getElementById("weatherResult").innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  const apiKey = "940b80f7c39e2a31a858b55da7caa85d";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  // Helper function to format time with timezone offset (returns HH:MM)
  function formatTime(unixTime, timezoneOffset) {
    // unixTime and timezoneOffset are in seconds
    const localTime = new Date((unixTime + timezoneOffset) * 1000);
    const hours = localTime.getUTCHours().toString().padStart(2, "0");
    const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Change background image based on weather condition
  function changeBackground(weather) {
    const body = document.body;
    const backgroundMap = {
      clear: "url('images/clear.jpg')",
      clouds: "url('images/clouds.jpg')",
      rain: "url('images/rain.jpg')",
      thunderstorm: "url('images/thunderstorm.jpg')",
      snow: "url('images/snow.jpg')",
      mist: "url('images/mist.jpg')"
    };
    let bgImage = backgroundMap[weather.toLowerCase()] || "url('images/default.jpg')";
    body.style.backgroundImage = bgImage;
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      // Calculate current time in city's timezone
      const nowUnix = Math.floor(Date.now() / 1000); // current UTC time in seconds
      const localTime = formatTime(nowUnix, data.timezone);
      const sunrise = formatTime(data.sys.sunrise, data.timezone);
      const sunset = formatTime(data.sys.sunset, data.timezone);

      // Change background based on main weather
      changeBackground(data.weather[0].main);

      document.getElementById("weatherResult").innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p><strong>Local Time:</strong> ${localTime}</p>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Feels Like:</strong> ${data.main.feels_like} °C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
        <p><strong>Sunrise:</strong> 🌅 ${sunrise}</p>
        <p><strong>Sunset:</strong> 🌇 ${sunset}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
      `;
    } else {
      document.getElementById("weatherResult").innerHTML = `<p>City not found!</p>`;
    }
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p>Error fetching weather data.</p>`;
  }
}






