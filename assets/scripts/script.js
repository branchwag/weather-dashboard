function getApi() {

  // var initials = document.querySelector("#initialinput").value;
    
  //   if (initials === "") {
  //       displayScoreSubmitMessage("error", "Box cannot be blank");
  //   }

  //also add in way to handle invalid location

  

    var cityName = document.querySelector("#inputbox").value;
    var APIKey = "60ebe634619c5700bf67dc2646a55408";
    //please see code further below where I am taking the city name and getting the lat/long before running a new API request with lat and long
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
        console.log(data.list)

        //clears current day boxes if info from previous search is there
        document.getElementById("day0").innerHTML = "";
        document.getElementById("day1").innerHTML = "";
        document.getElementById("day2").innerHTML = "";
        document.getElementById("day3").innerHTML = "";
        document.getElementById("day4").innerHTML = "";
        document.getElementById("day5").innerHTML = "";


        //Now to fill in 5 day forecast
        //console.log(data.list);

        //According to the weather api documentation, it pull entries every 3 hours which is 10800 added to the UNIX time (dt)
        //since 24 hrs divided by 3 is 8...so every 8th item is what we need actually
        //since this api returns 40 items starting at 0, maybe add 7? 

        var numberOfDaysToForeCast = 5;
        var objectLocationCounter = 0; //used to grab data every 8th position
  
        //var startingDayNumber = 1;
        //made a div for each day
        for (var i = 0; i < (numberOfDaysToForeCast + 1); i++) {

        //GETTING DATA
        //Windspeed
        // var windSpeedFromAPIforForecastedDay = data.list[objectLocationCounter].wind.speed;
        // console.log(windSpeedFromAPIforForecastedDay);

        
        //Gets City Name
        // console.log(data.city.name);
        var currentCityFromAPI = data.city.name;
        var currentCityElement = document.createElement("p");
        currentCityElement.innerText = "City: " + currentCityFromAPI;
        document.getElementById("day" + i).appendChild(currentCityElement);

        //Gets Date
        // console.log(data.list[0].dt_txt);
        var currentDateFromAPI = data.list[objectLocationCounter].dt_txt;
        var currentDateElement = document.createElement("p");
        currentDateElement.innerText = "Date: " + currentDateFromAPI.slice(0, 11); //chops off utc timestamp at end to make this just the date
        document.getElementById("day" + i).appendChild(currentDateElement);

        //Gets weather description
        //see https://openweathermap.org/weather-conditions
        // console.log(data.list[0].weather[0].description);
        var iconNum = data.list[objectLocationCounter].weather[0].icon
        var iconUrl = 'https://openweathermap.org/img/wn/' + iconNum + "@2x.png";
        var currentWeatherIcon = document.createElement("img");
        currentWeatherIcon.src = iconUrl;
        document.getElementById("day" + i).appendChild(currentWeatherIcon);

        //in text in case icon does not load
        var currentConditionFromAPI = data.list[objectLocationCounter].weather[0].description;
        var currentConditionElement = document.createElement("p");
        currentConditionElement.innerText = currentConditionFromAPI.toUpperCase();
        document.getElementById("day" + i).appendChild(currentConditionElement);

        //Temperature
        var TempInKelvinFromAPI = data.list[objectLocationCounter].main.temp;
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
        document.getElementById("day" + i).appendChild(temperatureElement);

        //Humidity
        //console.log(data.list[0].main.humidity);
        var humidityFromApi = data.list[objectLocationCounter].main.humidity;
        var humidityElement = document.createElement("p");
        //in percent
        humidityElement.innerText = "Humidity: " + humidityFromApi + "%";
        document.getElementById("day" + i).appendChild(humidityElement);

        //Wind Speed
        // console.log(data.list[0]);
        //console.log(data.list[0].wind.speed);
        // console.log(data.list)
        var windSpeedFromAPI = data.list[objectLocationCounter].wind.speed;
        var windSpeedElement = document.createElement("p");
        windSpeedElement.innerText = "Wind Speed: " + windSpeedFromAPI + " meters per second";
        document.getElementById("day" + i).appendChild(windSpeedElement);



        objectLocationCounter = objectLocationCounter + 7;
          
        }

        

      }
    )
}


document.getElementById("submitbutton").addEventListener('click', getApi);