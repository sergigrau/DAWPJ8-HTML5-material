/**
 * M15 File API — petites utilitats per gestionar i previsualitzar fitxers
 * Utilitza l'API File i FileReader per mostrar metadades, previsualitzacions
 * i contingut de fitxers arrossegats o seleccionats
 * 
 * @version 1.0
 * date 21.01.2026
 * @author sergi.grau@fje.edu

 */
(function(){
  // Element d'entrada de fitxers
  const fitxerElem = document.getElementById('fitxerElem');
  const zonaArrossegament = document.getElementById('zonaArrossegament');
  const llistaFitxers = document.getElementById('llistaFitxers');

  fitxerElem.addEventListener('change', e => gestionarFitxers(e.target.files));

  ['dragenter','dragover'].forEach(evt => {
    zonaArrossegament.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
      zonaArrossegament.classList.add('dragover');
    });
  });

  ['dragleave','drop'].forEach(evt => {
    zonaArrossegament.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
      zonaArrossegament.classList.remove('dragover');
    });
  });

  zonaArrossegament.addEventListener('drop', e => {
    const transferencia = e.dataTransfer;
    if(!transferencia) return;
    gestionarFitxers(transferencia.files);
  });

  /**
   * Gestiona una col·lecció de fitxers (FileList).
   * Esborra la llista visible i processa cada fitxer cridant `mostraFitxer`.
   * @param {FileList|Array<File>} files
   */
  function gestionarFitxers(files){
    llistaFitxers.innerHTML = '';
    Array.from(files).forEach(file => mostraFitxer(file));
  }

  /**
   * Mostra un fitxer a la llista: metadades, enllaç de descàrrega i
   * previsualització si el tipus ho permet (imatges o text).
   * @param {File} file
   */
  function mostraFitxer(file){
    const elementLi = document.createElement('li');
    const metaInfo = document.createElement('div');
    metaInfo.className = 'meta';
    metaInfo.textContent = `${file.name} — ${formatarBytes(file.size)} — ${file.type || 'n/a'} — ${formatarData(file.lastModified)}`;

    elementLi.appendChild(metaInfo);

    // Enllaç per descarregar una còpia
    const objectURL = URL.createObjectURL(file);
    const enllac = document.createElement('a');
    enllac.href = objectURL;
    enllac.download = file.name;
    enllac.textContent = 'Descarregar copia';
    enllac.style.marginRight = '12px';
    elementLi.appendChild(enllac);

    // Previsualitzacions o contingut segons tipus
    if(file.type.startsWith('image/')){
      const imatge = document.createElement('img');
      imatge.className = 'preview';
      const lector = new FileReader();
      lector.onload = e => imatge.src = e.target.result;
      lector.readAsDataURL(file);
      elementLi.appendChild(imatge);
    } else if(file.type.startsWith('text/') || file.name.match(/\.txt|\.csv|\.json$/i)){
      const preElement = document.createElement('pre');
      preElement.textContent = 'Carregant...';
      const lector = new FileReader();
      lector.onload = e => preElement.textContent = e.target.result;
      lector.onerror = () => preElement.textContent = 'Error llegint el fitxer.';
      lector.readAsText(file, 'utf-8');
      elementLi.appendChild(preElement);
    } else {
      const infoDiv = document.createElement('div');
      infoDiv.textContent = 'Tipus no previsualitzable';
      elementLi.appendChild(infoDiv);
    }

    llistaFitxers.appendChild(elementLi);

    // Revocar object URL quan ja no cal
    enllac.addEventListener('click', () => setTimeout(() => URL.revokeObjectURL(objectURL), 1000));
  }

  /**
   * Format a bytes en una cadena llegible.
   * @param {number} n
   * @returns {string}
   */
  function formatarBytes(n){
    if(n === 0) return '0 B';
    const units = ['B','KB','MB','GB','TB'];
    const i = Math.floor(Math.log(n)/Math.log(1024));
    return (n/Math.pow(1024,i)).toFixed(i?2:0) + ' ' + units[i];
  }

  /**
   * Retorna una data llegible a partir d'un timestamp (ms).
   * @param {number} ms
   * @returns {string}
   */
  function formatarData(ms){
    if(!ms) return '—';
    const d = new Date(ms);
    return d.toLocaleString();
  }
})();
