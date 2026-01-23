/*
 * programa que mostra com es pot treballar amb l'API geolocalitzacio
 * @author sergi.grau@fje.edu
 * @version 1.0
 * date 19.01.2017
 * format del document UTF-8
 *
 * CHANGELOG
 * 19.01.2017
 * - programa que mostra com es pot treballar amb l'API geolocalitzacio
 *
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */

let trackerId = 0;
let geocoder;
let usuari = {};
let mapa = {};

function iniciar() {
  geocoder = new google.maps.Geocoder();
    if (navigator.geolocation) {
    const geolocalitzacio = navigator.geolocation;
    geolocalitzacio.getCurrentPosition(function (pos) {
      const latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      const opts = {
        zoom: 12,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      mapa = new google.maps.Map(document.getElementById("mapa"), opts);
      usuari = new google.maps.Marker({
        position: latLng,
        map: mapa,
        title: "Tu!"
      });
      mostrarLocalitzacio(pos);
    });
  }
}

function mostrarLocalitzacio(pos) {
  const latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
  if (geocoder) {
    geocoder.geocode({
      'latLng': latLng
    }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          alert(results[1].formatted_address);
        }
      }
    });
  }
}

function stopTracking() {
  if (trackerId) {
    navigator.geolocation.clearWatch(trackerId);
  }
}
window.addEventListener("load", iniciar, true);
