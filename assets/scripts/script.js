function getApi() {

  // var initials = document.querySelector("#initialinput").value;
    
  //   if (initials === "") {
  //       displayScoreSubmitMessage("error", "Box cannot be blank");
  //   }

    var cityName = document.querySelector("#inputbox").value;
    var APIKey = "60ebe634619c5700bf67dc2646a55408";
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + APIKey;
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Use the console to examine the response
        console.log(data);
        // console.log(cityName);
  
          latitude = data[0].lat;
          longitude = data[0].lon;

          console.log(latitude);
          console.log(longitude);
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

  document.getElementById("pastSearchButton" + cityName).addEventListener('click', getApi);
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
        console.log(data);

        //clears current condition box in case info from previous search is there
        document.getElementById("currentcond").innerHTML = "";

        //Gets City Name
        console.log(data.city.name);
        var currentCityFromAPI = data.city.name;
        var currentCityElement = document.createElement("p");
        currentCityElement.innerText = "City: " + currentCityFromAPI;
        document.getElementById("currentcond").appendChild(currentCityElement);

        //Gets Date
        console.log(data.list[0].dt_txt);
        var currentDateFromAPI = data.list[0].dt_txt;
        var currentDateElement = document.createElement("p");
        currentDateElement.innerText = "Date: " + currentDateFromAPI;
        document.getElementById("currentcond").appendChild(currentDateElement);

        //Gets weather description
        console.log(data.list[0].weather[0].description);
        var currentConditionFromAPI = data.list[0].weather[0].description;
        var currentConditionElement = document.createElement("p");
        currentConditionElement.innerText = currentConditionFromAPI;
        document.getElementById("currentcond").appendChild(currentConditionElement);


        
      }
    )
}


document.getElementById("submitbutton").addEventListener('click', getApi);