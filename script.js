let map;
let cityMarker = null;
let countryCities = {};
let cityDataset = [];
const apiKey = 'c06b3b46bff119811142645233081c47';
const API_KEY = apiKey;
const mainElement = document.querySelector('main');
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherDetails = document.getElementById('weatherDetails');
const forecastElement = document.getElementById('forecast');
const recentCitiesDropdown = document.getElementById('recentCitiesDropdown');
const weatherInfo = document.getElementById('weatherInfo');
weatherDetails.style.backgroundSize = 'cover';
weatherDetails.style.backgroundRepeat = 'no-repeat'
forecastElement.style.display = 'flex';
forecastElement.style.flexDirection = 'row';

// Handle Search Button Click
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  } else {
    alert('Please enter a valid city!');
  }
});

// Handle Search from Recently Searched Cities
recentCitiesDropdown.addEventListener('change', (e) => {
  const selectedCity = e.target.value;
  if (selectedCity) {
    fetchWeatherData(selectedCity);
  }
});

// Fetch Weather Data
function fetchWeatherData(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeatherData(data);
      updateRecentCities(city);
      fetchExtendedForecast(city);
    })
    .catch(error => {
      alert(error.message);
    });
}


// Get user's location on page load
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherDataByCoords(lat, lon);
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

// Button to manually get the current location
const getLocationBtn = document.getElementById('getLocationBtn');
getLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherDataByCoords(lat, lon);
      },
      (error) => {
        alert("Unable to retrieve location. Please try again.");
        console.error('Geolocation error:', error);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

// Display Weather Data
function displayWeatherData(data) {
  document.getElementById('cityName').textContent = data.name;
  document.getElementById('minTemp').textContent = `Min Temperature: ${data.main.temp_min} °C`;
  document.getElementById('maxTemp').textContent = `Max Temperature: ${data.main.temp_max} °C`;
  document.getElementById('feels_like').textContent = `Feels Like: ${data.main.feels_like} °C`;
  document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`;
  document.getElementById('seaLevel').textContent = `Sea Level: ${data.main.sea_level || 'N/A'} hPa`;
  document.getElementById('groundLevel').textContent = `Ground Level: ${data.main.grnd_level || 'N/A'} hPa`;
  document.getElementById('windDirection').textContent = `Wind Direction: ${data.wind.deg}°`;
  document.getElementById('gust').textContent = `Wind Gust: ${data.wind.gust}°`;
  document.getElementById('speed').textContent = `Wind Speed: ${data.wind.speed}°`;
  document.getElementById('country').textContent = `Country: ${data.sys.country}`;
  document.getElementById('latitude').textContent = `Latitude: ${data.coord.lat}`;
  document.getElementById('longitude').textContent = `Longitude: ${data.coord.lon}`;
  document.getElementById('sunrise').textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
  document.getElementById('sunset').textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;

  // Set weather icon
  const weatherIcon = document.getElementById('weatherIcon');
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  weatherIcon.alt = data.weather[0].description;
  console.log(data);
  console.log(data.name);
  console.log(data.weather[0].main)

  const weatherCondition = data.weather[0].main;
  const currentTime = new Date().getTime();
  const isDaytime = currentTime >= data.sys.sunrise * 1000 && currentTime < data.sys.sunset * 1000;
  let backgroundGif = '';

  if (weatherCondition === 'Clear') {
    backgroundGif = isDaytime ? 'clear-day.gif' : 'clear-night.gif';
  } else if (weatherCondition === 'Clouds') {
    backgroundGif = 'cloudy.gif';
  } else if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') {
    backgroundGif = 'rain.gif';
  } else if (['Smoke','Mist', 'Haze', 'Fog'].includes(weatherCondition)) {
    backgroundGif = 'misty.gif';
  } else if (weatherCondition === 'Snow') {
    backgroundGif = 'snow.gif';
  } else if (['Thunderstorm', 'Squall', 'Tornado'].includes(weatherCondition)) {
    backgroundGif = 'storm.gif';
  } else {
    console.log('No matching background found for current weather condition.');
  }
  if (mainElement && backgroundGif) {
    mainElement.style.backgroundImage = `url('./Resources/${backgroundGif}')`;
    mainElement.style.backgroundSize = 'cover';
    mainElement.style.backgroundRepeat = 'no-repeat';
    mainElement.style.color = 'white';
  }
}

// Update Recently Searched Cities
let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
function updateRecentCities(city) {
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    if (recentCities.length > 5) {
      recentCities.shift(); 
      // Keep only the last 5 cities
    }
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    renderRecentCities();
  }
}

function renderRecentCities() {
  recentCitiesDropdown.innerHTML = '<option disabled selected>Recently Searched Cities</option>';
  recentCities.forEach(city => {
    const option = document.createElement('option');
    option.textContent = city;
    option.value = city;
    recentCitiesDropdown.appendChild(option);
  });
}

renderRecentCities(); // Render on page load

function fetchExtendedForecast(city) {
  const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(forecastAPI)
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch extended forecast data');
      }
      return response.json();
    })
    .then(data => {
      displayExtendedForecast(data.list);
    })
    .catch(error => {
      console.error('Error fetching extended forecast:', error);
    });
}
// Fetch Extended Forecast Data

function fetchWeatherDataByCoords(lat, lon) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Location not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeatherData(data);
      fetchExtendedForecastByCoords(lat, lon);
    })
    .catch(error => {
      alert(error.message);
    });
}

// Function to fetch extended forecast by coordinates
function fetchExtendedForecastByCoords(lat, lon) {
  const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(forecastAPI)
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch extended forecast data');
      }
      return response.json();
    })
    .then(data => {
      displayExtendedForecast(data.list);
    })
    .catch(error => {
      console.error('Error fetching extended forecast:', error);
    });
}

// Function to display the extended forecast
function displayExtendedForecast(forecastData) { 
  forecastElement.innerHTML = ''; // Clear any previous data

  forecastData.forEach((forecast, index) => {
    if (index % 8 === 0) {
      const forecastCard = document.createElement('div');
      forecastCard.classList.add('forecast-card', 'p-4', 'bg-grey-100', 'rounded-lg', 'shadow-lg', 'text-center', 'max-w-xs', 'transform', 'transition-transform', 'duration-200', 'hover:-translate-y-1');

      const forecastTime = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric'
      });
      const temp = forecast.main.temp;
      const icon = forecast.weather[0].icon;
      const description = forecast.weather[0].description;
      const wind_s= forecast.wind.speed;
      const humidity= forecast.main.humidity;

      forecastCard.innerHTML = `
        <p class="font-bold text-gray-900">${forecastTime}</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}" class="mx-auto my-2 w-12 h-12">
        <p class="text-xl font-semibold text-blue-500">${temp} °C</p>
        <p class="capitalize font-bold text-gray-700">${description}</p>
        <p class="capitalize text-sm text-gray-600">Wind Speed: ${wind_s} m/s</p>
        <p class="capitalize text-sm text-gray-600">Humidity: ${humidity}%</p>
      `;

      forecastElement.appendChild(forecastCard);
    }
  });
}
// Function to fetch weather data by coordinates
















