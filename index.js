var weather_data;
fetch("data.json")
  .then((data) => data.json())
  .then((result) => {
    weather_data = result;
    console.log(weather_data);
    setWeather();
  });

function setWeather() {
  var city = Object.keys(weather_data);
  var option = ``;
  for (let i = 0; i < city.length; i++) {
    option += `<option>${city[i]}</option>`;
  }
  document.querySelector("#data_dropdown").innerHTML = option;
}
//temperature
let far;
function changeToFarenheit(val) {
  let farenheit = val * 1.8 + 32;
  console.log("this is inside function", farenheit);
  return farenheit;
}
function change() {
  var city = Object.keys(weather_data);
  let montharr = [
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
  var dropdown = document.getElementById("inputdata").value;
  //Image
  document.getElementById(
    "top-img"
  ).src = `HTML & CSS/Icons for cities/${dropdown}.svg`;
  //temperature
  document.getElementById("top-tempc").innerHTML =
    weather_data[dropdown].temperature;
  //humidity
  document.getElementById("top-humidity").innerHTML =
    weather_data[dropdown].humidity;
  //precipitation
  document.getElementById("top-precipitation").innerHTML =
    weather_data[dropdown].precipitation;
  //temperature F
  let cel = weather_data[dropdown].temperature.slice(0, -2);
  far = changeToFarenheit(cel).toFixed(0) + "F";
  document.getElementById("top-far").innerHTML = far;
  //Date and time
  let dateArr;
  dateArr = weather_data[dropdown].dateAndTime.split(",");
  console.log(dateArr[1].slice(0, -2));
  document.getElementById("top-time-1").innerHTML = dateArr[1].slice(0, -2);
  document.getElementById("top-date").innerHTML = dateArr[0];

  // Date Spliting Method
  let dateSplit = dateArr[0];
  console.log(dateSplit);
  dateArr = dateSplit.split("/");
  let dateInWords =
    dateArr[1] + "-" + montharr[parseInt(dateArr[0]) - 1] + "-" + dateArr[2];
  document.getElementById("top-date").innerHTML = dateInWords;

  // Time
  let timerId;
  function timedate(timeZone, dateAndTime) {
    if (timerId) {
      clearInterval(timerId);
    }
    timerId = setInterval(() => {
      var date = new Date()
        .toLocaleString("en-US", {
          timeZone: timeZone,
          timeStyle: "medium",
          hourCycle: "h24",
        })
        .split(":");
      document.getElementById("top-time-1").innerHTML = date[0] + ":" + date[1];
      document.getElementById("time-color").innerHTML = date[2];
    }, 100);
  }
  for (var i = 0; i < city.length; i++) {
    var time = weather_data[dropdown].timeZone;
    var dateAndTime = weather_data[dropdown].dateAndTime;
    console.log(weather_data[dropdown].temperature, time, dateAndTime);
    timedate(time, dateAndTime);
  }

  // Temperature Changing Left
  let sixtemp = [
    parseInt(weather_data[`${dropdown}`].temperature.slice(0, -2)),
    parseInt(weather_data[`${dropdown}`].temperature.slice(0, -2)),
  ];
  for (let i = 0; i < 4; i++) {
    sixtemp[i + 2] = parseInt(
      weather_data[`${dropdown}`].nextFiveHrs[i].slice(0, -2)
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
