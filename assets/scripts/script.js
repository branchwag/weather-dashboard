function getApi() {

  //also add in way to handle invalid location

    var cityName = document.querySelector("#inputbox").value;
    var APIKey = "60ebe634619c5700bf67dc2646a55408";
    //please see code further below where I am taking the city name and getting the lat/long before running a new API request with lat and long
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + APIKey;
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Use the console to examine the response
        // console.log(data);
        // console.log(typeof(data));
        //making sure that inputs are valid
        if (data.length === 0) {
          return alert('Please check your search input');
        }
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

function runOldSearch(event) {
  // console.log(event.target.innerText);
  //put the cityName into the input box and run api function
  // document.querySelector("#inputbox").value = event.target.innerText;
  //while the above does work, we need to do this with localstorage. Get localstorage for what was clicked on.
  document.querySelector("#inputbox").value = localStorage.getItem(event.target.innerText)
  getApi();
} 

function createPastSearchButton() {
  var cityName = document.querySelector("#inputbox").value;
  var pastSearchButton = document.createElement("button");

  //set this cityName value into local storage
  localStorage.setItem(document.querySelector("#inputbox").value, document.querySelector("#inputbox").value);

  pastSearchButton.id = 'pastSearchButton' + cityName; 
  pastSearchButton.innerText = cityName;
    //makes the button pretty
  pastSearchButton.classList.add("btn" , "btn-secondary" , "btn-lg", "custombtn", "pastSearchButtonC");
  document.querySelector("#prevsearch").appendChild(pastSearchButton);    

  //adds a listener to the past search buttons
  var pastSearchButtons = document.getElementsByClassName("pastSearchButtonC");
  for (var i = 0; i < pastSearchButtons.length; i++) {
    pastSearchButtons[i].addEventListener('click', runOldSearch);
  }

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
        // console.log(data.list)

        //clears current day boxes if info from previous search is there
        document.getElementById("day0").innerHTML = "";
        document.getElementById("day1").innerHTML = "";
        document.getElementById("day2").innerHTML = "";
        document.getElementById("day3").innerHTML = "";
        document.getElementById("day4").innerHTML = "";
        document.getElementById("day5").innerHTML = "";


        //Now to fill in 5 day forecast
        // console.log(data.list);

        //According to the weather api documentation, it pull entries every 3 hours which is 10800 added to the UNIX time (dt)
        //since 24 hrs divided by 3 is 8...so every 8th item is what we need actually
        //since this api returns 40 items starting at 0, maybe add 7? 

        var numberOfDaysToForeCast = 5;
        var objectLocationCounter = 0; //used to grab data every 8th position

  
        //var startingDayNumber = 1;
        //made a div for each day
        for (var i = 0; i < (numberOfDaysToForeCast + 1); i++) {
        if (+objectLocationCounter === 40) {
          objectLocationCounter = 39;
        }

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
        var currentDateFromAPI = data.list[objectLocationCounter].dt_txt;
        // if (+objectLocationCounter > 39) {
        //   (currentCityFromAPI.slice(0, -10));
        // }
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

        objectLocationCounter = objectLocationCounter + 7; //needed to change to increment by 7 bc 8 would get out of bounds
        // console.log(objectLocationCounter);
        // console.log(i);
          
        }

        

      }
    )
}


document.getElementById("submitbutton").addEventListener('click', checkInput);

function checkInput() {
var inputCheck = document.querySelector("#inputbox").value;
    
if (inputCheck === "") {
    alert("Box cannot be blank");
}
else {
  getApi();
}

}