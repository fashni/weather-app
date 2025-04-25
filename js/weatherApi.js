const BASE_URL = 'https://weather-proxy.fashni.workers.dev';

export function fetchWeather(city) {
  return fetch(`${BASE_URL}?city=${city}`)
      .then(response => response.json())
      .catch(error => {
          console.error('Error fetching weather data:', error);
          return { cod: '404', message: error.message };
      });
}
