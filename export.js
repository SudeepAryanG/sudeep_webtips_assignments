/**Changes to celiuses to fahrenheit
 * @param {*Number} val  containes the celiuses value 
 * @returns fahrenheit value.
 */
export default function changeToFahrenheit(val) {
    let fahrenheit = val * 1.8 + 32;
    return fahrenheit;
}