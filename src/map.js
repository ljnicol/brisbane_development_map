
function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

var hex_data = JSON.parse(Get("data/pop_hexagons_4326.geojson"));

var map = new mapboxgl.Map({
    container: 'map',
    style: {
        "version": 8,
        "sources": {
            "raster-tiles": {
                "type": "raster",
                "tiles": ["https://c.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"],
                "tileSize": 256,
                "attribution": 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
            },
            "pop_hexagons": {
                "type": "geojson",
                "data": hex_data,
                "generateId": true
            }
        },
        "layers": [{
            "id": "simple-tiles",
            "type": "raster",
            "source": "raster-tiles",
            "minzoom": 0,
            "maxzoom": 22
        }, {
            "id": "pop_hexagons",
            "type": "fill-extrusion",
            "source": "pop_hexagons",
            "paint": {
                "fill-extrusion-color": fillColour, "fill-extrusion-height": ['feature-state', 'value'], "fill-extrusion-opacity": 0.8
            }
        }
        ]
    },
    center: { lng: 153, lat: -27.5 }, // starting position
    zoom: 8, // starting zoom
    pitch: 40,
    bearing: 20,
    antialias: true
});

let updateFeatureState = function (column) {
    hex_data.features.forEach(function (hex, index) {
        map.setFeatureState({
            source: 'pop_hexagons',
            id: index
        }, {
            'value': parseFloat(hex.properties[column])
        });
    })
}


let updateMapboxColumn = function (column) {
    let expr = getColourExpression(bins, colours, column);
    map.setPaintProperty('pop_hexagons', 'fill-extrusion-color', expr)
    map.setPaintProperty('pop_hexagons', 'fill-extrusion-height', ['feature-state', 'value'])
};

let updateYear = function (value) {
    yearSuffix = value.slice(2, value.length);
    currentColumn = 'pop_total_' + yearSuffix;
    updateFeatureState(currentColumn);
};

map.on('load', function () {
    updateFeatureState("pop_total_61");
})

map.on('click', 'pop_hexagons', (e) => {
    if (e.features.length > 0) {
        console.log(e.features[0])
    }
});