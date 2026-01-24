/*
 * M14_history.js
 * Gestió de l'historial de navegació amb l'API de l'historial (History API)
 * @author sergi.grau@fje.edu
 * @version 1.0
 * date 21.01.2026
 * format del document UTF-8
 *
 * REGISTRE DE CANVIS
 * 21.01.2026
  * - programa que mostra com es pot treballar amb la History API
 * OBSERVACIONS
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */

const contingut = document.getElementById('content');
const infoEstat = document.getElementById('stateInfo');

const ESTATS = {
  home: { pagina: 'home', titol: 'Home', missatge: 'Benvingut a la pàgina principal' },
  p1: { pagina: 'p1', titol: 'Pàgina 1', missatge: 'Contingut de la pàgina 1' },
  p2: { pagina: 'p2', titol: 'Pàgina 2', missatge: 'Contingut de la pàgina 2' },
  replaced: { pagina: 'replaced', titol: 'Replaced', missatge: 'URL reemplaçada amb replaceState' }
};

/**
 * Mostra l'estat al DOM i actualitza el títol de la pàgina i la informació d'estat.
 * @param {{pagina:string,titol:string,missatge:string}} estat - estat a renderitzar
 */
function mostraEstat(estat) {
  document.title = estat.titol + ' — M14';
  contingut.innerHTML = `<h2>${estat.titol}</h2><p>${estat.missatge}</p><p><strong>State.pagina:</strong> ${estat.pagina}</p>`;
  infoEstat.textContent = `history.length=${history.length} | location.pathname=${location.pathname} | history.state=${JSON.stringify(history.state)}`;
}

/**
 * Afegeix un nou estat a l'historial i mostra el contingut corresponent.
 * @param {{pagina:string,titol:string,missatge:string}} estat - estat a empènyer
 * @param {string} url - URL que s'afegirà a l'historial
 */
function empitja(estat, url) {
  history.pushState(estat, estat.titol, url);
  mostraEstat(estat);
}

/**
 * Substitueix l'estat actual de l'historial i mostra el contingut corresponent.
 * @param {{pagina:string,titol:string,missatge:string}} estat - estat a substituir
 * @param {string} url - URL que substituirà l'actual
 */
function substitueix(estat, url) {
  history.replaceState(estat, estat.titol, url);
  mostraEstat(estat);
}

document.getElementById('btn-home').addEventListener('click', () => empitja(ESTATS.home, 'M14_history.html'));
document.getElementById('btn-1').addEventListener('click', () => empitja(ESTATS.p1, 'M14_history/page1'));
document.getElementById('btn-2').addEventListener('click', () => empitja(ESTATS.p2, 'M14_history/page2'));
document.getElementById('btn-replace').addEventListener('click', () => substitueix(ESTATS.replaced, 'M14_history/replaced'));

// Gestiona la navegació enrere/endavant (popstate)
window.addEventListener('popstate', (ev) => {
  const estat = ev.state || ESTATS.home;
  mostraEstat(estat);
});

// Inicialitza: si existeix un estat l'utilitza; en cas contrari estableix 'home' amb replaceState
const inicial = history.state || ESTATS.home;
history.replaceState(inicial, inicial.titol, 'M14_history.html');
mostraEstat(inicial);
