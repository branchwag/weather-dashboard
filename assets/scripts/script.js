function getApi() {

  // var initials = document.querySelector("#initialinput").value;
    
  //   if (initials === "") {
  //       displayScoreSubmitMessage("error", "Box cannot be blank");
  //   }

  //also add in way to handle invalid location

    var cityName = document.querySelector("#inputbox").value;
    var APIKey = "60ebe634619c5700bf67dc2646a55408";
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + APIKey;
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Use the console to examine the response
        // console.log(data);
        // console.log(cityName);
  
          latitude = data[0].lat;
          longitude = data[0].lon;

          // console.log(latitude);
          // console.log(longitude);
          getWeatherDataByLatandLong(latitude, longitude);
      }
    )
    createPastSearchButton();
  }

function createPastSearchButton() {
  var cityName = document.querySelector("#inputbox").value;
  var pastSearchButton = document.createElement("button");
  pastSearchButton.id = 'pastSearchButton' + cityName; 
  pastSearchButton.innerText = cityName;
  document.querySelector("#prevsearch").appendChild(pastSearchButton);
  document.querySelector("#pastSearchButton" + cityName).classList.add("btn" , "btn-secondary" , "btn-lg", "custombtn", "pastSearchButtonC");
  //NEED TO MAKE PAST SEARCH BUTTON WORK
  // document.getElementById("pastSearchButton" + cityName).addEventListener('click', getApi);
}

function getWeatherDataByLatandLong(latitude, longitude) {
  var APIKey = "60ebe634619c5700bf67dc2646a55408";
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + APIKey;
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Use the console to examine the response
        // console.log(data);

        //clears current condition box in case info from previous search is there
        document.getElementById("currentcond").innerHTML = "";

        //Gets City Name
        // console.log(data.city.name);
        var currentCityFromAPI = data.city.name;
        var currentCityElement = document.createElement("p");
        currentCityElement.innerText = "City: " + currentCityFromAPI;
        document.getElementById("currentcond").appendChild(currentCityElement);

        //Gets Date
        // console.log(data.list[0].dt_txt);
        var currentDateFromAPI = data.list[0].dt_txt;
        var currentDateElement = document.createElement("p");
        currentDateElement.innerText = "Date: " + currentDateFromAPI.slice(0, 11); //chops off utc timestamp at end to make this just the date
        document.getElementById("currentcond").appendChild(currentDateElement);

        //Gets weather description
        //see https://openweathermap.org/weather-conditions
        // console.log(data.list[0].weather[0].description);
        var iconNum = data.list[0].weather[0].icon
        var iconUrl = 'https://openweathermap.org/img/wn/' + iconNum + "@2x.png";
        var currentWeatherIcon = document.createElement("img");
        currentWeatherIcon.src = iconUrl;
        document.getElementById("currentcond").appendChild(currentWeatherIcon);

        //in text in case icon does not load
        var currentConditionFromAPI = data.list[0].weather[0].description;
        var currentConditionElement = document.createElement("p");
        currentConditionElement.innerText = currentConditionFromAPI.toUpperCase();
        document.getElementById("currentcond").appendChild(currentConditionElement);

        //Temperature
        var TempInKelvinFromAPI = data.list[0].main.temp;
        // console.log(typeof(TempInKelvinFromAPI)); confirms this is returned as number
        //CONVERT TO FAHRENHEIT
        var TempinFahren = (TempInKelvinFromAPI - 273.15) * 9/5 + 32; // thank you google for the conversion formula!
        //console.log(TempinFahren);
        var cleanTempinFahren = Math.round(TempinFahren); // rounding result so it is cleaner to display
        //also putting in Celsius 
        var TempinCel = TempInKelvinFromAPI - 273.15;
        var cleanTempinCel = Math.round(TempinCel);
        // console.log(cleanTempinCel);
        //console.log("Temp: " + cleanTempinFahren + "°F / " + cleanTempinCel + "°C");
        var temperatureElement = document.createElement("p");
        temperatureElement.innerText = "Temp: " + cleanTempinFahren + "°F / " + cleanTempinCel + "°C";
        document.getElementById("currentcond").appendChild(temperatureElement);

        //Humidity
        //console.log(data.list[0].main.humidity);
        var humidityFromApi = data.list[0].main.humidity;
        var humidityElement = document.createElement("p");
        //in percent
        humidityElement.innerText = "Humidity: " + humidityFromApi + "%";
        document.getElementById("currentcond").appendChild(humidityElement);

        //Wind Speed
        // console.log(data.list[0]);
        //console.log(data.list[0].wind.speed);
        // console.log(data.list)
        var windSpeedFromAPI = data.list[0].wind.speed;
        var windSpeedElement = document.createElement("p");
        windSpeedElement.innerText = "Wind Speed: " + windSpeedFromAPI + " meters per second";
        document.getElementById("currentcond").appendChild(windSpeedElement);

        //now to fill in 5 day forecast
        
      }
    )
}


document.getElementById("submitbutton").addEventListener('click', getApi);