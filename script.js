const form = document.querySelector("#city-search");
const input = document.querySelector("#city-input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

let apiKey = "";

// Use objects to organize and manage application data
const appState = {
	favourites: [], // Stores favorite cities
	weatherData: {}, // Stores the latest weather data
};

// Load API key asynchronously
async function loadApiKey() {
	try {
		const response = await fetch("./config.json");
		if (!response.ok) throw new Error("Failed to load API key");
		const config = await response.json();
		apiKey = config.apiKey;
		console.log("API Key loaded");
	} catch (error) {
		console.error("Error loading config:", error);
	}
}

// Fetch weather data asynchronously
async function fetchWeather(city) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error("City not found");
		const data = await response.json();

		// Store fetched data
		appState.weatherData = data;
		displayWeather(data);
	} catch (error) {
		msg.textContent = "Please search for a valid city";
		console.error("Fetch error:", error);
	}
}

// Display weather on the page
function displayWeather(data) {
	const { main, name, sys, weather } = data;
	const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

	const li = document.createElement("li");
	li.classList.add("city");
	const markup = `
    <h2 class="city-name" data-name="${name},${sys.country}">
      <span>${name}</span>
      <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
      <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
      <figcaption>${weather[0]["description"]}</figcaption>
    </figure>
    <button class="save-btn">Add to favourites</button>
  `;
	li.innerHTML = markup;
	list.appendChild(li);
}

// Save favorite city
function saveFavorite(cityData) {
	let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

	// Add favourite city
	favourites = [
		...appState.favourites, // Use spread operator to merge old and new data
		cityData,
	];

	// Stringify for storage
	localStorage.setItem("favourites", JSON.stringify(favourites));
	console.log("Saved favourites:", favourites);
}

// Load favourites from localStorage
function loadFavourites() {
	const storedFavourites = localStorage.getItem("favourites");
	if (storedFavourites) {
		// Parse stored JSON data
		const favourites = JSON.parse(storedFavourites);
		favourites.forEach((cityData) => {
			displayWeather(cityData);
		});
		console.log("Favs loaded");
	} else {
		console.log("No favs found");
	}
}

// Handle form submission
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const inputVal = input.value.trim();
	if (inputVal) fetchWeather(inputVal);
	msg.textContent = "";
	form.reset();
	input.focus();
});

// Handle save button clicks
list.addEventListener("click", (e) => {
	if (e.target.classList.contains("save-btn")) {
		saveFavorite(appState.weatherData);
	}
});

// Initialize app
loadApiKey();
loadFavourites();

document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM loaded");
});
