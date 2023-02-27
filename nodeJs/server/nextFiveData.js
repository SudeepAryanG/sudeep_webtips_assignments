const { nextNhoursWeather, allTimeZones } = require("../timeZone");

process.on("message", (message) => {
  const jsonResponse = nextNhoursWeather(
    message.city,
    message.hours,
    allTimeZones()
  );
  process.send(jsonResponse);
});
