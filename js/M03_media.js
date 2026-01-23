/*
 * programa que mostra com es pot treballar amb l'API audio
 * @author sergi.grau@fje.edu
 * @version 2.0
 * date 19.01.2017
 * format del document UTF-8
 *
 * CHANGELOG
 * 19.01.2017
 * - programa que mostra com es pot treballar amb l'API audio
 * 23.01.2026 actualització codi bones pràctiques
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */

window.onload = function () {
  document.getElementById('estat').addEventListener('click', canviaEstat, true);
  document.getElementById('inici').addEventListener('click', anarInici, true);
  document.getElementById('final').addEventListener('click', anarFinal, true);
  const media = document.getElementById("media");
  const estat = document.getElementById("estat");
  const temps = document.getElementById("temps");
  inici();


  function inici() {
    media.addEventListener("load", function () {
      media.play();
      temps.innerHTML = media.duration;

    });
  }

  function canviaEstat() {
    if (media.paused) {
      media.play();
      estat.innerHTML = "Pausa";
    } else {
      media.pause();
      estat.innerHTML = "Reproducció";
    }
  }

  function anarInici() {
    media.currentTime = 0;
  }

  function anarFinal() {
    media.currentTime = media.duration;
  }

  setInterval(mostraTemps, 1000);

  function mostraTemps() {
    temps.innerHTML = media.currentTime;
  }
}


