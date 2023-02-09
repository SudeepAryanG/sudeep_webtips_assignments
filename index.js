var weather_data;
fetch("data.json")
  .then((data) => data.json())
  .then((result) => {
    weather_data = result;
    console.log(weather_data);
    setWeather();
    // change();
    setInterval(change,1000);
  });

function setWeather() {
  var city = Object.keys(weather_data);
  var option = ``;
  for (let i = 0; i < city.length; i++) {
    option += `<option>${weather_data[city[i]].cityName}</option>`;
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
let selectedCity;

function callChange() {
  selectedCity = document.querySelector("#inputdata").value.toLowerCase();
  city = Object.keys(weather_data);
  let currentCity = selectedCity;
  let flag = 0;
  for (let i = 0; i < city.length; i++) {
    if (currentCity == city[i]) {
      console.log("main");
      change();
      flag = 1;
    }
  }
  if (flag == 0) {
    Null();
  }
}
function Null() {
  document.querySelector("#top-tempc").innerText = "-";
  document.querySelector("#top-far").innerText = "-";
  document.querySelector("#top-humidity").innerText = "-";
  document.querySelector("#top-precipitation").innerText = "-";
  document.querySelector("#top-date").innerText = "";
  document.querySelector("#top-time").innerText = "Enter a valid City";
  document.querySelector("#data_dropdown").style.borderColor = "red";
  document.querySelector("#top-time").style.color = "";
  document.querySelector("#top-img").src = "";
  for (let i = 0; i < 6; i++) {
    document.querySelector(`#time-${i + 1}`).innerText = "-";
    document.querySelector(`#icon-${i + 1}`).src = "";
    document.querySelector(`#temperature-${i + 1}`).innerText = "-";
  }
}

function change() {
  var dropdown = document.querySelector("#inputdata").value.toLowerCase();;
  // console.log(dropdown);
  var city = Object.keys(weather_data);
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
  //Image
  document.getElementById(
    "top-img"
  ).src = `HTML & CSS/Icons for cities/${dropdown}.svg`;
  //temperature
  console.log(weather_data,dropdown)
  var temp= weather_data[dropdown].temperature;
  document.getElementById("top-tempc").innerHTML =temp;
   
  //humidity
  document.getElementById("top-humidity").innerHTML =
    weather_data[dropdown].humidity;
  //precipitation
  document.getElementById("top-precipitation").innerHTML =
    weather_data[dropdown].precipitation;
  //temperature F
  let cel = parseInt(weather_data[dropdown].temperature);
  far = changeToFarenheit(cel).toFixed(0) + "F";
  document.getElementById("top-far").innerHTML = far;
  //Date
  let dateArr;
  dateArr = weather_data[dropdown].dateAndTime.split(",");
  console.log(dateArr[1].slice(0, -2));
  document.getElementById("top-time").innerHTML = dateArr[1].slice(0, -2);
  document.getElementById("top-date").innerHTML = dateArr[0];

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

  // Time And Date
  let timerId;
  let time;

  time = new Date().toLocaleString("en-US", {
    timeZone: weather_data[selectedCity].timeZone,
    timeStyle: "medium",
    hourCycle: "h12",
  });

  document.getElementById("top-time").innerHTML = time;
  console.log(time);

  //Hours changing with wrt to time.
  let hour = parseInt(time.split(":")[0]);
  let noon = time.split(" ")[1];

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
}
