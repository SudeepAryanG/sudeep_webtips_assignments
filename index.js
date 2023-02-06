var weather_data;
fetch("data.json")
.then(data=>data.json())
.then(result=>{
    weather_data=result;
    console.log(weather_data);
    setWeather();
})

function setWeather() {
    var city = Object.keys(weather_data);
    var option = ``;
    
    for (var i=0; i< city.length; i++) {
        option += `<option>${city[i]}</option>`;    }
    document.querySelector("#dropdown").innerHTML=option;
}

//temperature
let far;
function changeToFarenheit(val){ 
    let farenheit=(val * 1.8)+32;  
    console.log("this is inside function",farenheit);
    return farenheit;

}
function change(){
    var city = Object.keys(weather_data);
    var dropdown = document.querySelector("#dropdown");
    var select_value=dropdown.options[dropdown.selectedIndex].value;
    document.getElementById("top-img").src=`HTML & CSS/Icons for cities/${select_value}.svg`
            //temperature C
    document.getElementById("top-tempc").innerHTML=weather_data[select_value].temperature;    
                        //temperature F
    let cel=weather_data[select_value].temperature.slice(0,-2);
    far=changeToFarenheit(cel)+' F';
    document.getElementById("top-far").innerHTML=far;


    document.getElementById("top-humidity").innerHTML=weather_data[select_value].humidity;
    document.getElementById("top-precipitation").innerHTML=weather_data[select_value].precipitation;
    //Date and time
    document.getElementById("top-time").innerHTML=weather_data[select_value].dateAndTime;
}