const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

//child process is used to run multiple servers at a time

const { fork } = require("child_process");

app.use(express.static( "src"));
app.use(express.json());

app.get("/weatherData", (req, res) => {
  const childProcess = fork("./server/weatherData.js");
  childProcess.send("message");
  childProcess.on("message", (message) => res.json(message));
});

app.get("/weatherDataCity/:id", (req, res) => {
  const childProcess = fork("./server/weatherDataCity.js");
  childProcess.send({ city: req.params.id });
  childProcess.on("message", (message) => res.json(message));
});

app.post("/nextFiveData", (req, res) => {
  const childProcess = fork("./server/nextFiveData.js");
  childProcess.send({
    city: req.body.city_Date_Time_Name,
    hours: req.body.hours,
  });
  childProcess.on("message", (message) => res.json(message));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
