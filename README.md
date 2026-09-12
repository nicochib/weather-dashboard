Weather Dashboard

A weather dashboard built with HTML, CSS and JavaScript that uses the OpenWeatherMap API to display current weather conditions and a five-day forecast for searched cities.

Features

* Search for weather by city
* Display current temperature and weather conditions
* Show humidity, wind speed, feels-like temperature and atmospheric pressure
* Display sunrise and sunset times
* Five-day weather forecast with daily high and low temperatures
* Weather icons based on current conditions
* Dynamic colour themes based on weather conditions and day/night
* Loading and error states for API requests
* Responsive interface

Tech Stack

* HTML5
* CSS3
* JavaScript
* OpenWeatherMap API

How It Works

When a user searches for a city, the application makes two requests to the OpenWeatherMap API:

1. The current weather endpoint retrieves the city’s current conditions.
2. The forecast endpoint retrieves weather data in three-hour intervals.

The forecast data is then grouped by calendar day and used to generate the five-day forecast displayed in the dashboard.

The interface also changes its visual theme depending on the current weather condition, including clear weather, rain, snow, thunderstorms, clouds and day/night states.

API Endpoints

The application uses:

* GET /data/2.5/weather — retrieves current weather conditions
* GET /data/2.5/forecast — retrieves the five-day forecast in three-hour intervals

Both requests use metric units. The API key is supplied directly in app.js.

Getting Started

Prerequisites

* A modern web browser
* An OpenWeatherMap API key

Installation

Clone the repository:

git clone https://github.com/nicochib/weather-dashboard.git
cd weather-dashboard

No package installation is required because the project uses vanilla HTML, CSS and JavaScript.

Add your OpenWeatherMap API key to app.js:

const API_KEY = `YOUR_KEY_HERE`;

Then open index.html in a browser.

For local development, you can also run the project using a simple local server such as VS Code Live Server.

Project Structure

weather-dashboard/
├── app.js
├── index.html
├── style.css
├── PPMori-Black.otf
├── PPMori-BlackItalic.otf
├── PPMori-Extralight.otf
├── PPMori-ExtralightItalic.otf
├── PPMori-Italic.otf
├── PPMori-Regular.otf
├── PPMori-Semibold.otf
└── PPMori-SemiboldItalic.otf

Development Notes

The project focuses on working with external APIs, asynchronous JavaScript, dynamic DOM rendering and transforming API data into a user-friendly interface.

It also includes custom weather-theme logic that maps OpenWeatherMap weather IDs to different visual styles for the dashboard.

Future Improvements

* Improve city search validation and suggestions
* Add browser geolocation support
* Add a saved search or favourite cities feature
* Improve forecast data grouping using the API’s timezone information
* Add more detailed hourly weather information
* Move the API key to a safer configuration method rather than exposing it in client-side JavaScript
* Add automated testing

Author

Nicole Chibangula

GitHub