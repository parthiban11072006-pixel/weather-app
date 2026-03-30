const apiKey = "067880ab613cb37898bd8c8057e05999"; 
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const resultArea = document.getElementById('weatherResult');
const locationBtn = document.getElementById('locationBtn');

// 1. Search button click panna city weather vara
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim(); 
    if (city !== "") {
        getWeather(city);
    } else {
        alert("City name enter pannunga!");
    }
});

// 2. Enter key amukkunaalum search aaga
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// 3. Use My Location button logic
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        resultArea.innerHTML = "<p>Detecting location...</p>";
        navigator.geolocation.getCurrentPosition((position) => {
            getWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, () => {
            alert("Location access denied! Browser settings-la allow pannunga.");
            resultArea.innerHTML = "<p>Access Denied</p>";
        });
    }
});

// City name vachu fetch panna
async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchAndDisplay(url);
}

// Lat/Lon vachu fetch panna
async function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchAndDisplay(url);
}

// Common function to fetch data
async function fetchAndDisplay(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
            updateUI(data);
        } else {
            resultArea.innerHTML = `<p style="color: red;">City found aagala!</p>`;
        }
    } catch (error) {
        resultArea.innerHTML = `<p>Error fetching data!</p>`;
    }
}

// Screen-la results kaatta
function updateUI(data) {
    const weatherMain = data.weather[0].main;
    
    // Background color based on weather
    let bgColor = "#000000"; // Default Black
    if (weatherMain === "Clear") bgColor = "#f1c40f"; // Sunny Yellow
    if (weatherMain === "Clouds") bgColor = "#5d6d7e"; // Cloudy Gray
    if (weatherMain === "Rain") bgColor = "#2e86de";   // Rainy Blue
    
    document.body.style.backgroundColor = bgColor;

    // Results-ah azhaga card-kulla kaatta
    resultArea.innerHTML = `
        <h3 style="margin: 0; color: #31344b;">${data.name}</h3>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" style="width: 70px;">
        <p style="font-size: 30px; font-weight: bold; margin: 5px; color: #31344b;">${Math.round(data.main.temp)}°C</p>
        <p style="margin: 5px; color: #555;">Condition: <b>${weatherMain}</b></p>
        <p style="margin: 5px; color: #555;">Humidity: <b>${data.main.humidity}%</b></p>
    `;
}