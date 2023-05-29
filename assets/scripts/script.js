function getApi() {
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=60ebe634619c5700bf67dc2646a55408';
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Use the console to examine the response
        console.log(data);
      }
    )}

getApi()    