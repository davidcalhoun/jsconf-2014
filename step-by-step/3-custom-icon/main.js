(function(){
    function init() {
        //  init map
        var map = L.mapbox.map('map', 'franksvalli.i9ic5111').setView([0, 0], 1);

        //  basic marker
        //L.marker([30.5554579,-81.4439261]).addTo(map);

        //  custom marker
        L.marker([30.5554579,-81.4439261],{
            icon: L.icon({
                //  custom SkySat-1 icon
                iconUrl:       'skysat-1.png',
                iconRetinaUrl: 'skysat-1@2x.png',

                //  size of the icon
                iconSize:      [50, 48],

                //  define icon anchor to lat/lon
                //  (here it's the center)
                iconAnchor:    new L.Point(25, 24)
            })
        }).addTo(map);

    }

    document.addEventListener('DOMContentLoaded', init, false);
})();


