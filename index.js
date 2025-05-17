document.getElementById("form").addEventListener("submit",function(event){
    event.preventDefault();
});

let saved = [];
const searchedCities = localStorage.getItem("searches");
if(searchedCities!==null){
    try {
       saved =  JSON.parse(searchedCities);
    } catch (error) {
        console.log(error);
    }
}
else{
    saved = [];
}



window.onload = () => {
  if (saved.length > 0) {
    const dropDown = document.getElementById("options");
    saved.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      dropDown.appendChild(option);
    });
  }
};



document.getElementById("submit").addEventListener("click",async function(){
    clear();
    const cityName=document.getElementById("cityName").value.toLowerCase().trim();
    if(cityName===""){
        alert("Empty Values are not allowed, Please enter a city name");
        return;
    }
    else{
        const apiKey = "90930fa161303e19b2e7c87ff23f8e74";
        try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
            const weatherData = await response.json();
            //console.log(weatherData.list);
            if(weatherData.cod!=="200"){
                alert("Invalid City Name, Please try again with correct city name");
                document.getElementById("form").reset();
                return;
            }
            else{
                display(weatherData);
                const lowerSaved = saved.map(c => c.toLowerCase());
                if (!lowerSaved.includes(cityName.toLowerCase())) {
                    const dropDown = document.getElementById("options");
                    const option = document.createElement("option");
                    option.value = cityName;
                    option.textContent = cityName;
                    dropDown.appendChild(option);
                    saved.push(cityName);
                    localStorage.setItem("searches", JSON.stringify(saved));
                }
            }
        }
        catch(error){
            alert("Invalid City Name, Please try again with correct city name");
        }
        finally{
            document.getElementById("form").reset();
            return;
        }
    }
});
document.getElementById("currentLocation").addEventListener("click",async function(){
    clear();
    const apiKey = "90930fa161303e19b2e7c87ff23f8e74";
    if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(async(position)=>{
          const  latitude =  position.coords.latitude;
          const  longitude = position.coords.longitude;
          try{
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
                const weatherData = await response.json();
                display(weatherData);
            }
            catch(error){
                alert("Error obtaining Weather Data,Please try again");
                return;
            }
            finally{
                document.getElementById("form").reset();
                return;
            }
        },
    (error)=>{
        alert("Error obtaining loaction");
        return;
    });
    }
    else{
        alert("Geolocation is not supported by the browser");
        return;
    }
});

document.getElementById("options").addEventListener("change",async function(event){
    clear();
    const city = event.target.value;
    const apiKey = "90930fa161303e19b2e7c87ff23f8e74";
    try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
            const weatherData = await response.json();
            display(weatherData);
        }
        catch(error){
            alert("An error occured, Please try again");
            document.getElementById("form").reset();
            return;
        }
});

function clear(){
    const containerChild = document.getElementById("weatherDisplay");
    if (containerChild) {
        while (containerChild.firstChild) {
            containerChild.removeChild(containerChild.firstChild);
        }
    }
}


function display(weatherData){
    let fiveDayForecast = weatherData.list;
        fiveDayForecast = fiveDayForecast.filter((ele,index)=>index%8===0);
        console.log(fiveDayForecast);
        const container = document.createElement("div");
        container.className = "flex flex-col justify-center items-center md:grid md:grid-rows-3 md:grid-cols-2 lg:grid lg:grid-rows-2 lg:grid-cols-4";
        fiveDayForecast.forEach(element => {
            let dateValue = element.dt_txt.split(" ")[0];
            let temperatureValue = element.main.temp;
            let weatherValue = element.weather[0].main;
            let weatherDescriptionValue = element.weather[0].description;
            let iconValue = element.weather[0].icon;
            let windValue = element.wind.speed;
            let humidityValue = element.main.humidity;
            const card = document.createElement("div");
            let today = new Date();
            let todayDate = today.toISOString().split("T")[0];
            if (dateValue === todayDate) {
                card.className = "bg-blue-200 my-2 p-3 md:col-span-2 lg:col-span-4";
            }
            else{
                card.className = "my-2 p-3 bg-slate-200 md:m-2";
            }
            const date = document.createElement("p");
            const image = document.createElement("img");
            const temprature = document.createElement("p");
            const weather = document.createElement("p");
            const wind = document.createElement("p");
            const humidity = document.createElement("p");
            date.innerHTML = dateValue;
            image.src=`https://openweathermap.org/img/wn/${iconValue}@2x.png`;
            image.alt=`${weatherDescriptionValue}`;
            temprature.innerHTML = `Temperature : ${temperatureValue}&#8451`;
            weather.innerHTML = weatherValue;
            wind.innerHTML = `Wind : ${windValue}m/s`;
            humidity.innerHTML =`Humidity : ${humidityValue}%`;
            card.appendChild(date);
            card.appendChild(image);
            card.appendChild(weather);
            card.appendChild(temprature);
            card.appendChild(wind);
            card.appendChild(humidity);
            container.appendChild(card);
        });
        document.getElementById("weatherDisplay").append(container);
        document.getElementById("form").reset();
}