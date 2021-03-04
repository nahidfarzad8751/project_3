// var url = "https://data.sfgov.org/resource/cuks-n6tp.json?$limit=10000";

// let csv_file = "/static/data/data.csv";
// d3.csv(csv_file).then(creatHeatMap);

// function creatHeatMap(data) {
//   //console.log(data);
//   let myMap = createMap();
//   points = data.map((d) => [
//     //console.log(d["Latitude"]),
//     d["Latitude"],
//     d["Longitude"],
//     //d.location.coordinates[1],
//     //d.location.coordinates[0],
//     //L.marker([d["Latitude"], d["Longitude"]]).addTo(myMap),
//   ]);
//   console.log(points);
//   //https://github.com/Leaflet/Leaflet.heat
//   var heat = L.heatLayer(points, { radius: 50, blur: 5 }).addTo(myMap);
//   //var heat = L.marker([33.68845, -84.49328; 33.68845, -84.49326]).addTo(myMap);
// }

// function createMap() {
//   let myMap = L.map("map", {
//     //center: [33.749, 84.388],
//     //zoom: 18,
//   });
//   L.tileLayer(
//     "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
//     {
//       attribution:
//         "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//       tileSize: 512,
//       maxZoom: 18,
//       zoomOffset: -1,
//       id: "mapbox/streets-v11",
//       accessToken: API_KEY,
//     }
//   ).addTo(myMap);
//   return myMap;
// }

var url = "/static/data/data.csv";

d3.csv(url).then(creatHeatMap);

function creatHeatMap(data) {
  console.log(data);
  let myMap = createMap();
  points = data.map((d) => [
    d.location.coordinates[1],
    d.location.coordinates[0],
  ]);
  console.log(points);

  var heat = L.heatLayer(points, { radius: 20, blur: 35 }).addTo(myMap);
}

function createMap() {
  let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 11,
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
