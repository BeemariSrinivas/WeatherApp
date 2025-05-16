document.getElementById("form").addEventListener("submit",function(event){
    event.preventDefault();
});

document.getElementById("submit").addEventListener("click",async function(){
    const containerChild = document.getElementById("weatherDisplay");
    if (containerChild) {
        while (containerChild.firstChild) {
            containerChild.removeChild(containerChild.firstChild);
        }
    }
    const cityName=document.getElementById("cityName").value;
    const apiKey = "90930fa161303e19b2e7c87ff23f8e74";
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
        const weatherData = await response.json();
        //console.log(weatherData.list);
        display(weatherData);
    }
    catch(error){
        console.log(error);
    }
});

function display(weatherData){
    let fiveDayForecast = weatherData.list;
        fiveDayForecast = fiveDayForecast.filter((ele,index)=>index%8===0);
        console.log(fiveDayForecast);
        const container = document.createElement("div");
        fiveDayForecast.forEach(element => {
            let dateValue = element.dt_txt.split(" ")[0];
            let temperatureValue = element.main.temp;
            let weatherValue = element.weather[0].main;
            let weatherDescriptionValue = element.weather[0].description;
            let iconValue = element.weather[0].icon;
            let windValue = element.wind.speed;
            let humidityValue = element.main.humidity;
            const card = document.createElement("div");
            const date = document.createElement("p");
            const image = document.createElement("img");
            const temprature = document.createElement("p");
            const weather = document.createElement("p");
            const wind = document.createElement("p");
            const humidity = document.createElement("p");
            date.innerHTML = dateValue;
            image.src=`https://openweathermap.org/img/wn/${iconValue}@2x.png`;
            image.alt=`${weatherDescriptionValue}`;
            temprature.innerHTML = temperatureValue;
            weather.innerHTML = weatherValue;
            wind.innerHTML = windValue;
            humidity.innerHTML = humidityValue;
            card.appendChild(date);
            card.appendChild(image);
            card.appendChild(weather);
            card.appendChild(temprature);
            card.appendChild(wind);
            card.appendChild(humidity);
            container.appendChild(card);
        });
        document.getElementById("weatherDisplay").append(container);
}