import { fetchWeather } from './weatherApi.js';

class WeatherApp {
    constructor() {
        this.searchBtn = document.getElementById('search-btn');
        this.cityInput = document.getElementById('city-input');
        this.weatherContainer = document.getElementById('weather-container');
        this.historyList = document.getElementById('history-list');
        this.searchHistory = [];

        this.init();
    }

    init() {
        // BONUS: Load from local storage
        const history = localStorage.getItem('searchHistory');
        if (history) {
            this.searchHistory = JSON.parse(history);
            this.updateHistoryList();
        }

        // TODO: Add event listeners
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keydown', (e) => {if (e.key == 'Enter') {this.handleSearch()}})
        this.historyList.addEventListener('click', (e) => this.handleHistoryClick(e));

        // TODO: Check for city in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const city = urlParams.get("city");
        if (city) {
            this.cityInput.value = city;
            this.handleSearch();
        }
    }

    async handleSearch() {
        // TODO: Implement search functionality
        const city = this.cityInput.value.trim();
        if (!city) {
            alert('Please input a city.');
            return;
        }
        const data = await fetchWeather(city);
        // console.log(data)
        if (data.cod !== 200) {
            alert(data.message);
            return;
        }
        this.displayWeather(data);
        this.addToHistory(city);
        this.updateURL(city);
    }

    displayWeather(data) {
        // BONUS: Add weather icon
        const iconCode = data.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // TODO: Display weather data
        const k2c = k => (k - 273.15).toFixed(1);
        const weather = `
            <div class="left">
                <h3>${data.name}, ${data.sys.country}</h3>
                <p class="temp">${k2c(data.main.temp)}°C</p>
                <p class="details">${k2c(data.main.temp_max)}°/${k2c(data.main.temp_min)}° Feels like ${k2c(data.main.feels_like)}°</p>
            </div>
            <div class="right">
                <img src="${iconURL}" alt="${data.weather[0].description}" class="weather-icon" />
                <p class="desc">${data.weather[0].description}</p>
            </div>
        `;
        this.weatherContainer.innerHTML = weather;
    }

    addToHistory(city) {
        // TODO: Add city to search history
        const city_lower = city.toLowerCase();
        if (!this.searchHistory.includes(city_lower)) {
            this.searchHistory.unshift(city_lower);
            this.updateHistoryList();
            // BONUS: Add to local storage
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    }

    updateHistoryList() {
        // TODO: Update the history list in the UI
        this.historyList.innerHTML = '';
        this.searchHistory.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.classList.add('history-item');
            this.historyList.appendChild(li);
        })
    }

    handleHistoryClick(e) {
        // TODO: Handle clicks on history items
        if (e.target && e.target.matches('li.history-item')) {
            const city = e.target.textContent;
            this.cityInput.value = city;
            this.handleSearch();
        }
    }

    updateURL(city) {
        // TODO: Update URL with the searched city
        const newUrl = `${window.location.pathname}?city=${encodeURIComponent(city)}`;
        history.pushState(null, '', newUrl);
    }
}

const app = new WeatherApp();
