/**Changes to celiuses to farenheit
 * @param {*Number} val  containes the celiuses value 
 * @returns farenheit value.
 */
export default function changeToFarenheit(val) {
    let farenheit = val * 1.8 + 32;
    return farenheit;
}