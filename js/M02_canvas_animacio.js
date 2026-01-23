/*
 * programa que mostra com es pot treballar amb l'API canvas amb animacions
 * @version 2.0
 * date 19.10.2020
 * format del document UTF-8
 *
 * CHANGELOG
 * 19.10.2020
 * - programa que mostra com es pot treballar amb l'API canvas amb animacions
  * 23.01.2026 actualització codi bones pràctiques
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */


 //les animacions no es poden fer amb bucles ens calen periodes de temps

 /*
setInterval(function, delay)
Executa una funció especificada per funció cada delay milisegundos.
setTimeout(function, delay)
Executa una funció especificada per funció dins de delay milisegundos.
requestAnimationFrame(callback)
Comunica al navegador que deseas inicia una animació i requereix que el navegador anomeni a les funcions específiques per actualitzar la mateixa abans de la següent escena.
 */
let sol = new Image();
let lluma = new Image();
let terra = new Image();
function iniciar(){
  sol.src = '../imatges/Canvas_sun.png';
  lluma.src = '../imatges/Canvas_moon.png';
  terra.src = '../imatges/Canvas_earth.png';
  window.requestAnimationFrame(dibuixar);
}

function dibuixar() {
  let ctx = document.getElementById('canvas').getContext('2d');

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0,0,300,300); // limpiar canvas

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.strokeStyle = 'rgba(0,153,255,0.4)';
  ctx.save();
  ctx.translate(150,150);

  // La terra
  let temps = new Date();
  let t= parseInt(document.getElementById('t').value);
  ctx.rotate( ((2*Math.PI)/t)*temps.getSeconds() + ((2*Math.PI)/(t*1000))*temps.getMilliseconds() );
  ctx.translate(105,0);
  ctx.fillRect(0,-12,50,24); // ombra
  ctx.drawImage(terra,-12,-12);

  // La lluna
  ctx.save();
  ctx.rotate( ((2*Math.PI)/6)*temps.getSeconds() + ((2*Math.PI)/6000)*temps.getMilliseconds() );
  ctx.translate(0,28.5);
  ctx.drawImage(lluma,-3.5,-3.5);
  ctx.restore();

  ctx.restore();
  
  ctx.beginPath();
  ctx.arc(150,150,105,0,Math.PI*2,false); // Órbita terrestre
  ctx.stroke();
 
  ctx.drawImage(sol,0,0,300,300);

  window.requestAnimationFrame(dibuixar); //es repeteix cada 60 fps i permet interaccions
}

iniciar();
