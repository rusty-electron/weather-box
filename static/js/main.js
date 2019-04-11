let loc = ["26.1427", "91.6597"];

let clearBtn = document.querySelector('.search > img');
clearBtn.addEventListener('click', function(){
    searchInput.value = '';
})


let ipurl = 'http://ipinfo.io/json';
fetch('https://cors-anywhere.herokuapp.com/'+ ipurl)
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data);
        loc = data.loc.split(',');
        
        setLocation(loc, data.city, data.country);
        fetchWeather();
    })
    .catch( err=>{
        console.log(err);
    })

let jsonData = [];

const place = document.querySelector('.place');
const latlong = document.querySelector('.latlong');

const left = document.querySelector('.left');
const right = document.querySelector('.right');
const showHour = document.querySelector('.see-hr');

let box = document.querySelector('.hr-stack');

showHour.addEventListener("click", function(){
                
    index = range[0];
    
    if (box.style.display == "block"){
        showHour.textContent = "See Hourly Information";
        box.style.display = "none";
    }else{
        showHour.textContent = "Hide Hourly Information";
        box.style.display = "block";
    }

    //Load Hourly Forecast Data
    loadHourForecast(index, global, range);
});

left.addEventListener("click", function(){
    index--;
    loadHourForecast(index, global, range);
})

right.addEventListener("click", function(){
    index++;
    loadHourForecast(index, global, range);
})



let index = 0;
let range, global;

function fetchWeather(){
    let url = 'https://api.darksky.net/forecast/615c985b8a04b23cedb60c4832bae5d1/' + loc[0]+ ','+ loc[1];

    fetch('https://cors-anywhere.herokuapp.com/'+ url)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data);

            doStuff(data);
            global = data;

            range = gethourRange(data.hourly.data);
            
            console.log(range);
            box.style.display = "none";
        })
        .catch(err => {
            console.log(err)
    });
}

const mainDiv = document.querySelector('div.hr-sum-t')
const tempSpan = document.querySelector('.temp > span')
const uvSpan = document.querySelector('.uv > span')
const windSpan = document.querySelector('.wind > span')
const humidSpan = document.querySelector('.humid > span')
const hrShort = document.querySelector('.graphic > div')
const daSum = document.querySelector('.da-sum-t');
const wthrImg = document.querySelector('.graphic > img');

function doStuff(jsonData){
    mainDiv.textContent = jsonData.hourly.summary;
    tempSpan.textContent = tempConvert(jsonData.currently.temperature) + " °C";
    uvSpan.textContent = jsonData.currently.uvIndex;
    humidSpan.textContent = jsonData.currently.humidity;
    windSpan.textContent = windConvert(jsonData.currently.windSpeed) + " kmph";
    hrShort.textContent = jsonData.currently.summary;
    changeImage(jsonData.currently.icon, wthrImg);

    daSum.textContent = replaceFahrenheit(jsonData.daily.summary);
}

function tempConvert(data){
    return Math.round(5*(data-32)/9);
}

function changeImage(data, item){
    let fileUrl;
    switch(data){
        case "rain":
        fileUrl = "/static/images/icons8-rain-80.png";
        break;

        case "cloudy":
        fileUrl = "/static/images/icons8-clouds-64.png";
        break;

        case "fog":
        fileUrl = "/static/images/icons8-fog-64.png";
        break;

        case "clear-day":
        fileUrl = "/static/images/icons8-bright-sunny-day-80.png";
        break;

        case "clear-night":
        fileUrl = "/static/images/icons8-moon-and-stars-512.png";
        break;
        
        case "partly-cloudy-night":
        fileUrl = "/static/images/icons8-night-64.png";
        break;
        
        case "partly-cloudy-day":
        fileUrl = "/static/images/icons8-partly-cloudy-day-64.png";
        break;

        case "snow":
        fileUrl = "/static/images/icons8-snow-storm-96.png";
        break;
        
        case "wind":
        fileUrl = "/static/images/icons8-windy-weather-96.png";
        break;

        case "sleet":
        fileUrl = "/static/images/icons8-sleet-96.png";
        break;
        
        case "hail":
        fileUrl = "/static/images/icons8-hail-96.png";
        break;
        
        case "thunderstorm":
        fileUrl = "/static/images/icons8-cloud-lightning-80.png";
        break;

        case "tornado":
        fileUrl = "/static/images/icons8-tornado-80.png";
        break;

        default:
        fileUrl = "/static/images/icons8-thermometer-80.png";
        break;
    }
    item.src = fileUrl;
}

function windConvert(data){
    return Math.round((data * 1.609));
}

function setLocation(loc, city, country){
    place.textContent = city + ", " + country;
    latlong.textContent = " (" + parseFloat(loc[0]).toFixed(4) +', '+ parseFloat(loc[1]).toFixed(4) + ")";
}

function replaceFahrenheit(data){
    let reg = /\b\d*\.?\d+\°F\b/;
    let found = reg.exec(data);
    let valueString = /\d*/.exec(found[0]);

    data = data.replace(valueString[0], Math.round(tempConvert(valueString[0])));
    return data.replace("°F","°C");
}

function loadHourForecast(i, jsonData, range){

    const tempSpan = document.querySelector('.hr-f-data > .temp > span')
    const uvSpan = document.querySelector('.hr-f-data > .uv > span')
    const windSpan = document.querySelector('.hr-f-data > .wind > span')
    const humidSpan = document.querySelector('.hr-f-data > .humid > span')
    const hrShort = document.querySelector('.hr-f-g > div')
    const wthrImg = document.querySelector('.hr-f-g > img');
    const timeBox = document.querySelector('.hr-forecast-time > span')
    let thisTime = new Date(jsonData.hourly.data[i].time * 1000);

    timeBox.textContent = thisTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    tempSpan.textContent = tempConvert(jsonData.hourly.data[i].temperature) + " °C";
    uvSpan.textContent = jsonData.hourly.data[i].uvIndex;
    humidSpan.textContent = jsonData.hourly.data[i].humidity;
    windSpan.textContent = windConvert(jsonData.hourly.data[i].windSpeed) + " kmph";
    hrShort.textContent = jsonData.hourly.data[i].summary;
    changeImage(jsonData.hourly.data[i].icon, wthrImg);

    if (i === range[0]){
        left.style.zIndex = -1;
        left.style.opacity = 0;
    }else if (i === range[1]){
        right.style.zIndex = -1;
        right.style.opacity = 0
    }else{
        right.style.zIndex = 0;
        right.style.opacity = 1;
        left.style.zIndex = 0;
        left.style.opacity = 1;
    }
}

function gethourRange(data){
    
    let later = new Date();
    later.setHours(later.getHours() + 12);

    for(let i = 0 ; i < data.length ; i++){
        if (data[i].time > Math.round((new Date()).getTime() / 1000)){
            start = i;
            break;
        }
    }

    for(let i = data.length - 1 ; i > 0 ; i--){
        if (data[i].time < Math.round(later.getTime() / 1000)){
            end = i;
            break;
        }
    }
    return [start, end]
}

