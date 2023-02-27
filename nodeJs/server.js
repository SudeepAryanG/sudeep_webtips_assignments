const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
let currCityDetails;

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());

var weatherResult;

const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone.js");

app.get("/weatherData", (req, res) => {
  weatherResult = allTimeZones();
  res.json(weatherResult);
});

app.get("/weatherDataCity/:id", (req, res) => {
  currCityDetails = timeForOneCity(req.params.id);
  res.json(currCityDetails);
});

app.post("/nextFiveData", (req, res) => {
  let cityDTN = req.body.city_Date_Time_Name;
  let hours = req.body.hours;
  res.json(nextNhoursWeather(cityDTN, hours, allTimeZones()));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
