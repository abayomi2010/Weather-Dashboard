let weatherAPIURL = "https://api.openweathermap.org";
let apiKey = "67d2acac2a53ed83d40a68f9b4f4be4a";



let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHistory = [];
let searchHistoryCont = $("#history");
let forecastContainer = $("#forecast");
let todayContainer = $("#today");



function renderSearchHistory () {
    
            
            
            // remove the search history(temporary)

            searchHistoryCont.empty();

            // write a loop to fill the history

            for (let i = 0; i < searchHistory.length; i++) {
            // Create a new button for each value in search history
               let btn = $("<button>");

            // give each button a type and data search attributes with values as button and searchHistory respectively
               btn.attr({type: "button", dataSearch :searchHistory[i]});

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
}

function renderCurrentWeather(city, weatherData) {
        let date = moment().format("D/M/YYYY");
        let tempC = weatherData.main.temp;
        let windKph = weatherData.wind.speed;
        let humidity = weatherData.main.humidity;
        
        let weatherIcon = $("<img>");
        
        let card =$("<div>");
        let cardBody = $("<div>");
        let heading = $("<h2>");
        let tempEl = $("<p>");
        let windEl = $("<p>");
        let humidityEl = $("<p>");
        let iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
        let iconWeatherDescription = weatherData.weather[0].description;

         card.attr("class", "card");
         cardBody.attr("class", "card-body");
         card.append(cardBody);
         heading.attr("class", " h3 card-title");
         tempEl.attr("class", "card-text");
         windEl.attr("class", "card-text");
         humidityEl.attr("class", "card-text");
         
         heading.text(`${city} ${date}`);
         weatherIcon.attr("src", iconUrl);
         weatherIcon.attr("alt", iconWeatherDescription);
         
         heading.append(weatherIcon);
         tempEl.text(`Temperature:  ${tempC} °C`);
         windEl.text(`Wind Speed: ${windKph} KPH`);
         humidityEl.text(`Humidity: ${humidity}%`);
         cardBody.append(heading, tempEl, windEl, humidityEl);
         todayContainer.html("");
         todayContainer.append(card);
         }




function renderForecast (weatherData) {
    let headingCol = $("<div>");
    let heading = $("<h4>");

    headingCol.attr("class", "col-12");
    heading.text("5-Day Forecast");
    headingCol.append(heading);
    
    forecastContainer.html("")
    
    forecastContainer.append(headingCol);
    
    
    let futureForecast = weatherData.filter(function (forecast) {
        return forecast.dt_txt.includes("12");
    })


    for (let i = 0; i < futureForecast.length; i++) {
        let iconUrl = `https://openweathermap.org/img/wn/${futureForecast[i].weather[0]["icon"]}.png`;
        
        let iconDescription = futureForecast[i].weather[0]["description"];

        let tempC = futureForecast[i].main.temp;
        let humidity = futureForecast[i].main.humidity;
        let windKph = futureForecast[i].wind.speed;

        let col = $("<div>");
        let card =$("<div>");
        let cardBody = $("<div>");
        let cardTitle = $("<h5>");
        let weatherIcon = $("<img>");
        let tempEl = $("<p>");
        let windEl = $("<p>");
        let humidityEl = $("<p>");

        col.append(card);
        card.append(cardBody);
        cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

        col.attr("class", "col-md");
        card.attr("class", "card bg-primary h-100 text-white");
        cardTitle.attr("class", "card-title");
        tempEl.attr("class", "card-text");
        windEl.attr("class", "card-text");
        humidityEl.attr("class", "card-text");
        

        cardTitle.text(moment(futureForecast[i].dt_text).format("D/M/YYYY"));  
        weatherIcon.attr("src", iconUrl);
        weatherIcon.attr("alt", iconDescription);
        tempEl.text(`Temperature:  ${tempC} °C`);
        windEl.text(`Wind Speed: ${windKph} KPH`);
        humidityEl.text(`Humidity: ${humidity}%`);


        forecastContainer.append(col);
        
        
        
        
        
        

        
        
        


    }

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
        
        
        renderCurrentWeather(city, response.list[0]);
        renderForecast(response.list)
        // console.log(response.list);
        
        
        
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


function handleSearchHistory(event) {
    if (!$(event.target).hasClass("btn-info")) {
        return;
    }
    let search = $(event.target).attr("dataSearch");
    

    fetchCoordinates(search);
    searchInput.val("");
    
    
    
}


initialiseSearchHistory();

searchForm.on("submit", function(event) {
    event.preventDefault();
    let search = (searchInput.val().trim());

    fetchCoordinates(search);
    searchInput.val("");

})

searchHistoryCont.on("click",  handleSearchHistory);
