const form = document.querySelector("#city-search");
const input = document.querySelector("#city-input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

// Getting API key from config file
let apiKey = "";
fetch("./config.json")
	.then((response) => {
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.json();
	})
	.then((config) => {
		apiKey = config.apiKey;
		console.log("API key loaded");
	})
	.catch((error) => {
		console.log("Error loading config:", error);
	});

// Updating web page with weather information
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const inputVal = input.value;

	//AJAX section
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			console.log("Data fetched");
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
        `;
			li.innerHTML = markup;
			list.appendChild(li);
		})
		.catch((error) => {
			console.log("Error:", error);
			msg.textContent = "Please search for a valid city";
		});

	msg.textContent = "";
	form.reset();
	input.focus();
});

document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM loaded");
});
