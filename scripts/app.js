var searches = [];
var currentCity = "";

$(document).ready(function () {
    
    
    var mymap = L.map('mapid').setView([-37.784, 175.28], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiY29kZWNyYWZ0ZXJ0cm95IiwiYSI6ImNqdm04cGdxazBsbjk0YW50bzdwbXlxaGsifQ.xQjNqAnHi_3OjXC6rKhgHw'
    }).addTo(mymap);

    $("#submit").click(function () {
        currentCity = $("#city").val();
        if (currentCity.length == 0) {
            alert("Please enter a city");
        } else {
            fetch('http://www.mapquestapi.com/geocoding/v1/address?key=SILNEFAPl42duMtaqi0GY7UHH6uxDa4M&location=' + currentCity + ',nz')
                .then(function (response) {
                    return response.json();
                }).then(function (response) {
                    var cityDetails = response.results[0].locations[0];
                    if (cityDetails.adminArea5.toLowerCase() == currentCity.toLowerCase() || cityDetails.adminArea1 != "NZ") {
                        var latLng = cityDetails.latLng;
                        mymap.setView([latLng.lat, latLng.lng], 13);
                        getInfo(latLng);
                        getWeather(latLng);
                        searches.push(cityDetails);
                    } else {
                        alert(currentCity + " not found.\nPlease enter a valid city in New Zealand");
                    }
                });
        }        
    });

});


function getInfo(latLng) {
    fetch("getinfo.php?lat=" + latLng.lat + "&long=" + latLng.lng)
        .then(response => response.json())
        .then((json) => {            
            var sunrise = new Date(json.results.sunrise);
            var sunset = new Date(json.results.sunset);
            $("#daylight").html(currentCity + " currently: Sun rises at " + sunrise.toLocaleTimeString() + " and sets at " +  sunset.toLocaleTimeString());
        });
}

function getWeather(latLng){
    ajaxRequest("getweather.php?lat=" + latLng.lat + "&long=" + latLng.lng, "", "GET", displayWeather);       
}

function displayWeather(response) {
    var parser = new DOMParser();
    result = parser.parseFromString(response, "text/xml");

}


function ajaxRequest(url, data, method, callback) {
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
				console.log(request.responseText);
			}

		}
	}

	request.send(data);
}

