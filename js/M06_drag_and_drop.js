/*
 * programa que mostra com es pot treballar amb l'API D&D
 * es un programa que permet jugar al 3 en ratlla
 * @author sergi.grau@fje.edu
 * @version 2.0
 * date 25.12.2016
 * format del document UTF-8
 *
 * CHANGELOG
 * 25.12.2016
 * - programa que mostra com es pot treballar amb l'API D&D
  * 23.01.2026 actualització codi bones pràctiques
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */
 window.onload = function () {

     const tds = document.querySelectorAll('td');
     [].forEach.call(tds, function (item) {
         item.addEventListener('dragover', gestionarSobreDrag, false);
         item.addEventListener('drop', gestionarDrop, false);

     });

     const imatges = document.querySelectorAll('img');
     [].forEach.call(imatges, function (item) {
         item.addEventListener('dragstart', gestionarIniciDrag, false);
     });

     function gestionarSobreDrag(ev) {
         ev.preventDefault();
     }

     function gestionarIniciDrag(ev) {
         ev.dataTransfer.setData("imatge", ev.target.id);
     }

     function gestionarDrop(ev) {
         ev.preventDefault();
         const data = ev.dataTransfer.getData("imatge");
         if (this.childNodes.length < 1) {
             ev.target.appendChild(document.getElementById(data).cloneNode(true));
         }

     }

 };
