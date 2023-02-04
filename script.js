let weatherAPIURL = "https://api.openweathermap.org";
let apiKey = "67d2acac2a53ed83d40a68f9b4f4be4a";



let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHistory = [];
let searchHistoryCont = $("#history");


function renderSearchHistory () {
    
            
            
            // remove the search history(temporary)

            searchHistoryCont.empty();

            // write a loop to fill the history

            for (let i = 0; i < searchHistory.length; i++) {
            // Create a new button for each value in search history
               let btn = $("<button>");

            // give each button a type and data search attributes with values as button and searchHistory respectively
               btn.attr({type: "button", dataSearch :"searchHistory"});

            //  give each button class = btn-history
               btn.addClass("btn-info");
               btn.text(searchHistory[i]); 
               searchHistoryCont.append(btn); 
            }
            

            
}


function appendSearchHistory (search) {
    if (searchHistory.indexOf(search) !== -1) {
        return
    } else {
    searchHistory.push(search);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    renderSearchHistory();
    
}

// function renderCurrentWeather(city, weather) {
//     let date = moment().format("D/M/YYYY");
//     let tempC = weatherData.main.temp;
//     let windKph = weatherData.wind.speed;
//     let humidity = weatherData.main.humidity;
    
//     let card =$("<div>");
//     let cardBody = $("<div>");
//     let heading = $("<h2>");
//     let tempEl = $("<p>");
//     let windEl = $("<p>");
//     let humidityEl = $("<p>");
// }

}

function fetchWeather (location) {
    let latitude = location.lat;
    let longitude = location.lon;
    let city = location.name;

    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=${apiKey}`

    $.ajax({
        url : queryWeatherURL,
        method : "GET"
    }).then(function (response){
        renderCurrentWeather(city, response.list[0])
    })
}

function fetchCoordinates(search) {
    
    let queryUrl = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
    

    $.ajax({
        url : queryUrl,
        method : "GET"
    }).then(function (response){
        // console.log(response);
        if (!response[0]) {
            alert("Location not found")
        } else {
            appendSearchHistory(search);
            fetchWeather(response[0]);
    }
    })
}

function initialiseSearchHistory () {
    let storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);    
    }
    renderSearchHistory();
}

initialiseSearchHistory();

searchForm.on("submit", function(event) {
    event.preventDefault();
    let search = (searchInput.val().trim());

    fetchCoordinates(search);
    searchInput.val("");

})