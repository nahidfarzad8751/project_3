var url = "https://data.sfgov.org/resource/cuks-n6tp.json?$limit=10000";

//d3.json(url).then(creatHeatMap);
let csv_file = "/static/data/data.csv";
d3.csv(csv_file).then(creatHeatMap);
//d3.json(url).then(creatHeatMap);
// console.log("FUCKS");
// d3.csv("/static/data/data.csv", function (Data) {
//   console.log("asdasdas");
//   console.log(Data);
//   for (var i = 0; i < Data.length; i++) {
//     //console.log(data[i]);
//     console.log("LOL");
//   }
// });

function creatHeatMap(data) {
  //console.log(data);
  let myMap = createMap();
  points = data.map((d) => [
    //console.log(d["Latitude"]),
    d["Latitude"],
    d["Longitude"],
    //d.location.coordinates[1],
    //d.location.coordinates[0],
    //L.marker([d["Latitude"], d["Longitude"]]).addTo(myMap),
  ]);
  console.log(points);
  //https://github.com/Leaflet/Leaflet.heat
  var heat = L.heatLayer(points, { radius: 5, blur: 5 }).addTo(myMap);
  //var heat = L.marker([33.68845, -84.49328; 33.68845, -84.49326]).addTo(myMap);
}

function createMap() {
  let myMap = L.map("map", {
    center: [33.68845, -84.49328],
    zoom: 13,
  });
  L.tileLayer(
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
  ).addTo(myMap);
  return myMap;
}

// d3.csv(csv_file).then(creatMarkerMap);
// function creatMarkerMap(data) {
//   //console.log(data);
//   let myMap = createMap();
//   points = data.map((d) => [
//     //console.log(d["Latitude"]),
//     d["Latitude"],
//     d["Longitude"],
//   ]);
//   // var heat = L.heatLayer(points, { radius: 5, blur: 5 }).addTo(myMap);
//   L.marker(points).addTo(myMap);
// }

// d3.csv(csv_file, function (response) {
//   console.log(response);

//   for (var i = 0; i < response.length; i++) {
//     var location = response[i].location;

//     if (location) {
//       L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
//     }
//   }
// });
