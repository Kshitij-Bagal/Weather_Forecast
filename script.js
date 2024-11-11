let map;
let cityMarker = null;
let countryCities = {};
let cityDataset = [];
const apiKey = 'c06b3b46bff119811142645233081c47';
const API_KEY = apiKey;

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

  if (backgroundGif) {
    document.body.style.backgroundImage = `url('./Resources/${backgroundGif}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.color = 'white'
  }

  // setWeatherBackground(data.weather[0].main);
  // // Display weather icon
  // const weatherIcon = document.createElement('img');
  // weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  // weatherInfo.appendChild(weatherIcon);
}

// function setWeatherBackground(data) {
//   // Check if data and data.weather exist and have expected properties!data || !data.weather ||
//   if ( data.weather[0] === null ) {
//     console.error('Weather data is missing or undefined.');
//     return;
//   }
// }

// Update Recently Searched Cities
let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

function updateRecentCities(city) {
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    if (recentCities.length > 5) {
      recentCities.shift(); // Keep only the last 5 cities
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



function displayExtendedForecast(forecastData) {
  // Clear any existing forecast content
  forecastElement.innerHTML = '';

  // Extract the dates for each forecast entry at 12:00:00
  const filteredData = forecastData.filter(item => item.dt_txt.includes('12:00:00'));

  // Create a container for the forecast elements
  // const forecastContainer = document.createElement('div');
  // forecastContainer.classList.add('forecast-container');

  // Loop through each forecast item to display the date, icon, temperature, wind speed, and humidity
  filteredData.forEach(item => {
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');

    // Add date
    const date = document.createElement('h3');
    date.textContent = item.dt_txt.split(' ')[0];
    forecastItem.appendChild(date);

    // Add weather icon
    const icon = document.createElement('img');
    icon.src = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    icon.alt = item.weather[0].description;
    forecastItem.appendChild(icon);

    // Add temperature
    const temp = document.createElement('p');
    temp.textContent = `Temp: ${item.main.temp}°C`;
    forecastItem.appendChild(temp);

    // Add wind speed
    const wind = document.createElement('p');
    wind.textContent = `Wind: ${item.wind.speed} m/s`;
    forecastItem.appendChild(wind);

    // Add humidity
    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${item.main.humidity}%`;
    forecastItem.appendChild(humidity);
  forecastItem.style.width= '100px';
    forecastElement.appendChild(forecastItem);
  });
   


  // Append the generated forecast container to the forecast element
  // forecastElement.appendChild(forecastContainer);
}














// function displayExtendedForecast(forecastData) {
//   // Clear any existing forecast content
//   forecastElement.innerHTML = '';

//   // Extract the dates for each forecast entry at 12:00:00
//   const filteredData = forecastData.filter(item => item.dt_txt.includes('12:00:00'));

//   // Create the table structure for the forecast
//   const table = document.createElement('table');
//   table.classList.add('forecast-table');

//   // Create the header row with dates
//   const headerRow = document.createElement('tr');
//   headerRow.innerHTML = `<th>Parameter</th>`; // First cell for parameter title

//   filteredData.forEach(item => {
//     const dateCell = document.createElement('th');
//     dateCell.textContent = item.dt_txt.split(' ')[0]; // Extract date only
//     headerRow.appendChild(dateCell);
//   });
//   table.appendChild(headerRow);

//   // Add each parameter row
//   const parameters = [
//     { label: 'Temperature', key: 'temp', unit: '°C' },
//     { label: 'Wind Speed', key: 'speed', unit: 'm/s' },
//     { label: 'Humidity', key: 'humidity', unit: '%' }
//   ];

//   parameters.forEach(param => {
//     const row = document.createElement('tr');
//     const titleCell = document.createElement('td');
//     titleCell.textContent = param.label;
//     row.appendChild(titleCell);

//     // Add data for each date in this parameter row
//     filteredData.forEach(item => {
//       const dataCell = document.createElement('td');
//       const value = param.key === 'temp' ? item.main[param.key] : item.wind[param.key] || item.main[param.key];
//       dataCell.textContent = `${value} ${param.unit}`;
//       row.appendChild(dataCell);
//     });

//     table.appendChild(row);
//   });

//   // Append the generated table to the forecast container
//   forecastElement.appendChild(table);
// }





// function fetchExtendedForecast(city) {
//   const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

//   fetch(forecastAPI)
//     .then(response => response.json())
//     .then(data => {
//       displayExtendedForecast(data.list);
//     })
//     .catch(error => {
//       console.error('Error fetching extended forecast:', error);
//     });
// }

// // Display Extended Forecast
// function displayExtendedForecast(forecastData) {
//   forecastElement.innerHTML = ''; // Clear previous forecast

//   forecastData.filter(item => item.dt_txt.includes('12:00:00')).forEach(item => {
//     const card = document.createElement('div');
//     card.innerHTML = `
//       <h3>${item.dt_txt.split(' ')[0]}</h3>
//       <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
//       <p>Temp: ${item.main.temp}°C</p>
//       <p>Wind: ${item.wind.speed} m/s</p>
//       <p>Humidity: ${item.main.humidity}%</p>
//     `;
//     forecastElement.appendChild(card);
//   });
// }
