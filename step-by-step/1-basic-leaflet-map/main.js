// initialize map at 0,0 lat/lon, with a zoom of 1 (zoomed out)
var map = L.map('map').setView([0, 0], 1);

// add a tile layer (OpenStreetMap)
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);