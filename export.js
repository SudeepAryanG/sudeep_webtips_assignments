/**Changes to celiuses to fahrenheit
 * @param {*Number} val  containes the celiuses value 
 * @returns fahrenheit value.
 */
export default function changeToFarenheit(val) {
    let farenheit = val * 1.8 + 32;
    return farenheit;
}