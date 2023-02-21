import changeToFarenheit from "./export.js";
var weatherData;
let currWeather;

/**
 * @desc function to fetch weather data from the json file and store in a
 * global variable.
 */
(function () {
  fetch("data.json")
    .then((data) => data.json())
    .then((result) => {
      let value = new WeatherTemplate(result);
      value.__proto__.updateDropDown=function(){
        var city = Object.keys(this.weatherData);
        var option = ``;
        for (let i = 0; i < city.length; i++)
        {
          option += `<option>${this.weatherData[city[i]].cityName}</option>`;
        }
        document.querySelector("#data_dropdown").innerHTML = option;
        }
        value.updateDropDown();
        value.sortCitiesByContAndTemp();        
        setInterval(value.filterCityCards.bind(value), 1000);
        setInterval(value.updateValidCityDetails.bind(value), 1000);
        value.setWeathercard("sunny");
        document.querySelector("#inputdata").addEventListener("change", value.updateValidCityDetails.bind(value));
    });
})(); //IIFE
/**
 * 
 * @param {String} weatherData Constructor function for all global variables and event listeners
 */
  function WeatherTemplate(weatherData) {
    this.weatherData = weatherData;
    this.selectedCity="Anadyr";
    this.currWeather;
    this.sortedSunnyWeatherValues = [];
    this.sortedSnowWeatherValues = [];
    this.sortedRainyWeatherValues = [];
    this.allCities;
    this.continentOrder = 0;
    this.temperatureOrder = 1;

    document
      .querySelector("#inputdata")
      .addEventListener("input", this.userSelectedCity.bind(this));
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
   * @desc this function gives the updateDropDown for city selection
   */

  /**
   * @desc function to check whether user has entered vaild input city
   */
  WeatherTemplate.prototype.userSelectedCity = function () {
    this.selectedCity = document
      .querySelector("#inputdata")
      .value.toLowerCase();
    let city = Object.keys(this.weatherData);
    let currentCity = this.selectedCity;
    let flag = 0;
    for (let i = 0; i < city.length; i++) {
      if (currentCity == city[i]) {
        this.updateValidCityDetails();
        flag = 1;
      }
    }
    if (flag == 0) {
      this.updateInValidCityDetails();
    }
  };
  /**git 
   * @desc this function sets the null value for weather details when
   * invalid city is selected
   */
  WeatherTemplate.prototype.updateInValidCityDetails = function () {
    document.querySelector("#top-tempc").innerText = "-";
    document.querySelector("#top-far").innerText = "-";
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
  };
  /**
   * @desc Based on the user selected city the various fields such as
   *  temperature,precipitation,humidity,live time,date and next
   * five hours temperature and climate icons we get updated.
   */
  WeatherTemplate.prototype.updateValidCityDetails = function () {
    var updateDropDown = document.querySelector("#inputdata").value.toLowerCase();
    
    //Image
    document.getElementById(
      "top-img"
    ).src = `HTML & CSS/Icons for cities/${updateDropDown}.svg`;
    //temperature
    var temp = this.weatherData[updateDropDown].temperature;
    document.getElementById("top-tempc").innerHTML = temp;
    //humidity
    document.getElementById("top-humidity").innerHTML =
      this.weatherData[updateDropDown].humidity;
    //precipitation
    document.getElementById("top-precipitation").innerHTML =
      this.weatherData[updateDropDown].precipitation;
    //temperature F
    let tempInCelsius = parseInt(this.weatherData[updateDropDown].temperature);
    let tempInFahrenheit = changeToFarenheit(tempInCelsius).toFixed(0) + " F";
    document.getElementById("top-far").innerHTML = tempInFahrenheit;
    //Date and time
    let datetimeArr;
    datetimeArr = this.weatherData[updateDropDown].dateAndTime.split(",");
    document.getElementById("top-time").innerHTML = datetimeArr[1].slice(0, -2);
    document.getElementById("top-date").innerHTML = datetimeArr[0];
    //Date
    let monthArr = [
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
    let dateSplit = datetimeArr[0];
    let dateArr = dateSplit.split("/");
    let dateInWords =
      String(dateArr[1].padStart(2, "0")) +
      "-" +
      monthArr[dateArr[0] - 1] +
      "-" +
      dateArr[2];
    document.getElementById("top-date").innerHTML = dateInWords;
    // Time
    let time;
    time = new Date().toLocaleString("en-US", {
      timeZone: this.weatherData[this.selectedCity].timeZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    document.getElementById("top-time").innerHTML = time;
    //Hours changing with wrt to time.
    let hour = parseInt(time.split(":")[0]);
    let noon = time.slice(-2);
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
      sixtemp[i + 2] = parseInt(
        this.weatherData[`${updateDropDown}`].nextFiveHrs[i].slice(0, -2)
      );
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
  };

/**
 * @desc this function sets the current time for the specified timezone
 * @param {Srting} timeZone timeZone of the currently selected city
 * @returns current time
 */
function getTime(timeZone) {
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
function getDate(datetimeArr) {
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

  //Task2
  /**
   * @desc function to sort cities based on sunny rainy or cold option choosen by the user
   * @param {@String} arr all values of cities data.
   * @param {*String} constraint type of weather like suuny,cold,rainy
   * @returns returns the sorted city array.
   */
  WeatherTemplate.prototype.sortCities = function (arr, constraint) {
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
WeatherTemplate.prototype.displaycitycards = function(arr) {
  let card = "";
  for (let i = 0; i < arr.length; i++) {
    card += `<div class="mid">
              <div class="mid-item">
                <div>${arr[i].cityName}</div>
                <div class="mid-img">
                  <img src="HTML & CSS/Weather Icons/${currWeather}Icon.svg" alt="sunny" />
                  <span>${arr[i].temperature}</span>
                </div>
              </div>
              <div class="city-card-time">${getTime(arr[i]["timeZone"])}</div>
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
WeatherTemplate.prototype.filtercitycards = function () {
  let limiter = parseInt(document.querySelector("#displaynum").value);
  if (limiter < 3) return;
  let sortedWeatherValues;
  switch (currWeather) {
    case "sunny":
      sortedWeatherValues = sortedSunnyWeatherValues;
      break;
    case "snowflake":
      sortedWeatherValues = sortedSnowWeatherValues;
      break;
    default:
      sortedWeatherValues = sortedRainyWeatherValues;
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
    displayCityCards(sortedWeatherValues.slice(0, limiter));
  } else {
    displayCityCards(sortedWeatherValues);
  }
}

/**
 * function to define the content of the weather cards based on the
 *  weather attributes and display top attributes selected by the user
 * @param {*String} weather holds the value of currently
 * selected weather like sunny,snow, rainny
 */
WeatherTemplate.prototype.setWeathercard = function (weather) {
  currWeather = weather;
  var cityValues = Object.values(weatherData);
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
    // Sort the cities in descending order of temperature
    sortedSunnyWeatherValues = sortCities(sunnyWeather, "temperature");
    //Display the city details in cards
    filterCityCards();
  }
  //SNOW Weather
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
    sortedSnowWeatherValues = sortCities(snowWeather, "temperature");
    filterCityCards();
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
    sortedRainyWeatherValues = sortCities(rainyWeather, "humidity");
    //Display the city details in cards
    filterCityCards();
  }
}

//Task 3
function setCityTimeZones(city) {
  return city.timeZone.split("/")[0];
}
/**
 * @desc Display the lower card and based on the user selected continent and temperature.
 */
WeatherTemplate.prototype.displayContinentCards = function () {
  let continentCard = ``;
  let cityTimeZones = allCities.map(setCityTimeZones);
  for (let i = 0; i < 12; i++) {
    let currentTime = getTime(allCities[i]["timeZone"]);
    let currentSession = currentTime.slice(-2);
    let hourAndMin = currentTime.split(":");
    continentCard += `<div class="grid-item">
              <div class="grid-text">
                <p class="country-names">${cityTimeZones[i]}</p>
                <span class="btm-temp">${allCities[i].temperature}</span>
              </div>
              <p class="grid-text">
              ${allCities[i].cityName}, ${hourAndMin[0]}:${hourAndMin[1]} ${currentSession}<span
                  ><img
                    src="HTML & CSS/Weather Icons/humidityIcon.svg"
                    alt="rainy"
                  />
                  ${allCities[i].humidity}</span
                >
              </p>
        </div>`;
  }
  document.querySelector(".bottom-grid").innerHTML = continentCard;
}
let allCities;
/**
 * @desc  this function is to sort the cities of continent in ascending or descending order based on the user preference
 */
WeatherTemplate.prototype.sortCitiesByContAndTemp= function() {
  allCities = Object.values(weatherData);
  if (continentOrder == 0) {
    if (temperatureOrder == 0) {
      allCities.sort((a, b) => {
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
          return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
        } else {
          return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
        }
      });
    } else {
      allCities.sort((a, b) => {
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
          return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
        } else {
          return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
        }
      });
    }
  } else {
    if (temperatureOrder == 0) {
      allCities.sort((a, b) => {
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
          return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
        } else {
          return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
        }
      });
    } else {
      allCities.sort((a, b) => {
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
          return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
        } else {
          return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
        }
      });
    }
  }
  displayContinentCards();
}
