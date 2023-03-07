const { timeForOneCity } = require("sudeeparyan_timezone");

process.on("message", (message) => {
  const jsonResponse = timeForOneCity(message.city);
  process.send(jsonResponse);
});
