(function(){
    function init() {
        //  init map
        var map = L.mapbox.map('map', 'franksvalli.i9ic5111').setView([0, 0], 1);

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

        var tle = [
            'SKYSAT-1                ',
            '1 39418U 13066C   14148.17702979  .00002107  00000-0  19287-3 0  5740',
            '2 39418  97.7889 224.9006 0024641  64.3193 296.0575 14.95823977 28066'
        ];

        //  get current satellite lat/lon
        var latlon = getSatLatLon(tle);

        //  initialize marker and pass in our custom icon
        L.marker(latlon,{
            icon: customIcon
        }).addTo(map);
    }


    /**
     * Find lat/lon of satellite now, or at given localTime
     * @param  {Array}  tle       satellite TLE
     * @param  {String} localTime (optional) local timestamp
     * @return {Array}            [lat, lon]
     */
    var getSatLatLon = function(tle, localTime) {
        //  time defaults to now
        var time = (localTime) ? new Date(localTime) : new Date();

        //  convert local time to UTC
        var year   = time.getUTCFullYear();
        //  important 0th to 1-index conversion for satellite.js
        var month  = time.getUTCMonth() + 1;
        var date   = time.getUTCDate();
        var hour   = time.getUTCHours();
        var minute = time.getUTCMinutes();
        var second = time.getUTCSeconds();

        //  the rest of the function can be copied from the
        //  satellite.js readme:

        //  Initialize a satellite record
        var satrec = satellite.twoline2satrec (tle[1], tle[2]);

        //  Pass in calendar date and time.
        var position_and_velocity = satellite.propagate (satrec, year, month, date, hour, minute, second);

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
        var gmst = satellite.gstime_from_date (year, month, date, hour, minute, second);

        // Geodetic coords are accessed via "longitude", "latitude", "height".
        var position_gd    = satellite.eci_to_geodetic (position_eci, gmst);
        var longitude = position_gd["longitude"];
        var latitude  = position_gd["latitude"];
        var height    = position_gd["height"];

        //  Convert the RADIANS to DEGREES for pretty printing (appends "N", "S", "E", "W". etc).
        var longitude_str = satellite.degrees_long (longitude);
        var latitude_str  = satellite.degrees_lat  (latitude);


        return [latitude_str, longitude_str];
    }

    document.addEventListener('DOMContentLoaded', init, false);
})();
