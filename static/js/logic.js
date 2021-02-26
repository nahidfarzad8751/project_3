//https://gist.github.com/nickpeihl/b6d09258bed0cafdd653de2278f96c17

//console.log(FEATURE);
//let FEATURE = "Happiness_Score";
// Family
// Freedom// Currently all zeroes
// Happiness_Rank
// Happiness_Score
// Health
// Trust
//console.log("RANDOM TEST");

var map = L.map("map").setView([37.8, -96], 3);

var satellitemap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY,
  }
).addTo(map);

var streetsmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
).addTo(map);

var darkmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY,
  }
).addTo(map);

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Satellite Map": satellitemap,
  "Streets Map": streetsmap,
  "Dark Map": darkmap,
};

L.control.layers(baseMaps).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML =
    "<h4>World Happiness Feature of Interest</h4>" +
    (props
      ? "<b>" + props.name + "</b><br />" + FEATURE + ": " + props[FEATURE]
      : //" people / mi<sup>2</sup>"
        "Hover over a state");
};

info.addTo(map);

// get color depending on population density value
function getColorFeatureOpacity(d) {
  return d < 0.001 ? 1 : 1; //condition ? exprIfTrue : exprIfFalse
}

//https://stackoverflow.com/questions/22949597/getting-max-values-in-json-array
function getMaxMin(arr, prop) {
  var max;
  var min;
  console.log(`The property being looped is: ${prop}`);
  //console.log(arr.length);
  for (var i = 0; i < arr.length - 1; i++) {
    if (max == null || parseInt(arr[i].properties[prop]) >= parseInt(max))
      max = arr[i].properties[prop];
    max_dict = arr[i].properties;
    if (min == null || parseInt(arr[i].properties[prop]) < parseInt(min))
      min = arr[i].properties[prop];
    min_dict = arr[i].properties;
    //console.log(max_dict.Health);
  }
  // min = min_dict[FEATURE];
  // max = max_dict[FEATURE];
  console.log(typeof max, prop, "LOLOLOLOL");
  console.log(`$The max Value for the ${prop} feature is: ${max}`);
  console.log(`$The max Object for the ${prop} feature is: `, max_dict);

  console.log(`$The min Value for the ${prop} feature is: ${min}`);
  console.log(`$The min Object for the ${prop} feature is: `, min_dict);

  return [min, max];
}
var [Min, Max] = getMaxMin(statesData.features, FEATURE);

console.log(Min, Max);
// https://gka.github.io/chroma.js/
// Can now create a more useful and relavent scale for coloring that is relative to the desired feature size

function getColorofFeature(d) {
  scale = chroma
    .scale(["red", "blue", "green"])
    .domain([Min, Max], 10, "quantiles");
  //console.log(d);
  return d == null ? chroma("black").darken().hex() : scale(d).hex();
  //condition ? exprIfTrue : exprIfFalse
}
//Overall border and color styling
function style(feature) {
  //console.log(feature);
  return {
    weight: 2,
    opacity: 1,
    color: "white", //border color
    dashArray: "4",
    fillOpacity: getColorFeatureOpacity(feature.properties[FEATURE]), // 0.7,
    fillColor: getColorofFeature(feature.properties[FEATURE]),
  };
  //console.log(feature);
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.9,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

geojson = L.geoJson(statesData, {
  //console.log(statesData)
  //System.out.println('statesData')
  style: style, //A Function defining the Path options for styling GeoJSON lines and polygons, called internally when data is added
  onEachFeature: onEachFeature, //A Function that will be called once for each created Feature, after it has been created and styled
}).addTo(map);

// map.attributionControl.addAttribution(
//   'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>'
// );

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = range(0, 8, Min, Max), //[0, 0.1, 0.2, 0.5, 0.1, 0.2, 0.5, 0.1],
    labels = [],
    from,
    to;

  for (var i = 0; i < grades.length - 1; i++) {
    to = grades[i];
    from = grades[i + 1];
    //console.log(typeof from);
    console.log(`From: ${from.toFixed(3)}, To: ${to.toFixed(3)}`);
    labels.push(
      '<i style="background:' +
        scale(from).hex() +
        '"></i> ' +
        from.toFixed(3) +
        "--" +
        to.toFixed(3)
      //from.toFixed(2)
      //from +
      //(to ? "&ndash;" + to : "+")
    );
  }

  div.innerHTML = labels.join("<br>");
  return div;
};

legend.addTo(map);

//Use this to create based on Max and Min
// Should match the number of quantiles used in the scale command for coloring
function range(start, end, Min, Max) {
  var ans = [0];
  var inc = Max / (end + 1);
  for (let i = start; i <= end; i++) {
    ans.push(i * inc + inc);
    //console.log(i);
  }
  //ans.push(0);
  //console.log(ans);
  return ans.reverse();
}

featureScaleArray = range(0, 8, Min, Max);
//console.log(featureScaleArray);
