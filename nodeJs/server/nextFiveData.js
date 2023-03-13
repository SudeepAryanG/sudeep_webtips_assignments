const { nextNhoursWeather, allTimeZones } = require("sudeeparyan_timezone");

process.on("message", (message) => {
  const jsonResponse = nextNhoursWeather(
    message.city,
    message.hours,
    allTimeZones()
  );
  process.send(jsonResponse);
});
