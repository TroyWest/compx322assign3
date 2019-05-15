

$(document).ready(function () {
    var currentCity = "";
    var searches = {};
    var mymap = L.map('mapid').setView([-37.784, 175.28], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
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
                    var cityDeatils = response.results[0].locations[0];
                    if (cityDeatils.adminArea5 == currentCity) {
                        var latLng = cityDeatils.latLng;
                        mymap.setView([latLng.lat, latLng.lng], 13);
                    } else {
                        alert(currentCity + " not found.\nPlease enter a valid city in New Zealand");
                    }
                });
        }        
    });

});


