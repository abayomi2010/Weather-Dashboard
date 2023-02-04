let weatherAPIURL = "https://api.openweathermap.org";
let apiKey = "67d2acac2a53ed83d40a68f9b4f4be4a";



let searchInput = $("#search-input");
let searchForm = $("#search-form");

function fetchCoordinates(search) {
    
    let queryUrl = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
    console.log(queryUrl);

    $.ajax({
        url : queryUrl,
        method : "GET"
    }).then(function (response){
        console.log(response);

    })
}
// $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function(response) {})

searchForm.on("submit", function(event) {
    event.preventDefault();
    let search = (searchInput.val().trim());

    fetchCoordinates(search);

})