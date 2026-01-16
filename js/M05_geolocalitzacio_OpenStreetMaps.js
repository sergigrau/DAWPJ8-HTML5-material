/*
 * programa que mostra com es pot treballar amb l'API geolocalitzacio
 * i openStreetMaps
 * @author sergi.grau@fje.edu
 * @version 1.0
 * date 03.11.2020
 * format del document UTF-8
 *
 * CHANGELOG
 * 03.11.2020
 * - programa que mostra com es pot treballar amb l'API geolocalitzacio
 * https://geoadmin.github.io/ol3/apidoc/ol.style.Style.html
 *
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */




function iniciar() {
  var view = new ol.View({
    center: ol.proj.fromLonLat([0, 0]),
    zoom: 2
  });

  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'mapa', // ha de coincidir amb l'id del div
    view: view
  });

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      var coords = [pos.coords.longitude, pos.coords.latitude];
      var position = ol.proj.fromLonLat(coords);
      view.setCenter(position);
      view.setZoom(15);

      var marker = new ol.Feature({
        geometry: new ol.geom.Point(position)
      });
      var vectorSource = new ol.source.Vector({
        features: [marker]
      });
      var markerStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({ color: 'red' }),
          stroke: new ol.style.Stroke({ color: 'white', width: 2 })
        })
      });
      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: markerStyle
      });
      map.addLayer(vectorLayer);
    }, function (err) {
      alert('No s\'ha pogut obtenir la teva localització.');
    });
  } else {
    alert('El teu navegador no suporta la geolocalització.');
  }
}



window.addEventListener("load", iniciar, true);
