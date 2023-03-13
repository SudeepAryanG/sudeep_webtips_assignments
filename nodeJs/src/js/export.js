/**Changes to celiuses to farenheit
 * @param {*Number} val  containes the celiuses value 
 * @returns farenheit value.
 */
export default function changeToFahrenheit (val) {
    let farenheit = val * 1.8 + 32;
    return farenheit;
}
let setCityTimeZones = function (city) {
    return city.timeZone.split("/")[0];
  };

  export{setCityTimeZones}