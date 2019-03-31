let loc = ["26.1427", "91.6597"];

let url = 'https://api.darksky.net/forecast/615c985b8a04b23cedb60c4832bae5d1/' + loc[0]+ ','+ loc[1];
let jsonData = [];

const lat = document.querySelector('.lat');
const long = document.querySelector('.long');

fetch('https://cors-anywhere.herokuapp.com/'+ url)
.then(response => {
return response.json()
})
.then(data => {
console.log(data);

setLocation(loc)
doStuff(data)
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

function doStuff(jsonData){
mainDiv.textContent = jsonData.hourly.summary;
tempSpan.textContent = tempConvert(jsonData.currently.temperature) + " °C";
uvSpan.textContent = jsonData.currently.uvIndex;
humidSpan.textContent = jsonData.currently.humidity;
windSpan.textContent = windConvert(jsonData.currently.windSpeed) + " kmph";
hrShort.textContent = jsonData.currently.summary;
changeImage(jsonData.currently.icon);

daSum.textContent = replaceFahrenheit(jsonData.daily.summary);
}

function tempConvert(data){
return +(5*(data-32)/9).toFixed(2);
}

function changeImage(data){
let fileUrl;
switch(data){
    case "rain":
    fileUrl = "/static/images/icons8-rain-80.png";
    break;
}
document.querySelector('.graphic > img').src = fileUrl;
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