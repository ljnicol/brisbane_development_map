
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
                "data": "data/pop_hexagons_4326.geojson"
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
                "fill-extrusion-color": fillColour, "fill-extrusion-height": ['get', 'pop_total_26']
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


let updateMapboxColumn = function (column) {
    let expr = getColourExpression(bins, colours, column);
    map.setPaintProperty('pop_hexagons', 'fill-extrusion-color', expr)
    map.setPaintProperty('pop_hexagons', 'fill-extrusion-height', ['get', column])
};

let updateYear = function (value) {
    yearSuffix = value.slice(2, value.length);
    currentColumn = 'pop_total_' + yearSuffix;
    updateMapboxColumn(currentColumn);
};
