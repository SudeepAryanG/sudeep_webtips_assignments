const { allTimeZones } = require("sudeeparyan_timezone");

process.on("message", (message) => {
  const jsonResponse = allTimeZones();
  process.send(jsonResponse);
});
