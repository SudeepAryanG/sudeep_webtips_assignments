import changeToFarenheit from "./export.js";

(function () {
/**
 * @desc function to fetch weather data from the json file and store in a
 * global variable, and also gives the updateDropDown based on user preferences
 */
  fetch("https://soliton.glitch.me/all-timezone-cities")
    .then((data) => data.json())
    .then((result) => {
      let weatherData = {};
      for (let i of result) {
        weatherData[i.cityName.toLowerCase()] = i;
      }
      let value = new WeatherTemplate(weatherData);
      value.__proto__.updateDropDown = function () {
        var city = Object.keys(weatherData);
        var option = ``;
        for (let i = 0; i < city.length; i++) {
          option += `<option>${
            city[i].charAt(0).toUpperCase() + city[i].slice(1)
          }</option>`;
        }
        document.querySelector("#data_dropdown").innerHTML = option;
      };
      value.updateDropDown();
      value.sortCitiesByContAndTemp();
      setInterval(value.filterCityCards.bind(value), 60000);
      setInterval(value.updateValidCityDetails.bind(value), 60000);
      value.setWeathercard("sunny");
      document
        .querySelector("#inputdata")
        .addEventListener("input", value.updateValidCityDetails.bind(value));
    });
})(); //IIFE
/**
 * @param {String} weatherData Constructor Class has used for all function and for all global variables and event listeners
 */
class WeatherTemplate {
  constructor(weatherData) {
    this.weatherData = weatherData;
    this.selectedCity = "Anadyr";
    this.currWeather;
    this.sortedSunnyWeatherValues = [];
    this.sortedSnowWeatherValues = [];
    this.sortedRainyWeatherValues = [];
    this.allCities = Object.keys(this.weatherData);
    this.continentOrder = 0;
    this.temperatureOrder = 1;

    document
      .querySelector("#inputdata")
      .addEventListener("input", this.userSelectedCity.bind(this));
    document
      .querySelector("#inputdata")
      .addEventListener("input", this.nextFiveHrs.bind(this));
    document
      .querySelector("#sunny")
      .addEventListener("click", this.setWeathercard.bind(this, "sunny"));
    document.querySelector("#snowflake").addEventListener("click", () => {
      this.setWeathercard.call(this, "snowflake");
    });
    document
      .querySelector("#rainy")
      .addEventListener("click", this.setWeathercard.bind(this, "rainy"));
    document
      .querySelector("#displaynum")
      .addEventListener("change", this.filterCityCards.bind(this));
    document.querySelector("#curser-left").addEventListener("click", () => {
      document.querySelector("#middle-block").scrollLeft -= 300;
    });
    document.querySelector("#curser-right").addEventListener("click", () => {
      document.querySelector("#middle-block").scrollLeft += 300;
    });
    document.querySelector("#continent").addEventListener("click", () => {
      if (this.continentOrder == 0) {
        this.continentOrder = 1;
        document.querySelector("#bottom-continent-arrow").src =
          "HTML & CSS/General Images & Icons/arrowUp.svg";
      } else if (this.continentOrder == 1) {
        this.continentOrder = 0;
        document.querySelector("#bottom-continent-arrow").src =
          "HTML & CSS/General Images & Icons/arrowDown.svg";
      }
      this.sortCitiesByContAndTemp();
    });
    document.querySelector("#bottom-temp").addEventListener("click", () => {
      if (this.temperatureOrder == 0) {
        this.temperatureOrder = 1;
        document.querySelector("#bottom-temp-arrow").src =
          "HTML & CSS/General Images & Icons/arrowUp.svg";
      } else if (this.temperatureOrder == 1) {
        this.temperatureOrder = 0;
        document.querySelector("#bottom-temp-arrow").src =
          "HTML & CSS/General Images & Icons/arrowDown.svg";
      }
      this.sortCitiesByContAndTemp();
    });
  }
  /**
   * @desc function to check whether user has entered vaild input city and update the details
   */
  userSelectedCity() {
    this.selectedCity = document.querySelector("#inputdata").value;
    let city = Object.keys(this.weatherData);
    let currentCity = this.selectedCity;
    let flag = 0;
    for (let i = 0; i < city.length; i++) {
      if (currentCity.toLowerCase() === city[i].toLowerCase()) {
        this.updateValidCityDetails();
        flag = 1;
      }
    }
    if (flag === 0) {
      this.updateInValidCityDetails();
    }
  }
  /**
   * @desc this function sets the null value for weather details when
   * invalid city is selected
   */
  updateInValidCityDetails() {
    document.querySelector("#top-tempc").innerText = "-";
    document.querySelector("#top-fahrenheit").innerText = "-";
    document.querySelector("#top-humidity").innerText = "-";
    document.querySelector("#top-precipitation").innerText = "-";
    document.querySelector("#top-date").innerText = "";
    document.querySelector("#top-time").innerText = "Enter a valid City";
    document.querySelector("#inputdata").style.borderColor = "red";
    document.querySelector("#top-time").style.color = "";
    document.querySelector("#top-img").src = "";
    for (let i = 0; i < 6; i++) {
      document.querySelector(`#time-${i + 1}`).innerText = "-";
      document.querySelector(`#icon-${i + 1}`).src = "";
      document.querySelector(`#temperature-${i + 1}`).innerText = "-";
    }
  }
  /**
   * @desc Based on the user selected city the various fields such as
   *  temperature,precipitation,humidity,live time,date and next
   * five hours temperature and climate icons we get updated.
   */
  updateValidCityDetails() {
    let updateDropDown = document
      .querySelector("#inputdata")
      .value.toLowerCase();
    let valid = false;
    for (const city of Object.keys(this.weatherData)) {
      if (city == updateDropDown.toLowerCase()) {
        valid = true;
      }
    }
    if (!valid) return;
    document.querySelector("#inputdata").style.borderColor = "";
    //Image
    document.getElementById(
      "top-img"
    ).src = `HTML & CSS/Icons for cities/${updateDropDown}.svg`;
    //temperature
    let temp = this.weatherData[updateDropDown].temperature;
    document.getElementById("top-tempc").innerHTML = temp;
    //humidity
    document.getElementById("top-humidity").innerHTML =
      this.weatherData[updateDropDown].humidity;
    //precipitation
    document.getElementById("top-precipitation").innerHTML =
      this.weatherData[updateDropDown].precipitation;
    //temperature F
    let cel = parseInt(this.weatherData[updateDropDown].temperature);
    let far = changeToFarenheit(cel).toFixed(0) + " F";
    document.getElementById("top-fahrenheit").innerHTML = far;
    //Date and time
    let datetimeArr;
    datetimeArr = this.weatherData[updateDropDown].dateAndTime.split(",");
    document.getElementById("top-time").innerHTML = datetimeArr[1].slice(0, -2);
    document.getElementById("top-date").innerHTML = datetimeArr[0];
    //Date
    let dateArr = datetimeArr[0];
    let currDate = this.getDate(dateArr);
    document.getElementById("top-date").innerHTML = currDate;
    // Time
    let time = document.querySelector("#top-time");
    let timeZone = this.weatherData[`${updateDropDown}`].timeZone;
    let currTime = this.getTime(timeZone);
    time.innerHTML = currTime;
  }
  async nextFiveHrs() {
    let updateDropDown = document
      .querySelector("#inputdata")
      .value.toLowerCase();
    let valid = false;
    for (const city of Object.keys(this.weatherData)) {
      if (city == updateDropDown) {
        valid = true;
      }
    }
    if (!valid) return;

    let cityResponse = await fetch(
      `https://soliton.glitch.me?city=${this.weatherData[updateDropDown].cityName}`
    ).then((data) => data.json());
    let forecastJSON = await fetch(
      "https://soliton.glitch.me/hourly-forecast",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cityResponse,
          hours: "6",
        }),
      }
    ).then((data) => data.json());
    let timeZone = this.weatherData[`${updateDropDown}`].timeZone;
    let currTime = this.getTime(timeZone);

    //Hours changing with wrt to time.
    let hour = parseInt(currTime.split(":")[0]);
    let noon = currTime.slice(-2);
    //let noon = currTime.split(" ")[1];
    for (let i = 0; i < 6; i++) {
      if (hour > 12) {
        hour = hour - 12;
      }
      if (i == 0) {
        document.querySelector(`#time-${i + 1}`).innerHTML = "NOW";
      } else {
        document.querySelector(`#time-${i + 1}`).innerHTML = hour + " " + noon;
      }
      if (hour == 11 && noon == "PM") {
        noon = "AM";
        hour = 12;
      } else if (hour == 11 && noon == "AM") {
        hour = 12;
        noon = "PM";
      } else {
        hour++;
      }
    }
    //Temperature Changing Left
    let sixtemp = [
      parseInt(this.weatherData[`${updateDropDown}`].temperature.slice(0, -2)),
      parseInt(this.weatherData[`${updateDropDown}`].temperature.slice(0, -2)),
    ];
    for (let i = 0; i < 4; i++) {
      sixtemp[i + 2] = parseInt(forecastJSON.temperature[i].slice(0, -2));
    }
    for (let i = 0; i < 6; i++) {
      document.querySelector(`#temperature-${i + 1}`).innerHTML = sixtemp[i];
    }
    // Image Changnging wrt to Temperature
    for (let i = 0; i < 6; i++) {
      if (sixtemp[i] < 0) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/snowflakeIcon.svg";
      } else if (sixtemp[i] < 18 && sixtemp[i] > 0) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/rainyIcon.svg";
      } else if (sixtemp[i] >= 18 && sixtemp[i] <= 22) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/windyIcon.svg";
      } else if (sixtemp[i] >= 23 && sixtemp[i] <= 29) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/cloudyIcon.svg";
      } else if (sixtemp[i] > 29) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/sunnyIcon.svg";
      }
    }
  }

  /**
   * @desc this prototype function sets the current time for the specified timezone
   * @param {*} timeZone timeZone of the currently selected city
   * @returns current time
   */
  getTime(timeZone) {
    return new Date().toLocaleString("en-US", {
      timeZone: timeZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
  }

  /**
   * @desc this function gives the current date for the selected city
   * @param {String} datetimeArr date of current selected city
   * @returns current date
   */
  getDate(datetimeArr) {
    const monthArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dateSplit = datetimeArr;
    const dateArr = dateSplit.split("/");
    const dateInWords =
      String(dateArr[1]) + "-" + monthArr[dateArr[0] - 1] + "-" + dateArr[2];
    return dateInWords;
  }

  /**
   * @desc function to sort cities based on sunny rainy or cold option choosen by the user
   * @param {@String} arr all values of cities data.
   * @param {*String} constraint type of weather like suuny,cold,rainy
   * @returns returns the sorted city array.
   */
  sortCities(arr, constraint) {
    switch (constraint) {
      case "temperature":
        arr.sort((a, b) => {
          return parseInt(b.temperature) - parseInt(a.temperature);
        });
        break;
      case "precipitation":
        arr.sort((a, b) => {
          return parseInt(b.precipitation) - parseInt(a.precipitation);
        });
        break;
      default:
        arr.sort((a, b) => {
          return parseInt(b.humidity) - parseInt(a.humidity);
        });
        break;
    }
    return arr;
  }
  //Display Middle Cards

  /**
   * @desc function to display cards containing sorted cities  as per user preferences
   * @param {*} arr all cities data in string format.
   */

  displayCityCards(arr) {
    let card = "";
    for (let i = 0; i < arr.length; i++) {
      card += `<div class="mid">
                <div class="mid-item">
                    <div>${arr[i].cityName}</div>
                    <div class="mid-img">
                    <img src="HTML & CSS/Weather Icons/${
                      this.currWeather
                    }Icon.svg" alt="sunny" />
                    <span>${arr[i].temperature}</span>
                    </div>
                </div>
                <div class="city-card-time">${this.getTime(
                  arr[i]["timeZone"]
                )}</div>
                <div>
                    <img
                    src="HTML & CSS/Weather Icons/humidityIcon.svg"
                    alt="rainy"
                    />${arr[i].humidity}
                </div>
                <div>
                    <img src="HTML & CSS/Weather Icons/precipitationIcon.svg" 
                    />${arr[i].precipitation}
                </div>
                </div>`;
    }
    document.querySelector(".middle-block").innerHTML = card;
    document.querySelectorAll(".mid").forEach((element, i) => {
      element.style.backgroundImage = `url('./HTML & CSS/Icons for cities/${arr[
        i
      ].cityName.toLowerCase()}.svg')`;
    });
  }
  
  /**
   * @desc function to manage the numberof cities cards displayed based on
   * display top like minimumand maximum numbers.
   */

  filterCityCards() {
    let limiter = parseInt(document.querySelector("#displaynum").value);
    if (limiter < 3) return;
    let sortedWeatherValues;
    switch (this.currWeather) {
      case "sunny":
        sortedWeatherValues = this.sortedSunnyWeatherValues;
        break;
      case "snowflake":
        sortedWeatherValues = this.sortedSnowWeatherValues;
        break;
      default:
        sortedWeatherValues = this.sortedRainyWeatherValues;
        break;
    }
    if (limiter < 4) {
      document.querySelector("#curser-left").style.display = "none";
      document.querySelector("#curser-right").style.display = "none";
    } else {
      document.querySelector("#curser-left").style.display = "block";
      document.querySelector("#curser-right").style.display = "block";
    }
    if (sortedWeatherValues.length > limiter) {
      this.displayCityCards(sortedWeatherValues.slice(0, limiter));
    } else {
      this.displayCityCards(sortedWeatherValues);
    }
  }

  /**
   * @desc function to define the content of the weather cards based on the
   *  weather attributes and display top attributes selected by the user
   * @param {*String} weather holds the value of currently
   * selected weather like sunny,snow, rainny
   */

  setWeathercard(weather) {
    this.currWeather = weather;
    var cityValues = Object.values(this.weatherData);
    let sunnyWeather = [];
    let snowWeather = [];
    let rainyWeather = [];
    document.getElementById("sunny").style.borderBottom = "none";
    document.getElementById("rainy").style.borderBottom = "none";
    document.getElementById("snowflake").style.borderBottom = "none";
    //SUNNY Weather
    if (weather == "sunny") {
      document.getElementById("sunny").style.borderBottom = "2px solid #1E90FF";
      //Get the cities with sunny weather using call function
      Array.prototype.forEach.call(cityValues, function (city) {
        if (
          parseInt(city.temperature) > 29 &&
          parseInt(city.humidity) < 50 &&
          parseInt(city.precipitation) >= 50
        ) {
          sunnyWeather.push(city);
        }
      });
      this.sortedSunnyWeatherValues = this.sortCities(
        sunnyWeather,
        "temperature"
      );
      //Display the city details in cards
      this.filterCityCards();
    }
    if (weather == "snowflake") {
      //Get the cities with snow weather
      document.getElementById("snowflake").style.borderBottom =
        "2px solid #1E90FF";
      for (let i = 0; i < cityValues.length; i++) {
        if (
          parseInt(cityValues[i].temperature) >= 20 &&
          parseInt(cityValues[i].temperature) < 28 &&
          parseInt(cityValues[i].humidity) > 50 &&
          parseInt(cityValues[i].precipitation) < 50
        ) {
          snowWeather.push(cityValues[i]);
        }
      }
      // Sort the cities in descending order of temperature
      this.sortedSnowWeatherValues = this.sortCities(
        snowWeather,
        "temperature"
      );
      this.filterCityCards();
      //Display the city details in cards
    }
    //Rainy weather
    if (weather == "rainy") {
      //Get the cities with rainy weather using filter method.
      const rainyWeather = cityValues.filter((city) => {
        const temperature = parseInt(city.temperature);
        const humidity = parseInt(city.humidity);
        return temperature < 20 && humidity >= 50;
      });
      document.getElementById("rainy").style.borderBottom = "2px solid #1E90FF";
      //Sort cities in descending order of humidity
      this.sortedRainyWeatherValues = this.sortCities(rainyWeather, "humidity");
      //Display the city details in cards
      this.filterCityCards();
    }
  }

  setCityTimeZones(city) {
    return city.timeZone.split("/")[0];
  }

  /**
   * @desc Display the continent card and based on the user selected continent and temperature.
   */

  displayContinentCards() {
    let continentCard = ``;
    let cityTimeZones = this.allCities.map(this.setCityTimeZones);
    for (let i = 0; i < 12; i++) {
      let timeNow = this.getTime(this.allCities[i]["timeZone"]);
      let noonNow = timeNow.slice(-2);
      let hourAndMin = timeNow.split(":");
      continentCard += `<div class="grid-item">
                    <div class="grid-text">
                    <p class="country-names">${cityTimeZones[i]}</p>
                    <span class="btm-temp">${this.allCities[i].temperature}</span>
                    </div>
                    <p class="grid-text">
                    ${this.allCities[i].cityName}, ${hourAndMin[0]}:${hourAndMin[1]} ${noonNow}<span
                        ><img
                        src="HTML & CSS/Weather Icons/humidityIcon.svg"
                        alt="rainy"
                        />
                        ${this.allCities[i].humidity}</span
                    >
                    </p>
            </div>`;
    }
    document.querySelector(".bottom-grid").innerHTML = continentCard;
  }

  /**
   * @desc this function Sort the Continent based on asscending or decending orders based on the user preference.
   */

  sortCitiesByContAndTemp() {
    this.allCities = Object.values(this.weatherData);
    if (this.continentOrder == 0) {
      if (this.temperatureOrder == 0) {
        this.allCities.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
          } else {
            return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      } else {
        this.allCities.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    } else {
      if (this.temperatureOrder == 0) {
        this.allCities.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
          } else {
            return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      } else {
        this.allCities.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    }
    this.displayContinentCards();
  }
}
