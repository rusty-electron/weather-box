let loc = ["26.1427", "91.6597"];

let url = 'https://api.darksky.net/forecast/615c985b8a04b23cedb60c4832bae5d1/' + loc[0]+ ','+ loc[1];
let jsonData = [];

let start;
let end;


const lat = document.querySelector('.lat');
const long = document.querySelector('.long');

let index = 0;

fetch('https://cors-anywhere.herokuapp.com/'+ url)
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data);

        setLocation(loc)
        doStuff(data)
        
        //Load Hourly Forecast Data
        loadHourForecast(index, data);

        gethourRange(data.hourly.data);
    })
    .catch(err => {
        console.log(err)
});

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

    console.log(new Date(jsonData.hourly.data[48].time * 1000));
    
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

        default:
        fileUrl = "/static/images/icons8-thermometer-80.png";
        break;
    }
    item.src = fileUrl;
}

function windConvert(data){
    return +(data * 1.609).toFixed(2);
}

function setLocation(loc){
    lat.textContent = loc[0] +',';
    long.textContent = loc[1];
}

function replaceFahrenheit(data){
    let reg = /\b\d*\.?\d+\°F\b/;
    let found = reg.exec(data);
    let valueString = /\d*/.exec(found[0]);

    data = data.replace(valueString[0], Math.round(tempConvert(valueString[0])));
    return data.replace("°F","°C");
}

function loadHourForecast(i, jsonData){

    const tempSpan = document.querySelector('.hr-f-data > .temp > span')
    const uvSpan = document.querySelector('.hr-f-data > .uv > span')
    const windSpan = document.querySelector('.hr-f-data > .wind > span')
    const humidSpan = document.querySelector('.hr-f-data > .humid > span')
    const hrShort = document.querySelector('.hr-f-g > div')
    const wthrImg = document.querySelector('.hr-f-g > img');

    tempSpan.textContent = tempConvert(jsonData.hourly.data[i].temperature) + " °C";
    uvSpan.textContent = jsonData.hourly.data[i].uvIndex;
    humidSpan.textContent = jsonData.hourly.data[i].humidity;
    windSpan.textContent = windConvert(jsonData.hourly.data[i].windSpeed) + " kmph";
    hrShort.textContent = jsonData.hourly.data[i].summary;
    changeImage(jsonData.hourly.data[i].icon, wthrImg);
}

function gethourRange(data, start, end){
    
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

    console.log(new Date(data[start].time * 1000))
    console.log(new Date(data[end].time * 1000))
}
