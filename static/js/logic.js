var urlEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log (urlEarthquakes)
var urlPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log (urlPlates)
//var earthquakes = new L.LayerGroup();
function radius_size(magnitude) {
    return magnitude * 20000;
};

function Color(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'orange'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'greenyellow'
    } else {
        return 'lime'
    }
};

d3.json(urlEarthquakes, function(earthquake_data) {

    var earthquakes= L.geoJson(earthquake_data, {
        // Style each feature (in this case a neighborhood)
        pointToLayer:function(feature,latlng){
			return new L.circle(latlng,{
				radius: radius_size(feature.properties.mag),
				fillColor: Color(feature.properties.mag),
				fillOpacity:.9,
				stroke:false,
			})
		},
        // Called on each feature
        onEachFeature: function(feature, layer) {
          
          
          // Giving each feature a pop-up with information pertinent to it
          layer.bindPopup(`<h3>Magnitude:${feature.properties.mag}</h3>\
          <h3>Location:${feature.properties.place}</h3>\
          <hr><p>${new Date(feature.properties.time)}</p>`);
          }
      })
      createMap(earthquakes);
    });

    function createMap(earthquakes) {

        // var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        // maxZoom: 18,
        // id: 'mapbox.high-contrast',
        // accessToken: API_KEY
        // });

        var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
            accessToken:API_KEY
          });
      
          var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
            accessToken:API_KEY
          });
    
    
        var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
            accessToken: API_KEY
        });
    
        var baseMaps = {
            //"High Contrast": highContrastMap,
            "Satellite": satellite,
            "Gray Scale": darkmap,
            "Outdoors": outdoors
            
        };
        var tectonicplates = new L.LayerGroup();

        var overlayMaps ={
            "Earthquakes": earthquakes,
            "Fault lines": tectonicplates
        };
    
          var myMap = L.map("map", {
              center: [37.09, -95.71],
              zoom: 2.5,
              layers: [outdoors, earthquakes, tectonicplates]
          }); 
    
          d3.json(urlPlates, function(plateData) {
              L.geoJSON(plateData,{
                  color:"gold",
                  weight:2
              })
              .addTo(tectonicplates);
          });
    
          L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
          }).addTo(myMap);
        
//   // Set up the horizontal legend
//   var legend = L.control({ position: "bottomleft" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = [0, 1, 2, 3, 4, 5];
//     //var colors = geojson.options.colors;
//     var labels = [];

    
//     // loop through our density intervals and generate a label with a colored square for each interval
//     // first loop for colored legend boxes
//     //=====anaother style====
//     for (var i = 0; i < limits.length; i++) {
//         div.innerHTML +=
//             '<span style="background:' + Color(limits[i] + 1) + '"></span> ';
//     }

//     // a line break
//     div.innerHTML += '<br>';
//     for (var i = 0; i < limits.length; i++) {
//         div.innerHTML +=
//             '<label>' + limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] : '+') + '</label>';
//     }
    
//     return div;
//   }

//   // Adding legend to the map
//   legend.addTo(myMap);

  
// Set up the vertical legend
var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    var labels = [];
  
    var limits = [0, 1, 2, 3, 4, 5];
    for (var i = 0; i < limits.length; i++) {

            div.innerHTML += 
            labels.push(
                '<span style="background:' + Color(limits[i] + 1) + '"></span> '+
                '<label>' +limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] : '+') + '</label>');

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(myMap);
}; 