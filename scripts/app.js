var searches = []; // Array to store towns from searches
var currentCity = ""; // Name of the current city
var mymap; //Handle for the map 

// Town object for caching town details 
function Town(name, latLng) {
    this.name = name;
    this.latLng = latLng;
}

$(document).ready(function () {
    // Initialize the map on Hamilton
    mymap = L.map('mapid').setView([-37.784, 175.28], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiY29kZWNyYWZ0ZXJ0cm95IiwiYSI6ImNqdm04cGdxazBsbjk0YW50bzdwbXlxaGsifQ.xQjNqAnHi_3OjXC6rKhgHw'
    }).addTo(mymap);

    // Set up click action on the submit button
    $("#submit").click(function () {   
        //Set current city     
        currentCity = $("#city").val();
        if (currentCity.length == 0) {
            alert("Please enter a city");
        } else {
            // find if current city has been searched for already
            var townIndex = searches.findIndex(t => t.name == currentCity);
            if(townIndex == -1){
                // Not found - query mapquest and add new city to cache
                loadNewCity(mymap);
            } else {
                // Found - load city from cache
                loadTown(townIndex);
            }
            
        }
    });

});

// Used when loading a new map
function loadMap(town) {
    mymap.setView([town.latLng.lat, town.latLng.lng], 13);
}

// Queries map quest for the geocode of a city then adds that city to the searches cache array
// Then loads the map and queries the sunrise sunset and weather services
function loadNewCity() {
    fetch('http://www.mapquestapi.com/geocoding/v1/address?key=SILNEFAPl42duMtaqi0GY7UHH6uxDa4M&location=' + currentCity + ',nz')
        .then(function (response) {
            return response.json();
        }).then(function (response) {
            var cityDetails = response.results[0].locations[0];
            if (cityDetails.adminArea5.toLowerCase() == currentCity.toLowerCase() || cityDetails.adminArea1 != "NZ") {
                var latLng = cityDetails.latLng;
                var town = new Town(currentCity, latLng);
                loadMap(town);
                searches.push(town);
                updateRecentSearches();

                getDaylightInfo(latLng);
                getWeather(latLng);
            } else {
                alert(currentCity + " not found.\nPlease enter a valid city in New Zealand");
            }
        });
}

// Queries for sunrise sunset informaton then displays results
function getDaylightInfo(latLng) {
    fetch("getinfo.php?lat=" + latLng.lat + "&long=" + latLng.lng)
        .then(response => response.json())
        .then((json) => {
            var sunrise = new Date(json.results.sunrise);
            var sunset = new Date(json.results.sunset);
            $("#daylight").html(currentCity + " currently: Sun rises at " + sunrise.toLocaleTimeString() + " and sets at " + sunset.toLocaleTimeString());
        });
}

// Sends the AJAX request for the weather data
function getWeather(latLng) {
    ajaxRequest("getweather.php?lat=" + latLng.lat + "&long=" + latLng.lng, "", "GET", displayWeather, displayWeatherError);
}

// On successfully completing AJAX requests, checks for errors then displays results
function displayWeather(response) {
    var parser = new DOMParser();
    var result = parser.parseFromString(response, "text/xml");
    if (result.getElementsByTagName("parsererror").length > 0) {
        displayWeatherError(response);
    } else {
        var weather = result.getElementsByTagName("weather")[0];
        var temperature = result.getElementsByTagName("temperature")[0];
        $("#weather").html("Current weather is " + weather.getAttribute('value')
            + ". It is currently " + temperature.getAttribute('value')
            + "&deg;C. Max temp: " + temperature.getAttribute('max')
            + "&deg;C. Min temp: " + temperature.getAttribute('min')
            + "&deg;C.");
    }
}

// Informs the user hat the weather information could not be loaded if an error
// has occurred
function displayWeatherError(response) {
    $("#weather").html("Current weather could not be retreived at this time.")
    console.log(response);
}

// Updates the display of the recent searches
function updateRecentSearches() {
    var recentSearches = $("#recentSearches");
    recentSearches.html("");
    var updatedSearchList = "";
    searches.forEach(function (town, index) {
        updatedSearchList += "<li onclick='loadTown(" + index + ")'>" + town.name + "</li>";

    });
    recentSearches.html(updatedSearchList);
}

// Loads a town from the search cache and uses that information to query for maps weather 
// and daylight hours
function loadTown(index) {
    var town = searches[index];
    currentCity = town.name;
    loadMap(town);
    getDaylightInfo(town.latLng);
    getWeather(town.latLng);
}


// AJAX request
function ajaxRequest(url, data, method, callback, error) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);

    if (method == "POST") {
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }

    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) {
                callback(request.responseText);
            } else {
                error(request.responseText);
            }

        }
    }

    request.send(data);
}

