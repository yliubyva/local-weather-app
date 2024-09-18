'use strict';

const API_KEY = 'b449b08afcd0b43c7b196ba0196664d2';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const formElement = document.getElementById('weatherForm');
const locationInput = document.getElementById('locationInput');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');

formElement.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

async function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        saveWeatherData(data);
        displayWeatherData(data);
    } catch(error) {
        console.error('Error fetching weather data:', error);
    }
}

function saveWeatherData(data) {
    const timestamp = new Date().getTime();
    localStorage.setItem('weatherData', JSON.stringify(data));
    localStorage.setItem('weatherTimestamp', timestamp);
};

function getStoredWeatherData() {
    const weatherData = localStorage.getItem('weatherData');
    const timestamp = localStorage.getItem('weatherTimestamp');
    const currentTime = new Date().getTime();

    if (weatherData && timestamp) {
        const timeDifference = currentTime - parseInt(timestamp, 10);
        if (timeDifference < 2 * 60 * 60 * 1000) {
            return JSON.parse(weatherData);
        }
    }
    return null;
};

function displayWeatherData(data) {
    locationElement.textContent = data.name;
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
};

const storedWeatherData = getStoredWeatherData();
if (storedWeatherData) {
    displayWeatherData(storedWeatherData);
};