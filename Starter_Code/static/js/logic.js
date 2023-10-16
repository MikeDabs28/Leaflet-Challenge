//create map
let myMap = L.map('map').setView([40.73, -110.0059], 5);

//create tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//json website from earthquake.gov
const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//d3 for data
d3.json(url).then(function(data){
  //create a leaflet layer group
  let earthquakes = L.layerGroup();
  
  //loop through the data
  data.features.forEach(function(feature) {
    //Coordinates for earthquakes
    let coordinates = feature.geometry.coordinates;
    let latitude = coordinates[1];
    let longitude = coordinates[0];
    let depth = coordinates[2];
    
    //get the magnitude of the earthquake
    let magnitude = feature.properties.mag;
    
    //create a circle marker for the earthquake
    let marker = L.circleMarker([latitude, longitude], {
      radius: magnitude * 5,
      color: "black",
      weight: 1,
      fillColor: depthColor(depth),
      fillOpacity: 0.6
    });
    
    //add a popup to the marker with information about the earthquake
    marker.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
      <strong>Magnitude:</strong> ${magnitude}<br>
      <strong>Depth:</strong> ${depth} km`);
    
    //add the marker to the layer group
    marker.addTo(earthquakes);
  });
  
  //add the layer group to the map
  earthquakes.addTo(myMap);

  //create function to color code depth
function depthColor(depth) {
  return depth > 90 ? '#34000f' :
         depth > 70 ? '#4d0017' :
         depth > 50 ? '#67001e' :
         depth > 30 ? '#800026' :
         depth > 10 ? '#9a002e' :
         depth > -10 ? '#b30035' :
         '#cd003d';
}


  //Add legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90];
    
    div.innerHTML += "<h3 style='text-align: center'>Depth (km)</h3>"

    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + depthColor(depths[i] + 1) + '"></i> ' +
         depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+') + '<br>';
   }
   return div;
};

legend.addTo(myMap)


});