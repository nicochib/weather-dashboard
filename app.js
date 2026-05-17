/* =====================
CONFIG 
===================== */

const API_KEY = `YOUR_KEY_HERE`;
const BASE_URL =  'https://api.openweathermap.org/data/2.5';

/* =====================================
THEME MAP
weather ID ranges -> CSS variable values 
===================== */

const THEMES = {
clear_day: {
'--orb-a': 'rgba(251,191,36,0.30)',
'--orb-b': 'rgba(249,115,22,0.20)',
'--accent':'#fbbf24',
'--bg-a':'#0a0a12',
'--bgb':'#1a1200',
},
 clear_night: {
'--orb-a':  'rgba(100,116,220,0.20)',
'--orb-b':'rgba(55,65,120,0.15)',
'--accent':'#818cf8',
'--bg-a':'#020408',
'--bgb':'#050d1a',
},
 rain:{
'--orb-a': 'rgba(56,189,248,0.22)',
'--orb-b':'rgba(14,165,233,0.15)',
'--accent':'#38bdf8',
'--bg-a':'#050a10',
'--bgb': '#071220',
},
 snow: {
'--orb-a': 'rgba(186,230,253,0.20)',
'--orb-b': 'rgba(147,197,253,0.15)',
'--accent': '#bae6fd',
'--bg-a': '#0a0d14',
'--bg-b': '#101520',
},  
 thunderstorm: {
'--orb-a': 'rgba(139,92,246,0.28)',
'--orb-b': 'rgba(168,85,247,0.18)',
'--accent': '#a855f7',
'--bg-a': '#060408',
'--bg-b': '#0c0810',
},
 clouds: {
'--orb-a': 'rgba(148,163,184,0.18)',
'--orb-b': 'rgba(100,116,139,0.12)',
'--accent': '#94a3b8',
'--bg-a': '#0c0d10',
'--bg-b': '#111318',
  },
 };
/* ==================
HELPERS 
===================== */
// picks which them
function getThemeKey(weatherId,isDay) {
    if (!isDay) return 'clear_night';
if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
if (weatherId >= 300 && weatherId < 600) return 'rain';
if (weatherId >= 600 && weatherId < 700) return 'snow';
if (weatherId === 800) return 'clear_day';
return 'clouds';

}
//applies themes sets css variables on :root
function applyTheme(weatherId, isDay) {
    const key = getThemeKey(weatherId, isDay);
    const theme = THEMES[key] || THEMES.clouds;
    const root = document.documentElement;
    Object.entries(theme).forEach(([property, value]) => {
    root.style.setProperty(property, value);
});
}
// Returns an emoji icon based on weather id 
function getWeatherIcon(id, isDay = true) {
    if (id >= 200 && id < 300) return '⛈️';
    if (id >= 300 && id < 600) return '🌧️';
    if (id >= 600 && id < 700) return '❄️';
    if (id >= 700 && id < 800) return '🌫️';
    if (id === 800) return isDay ? '☀️' : '🌙';
    if (id > 800) return '☁️';
    return '🌡️';

}

// converts unix timestamp to a shortday name "mon"
function getDayName(unixTimestamp) {
    return new Date(unixTimestamp * 1000)
    .toLocaleDateString('en-US', {weekday: 'short' });
}
// FORMATS unix timestamp to a readablke time "07:23 am"
function formatTime(unixTimestamp) {
    return new Date(unixTimestamp * 1000)
    .toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit' });
}
/* ==================
UI STATE RENDERS 
===================== */
function showLoading() {
    document.getElementById('content').innerHTML = `
    <div class ="state-view">
        <div class = "spinner"></div>
        <p class = "state-title">Fetching weather...</p>
    </div>
    `;
}

function showError(message) {
    document.getElementById('content').innerHTML =  `
    <div class ="state-view">
        <div class = "state-icon">ICON INCLUDE HERE</div>
        <p class = "state-title">Something went wrong</p>
        <p class = "state-sub">${message}</p>
    </div>
    `;
}

function showEmpty() {
    document.getElementById('content').innerHTML = `
    <div class = "state-view">
        <div class = "state-icon">ICON INCLUDE HERE</div>
        <p class = "state-title">Search a city to begin</p>
        <p class = "state-sub">Enter any city name above to get started</p>
    </div>
    `;
}
/* ==================
RENDER WEATHER 
===================== */
function renderWeather(current,forecastData) {
    const weatherId = current.weather[0].id;
    const isDay = current.weather[0].icon.endsWith('d');
    const icon = getWeatherIcon(weatherId, isDay);

// apply the background theme 
applyTheme(weatherId, isDay);

// process forecast - group by day, one entry per day 
const dailyMap = {};
forecastData.list.forEach(item => {
    const dayKey = new Date(item.dt * 1000).toDateString();
    if (!dailyMap[dayKey]) dailyMap[dayKey] = [];
    dailyMap[dayKey].push(item);
});
const days = Object.values(dailyMap).slice(0,5);

// build forcast cards 
const forecastHTML = days.map((slots, index) => {
    const midSlot = slots[Math.floor(slots.length / 2)];
    const high = Math.max(...slots.map(s => s.main.temp_max));
    const low = Math.min(...slots.map(s => s.main.temp_min));
    const dayIcon = getWeatherIcon(midSlot.weather[0].id, true);
    const label = index === 0 ? 'Today' : getDayName(midSlot.dt);

return `

<div class = "forecast-card">
    <span class = "forecast-day" > ${label} </span>
    <span class = "forecast-icon">${dayIcon} </span>
    <span class = "forecast-hi"> ${Math.round(high)}° </span>
    <span class = "forecast-lo"> ${Math.round(low)}° </span>
    <span class = "forecast-desc">${midSlot.weather[0].description} </span>
</div>
`;
}).join('');

// inject everything into #content(html)
document.getElementById('content').innerHTML = `

<div class="card current-card">
<div class="current-top">
<div class="current-left">
<h1 class="city-name">${current.name}, ${current.sys.country}</h1>
<p class="condition-label">${current.weather[0].description}</p>
</div>
<div class="current-right">
<span class="temp-value">${Math.round(current.main.temp)}<span class="temp-unit">°C</span></span>
<span class="current-icon">${icon}</span>
</div>
</div>

<div class="stats-row">
<div class="stat">
<span class="stat-label">Humidity</span>
<span class="stat-value">${current.main.humidity}<span class="stat-unit">%</span></span>
</div>
<div class="stat">
<span class="stat-label">Wind</span>
<span class="stat-value">${Math.round(current.wind.speed * 3.6)}<span class="stat-unit">km/h</span></span>
</div>
<div class="stat">
<span class="stat-label">Feels like</span>
<span class="stat-value">${Math.round(current.main.feels_like)}<span class="stat-unit">°C</span></span>
</div>
<div class="stat">
<span class="stat-label">Pressure</span>
<span class="stat-value">${current.main.pressure}<span class="stat-unit">hPa</span></span>
</div>
<div class="stat">
<span class="stat-label">Sunrise</span>
<span class="stat-value">${formatTime(current.sys.sunrise)}</span>
</div>
<div class="stat">
<span class="stat-label">Sunset</span>
<span class="stat-value">${formatTime(current.sys.sunset)}</span>
</div>
</div>
</div>

<div class="card forecast-card-wrap">
<p class="section-title">5 — Day Forecast</p>
<div class="forecast-grid">
${forecastHTML}
</div>
</div>

`;
}
/* ==================
API FETCH 
===================== */

async function fetchWeather(city) {
    if(!city.trim()) return;

if (API_KEY === '') {
showError('Add your OpenWeatherMap API key to app.js ');
return;
}

showLoading();

try {
const [currentRes, forecastRes] = await Promise.all([
fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
]);

if (!currentRes.ok) {
    if (currentRes.status === 404) throw new Error('City not found. Check the spelling and try again.');
    if (currentRes.status === 401) throw new Error('Invalid API key — check app.js.');
    throw new Error(`Unexpected error: ${currentRes.status}`);
    }
const current = await currentRes.json();
const forecast = await forecastRes.json();

renderWeather(current, forecast);

} catch(err){
    showError(err.message);
}
}
/* ==================
EVENT LISTENERS
===================== */

document.getElementById('searchBtn').addEventListener('click',()=> {
    const city = document.getElementsById('cityInput').value;
    fetchWeather(city);
});

document.getElementById('cityInput').addEventListener('keydown',(e)=> {
   if (e.key === 'Enter'){
   fetchWeather(e.target.value);
   } 
});

/* ==================
INIT
===================== */

showEmpty();
