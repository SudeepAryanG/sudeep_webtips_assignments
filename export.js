export default function changeToFarenheit(val) {
    let farenheit = val * 1.8 + 32;
    console.log("this is inside function", farenheit);
    return farenheit;
}