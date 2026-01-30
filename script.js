/* ================== CONFIG ================== */
const apiKey = "7bcce252f2fe47c9aa153321262001";

/* ================== DOM ELEMENTS ================== */
const place  = document.getElementById("place");
const region = document.getElementById("region");
const temp   = document.getElementById("temp");
const status = document.getElementById("status");
const timeEl = document.getElementById("time");
const hours  = document.getElementById("hours");
const cityInput = document.getElementById("city");
const navButtons = document.querySelectorAll(".nav-btn");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

/* ================== TIME FORMAT ================== */
function formatAMPM(time) {
  const d = new Date(time);
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:00 ${ampm}`;
}

/* ================== WEATHER ================== */
function loadWeather(city) {
  const cityName = city || cityInput.value.trim() || "Pune";

  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=1`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("City not found ❌");
        return;
      }

      // ===== MAIN WEATHER INFO =====
      place.innerText  = data.location.name;
      region.innerText = data.location.region;
      temp.innerText   = data.current.temp_c + "°C";
      status.innerText = data.current.condition.text;
      timeEl.innerText = data.location.localtime;

      // ===== NEW FEATURES =====
      feelsEl.innerText = "Feels like: " + data.current.feelslike_c + "°C";
      humidityEl.innerText = "Humidity: " + data.current.humidity + "%";
      windEl.innerText = "Wind: " + data.current.wind_kph + " km/h";

      // ===== HOURLY FORECAST =====
      hours.innerHTML = "";
      const currentHour = new Date(data.location.localtime).getHours();

      data.forecast.forecastday[0].hour
        .slice(currentHour, currentHour + 8)
        .forEach(h => {
          hours.innerHTML += `
            <div class="card">
              <div>${formatAMPM(h.time)}</div>
              <img src="https:${h.condition.icon}">
              <h3>${h.temp_c}°</h3>
              <small>${h.condition.text}</small>
            </div>
          `;
        });
    })
    .catch(err => {
      console.error(err);
      alert("Network error ❌");
    });
}

/* ================== SEARCH ================== */
function searchCity() {
  loadWeather();
}

/* ================== POPULAR CITY ================== */
function loadCity(city) {
  cityInput.value = city;
  loadWeather(city);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ================== EXTRA BUTTONS ================== */
function loadForecast() { status.innerText = "Hourly Forecast Loaded"; }
function loadMap() { window.open("https://www.google.com/maps/search/weather","_blank"); }
function loadNews() { window.open("https://www.weather.com/news","_blank"); }
function loadSatellite() { window.open("https://www.windy.com","_blank"); }
function loadLiveMap() { window.open("https://www.windy.com","_blank"); }
function changeLang() { alert("Language feature coming soon!"); }

/* ================== ACTIVE BUTTON ================== */
function setActive(button) {
  navButtons.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
}

/* ================== EVENT LISTENERS ================== */
// Enter key for search input
cityInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") loadWeather();
});

// Search button click
document.querySelector(".search button").addEventListener("click", searchCity);

// Nav button active state
navButtons.forEach(btn => btn.addEventListener("click", function() {
  setActive(btn);
}));

/* ================== INITIAL LOAD ================== */
loadWeather();
