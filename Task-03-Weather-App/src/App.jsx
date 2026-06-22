import React, { useState, useEffect } from 'react';

// WMO Weather Code Mapper to FontAwesome Icons and Condition Names
const weatherCodeMap = {
  0: { name: 'Clear Sky', icon: 'fa-solid fa-sun', themeClass: 'theme-sunny' },
  1: { name: 'Partly Cloudy', icon: 'fa-solid fa-cloud-sun', themeClass: 'theme-cloudy' },
  2: { name: 'Partly Cloudy', icon: 'fa-solid fa-cloud-sun', themeClass: 'theme-cloudy' },
  3: { name: 'Overcast', icon: 'fa-solid fa-cloud', themeClass: 'theme-cloudy' },
  45: { name: 'Foggy', icon: 'fa-solid fa-smog', themeClass: 'theme-cloudy' },
  48: { name: 'Rime Fog', icon: 'fa-solid fa-smog', themeClass: 'theme-cloudy' },
  51: { name: 'Light Drizzle', icon: 'fa-solid fa-cloud-rain', themeClass: 'theme-rainy' },
  53: { name: 'Drizzle', icon: 'fa-solid fa-cloud-rain', themeClass: 'theme-rainy' },
  55: { name: 'Heavy Drizzle', icon: 'fa-solid fa-cloud-showers-heavy', themeClass: 'theme-rainy' },
  61: { name: 'Light Rain', icon: 'fa-solid fa-cloud-rain', themeClass: 'theme-rainy' },
  63: { name: 'Moderate Rain', icon: 'fa-solid fa-cloud-showers-water', themeClass: 'theme-rainy' },
  65: { name: 'Heavy Rain', icon: 'fa-solid fa-cloud-showers-heavy', themeClass: 'theme-rainy' },
  71: { name: 'Light Snow', icon: 'fa-solid fa-snowflake', themeClass: 'theme-snowy' },
  73: { name: 'Moderate Snow', icon: 'fa-solid fa-snowflake', themeClass: 'theme-snowy' },
  75: { name: 'Heavy Snow', icon: 'fa-solid fa-snowflake', themeClass: 'theme-snowy' },
  80: { name: 'Rain Showers', icon: 'fa-solid fa-cloud-showers-heavy', themeClass: 'theme-rainy' },
  81: { name: 'Rain Showers', icon: 'fa-solid fa-cloud-showers-heavy', themeClass: 'theme-rainy' },
  82: { name: 'Violent Rain Showers', icon: 'fa-solid fa-cloud-showers-heavy', themeClass: 'theme-rainy' },
  95: { name: 'Thunderstorm', icon: 'fa-solid fa-cloud-bolt', themeClass: 'theme-thunderstorm' },
  96: { name: 'Thunderstorm with Hail', icon: 'fa-solid fa-cloud-bolt', themeClass: 'theme-thunderstorm' },
  99: { name: 'Thunderstorm with Heavy Hail', icon: 'fa-solid fa-cloud-bolt', themeClass: 'theme-thunderstorm' }
};

const getWeatherData = (code) => {
  return weatherCodeMap[code] || { name: 'Unknown Weather', icon: 'fa-solid fa-cloud', themeClass: 'theme-cloudy' };
};

// Weather Category Helper for Animated SVGs
const getWeatherCategory = (code) => {
  if (code === 0) return 'sunny';
  if ([1, 2, 3, 45, 48].includes(code)) return 'cloudy';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rainy';
  if ([71, 73, 75].includes(code)) return 'snowy';
  if ([95, 96, 99].includes(code)) return 'thunderstorm';
  return 'cloudy';
};

// SVG Animated Weather Icon Component
function WeatherIcon({ code, size = 'large' }) {
  const category = getWeatherCategory(code);
  const sizePx = size === 'large' ? 120 : 36;

  switch (category) {
    case 'sunny':
      return (
        <svg className="weather-svg sunny-svg" viewBox="0 0 100 100" width={sizePx} height={sizePx}>
          <circle cx="50" cy="50" r="20" fill="#fbbf24" className="sun-core" />
          <g className="sun-rays" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round">
            <line x1="50" y1="12" x2="50" y2="22" />
            <line x1="50" y1="78" x2="50" y2="88" />
            <line x1="12" y1="50" x2="22" y2="50" />
            <line x1="78" y1="50" x2="88" y2="50" />
            <line x1="23" y1="23" x2="30" y2="30" />
            <line x1="70" y1="70" x2="77" y2="77" />
            <line x1="23" y1="70" x2="30" y2="63" />
            <line x1="70" y1="30" x2="77" y2="23" />
          </g>
        </svg>
      );

    case 'cloudy':
      return (
        <svg className="weather-svg cloudy-svg" viewBox="0 0 100 100" width={sizePx} height={sizePx}>
          <path d="M35 60 A 15 15 0 0 1 50 45 A 20 20 0 0 1 80 50 A 15 15 0 0 1 75 75 L 35 75 A 15 15 0 0 1 35 60 Z" fill="#94a3b8" opacity="0.4" className="cloud-back" />
          <path d="M25 65 A 12 12 0 0 1 37 53 A 16 16 0 0 1 61 57 A 12 12 0 0 1 57 77 L 25 77 A 12 12 0 0 1 25 65 Z" fill="#e2e8f0" className="cloud-front" />
        </svg>
      );

    case 'rainy':
      return (
        <svg className="weather-svg rainy-svg" viewBox="0 0 100 100" width={sizePx} height={sizePx}>
          <path d="M25 55 A 12 12 0 0 1 37 43 A 16 16 0 0 1 61 47 A 12 12 0 0 1 57 67 L 25 67 A 12 12 0 0 1 25 55 Z" fill="#94a3b8" className="cloud-front" />
          <g className="rain-drops" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round">
            <line x1="32" y1="74" x2="30" y2="82" className="rain-drop drop-1" />
            <line x1="42" y1="76" x2="40" y2="84" className="rain-drop drop-2" />
            <line x1="52" y1="74" x2="50" y2="82" className="rain-drop drop-3" />
          </g>
        </svg>
      );

    case 'snowy':
      return (
        <svg className="weather-svg snowy-svg" viewBox="0 0 100 100" width={sizePx} height={sizePx}>
          <path d="M25 55 A 12 12 0 0 1 37 43 A 16 16 0 0 1 61 47 A 12 12 0 0 1 57 67 L 25 67 A 12 12 0 0 1 25 55 Z" fill="#e2e8f0" className="cloud-front" />
          <g fill="#7dd3fc" className="snow-flakes">
            <circle cx="32" cy="74" r="2.5" className="snowflake flake-1" />
            <circle cx="42" cy="77" r="3" className="snowflake flake-2" />
            <circle cx="52" cy="74" r="2.5" className="snowflake flake-3" />
          </g>
        </svg>
      );

    case 'thunderstorm':
      return (
        <svg className="weather-svg storm-svg" viewBox="0 0 100 100" width={sizePx} height={sizePx}>
          <path d="M25 55 A 12 12 0 0 1 37 43 A 16 16 0 0 1 61 47 A 12 12 0 0 1 57 67 L 25 67 A 12 12 0 0 1 25 55 Z" fill="#475569" className="cloud-front" />
          <path d="M43 63 L 36 76 L 43 76 L 40 88 L 52 72 L 44 72 Z" fill="#f59e0b" className="lightning-bolt" />
          <g className="rain-drops" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round">
            <line x1="28" y1="72" x2="26" y2="78" className="rain-drop drop-1" />
            <line x1="56" y1="72" x2="54" y2="78" className="rain-drop drop-2" />
          </g>
        </svg>
      );

    default:
      return (
        <svg className="weather-svg cloudy-svg" viewBox="0 0 100 100" width={sizePx} height={sizePx}>
          <path d="M25 65 A 12 12 0 0 1 37 53 A 16 16 0 0 1 61 57 A 12 12 0 0 1 57 77 L 25 77 A 12 12 0 0 1 25 65 Z" fill="#e2e8f0" />
        </svg>
      );
  }
}

// Quick Select Cities
const DEFAULT_CITIES = [
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'United Kingdom' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'United States' },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, country: 'India' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia' }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITIES[3]); // Default Mumbai
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch suggestions as user types
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            setSuggestions(data.results);
          } else {
            setSuggestions([]);
          }
        })
        .catch(() => setSuggestions([]));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Fetch weather data for the selected city
  useEffect(() => {
    if (!selectedCity) return;
    setLoading(true);
    setError('');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max&timezone=auto`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch weather data.');
        return res.json();
      })
      .then((data) => {
        setWeatherData(data.current);
        
        // Formulate 5-day forecast list
        const days = [];
        const daily = data.daily;
        // Skip index 0 (today) to display the next 5 days
        for (let i = 1; i < 6; i++) {
          const dateStr = daily.time[i];
          const dateObj = new Date(dateStr);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          
          days.push({
            day: dayName,
            date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            tempMax: Math.round(daily.temperature_2m_max[i]),
            tempMin: Math.round(daily.temperature_2m_min[i]),
            code: daily.weather_code[i]
          });
        }
        setForecastData(days);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'An error occurred.');
        setLoading(false);
      });
  }, [selectedCity]);

  const handleSuggestionClick = (city) => {
    setSelectedCity({
      name: city.name,
      lat: city.latitude,
      lon: city.longitude,
      country: city.country || city.admin1 || ''
    });
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleCitySelectDefault = (city) => {
    setSelectedCity(city);
    setSearchQuery('');
    setSuggestions([]);
  };

  // Get current weather theme info
  const weatherDetails = weatherData ? getWeatherData(weatherData.weather_code) : { name: '', icon: '', themeClass: 'theme-cloudy' };

  return (
    <div className={`weather-app ${weatherDetails.themeClass}`}>
      {/* Decorative blurs */}
      <div className="blur-glow-1"></div>
      <div className="blur-glow-2"></div>

      <header className="app-header">
        <a href="../index.html" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Hub Dashboard
        </a>
        <div className="header-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#logo-grad-1)"/>
            <path d="M2 17L12 22L22 17" stroke="url(#logo-grad-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="logo-grad-1" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06b6d4"/>
                <stop offset="1" stopColor="#8b5cf6"/>
              </linearGradient>
              <linearGradient id="logo-grad-2" x1="2" y1="17" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06b6d4"/>
                <stop offset="1" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-text">inCode<span className="accent-text">Weather</span></span>
        </div>
      </header>

      <main className="dashboard-container">
        
        {/* Search Panel */}
        <section className="search-section">
          <div className="search-wrapper">
            <div className="input-group">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                placeholder="Search city (e.g. Tokyo, Paris...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((city, idx) => (
                  <li key={idx} onClick={() => handleSuggestionClick(city)}>
                    <i className="fa-solid fa-location-dot"></i>
                    <span className="city-name">{city.name}</span>
                    <span className="city-desc">
                      {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Select Buttons */}
          <div className="quick-cities">
            {DEFAULT_CITIES.map((city, idx) => (
              <button
                key={idx}
                className={`city-btn ${selectedCity.name === city.name ? 'active' : ''}`}
                onClick={() => handleCitySelectDefault(city)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </section>

        {error && <div className="error-message"><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>}

        {/* Dashboard Weather Card */}
        {loading ? (
          <div className="loading-card">
            <div className="loader"></div>
            <p>Loading real-time weather data...</p>
          </div>
        ) : weatherData ? (
          <div className="weather-grid">
            
            {/* Core Card (Left) */}
            <div className="glass-panel main-weather-card">
              <div className="weather-card-header">
                <div>
                  <h2 className="location-title">{selectedCity.name}</h2>
                  <p className="country-sub">{selectedCity.country}</p>
                </div>
                <div className="weather-date-stamp">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="weather-temp-block">
                <div className="weather-visuals">
                  <WeatherIcon code={weatherData.weather_code} size="large" />
                  <div>
                    <span className="main-temp-val">{Math.round(weatherData.temperature_2m)}°</span>
                    <span className="temp-unit">C</span>
                  </div>
                </div>
                <div className="condition-status-text">
                  <h3>{weatherDetails.name}</h3>
                  <p>Feels like {Math.round(weatherData.apparent_temperature)}°C</p>
                </div>
              </div>

              <div className="weather-meta-info">
                <div className="meta-item">
                  <div className="meta-icon cyan"><i className="fa-solid fa-droplet"></i></div>
                  <div>
                    <span className="meta-val">{weatherData.relative_humidity_2m}%</span>
                    <span className="meta-label">Humidity</span>
                  </div>
                </div>

                <div className="meta-item">
                  <div className="meta-icon blue"><i className="fa-solid fa-wind"></i></div>
                  <div>
                    <span className="meta-val">{weatherData.wind_speed_10m} km/h</span>
                    <span className="meta-label">Wind Speed</span>
                  </div>
                </div>

                <div className="meta-item">
                  <div className="meta-icon pink"><i className="fa-solid fa-cloud-showers-heavy"></i></div>
                  <div>
                    <span className="meta-val">{weatherData.precipitation} mm</span>
                    <span className="meta-label">Precipitation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Panel (Right) */}
            <div className="glass-panel forecast-card">
              <h3 className="forecast-title">5-Day Outlook</h3>
              <div className="forecast-list">
                {forecastData.map((day, idx) => {
                  const dayDetails = getWeatherData(day.code);
                  return (
                    <div key={idx} className="forecast-item">
                      <div className="forecast-day-info">
                        <span className="forecast-day-name">{day.day}</span>
                        <span className="forecast-date-label">{day.date}</span>
                      </div>
                      <div className="forecast-condition">
                        <WeatherIcon code={day.code} size="small" />
                        <span className="forecast-status-name">{dayDetails.name}</span>
                      </div>
                      <div className="forecast-temp-range">
                        <span className="temp-max">{day.tempMax}°</span>
                        <span className="temp-min">{day.tempMin}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : null}

      </main>

      <footer className="dashboard-footer">
        <p>Weather Dashboard powered by Open-Meteo &bull; no-key REST API</p>
      </footer>
    </div>
  );
}
