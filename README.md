Weather App 🌤️
A sleek and user-friendly weather application that fetches real-time weather information for any city using the OpenWeather API. Users can view current weather conditions, a 5-day forecast, and weather details for their current location.

Features 🚀
Search Weather by City: Enter a city name to get the current weather and extended forecast.
Geolocation Support: Automatically fetch weather details for the user's current location.
Validation for City Names: Handles city names with spaces, hyphens, and apostrophes.
Dynamic Backgrounds: Changes the app's background based on weather conditions and time of day.
Recently Searched Cities: Tracks the last five searched cities for quick access.
Detailed Weather Data:
Temperature (min, max, feels like)
Wind speed and direction
Atmospheric pressure (sea and ground level)
Sunrise and sunset times
Error Handling: Alerts users with actionable messages for invalid inputs or API issues.
Technologies Used 🛠️
Front-End Development
HTML5: Structured the application's interface with semantic and accessible markup.
CSS3: Styled the application using modern CSS features like flexbox, animations, and responsive design techniques to ensure a seamless experience across devices.
JavaScript (ES6): Powered the app's interactivity and functionality with modular, clean, and optimized code. Key JavaScript features include:
Fetch API for asynchronous data retrieval.
Event listeners for handling user interactions.
LocalStorage for persisting recently searched cities.
API Integration
OpenWeather API: Utilized to fetch real-time weather data and a 5-day weather forecast. Key API endpoints:
weather endpoint for current weather data.
forecast endpoint for extended forecasts.
Geolocation
Navigator Geolocation API: Determines the user's current geographical location to fetch local weather data automatically.
Responsive Design
Ensured compatibility across different devices with responsive layouts using CSS media queries.
Tools & Development Environment
VS Code: Primary code editor with extensions for enhanced development efficiency.
Git: Version control to manage project updates and collaboration.
LocalStorage: Browser storage to cache recent city searches, improving user experience.
Installation & Setup 🖥️
Clone the Repository:

bash
Copy code
git clone https://github.com/your-username/weather-app.git
cd weather-app
API Key Setup:

Sign up at OpenWeather and get your API key.
Replace the placeholder API key (YOUR_API_KEY_HERE) in script.js with your actual key.
Run the App:

Open index.html in any modern web browser.
Usage Guide 📖
Enter a city name (letters, spaces, apostrophes, and hyphens are allowed).
Click Search to view weather details for the entered city.
Use the "Get Current Location" button to fetch weather details for your current coordinates.
If a city name isn't recognized:
Replace any hyphens (-) with spaces.
Double-check for typos.
View your recently searched cities in the dropdown menu for quick re-selection.
Error Handling 🔧
City Not Found: Displays a helpful message suggesting alternatives (e.g., "Replace hyphens with spaces").
Invalid City Name: Alerts users to enter a valid name (letters, spaces, apostrophes, and hyphens only).
Future Enhancements 🛠️
Add more detailed weather maps using the OpenWeather Map API.
Implement user authentication to save personalized settings and preferences.
Dark mode for better usability in low-light environments.
Contributing 🤝
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature-name
Commit your changes:
bash
Copy code
git commit -m "Add feature"
Push to the branch:
bash
Copy code
git push origin feature-name
Open a pull request.
License 📜
This project is licensed under the MIT License.

Acknowledgements 🙌
OpenWeather API for the weather data.
MDN Web Docs for JavaScript and web development resources.