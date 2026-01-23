/*
 * Programa HTML5 que de manera automàtica mostra instantànies d'un vídeo encastat.
 * Utilitza contingut de la xarxa, o un servidor d'streaming
 * @author sergi.grau@fje.edu
 * @version 2.0
 * date 19.01.2017
 * format del document UTF-8
 *
 * CHANGELOG
 * 19.01.2017
 * - programa que mostra com es pot treballar amb l'API video
* 23.01.2026 actualització codi bones pràctiques
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */

 const interval = 5000;

  // Mida de la instantània
  const ampladaInstantania = 100;
  const alturaInstantania = 75;

  // files i columnes del timeline
  const nombreFiles = 4;
  const nombreColumnes = 4;
  const graella = nombreFiles * nombreColumnes;

  // comptador instantania
  let comptadorInstantania = 0;

  // to cancel the timer at end of play
  let intervalId;

  let videoIniciat = false;

  function iniciVideo() {

    // posa en marxa el timer només el primer cop
    if(videoIniciat)
      return;
    videoIniciat = true;

    // calcula una instantania incial i crea la resta segons el timer
    actualitzarCanvas();
    intervalId = setInterval(actualitzarCanvas, interval);

    // manegador per anar al punt del video en funció de la zona del canvas polsada
    const timeline = document.getElementById("timeline");
    timeline.onclick = function(evt) {
      const offX = evt.layerX - timeline.offsetLeft;
      const offY = evt.layerY - timeline.offsetTop;

      // calcula la posició de la graella que s'ha polsat, index zero
      const posicio = Math.floor(offY / alturaInstantania) * frameRows;
      const posicioX = Math.floor(offX / ampladaInstantania);
      let instantaniaSeleccionada = (((Math.floor(comptadorInstantania / graella)) * graella) + posicio + posicioX);

      // arrodoniment en funció d'on es polsa
      if(posicio > (comptadorInstantania % 16))
        instantaniaSeleccionada -= graella;

      // no podem seleccionar valors anteriors a zero
      if(instantaniaSeleccionada < 0)
        return;

      // cerquem el tros de video que correspon
      const video = document.getElementById("movies");
      video.currentTime = instantaniaSeleccionada * tempsActualitzacio / 1000;
      comptadorInstantania = instantaniaSeleccionada;
    }
  }

  // dibuixa una instantània en el canvas
  function actualitzarCanvas() {
    const video = document.getElementById("movies");
    const timeline = document.getElementById("timeline");

    const ctx = timeline.getContext("2d");

    // calcula la posció actual basat en el comptador d'instantanies
    // i dibuixa la imatge a partir del video
    const posicioInstantania = comptadorInstantania % graella;
    const x = (posicioInstantania % nombreColumnes) * ampladaInstantania;
    const y = (Math.floor(posicioInstantania / nombreFiles)) * alturaInstantania;
    ctx.drawImage(video, 0, 0, 400, 300, x, y, ampladaInstantania, alturaInstantania);
    comptadorInstantania++;
  }

  // atura la creació d'instantànies
  function parar() {
    clearInterval(intervalId);
  }
