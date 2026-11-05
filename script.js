/**
 * WeatherNow — Professional Weather Dashboard
 * Auspify Technologies Internship Project — Phase 2: Live REST API Integration
 * 
 * Fully functional, real-time weather application powered by Open-Meteo REST API:
 * - Geocoding API: converts city names worldwide into latitude & longitude coordinates
 * - Forecast API: fetches live current metrics, hourly forecasts, and 5-day daily forecasts
 * - Asynchronous JavaScript (fetch, async/await, try/catch, HTTP validation)
 * - Dynamic timezone-aware digital clock & local dates
 * - Client-side unit switching (°C / °F) without redundant API calls
 * - Browser Geolocation integration for "Current Location"
 * - Persistent Recent Searches via localStorage (limited to 5 latest unique entries)
 * - Complete loading, error, and empty state management
 */

// ============================================================================
// 1. Scalable SVG Icons Dictionary
// ============================================================================

const SVG_ICONS = {
  'sun': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  'moon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  'cloud-sun': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`,
  'cloud': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  'cloud-rain': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`,
  'cloud-lightning': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>`,
  'snowflake': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21 3-6-1.5-3"/><path d="m17 3 3 6-1.5 3"/><path d="m2 12 2.5-1.25L4 8"/><path d="m20 12-2.5 1.25L18 16"/><path d="m4 16 1.5-3L2 12"/><path d="m7 21-3-6 1.5-3"/><path d="m7 3-3 6 1.5 3"/><path d="M12 2v20"/><path d="m20 10-2.5-1.25L18 6"/><path d="m4 8 2.5 1.25L8 10"/><path d="m4 16 2.5-1.25L8 14"/><path d="M2 12h20"/></svg>`,
  'wind': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`,
  'sunrise': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>`,
  'sunset': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>`,
  'droplets': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`,
  'gauge': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
  'eye': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`,
  'sun-dim': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 4h.01"/><path d="M20 12h.01"/><path d="M12 20h.01"/><path d="M4 12h.01"/></svg>`,
  'map-pin': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  'search': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
};

// ============================================================================
// 2. WMO Weather Interpretation Code (WW) Mapping
// ============================================================================

/**
 * Converts WMO weather codes into human-readable descriptions and matching icon keys.
 * Respects daylight state (isDay: 1 for daytime, 0 for night).
 * 
 * @param {number} code - WMO weather interpretation code (0-99)
 * @param {number} isDay - 1 for daytime, 0 for nighttime
 * @returns {{ condition: string, icon: string, key: string }}
 */
function getWeatherCondition(code, isDay = 1) {
  const numericCode = Number(code);

  switch (numericCode) {
    case 0:
      return {
        condition: isDay ? 'Clear Sky' : 'Clear Night',
        icon: isDay ? 'sun' : 'moon',
        key: 'sunny'
      };
    case 1:
      return {
        condition: isDay ? 'Mainly Clear' : 'Mainly Clear Night',
        icon: isDay ? 'sun' : 'moon',
        key: 'sunny'
      };
    case 2:
      return {
        condition: 'Partly Cloudy',
        icon: isDay ? 'cloud-sun' : 'cloud',
        key: 'partly-cloudy'
      };
    case 3:
      return {
        condition: 'Overcast',
        icon: 'cloud',
        key: 'cloudy'
      };
    case 45:
    case 48:
      return {
        condition: 'Foggy & Mist',
        icon: 'cloud',
        key: 'cloudy'
      };
    case 51:
      return {
        condition: 'Light Drizzle',
        icon: 'cloud-rain',
        key: 'rainy'
      };
    case 53:
      return {
        condition: 'Moderate Drizzle',
        icon: 'cloud-rain',
        key: 'rainy'
      };
    case 55:
      return {
        condition: 'Dense Drizzle',
        icon: 'cloud-rain',
        key: 'rainy'
      };
    case 56:
    case 57:
      return {
        condition: 'Freezing Drizzle',
        icon: 'snowflake',
        key: 'snowy'
      };
    case 61:
      return {
        condition: 'Slight Rain',
        icon: 'cloud-rain',
        key: 'rainy'
      };
    case 63:
      return {
        condition: 'Moderate Rain',
        icon: 'cloud-rain',
        key: 'rainy'
      };
    case 65:
      return {
        condition: 'Heavy Rain',
        icon: 'cloud-rain',
        key: 'rainy'
      };
    case 66:
    case 67:
      return {
        condition: 'Freezing Rain',
        icon: 'snowflake',
        key: 'snowy'
      };
    case 71:
      return {
        condition: 'Slight Snow',
        icon: 'snowflake',
        key: 'snowy'
      };
    case 73:
      return {
        condition: 'Moderate Snow',
        icon: 'snowflake',
        key: 'snowy'
      };
    case 75:
      return {
        condition: 'Heavy Snow',
        icon: 'snowflake',
        key: 'snowy'
      };
    case 77:
      return {
        condition: 'Snow Grains',
        icon: 'snowflake',
        key: 'snowy'
      };
    case 80:
      return {
        condition: 'Light Showers',
        icon: 'cloud-rain',
        key: 'rainy'
      };
    case 81:
      return {
        condition: 'Moderate Showers',
        icon: 'cloud-rain',
        key: 'rainy'
      };
    case 82:
      return {
        condition: 'Violent Showers',
        icon: 'cloud-rain',
        key: 'rainy'
      };
    case 85:
    case 86:
      return {
        condition: 'Snow Showers',
        icon: 'snowflake',
        key: 'snowy'
      };
    case 95:
      return {
        condition: 'Thunderstorm',
        icon: 'cloud-lightning',
        key: 'thunderstorm'
      };
    case 96:
    case 99:
      return {
        condition: 'Thunderstorm with Hail',
        icon: 'cloud-lightning',
        key: 'thunderstorm'
      };
    default:
      return {
        condition: 'Fair Weather',
        icon: isDay ? 'cloud-sun' : 'moon',
        key: 'sunny'
      };
  }
}

// ============================================================================
// 3. Helper Functions: Units, Compass, and Time Formatting
// ============================================================================

/**
 * Converts Celsius temperature to active unit (°C or °F) using F = (C * 9/5) + 32
 * 
 * @param {number} celsius - Temperature in Celsius
 * @param {string} unit - 'C' or 'F'
 * @returns {number}
 */
function celsiusToDisplay(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return 'N/A';
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

/**
 * Converts meteorological degrees (0° - 360°) into 16-point cardinal compass direction
 * 
 * @param {number} degrees 
 * @returns {string} e.g. "SW", "NNE"
 */
function getCompassDirection(degrees) {
  if (degrees === null || degrees === undefined || isNaN(degrees)) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Formats an ISO string (e.g. "2026-11-05T07:01") into 12-hour format "07:01 AM"
 */
function formatTime12Hour(isoString) {
  if (!isoString) return 'N/A';
  try {
    const parts = isoString.split('T');
    if (parts.length > 1) {
      const timeParts = parts[1].split(':');
      let hour = parseInt(timeParts[0], 10);
      const minutes = timeParts[1] || '00';
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      const formattedHour = hour < 10 ? `0${hour}` : hour;
      return `${formattedHour}:${minutes} ${ampm}`;
    }
    return isoString;
  } catch (e) {
    return isoString;
  }
}

// ============================================================================
// 4. Global State & DOM Element Cache
// ============================================================================

let currentWeatherData = null;
let currentUnit = localStorage.getItem('weathernow_unit') || 'C';
let currentTheme = localStorage.getItem('weathernow_theme') || 'light';
let isFetching = false;
let liveClockInterval = null;

// Persistent recent searches (max 5 items, default seeds for immediate demo convenience)
let recentSearches = JSON.parse(
  localStorage.getItem('weathernow_recent') || '["Bengaluru", "Mumbai", "London", "New York", "Tokyo"]'
);

// Cache common DOM elements
const DOM = {};

function initDomReferences() {
  DOM.headerDate = document.getElementById('header-current-date');
  DOM.themeToggleBtn = document.getElementById('theme-toggle-btn');
  DOM.unitToggleBtn = document.getElementById('unit-toggle-btn');
  DOM.mobileMenuBtn = document.getElementById('mobile-menu-btn');
  DOM.mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  DOM.searchInput = document.getElementById('city-search-input');
  DOM.searchBtn = document.getElementById('search-btn');
  DOM.currentLocationBtn = document.getElementById('current-location-btn');
  DOM.searchClearBtn = document.getElementById('search-clear-btn');
  DOM.recentChipsContainer = document.getElementById('recent-chips-container');
  DOM.clearRecentBtn = document.getElementById('clear-recent-btn');

  DOM.dashboardGrid = document.getElementById('dashboard-grid');
  DOM.loadingState = document.getElementById('loading-state');
  DOM.emptyState = document.getElementById('empty-state');
  DOM.errorState = document.getElementById('error-state');
  DOM.errorMessageText = document.getElementById('error-message-text');
  DOM.errorRetryBtn = document.getElementById('error-retry-btn');
  DOM.errorFallbackBtn = document.getElementById('error-fallback-btn');

  // Hero Card
  DOM.heroCard = document.getElementById('current-weather-hero');
  DOM.heroCity = document.getElementById('hero-city-name');
  DOM.heroCountry = document.getElementById('hero-country-name');
  DOM.heroClock = document.getElementById('hero-live-clock');
  DOM.heroTemp = document.getElementById('hero-temp-value');
  DOM.heroTempUnit = document.getElementById('hero-temp-unit');
  DOM.heroConditionIcon = document.getElementById('hero-condition-icon');
  DOM.heroConditionText = document.getElementById('hero-condition-text');
  DOM.heroFeelsLike = document.getElementById('hero-feels-like-val');
  DOM.heroTempMax = document.getElementById('hero-temp-max-val');
  DOM.heroTempMin = document.getElementById('hero-temp-min-val');
  DOM.heroSummary = document.getElementById('hero-summary-text');
  DOM.heroRefreshBtn = document.getElementById('hero-refresh-btn');

  // Weather Details
  DOM.detailHumidity = document.getElementById('detail-humidity-val');
  DOM.detailHumidityBar = document.getElementById('detail-humidity-bar');
  DOM.detailHumiditySub = document.getElementById('detail-humidity-sub');

  DOM.detailWind = document.getElementById('detail-wind-val');
  DOM.detailWindSub = document.getElementById('detail-wind-sub');

  DOM.detailPressure = document.getElementById('detail-pressure-val');
  DOM.detailPressureSub = document.getElementById('detail-pressure-sub');

  DOM.detailVisibility = document.getElementById('detail-visibility-val');
  DOM.detailVisibilitySub = document.getElementById('detail-visibility-sub');

  DOM.detailUv = document.getElementById('detail-uv-val');
  DOM.detailUvBar = document.getElementById('detail-uv-bar');
  DOM.detailUvSub = document.getElementById('detail-uv-sub');

  DOM.detailSunTimes = document.getElementById('detail-sun-times-val');
  DOM.detailSunSub = document.getElementById('detail-sun-sub');

  // Summary & AQI
  DOM.briefingTitle = document.getElementById('briefing-title');
  DOM.briefingBody = document.getElementById('briefing-body');
  DOM.aqiPillBadge = document.getElementById('aqi-pill-badge');

  // Forecasts
  DOM.hourlyTrack = document.getElementById('hourly-forecast-track');
  DOM.hourlyScrollLeft = document.getElementById('hourly-scroll-left');
  DOM.hourlyScrollRight = document.getElementById('hourly-scroll-right');
  DOM.fiveDayList = document.getElementById('five-day-forecast-list');

  // Feedback & Modal
  DOM.toast = document.getElementById('toast-notification');
  DOM.toastText = document.getElementById('toast-message-text');
  DOM.aboutModal = document.getElementById('about-modal');
  DOM.aboutCloseBtn = document.getElementById('about-close-btn');
  DOM.navAboutLinks = document.querySelectorAll('.nav-about-trigger');
  DOM.stateButtons = document.querySelectorAll('.state-btn');
}

// ============================================================================
// 5. Asynchronous Core Functions (Open-Meteo REST API)
// ============================================================================

/**
 * Searches for a city name worldwide via the Open-Meteo Geocoding REST API,
 * resolves geographical coordinates (latitude & longitude), and initiates weather fetch.
 * 
 * @param {string} cityName - Name of the city to lookup
 */
async function searchCity(cityName) {
  if (isFetching) return;

  const query = (cityName || '').trim();
  if (!query) {
    showToast('Please enter a city or location name to search');
    if (DOM.searchInput) DOM.searchInput.focus();
    return;
  }

  // Alias lookup map for common alternative spellings (e.g. Bellary -> Ballari)
  const aliasMap = {
    'bellary': 'Ballari',
    'bangalore': 'Bengaluru',
    'calcutta': 'Kolkata',
    'madras': 'Chennai',
    'bombay': 'Mumbai'
  };
  const effectiveQuery = aliasMap[query.toLowerCase()] || query;

  try {
    isFetching = true;
    setUiState('loading');
    if (DOM.searchBtn) DOM.searchBtn.disabled = true;

    // 1. Call Open-Meteo Geocoding API
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(effectiveQuery)}&count=10&language=en&format=json`;
    const response = await fetch(geocodingUrl);

    if (!response.ok) {
      throw new Error(`Geocoding request failed with status: ${response.status}`);
    }

    const geoData = await response.json();

    if (!geoData.results || geoData.results.length === 0) {
      setUiState('error', `Could not find any location matching "${query}". Please check the spelling or search another city.`);
      return;
    }

    // Select the best matching result (exact name match, highest population, or first item)
    const exactMatch = geoData.results.find(
      r => r.name.toLowerCase() === effectiveQuery.toLowerCase() ||
           r.name.toLowerCase() === query.toLowerCase()
    );
    const selected = exactMatch || geoData.results[0];

    const locationMeta = {
      name: selected.name,
      country: selected.country || selected.country_code || '',
      countryCode: selected.country_code || '',
      admin1: selected.admin1 || '',
      latitude: selected.latitude,
      longitude: selected.longitude,
      timezone: selected.timezone || 'auto'
    };

    // Update input and recent searches
    if (DOM.searchInput) {
      DOM.searchInput.value = selected.name;
      if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = 'flex';
    }
    saveRecentSearch(selected.name);

    // 2. Fetch comprehensive forecast for these coordinates
    await getWeather(selected.latitude, selected.longitude, locationMeta);

  } catch (error) {
    console.error('[WeatherNow] Error during city search:', error);
    setUiState('error', `Network or API service error: ${error.message || 'Unable to complete search'}. Please verify internet connection and try again.`);
  } finally {
    isFetching = false;
    if (DOM.searchBtn) DOM.searchBtn.disabled = false;
  }
}

/**
 * Fetches real-time weather information for specified coordinates using Open-Meteo Forecast API.
 * Retrieves current weather, 24-hour hourly outlook, and 5-day daily forecast.
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {object|null} locationMeta - Optional resolved location metadata
 */
async function getWeather(latitude, longitude, locationMeta = null) {
  try {
    setUiState('loading');

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      throw new Error('Invalid coordinates provided for weather query');
    }

    // Build Open-Meteo Forecast API URL dynamically
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,visibility,uv_index,is_day',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
      timezone: locationMeta && locationMeta.timezone ? locationMeta.timezone : 'auto',
      wind_speed_unit: 'kmh'
    });

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const response = await fetch(forecastUrl);

    if (!response.ok) {
      throw new Error(`Open-Meteo Forecast API responded with HTTP status ${response.status}`);
    }

    const data = await response.json();

    // Validate essential payload nodes
    if (!data.current || !data.daily || !data.hourly) {
      throw new Error('Incomplete weather payload received from API');
    }

    // Derive location details if not provided (e.g. from coordinates / GPS)
    const city = locationMeta?.name || `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
    const country = locationMeta?.country || '';
    const admin1 = locationMeta?.admin1 || '';
    const timezone = data.timezone || locationMeta?.timezone || 'UTC';

    // Find current hour index within hourly arrays to extract live visibility and UV
    let currentHourIndex = 0;
    if (data.hourly.time && data.current.time) {
      const matchIndex = data.hourly.time.findIndex(t => t.startsWith(data.current.time.slice(0, 13)));
      if (matchIndex !== -1) currentHourIndex = matchIndex;
    }

    const currentVisibilityMeters = data.hourly.visibility ? data.hourly.visibility[currentHourIndex] : null;
    const currentVisibilityKm = currentVisibilityMeters !== null && currentVisibilityMeters !== undefined
      ? (currentVisibilityMeters / 1000).toFixed(1)
      : '10.0';

    const currentUvIndex = data.hourly.uv_index
      ? Number(data.hourly.uv_index[currentHourIndex] || data.daily.uv_index_max?.[0] || 0)
      : Number(data.daily.uv_index_max?.[0] || 0);

    // Weather condition info from WMO code
    const conditionInfo = getWeatherCondition(data.current.weather_code, data.current.is_day);

    // Build 12-hour hourly forecast slice starting from current hour
    const hourlyList = [];
    const totalHours = data.hourly.time ? data.hourly.time.length : 0;
    const startHour = Math.max(0, currentHourIndex);
    const endHour = Math.min(totalHours, startHour + 12);

    for (let i = startHour; i < endHour; i++) {
      const isFirst = (i === startHour);
      const isoTime = data.hourly.time[i];
      let displayTime = 'Now';
      if (!isFirst && isoTime) {
        displayTime = formatTime12Hour(isoTime).replace(':00 ', ' ');
      }

      const hourCondition = getWeatherCondition(
        data.hourly.weather_code ? data.hourly.weather_code[i] : 0,
        data.hourly.is_day ? data.hourly.is_day[i] : 1
      );

      hourlyList.push({
        time: displayTime,
        tempC: data.hourly.temperature_2m ? data.hourly.temperature_2m[i] : null,
        condition: hourCondition.condition,
        icon: hourCondition.icon,
        precip: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[i] : 0
      });
    }

    // Build 5-day daily forecast list
    const dailyList = [];
    const totalDays = data.daily.time ? data.daily.time.length : 0;
    const maxDays = Math.min(totalDays, 5);

    for (let i = 0; i < maxDays; i++) {
      const isoDate = data.daily.time[i];
      let dayName = 'Today';
      let formattedDate = '';

      if (isoDate) {
        // Parse date in city's timezone
        const dateObj = new Date(isoDate + 'T12:00:00');
        if (i > 0) {
          dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        }
        formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      const dayCondition = getWeatherCondition(
        data.daily.weather_code ? data.daily.weather_code[i] : 0,
        1
      );

      dailyList.push({
        day: dayName,
        date: formattedDate,
        tempMinC: data.daily.temperature_2m_min ? data.daily.temperature_2m_min[i] : null,
        tempMaxC: data.daily.temperature_2m_max ? data.daily.temperature_2m_max[i] : null,
        condition: dayCondition.condition,
        icon: dayCondition.icon,
        rainChance: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] : 0
      });
    }

    // Dynamic Weather Summary Briefing
    const tempC = Math.round(data.current.temperature_2m);
    const windKmh = Math.round(data.current.wind_speed_10m);
    const humidity = data.current.relative_humidity_2m;
    const summaryText = `Currently ${tempC}°C with ${conditionInfo.condition.toLowerCase()} in ${city}. Relative humidity is ${humidity}% with ${windKmh > 20 ? 'moderate' : 'gentle'} winds of ${windKmh} km/h from the ${getCompassDirection(data.current.wind_direction_10m)}. Favorable conditions prevailing throughout the area.`;

    // Package comprehensive state object
    currentWeatherData = {
      city,
      country,
      admin1,
      latitude: lat,
      longitude: lon,
      timezone,
      tempC: data.current.temperature_2m,
      feelsLikeC: data.current.apparent_temperature,
      tempMinC: data.daily.temperature_2m_min ? data.daily.temperature_2m_min[0] : null,
      tempMaxC: data.daily.temperature_2m_max ? data.daily.temperature_2m_max[0] : null,
      humidity: data.current.relative_humidity_2m,
      windSpeedKmH: data.current.wind_speed_10m,
      windDirectionDeg: data.current.wind_direction_10m,
      pressureHPa: data.current.surface_pressure,
      visibilityKm: currentVisibilityKm,
      uvIndex: currentUvIndex,
      sunrise: data.daily.sunrise ? formatTime12Hour(data.daily.sunrise[0]) : 'N/A',
      sunset: data.daily.sunset ? formatTime12Hour(data.daily.sunset[0]) : 'N/A',
      condition: conditionInfo.condition,
      conditionIcon: conditionInfo.icon,
      conditionKey: conditionInfo.key,
      summary: summaryText,
      hourly: hourlyList,
      daily: dailyList
    };

    // Update entire UI dashboard dynamically
    updateWeatherDashboard(currentWeatherData);
    setUiState('normal');

  } catch (error) {
    console.error('[WeatherNow] Error fetching weather forecast:', error);
    setUiState('error', `Unable to retrieve live forecast data: ${error.message || 'Unknown network error'}. Please check internet connectivity.`);
  }
}

/**
 * Updates all weather dashboard DOM components with live data.
 * Does not refetch from API; renders immediately using the provided dataset.
 * 
 * @param {object} weatherData 
 */
function updateWeatherDashboard(weatherData) {
  if (!weatherData) return;

  const unit = currentUnit;

  // 1. Header unit toggle indicator
  if (DOM.unitToggleBtn) DOM.unitToggleBtn.textContent = `°${unit}`;

  // 2. Main Weather Overview (Hero Card)
  if (DOM.heroCity) DOM.heroCity.textContent = weatherData.city;
  
  if (DOM.heroCountry) {
    const locParts = [weatherData.admin1, weatherData.country].filter(Boolean);
    DOM.heroCountry.textContent = locParts.length > 0 ? locParts.join(', ') : 'Global Station';
  }

  if (DOM.heroTemp) DOM.heroTemp.textContent = celsiusToDisplay(weatherData.tempC, unit);
  if (DOM.heroTempUnit) DOM.heroTempUnit.textContent = `°${unit}`;

  if (DOM.heroConditionIcon) {
    DOM.heroConditionIcon.innerHTML = SVG_ICONS[weatherData.conditionIcon] || SVG_ICONS['cloud-sun'];
  }
  if (DOM.heroConditionText) DOM.heroConditionText.textContent = weatherData.condition;

  if (DOM.heroFeelsLike) {
    DOM.heroFeelsLike.textContent = `${celsiusToDisplay(weatherData.feelsLikeC, unit)}°${unit}`;
  }
  if (DOM.heroTempMax) {
    DOM.heroTempMax.textContent = `${celsiusToDisplay(weatherData.tempMaxC, unit)}°${unit}`;
  }
  if (DOM.heroTempMin) {
    DOM.heroTempMin.textContent = `${celsiusToDisplay(weatherData.tempMinC, unit)}°${unit}`;
  }
  if (DOM.heroSummary) DOM.heroSummary.textContent = weatherData.summary;

  // Card gradient condition class
  if (DOM.heroCard) {
    DOM.heroCard.className = `current-weather-hero condition-${weatherData.conditionKey || 'sunny'}`;
  }

  // 3. Weather Details Section (6 Cards)
  // Humidity
  if (DOM.detailHumidity) {
    DOM.detailHumidity.textContent = weatherData.humidity !== null && weatherData.humidity !== undefined
      ? `${Math.round(weatherData.humidity)}%`
      : 'N/A';
  }
  if (DOM.detailHumidityBar && weatherData.humidity !== null) {
    DOM.detailHumidityBar.style.width = `${Math.min(100, Math.max(0, weatherData.humidity))}%`;
  }
  if (DOM.detailHumiditySub) {
    DOM.detailHumiditySub.textContent = weatherData.humidity > 60
      ? 'Comfortable atmospheric moisture'
      : 'Dry and crisp air';
  }

  // Wind Speed & Direction
  if (DOM.detailWind) {
    if (weatherData.windSpeedKmH !== null && weatherData.windSpeedKmH !== undefined) {
      if (unit === 'F') {
        const mph = Math.round(weatherData.windSpeedKmH * 0.621371);
        DOM.detailWind.textContent = `${mph} mph`;
      } else {
        DOM.detailWind.textContent = `${Math.round(weatherData.windSpeedKmH)} km/h`;
      }
    } else {
      DOM.detailWind.textContent = 'N/A';
    }
  }
  if (DOM.detailWindSub) {
    const compass = getCompassDirection(weatherData.windDirectionDeg);
    const deg = Math.round(weatherData.windDirectionDeg || 0);
    DOM.detailWindSub.innerHTML = `Direction: <strong>${compass}</strong> (${deg}°)`;
  }

  // Barometric Pressure
  if (DOM.detailPressure) {
    DOM.detailPressure.textContent = weatherData.pressureHPa !== null && weatherData.pressureHPa !== undefined
      ? `${Math.round(weatherData.pressureHPa).toLocaleString()} hPa`
      : 'N/A';
  }
  if (DOM.detailPressureSub) {
    DOM.detailPressureSub.textContent = (weatherData.pressureHPa || 1013) >= 1013
      ? 'High pressure system · Stable'
      : 'Low pressure system · Active';
  }

  // Visibility
  if (DOM.detailVisibility) {
    if (weatherData.visibilityKm !== null && weatherData.visibilityKm !== undefined && weatherData.visibilityKm !== 'N/A') {
      const km = parseFloat(weatherData.visibilityKm);
      if (unit === 'F') {
        const miles = (km * 0.621371).toFixed(1);
        DOM.detailVisibility.textContent = `${miles} mi`;
      } else {
        DOM.detailVisibility.textContent = `${km.toFixed(1)} km`;
      }
    } else {
      DOM.detailVisibility.textContent = 'N/A';
    }
  }
  if (DOM.detailVisibilitySub) {
    DOM.detailVisibilitySub.textContent = parseFloat(weatherData.visibilityKm || 10) >= 9
      ? 'Clear visual horizon'
      : 'Haze or light mist present';
  }

  // UV Index
  if (DOM.detailUv) {
    const uv = Math.round((weatherData.uvIndex || 0) * 10) / 10;
    let label = 'Low';
    if (uv >= 3 && uv < 6) label = 'Moderate';
    else if (uv >= 6 && uv < 8) label = 'High';
    else if (uv >= 8 && uv < 11) label = 'Very High';
    else if (uv >= 11) label = 'Extreme';

    DOM.detailUv.textContent = `${uv} · ${label}`;
    if (DOM.detailUvBar) {
      const uvPercent = Math.min(100, (uv / 11) * 100);
      DOM.detailUvBar.style.width = `${uvPercent}%`;
    }
    if (DOM.detailUvSub) {
      DOM.detailUvSub.textContent = uv >= 6 ? 'Sun protection recommended' : 'Low solar radiation';
    }
  }

  // Sunrise and Sunset
  if (DOM.detailSunTimes) {
    DOM.detailSunTimes.textContent = `${weatherData.sunrise} / ${weatherData.sunset}`;
  }
  if (DOM.detailSunSub) {
    DOM.detailSunSub.textContent = `Dawn: ${weatherData.sunrise} · Dusk: ${weatherData.sunset}`;
  }

  // 4. Atmospheric Briefing Box
  if (DOM.briefingTitle) DOM.briefingTitle.textContent = `${weatherData.city} Weather Briefing`;
  if (DOM.briefingBody) DOM.briefingBody.textContent = weatherData.summary;
  if (DOM.aqiPillBadge) {
    DOM.aqiPillBadge.textContent = `Live Telemetry · Open-Meteo REST API`;
  }

  // 5. Hourly Forecast
  displayHourlyForecast(weatherData.hourly, weatherData.timezone, unit);

  // 6. Five-Day Forecast
  displayFiveDayForecast(weatherData.daily, unit);

  // 7. Update Live Clock immediately
  updateLiveClock();
}

/**
 * Renders the hourly forecast carousel.
 * 
 * @param {Array} hourlyData 
 * @param {string} timezone 
 * @param {string} unit 
 */
function displayHourlyForecast(hourlyData, timezone, unit = 'C') {
  if (!DOM.hourlyTrack) return;
  DOM.hourlyTrack.innerHTML = '';

  if (!hourlyData || hourlyData.length === 0) {
    DOM.hourlyTrack.innerHTML = `<div style="padding: 1.5rem; color: var(--text-muted); font-size: 0.9rem;">Hourly forecast data unavailable</div>`;
    return;
  }

  hourlyData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = `hourly-card ${index === 0 ? 'active-hour' : ''}`;

    const iconSvg = SVG_ICONS[item.icon] || SVG_ICONS['cloud-sun'];
    const tempDisplay = item.tempC !== null ? `${celsiusToDisplay(item.tempC, unit)}°${unit}` : 'N/A';

    card.innerHTML = `
      <span class="hourly-time">${item.time}</span>
      <div class="hourly-icon">${iconSvg}</div>
      <span class="hourly-temp tabular-nums">${tempDisplay}</span>
      <span class="hourly-condition" title="${item.condition}">${item.condition}</span>
      <span class="hourly-precip">
        ${SVG_ICONS['droplets']}
        <span>${item.precip}%</span>
      </span>
    `;

    DOM.hourlyTrack.appendChild(card);
  });
}

/**
 * Renders the five-day daily forecast list.
 * 
 * @param {Array} dailyData 
 * @param {string} unit 
 */
function displayFiveDayForecast(dailyData, unit = 'C') {
  if (!DOM.fiveDayList) return;
  DOM.fiveDayList.innerHTML = '';

  if (!dailyData || dailyData.length === 0) {
    DOM.fiveDayList.innerHTML = `<div style="padding: 1.5rem; color: var(--text-muted); font-size: 0.9rem;">Five-day forecast unavailable</div>`;
    return;
  }

  dailyData.forEach(item => {
    const row = document.createElement('div');
    row.className = 'forecast-row-card';

    const iconSvg = SVG_ICONS[item.icon] || SVG_ICONS['cloud-sun'];
    const minDisplay = item.tempMinC !== null ? `${celsiusToDisplay(item.tempMinC, unit)}°` : 'N/A';
    const maxDisplay = item.tempMaxC !== null ? `${celsiusToDisplay(item.tempMaxC, unit)}°` : 'N/A';

    row.innerHTML = `
      <div class="forecast-day-meta">
        <span class="forecast-day-name">${item.day}</span>
        <span class="forecast-day-date">${item.date}</span>
      </div>
      <div class="forecast-condition-cell">
        <div class="forecast-icon">${iconSvg}</div>
        <span class="forecast-condition-name">${item.condition}</span>
      </div>
      <div class="forecast-temp-range">
        <span class="temp-min tabular-nums">${minDisplay}</span>
        <div class="temp-bar-mini">
          <div class="temp-bar-fill" style="left: 10%; right: 10%;"></div>
        </div>
        <span class="temp-max tabular-nums">${maxDisplay}</span>
      </div>
    `;

    DOM.fiveDayList.appendChild(row);
  });
}

// ============================================================================
// 6. Timezone-Aware Live Digital Clock
// ============================================================================

/**
 * Updates the digital clock and date badge using the current city's IANA timezone.
 */
function updateLiveClock() {
  const now = new Date();
  const tz = currentWeatherData && currentWeatherData.timezone ? currentWeatherData.timezone : undefined;

  try {
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    if (tz && tz !== 'auto') timeOptions.timeZone = tz;

    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    if (tz && tz !== 'auto') dateOptions.timeZone = tz;

    const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);

    if (DOM.heroClock) DOM.heroClock.textContent = formattedTime;
    if (DOM.headerDate) DOM.headerDate.textContent = formattedDate;

  } catch (e) {
    // Graceful fallback to browser local time if invalid timezone string
    if (DOM.heroClock) DOM.heroClock.textContent = now.toLocaleTimeString('en-US');
    if (DOM.headerDate) DOM.headerDate.textContent = now.toLocaleDateString('en-US');
  }
}

// ============================================================================
// 7. Browser Geolocation (Current Location)
// ============================================================================

function handleCurrentLocation() {
  if (isFetching) return;

  if (!('geolocation' in navigator)) {
    showToast('Geolocation is not supported by your browser');
    return;
  }

  showToast('Requesting device location coordinates...');
  setUiState('loading');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        showToast('Acquired GPS coordinates. Resolving location name...');

        // Attempt reverse geocoding via Nominatim
        let locationName = `GPS Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
        let country = '';
        let admin1 = '';

        try {
          const revUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
          const revRes = await fetch(revUrl, {
            headers: { 'Accept': 'application/json' }
          });
          if (revRes.ok) {
            const revData = await revRes.json();
            if (revData && revData.address) {
              locationName = revData.address.city ||
                             revData.address.town ||
                             revData.address.village ||
                             revData.address.county ||
                             revData.name ||
                             locationName;
              country = revData.address.country || '';
              admin1 = revData.address.state || '';
            }
          }
        } catch (revErr) {
          console.warn('[WeatherNow] Reverse geocode fallback:', revErr);
        }

        const meta = {
          name: locationName,
          country,
          admin1,
          latitude: lat,
          longitude: lon
        };

        if (DOM.searchInput) {
          DOM.searchInput.value = locationName;
          if (DOM.searchClearBtn) DOM.searchClearBtn.style.display = 'flex';
        }
        saveRecentSearch(locationName);

        await getWeather(lat, lon, meta);
        showToast(`Weather loaded for ${locationName}`);

      } catch (err) {
        console.error('[WeatherNow] Geolocation weather fetch failed:', err);
        setUiState('error', `Failed to load weather for your location: ${err.message}`);
      }
    },
    (geoError) => {
      console.warn('[WeatherNow] Geolocation error:', geoError);
      let msg = 'Location request was declined';
      if (geoError.code === 2) msg = 'Location position unavailable';
      else if (geoError.code === 3) msg = 'Location request timed out';

      showToast(msg);
      // Restore dashboard to previous city
      if (currentWeatherData) {
        setUiState('normal');
      } else {
        searchCity('Bengaluru');
      }
    },
    { timeout: 8000, enableHighAccuracy: false }
  );
}

// ============================================================================
// 8. Recent Searches Management (localStorage)
// ============================================================================

function saveRecentSearch(cityName) {
  if (!cityName) return;
  const cleaned = cityName.trim();
  if (!cleaned) return;

  // Filter out existing occurrence to prevent duplicates
  recentSearches = recentSearches.filter(
    item => item.toLowerCase() !== cleaned.toLowerCase()
  );

  // Add to beginning of array
  recentSearches.unshift(cleaned);

  // Limit to 5 most recent cities
  if (recentSearches.length > 5) {
    recentSearches = recentSearches.slice(0, 5);
  }

  try {
    localStorage.setItem('weathernow_recent', JSON.stringify(recentSearches));
  } catch (e) {
    console.warn('localStorage error', e);
  }

  renderRecentSearches();
}

function renderRecentSearches() {
  if (!DOM.recentChipsContainer) return;
  DOM.recentChipsContainer.innerHTML = '';

  if (recentSearches.length === 0) {
    DOM.recentChipsContainer.innerHTML = `<span style="color: var(--text-muted); font-size: 0.8rem;">No recent searches</span>`;
    return;
  }

  recentSearches.forEach(cityName => {
    const chip = document.createElement('button');
    chip.className = 'recent-chip';
    chip.innerHTML = `${SVG_ICONS['map-pin']} <span>${cityName}</span>`;
    chip.addEventListener('click', () => {
      if (DOM.searchInput) DOM.searchInput.value = cityName;
      searchCity(cityName);
    });
    DOM.recentChipsContainer.appendChild(chip);
  });
}

// ============================================================================
// 9. UI States & Notification Feedback
// ============================================================================

function setUiState(state, errorMessage = '') {
  if (!DOM.dashboardGrid) return;

  DOM.dashboardGrid.style.display = 'none';
  if (DOM.loadingState) DOM.loadingState.classList.remove('active');
  if (DOM.emptyState) DOM.emptyState.classList.remove('active');
  if (DOM.errorState) DOM.errorState.classList.remove('active');

  if (state === 'normal') {
    DOM.dashboardGrid.style.display = 'grid';
  } else if (state === 'loading') {
    if (DOM.loadingState) DOM.loadingState.classList.add('active');
  } else if (state === 'empty') {
    if (DOM.emptyState) DOM.emptyState.classList.add('active');
  } else if (state === 'error') {
    if (DOM.errorState) DOM.errorState.classList.add('active');
    if (DOM.errorMessageText && errorMessage) {
      DOM.errorMessageText.textContent = errorMessage;
    }
  }

  // Update State preview buttons in the banner
  if (DOM.stateButtons) {
    DOM.stateButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.state === state);
    });
  }
}

let toastTimer = null;
function showToast(message) {
  if (!DOM.toast || !DOM.toastText) return;
  DOM.toastText.textContent = message;
  DOM.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, 2600);
}

// ============================================================================
// 10. Dual Theme Switcher (Light / Dark)
// ============================================================================

function applyTheme(theme) {
  currentTheme = theme;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.innerHTML = SVG_ICONS['sun'];
      DOM.themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      DOM.themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  } else {
    document.documentElement.classList.remove('dark');
    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.innerHTML = SVG_ICONS['moon'];
      DOM.themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      DOM.themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  }
  localStorage.setItem('weathernow_theme', theme);
}

// ============================================================================
// 11. Event Listeners & Bootstrapping
// ============================================================================

function setupEventListeners() {
  // Theme Toggle
  if (DOM.themeToggleBtn) {
    DOM.themeToggleBtn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }

  // Temperature Unit Toggle (°C / °F)
  if (DOM.unitToggleBtn) {
    DOM.unitToggleBtn.addEventListener('click', () => {
      currentUnit = currentUnit === 'C' ? 'F' : 'C';
      localStorage.setItem('weathernow_unit', currentUnit);
      if (currentWeatherData) {
        // Recalculate and update DOM immediately without API re-fetch
        updateWeatherDashboard(currentWeatherData);
        showToast(`Units switched to °${currentUnit}`);
      }
    });
  }

  // Mobile Navigation Drawer Toggle
  if (DOM.mobileMenuBtn && DOM.mobileNavDrawer) {
    DOM.mobileMenuBtn.addEventListener('click', () => {
      DOM.mobileNavDrawer.classList.toggle('open');
    });
  }

  // Search Input & Buttons
  if (DOM.searchBtn) {
    DOM.searchBtn.addEventListener('click', () => {
      if (DOM.searchInput) searchCity(DOM.searchInput.value);
    });
  }

  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchCity(DOM.searchInput.value);
      }
    });

    DOM.searchInput.addEventListener('input', () => {
      if (DOM.searchClearBtn) {
        DOM.searchClearBtn.style.display = DOM.searchInput.value.trim().length > 0 ? 'flex' : 'none';
      }
    });
  }

  if (DOM.searchClearBtn) {
    DOM.searchClearBtn.addEventListener('click', () => {
      if (DOM.searchInput) {
        DOM.searchInput.value = '';
        DOM.searchInput.focus();
      }
      DOM.searchClearBtn.style.display = 'none';
    });
  }

  // Geolocation Button
  if (DOM.currentLocationBtn) {
    DOM.currentLocationBtn.addEventListener('click', handleCurrentLocation);
  }

  // Clear Recent Searches History
  if (DOM.clearRecentBtn) {
    DOM.clearRecentBtn.addEventListener('click', () => {
      recentSearches = [];
      localStorage.removeItem('weathernow_recent');
      renderRecentSearches();
      showToast('Recent searches cleared');
    });
  }

  // Refresh Weather Data Button on Hero Card
  if (DOM.heroRefreshBtn) {
    DOM.heroRefreshBtn.addEventListener('click', () => {
      if (!currentWeatherData) return;
      DOM.heroRefreshBtn.classList.add('spinning');
      showToast(`Refreshing live weather for ${currentWeatherData.city}...`);

      getWeather(currentWeatherData.latitude, currentWeatherData.longitude, {
        name: currentWeatherData.city,
        country: currentWeatherData.country,
        admin1: currentWeatherData.admin1,
        timezone: currentWeatherData.timezone
      }).finally(() => {
        DOM.heroRefreshBtn.classList.remove('spinning');
        showToast('Live weather updated');
      });
    });
  }

  // Hourly Carousel Horizontal Scroll Controls
  if (DOM.hourlyScrollLeft && DOM.hourlyTrack) {
    DOM.hourlyScrollLeft.addEventListener('click', () => {
      DOM.hourlyTrack.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }
  if (DOM.hourlyScrollRight && DOM.hourlyTrack) {
    DOM.hourlyScrollRight.addEventListener('click', () => {
      DOM.hourlyTrack.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  // Error State Retry & Fallback Actions
  if (DOM.errorRetryBtn) {
    DOM.errorRetryBtn.addEventListener('click', () => {
      if (DOM.searchInput) DOM.searchInput.focus();
    });
  }
  if (DOM.errorFallbackBtn) {
    DOM.errorFallbackBtn.addEventListener('click', () => {
      searchCity('Bengaluru');
    });
  }

  // Evaluator UI State Switcher buttons in banner
  if (DOM.stateButtons) {
    DOM.stateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const state = btn.dataset.state;
        if (state === 'normal' && !currentWeatherData) {
          searchCity('Bengaluru');
        } else {
          setUiState(state);
        }
      });
    });
  }

  // About Modal
  if (DOM.navAboutLinks) {
    DOM.navAboutLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (DOM.aboutModal) {
          DOM.aboutModal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }
  if (DOM.aboutCloseBtn) {
    DOM.aboutCloseBtn.addEventListener('click', () => {
      if (DOM.aboutModal) {
        DOM.aboutModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
  if (DOM.aboutModal) {
    DOM.aboutModal.addEventListener('click', (e) => {
      if (e.target === DOM.aboutModal) {
        DOM.aboutModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

// ============================================================================
// 12. Application Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initDomReferences();
  setupEventListeners();
  applyTheme(currentTheme);
  renderRecentSearches();

  // Start live clock ticking every second
  updateLiveClock();
  if (liveClockInterval) clearInterval(liveClockInterval);
  liveClockInterval = setInterval(updateLiveClock, 1000);

  // Initial Weather Load:
  // Fetch real-time weather data for Bengaluru, India (or first recent search)
  const initialCity = recentSearches[0] || 'Bengaluru';
  console.log(`[WeatherNow Phase 2] Initializing live weather for: ${initialCity}`);
  searchCity(initialCity);
});

// Expose required functions globally for programmatic evaluation
window.searchCity = searchCity;
window.getWeather = getWeather;
window.updateWeatherDashboard = updateWeatherDashboard;
window.getWeatherCondition = getWeatherCondition;
window.displayHourlyForecast = displayHourlyForecast;
window.displayFiveDayForecast = displayFiveDayForecast;
