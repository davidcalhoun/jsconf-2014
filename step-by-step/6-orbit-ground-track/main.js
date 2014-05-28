(function(){
    //  moved references here to share between functions
    var map,
        marker,
        tle,
        orbitLine;

    function init() {
        //  init map
        map = L.mapbox.map('map', 'franksvalli.i9ic5111',{
            worldCopyJump: true
        }).setView([0, 0], 1);

        //  add test marker
        //L.marker([30.5554579,-81.4439261]).addTo(map);    //  basic marker

        //  define custom SkySat-1 icon for the marker
        var customIcon = L.icon({
            iconUrl:       'skysat-1.png',
            iconRetinaUrl: 'skysat-1@2x.png',

            //  size of the icon
            iconSize:     [50, 48],

            //  center of icon
            iconAnchor:   new L.Point(25, 24)
        });

        tle = [
            'SKYSAT-1                ',
            '1 39418U 13066C   14142.82545552  .00001899  00000-0  17444-3 0  5580',
            '2 39418  97.7880 219.5774 0024543  80.8081 279.5892 14.95800287 27267'
        ];

        var latlon = getSatLatLon(tle);

        //  initialize marker and pass in our custom icon
        marker = L.marker(latlon,{
            icon: customIcon
        }).addTo(map);

        //  two second interval to update satellite position
        window.setInterval(updateLatLon, 2000);

        //  ground track
        generateGroundTrack(tle);
    }

    var getSatLatLon = function(tle, localTimeMS) {
        //  start the devtools timer
        console.time("tle-processing");

        var time = (localTimeMS) ? new Date(localTimeMS) : new Date();
        var year = time.getUTCFullYear();
        var month = time.getUTCMonth() + 1;
        var date_of_month   = time.getUTCDate();
        var hour  = time.getUTCHours();
        var minute = time.getUTCMinutes();
        var second = time.getUTCSeconds();

        // Initialize a satellite record
        var satrec = satellite.twoline2satrec (tle[1], tle[2]);

        //  Or you can use a calendar date and time (obtained from Javascript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)).
        var position_and_velocity = satellite.propagate (satrec, year, month, date_of_month, hour, minute, second);

        // The position_velocity result is a key-value pair of ECI coordinates.
        // These are the base results from which all other coordinates are derived.
        var position_eci = position_and_velocity["position"];
        var velocity_eci = position_and_velocity["velocity"];

        // Set the Observer at 122.03 West by 36.96 North, in RADIANS
        var deg2rad = Math.PI / 180;
        var observer_gd = {
            longitude : -122.0308  * deg2rad,
            latitude  : 36.9613422 * deg2rad,
            height    : .370
        };

        // You will need GMST for some of the coordinate transforms
        var gmst = satellite.gstime_from_date (year, month, date_of_month, hour, minute, second);

        // Geodetic coords are accessed via "longitude", "latitude", "height".
        var position_gd    = satellite.eci_to_geodetic (position_eci, gmst);
        var longitude = position_gd["longitude"];
        var latitude  = position_gd["latitude"];
        var height    = position_gd["height"];

        //  Convert the RADIANS to DEGREES for pretty printing (appends "N", "S", "E", "W". etc).
        var longitude_str = satellite.degrees_long (longitude);
        var latitude_str  = satellite.degrees_lat  (latitude);

        //  end the devtools timer
        console.timeEnd("tle-processing");

        return [latitude_str, longitude_str];
    }

    function generateGroundTrack(tle, stepMS) {
        //  default to 1 minute intervals
        stepMS = stepMS || (1000 * 60 * 1);

        //  offset: plot orbit 3 hrs into past and future
        var timeOffset = 1000 * 60 * 60 * 3,
            startTime     = Date.now() - timeOffset,
            curMarkerTime = startTime,
            endTime       = Date.now() + timeOffset;

        //  generate lat/lons
        var latLngs = [];
        while(curMarkerTime < endTime) {
            latLngs.push(getSatLatLon(tle, curMarkerTime));
            curMarkerTime += stepMS;
        }

        //  plot lat/lons into polyline
        polyline = L.polyline(latLngs, {color: 'blue'}).addTo(map);
    }

    function updateLatLon() {
        marker.setLatLng(getSatLatLon(tle));
    }

    document.addEventListener('DOMContentLoaded', init, false);
})();
