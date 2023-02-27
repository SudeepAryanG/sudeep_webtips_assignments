const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

const {fork} = require("child_process") 

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());

app.get("/weatherData", (req, res) => {
  const childProcess = fork('./weatherData.js');
  childProcess.send("message");
  childProcess.on("message",message => res.json(message))
});

app.get("/weatherDataCity/:id", (req, res) => {
  const childProcess = fork('./weatherDataCity.js');
  childProcess.send({"city": req.params.id});
  childProcess.on("message",message => res.json(message))
});

app.post("/nextFiveData", (req, res) => {
  const childProcess = fork('./nextFiveData.js'); 
  childProcess.send({city: req.body.city_Date_Time_Name, hours: req.body.hours});
  childProcess.on("message",message => res.json(message))
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
