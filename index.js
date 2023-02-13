import changeToFarenheit from "./export.js";
var weather_data;
let currWeather;
(function(){
fetch("data.json")
  .then((data) => data.json())
  .then((result) => {
    weather_data = result;
    console.log(weather_data);
    setWeather();
    setWeathercard('sunny')
    // setInterval(change,1000);
  });
})();  //IIFE 
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
let selectedCity;
document.querySelector("#inputdata").addEventListener("change", callChange);

function callChange() {
  console.log("here");
  selectedCity = document.querySelector("#inputdata").value.toLowerCase();
  let city = Object.keys(weather_data);
  let currentCity = selectedCity;
  let flag = 0;
  for (let i = 0; i < city.length; i++) {
    if (currentCity == city[i]) {
      console.log("main");
      change();
      flag = 1;
    }
  }
  console.log(flag);
  if (flag == 0) {
    console.log("Null");
    ErrorCity();
  }
}

/**
 * @desc this function sets the null value for weather details when 
 * invalid city is selected
 */
function ErrorCity() {
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
}

function change() {
  var dropdown = document.querySelector("#inputdata").value.toLowerCase();;
  
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
  //Date and time
  let datetimeArr;
  datetimeArr = weather_data[dropdown].dateAndTime.split(",");
  console.log(datetimeArr[1].slice(0, -2));
  document.getElementById("top-time").innerHTML = datetimeArr[1].slice(0, -2);
  document.getElementById("top-date").innerHTML = datetimeArr[0];
    //Date
  let dateSplit = datetimeArr[0];
  
  let dateArr = dateSplit.split("/");
  
  let dateInWords =String(dateArr[1].padStart(2, "0")) +"-" +
    monthArr[dateArr[0] - 1] +"-" + dateArr[2];
  document.getElementById("top-date").innerHTML = dateInWords;
    // Time 
    let time;
    time = new Date().toLocaleString("en-US", {
      timeZone: weather_data[selectedCity].timeZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    document.getElementById("top-time").innerHTML = time;
    console.log(time);
  
  //Temperature Changing Left
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
    
    } else if (sixtemp[i] >= 23 && sixtemp[i] <= 29) {
      document.querySelector(`#icon-${i + 1}`).src =
        "HTML & CSS/Weather Icons/cloudyIcon.svg";
    } else if (sixtemp[i] > 29) {
      document.querySelector(`#icon-${i + 1}`).src =
        "HTML & CSS/Weather Icons/sunnyIcon.svg";
    }
  }
  //Hours changing with wrt to time.

  let hour = parseInt(time.split(":")[0]);

  let noon = time.slice(-2);
  console.log(noon);
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
var sortedSunnyWeatherValues = [];
var sortedsnowWeatherValues = [];
var sortedRainyWeatherValues=[];

//Task 2
document.querySelector("#sunny").addEventListener("click", () => { setWeathercard("sunny");});
document.querySelector("#snow").addEventListener("click", () => { setWeathercard("snow");});
document.querySelector("#rainy").addEventListener("click", () => { setWeathercard("rainy");});
document.querySelector("#displaynum").addEventListener("change",setMinMax);

function sortCities(arr,constraint)
{
  if(constraint=="temperature")
  {
    arr.sort((a,b)=>{
      return parseInt(b.temperature)-parseInt(a.temperature);
    })
  } 
  else if(constraint=="precipitation")
  {
    arr.sort((a,b)=>{
      return parseInt(b.precipitation)-parseInt(a.precipitation);
    })
  } 
  else
  {
    arr.sort((a,b)=>{
      return parseInt(b.humidity)-parseInt(a.humidity);
    })
  } 
  return arr;
};

//Display Top Cards

function display(arr){
  let card="";
for(let i = 0; i<arr.length; i++){ 
  let time = new Date().toLocaleString("en-US", {
    timeZone: arr[i].timeZone,
    timeStyle: "medium",
    hourCycle: "h12",
  });
  card += `<div class="mid">
            <div class="mid-item">
              <div>${arr[i].cityName}</div>
              <div class="mid-img">
                <img src="HTML & CSS/Weather Icons/${currWeather}Icon.svg" alt="sunny" />
                <span>${arr[i].temperature}</span>
              </div>
            </div>
            <div >${time}</div>
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
          </div>`
}
document.querySelector(".middle-block").innerHTML = card;

console.log("reach",document.querySelectorAll(".mid"),arr);
document.querySelectorAll(".mid").forEach((element,i)=>{
  element.style.backgroundImage =`url('./HTML & CSS/Icons for cities/${arr[i].cityName.toLowerCase()}.svg')`;
})
}


function setMinMax(){
    console.log('setminmax')
    let limiter=document.querySelector("#displaynum").value; 
    if(currWeather=='sunny'){
      if (sortedSunnyWeatherValues.length>limiter){
        display(sortedSunnyWeatherValues.slice(0,limiter)); 
      }
      else{
        display(sortedSunnyWeatherValues);
      }
    }

    else if(currWeather=='snow'){
      if (sortedsnowWeatherValues.length>limiter){
        display(sortedsnowWeatherValues.slice(0,limiter));
      }
      else{
        display(sortedsnowWeatherValues) ;
      }
    } 
    else{
      if (sortedRainyWeatherValues.length>limiter){
        display(sortedRainyWeatherValues.slice(0,limiter));
      }
      else{
        display(sortedRainyWeatherValues);
      }
    } 
}
  
function setWeathercard(weather){ 
  currWeather=weather;
  var cityValues = Object.values(weather_data);
  let sunnyWeather=[];

  let snowWeather=[];

  let rainyWeather=[];


  document.getElementById("sunny").style.borderBottom = "none";
  document.getElementById("rainy").style.borderBottom = "none";
  document.getElementById("snow").style.borderBottom = "none";
  
  
  //SUNNY Weather
  if(weather=='sunny'){
    //Get the cities with sunny weather
    document.getElementById("sunny").style.borderBottom = "2px solid #1E90FF";
    for(let i=0; i<cityValues.length; i++)
    {
      if( (parseInt(cityValues[i].temperature) > 29) 
      && (parseInt(cityValues[i].humidity) < 50) 
      && (parseInt(cityValues[i].precipitation) >= 50) ){ 
        sunnyWeather.push(cityValues[i])
      }
    }
    // Sort the cities in descending order of temperature
    sortedSunnyWeatherValues = sortCities(sunnyWeather,"temperature");
    console.log(sortCities(sunnyWeather,"temperature"))
    //Display the city details in cards  
    let slicedSortedSunnyWeatherValues=setMinMax(); 
  }
  //SNOW Weather
  if(weather=='snow'){
     
    //Get the cities with snow weather
    for(let i=0;i<cityValues.length;i++)
    {
      if( (parseInt(cityValues[i].temperature) >= 20 && parseInt(cityValues[i].temperature) < 28) 
        && (parseInt(cityValues[i].humidity) > 50) 
        && (parseInt(cityValues[i].precipitation) < 50) ){
            snowWeather.push(cityValues[i]); 
        }
    }
    document.getElementById("snow").style.borderBottom = "2px solid #1E90FF";
    // Sort the cities in descending order of temperature
    sortedsnowWeatherValues= sortCities(snowWeather,"temperature");
    let slicedsortedsnowWeatherValues=setMinMax();
    //Display the city details in cards 
    }
  //Rainy weather
  if(weather=='rainy'){
    
    //Get the cities with rainy weather
    for(let i=0; i<cityValues.length; i++)
    {
      if( (parseInt(cityValues[i].temperature) < 20) 
          && (parseInt(cityValues[i].humidity) >= 50) ){
            rainyWeather.push(cityValues[i])
          }
    }
    document.getElementById("rainy").style.borderBottom = "2px solid #1E90FF";
  //Sort cities in descending order of humidity
  sortedRainyWeatherValues = sortCities(rainyWeather,"humidity");
  console.log(sortCities(rainyWeather,"humidity"));
  
  //Display the city details in cards 
  let slicedsortedRainyWeatherValues=setMinMax();
 }


}

document.querySelector("#curser-left").addEventListener('click',()=>{
  document.querySelector("#middle-block").scrollleft+=300;
  console.log("scroll-left")
})
document.querySelector("#curser-right").addEventListener('click',()=>{
  document.querySelector("#middle-block").scrollleft-=300;
  console.log("scroll-right")
})

