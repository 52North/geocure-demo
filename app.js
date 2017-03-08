// geocure base url
const BASEURL = 'http://colabis.dev.52north.org/geocure/services';

// global object that represents the Leaflet map
var map;


function initService(id) {
    // get maps and features and handle them
    $.get($(this).data("href"), function(data) {
        $.get(data.capabilities.maps, addMaps);
        $.get(data.capabilities.features, addFeatures);
        /*
        // legacy code when capabilities was an array and not an object
        data.capabilities.forEach(function(caplink) {
            $.get(caplink, function(data){
                if(data.hasOwnProperty('layers')) {
                    addMaps(data);
                }
                else if(data.hasOwnProperty('features')) {
                    addFeatures(data);
                }
            });
        });*/
    });
    
    // initialise map
    initMap();
}

function initMap() {
    // init map
    map = L.map('map', {
        center: [52, 7.6],  // Münster yeah!
        zoom: 13,
        crs: L.CRS.EPSG4326  // important because API's data uses EPSG:4326
    });

    // add basemap
    /*
    // standard OSM tiles - refuses to work with EPSG:4326 :/
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    */
    
    // using WMS instead
    /*L.tileLayer.wms('http://sg.geodatenzentrum.de/wms_webatlasde.light?', {
        layers:'webatlasde.light',
        attribution: '&copy; GeoBasis-DE / <a href="http://www.bkg.bund.de">BKG</a> 2017'
    }).addTo(map);*/
    
    // Tile service that supports EPSG:4326
    L.tileLayer('http://tiles.geoservice.dlr.de/service/wmts?layer=eoc%3Abasemap&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}', {
        attribution: '&copy; <a href="https://geoservice.dlr.de/">DLR EOC Geoservice</a>'
    }).addTo(map);
    
    // example marker
    L.marker([52, 7.6]).addTo(map)
        /*.bindPopup('Münster')
        .openPopup()*/;
}

function addMaps(data) {
    var overlays = {};
    data.layers.forEach(function(layer) {
        var imageUrl = layer.href;
        var imageBounds = [[data.crs.northBoundLatitude, data.crs.westBoundLongitude], [data.crs.southBoundLatitude, data.crs.eastBoundLongitude]];
        overlays[layer.title] = L.imageOverlay(imageUrl, imageBounds, {opacity:0.5});
        //tried individual opacity sliders
        //L.control.layerOpacity({ layer: overlays[layer.title]}).addTo(map);
    });
    // add layer control to map
    L.control.layers(null, overlays).addTo(map);
    // add opacity control (all layers together)
    L.control.layerOpacity({layers: overlays}).addTo(map);
    
    // another opacity plugin
    /*var opacitySlider = new L.Control.opacitySlider();
    map.addControl(opacitySlider);
    opacitySlider.setOpacityLayer(overlays[0]);*/
}

function addFeatures(data) {
    // TODO
    console.log("FEATURES");
    data.features.forEach(function(layer) {
       console.log(layer.title); 
    });
}

$(document).ready(function() {
    // get all services the RESTAPI provides and list them in the #serviceslist
    $.get(BASEURL, function(services) {
        services.forEach(function(service) {
            $("#serviceslist").append($('<li>', { id: service.id, text: service.label, title: service.description }).data("href", service.href).click(initService));
        });
    });
});