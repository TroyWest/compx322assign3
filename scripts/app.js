$(document).ready(function () {
    var mymap = L.map('mapid').setView([-37.784, 175.28], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiY29kZWNyYWZ0ZXJ0cm95IiwiYSI6ImNqdm04cGdxazBsbjk0YW50bzdwbXlxaGsifQ.xQjNqAnHi_3OjXC6rKhgHw'
    }).addTo(mymap);

});


