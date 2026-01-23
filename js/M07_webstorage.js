/*
 * programa que mostra com es pot treballar amb l'API webstorage
 * @author sergi.grau@fje.edu
 * @version 2.0
 * date 05.12.2016
 * format del document UTF-8
 *
 * CHANGELOG
 * 05.12.2016
 * - programa que mostra com es pot treballar amb l'API webstorage
  * 23.01.2026 actualització codi bones pràctiques
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */
const emmagatzematge = {
    taula: document.getElementById('taula'),
    desar: function() {
        localStorage.setItem(document.getElementById('nom').value,
            document.getElementById('nota').value);
        emmagatzematge.esborrarTaula();
        emmagatzematge.mostrar();
    },
    mostrar: function() {
        for (let i = 0; i < localStorage.length; i++) {
            const fila = taula.insertRow(0);
            fila.insertCell(0).innerHTML = localStorage.key(i);
            fila.insertCell(1).innerHTML = localStorage.getItem(localStorage.key(i));
        };
    },
    esborrarTaula: function() {
        while (taula.rows.length > 0) {
            taula.deleteRow(0);
        }
    },
    esborrarItem: function() {
        localStorage.removeItem(document.getElementById('nom').value);
        emmagatzematge.esborrarTaula();
        emmagatzematge.mostrar();
    },
    netejar: function() {
        localStorage.clear();
        emmagatzematge.esborrarTaula();
        emmagatzematge.mostrar();
    }
}
document.getElementById('desar').addEventListener('click', emmagatzematge.desar, false);
document.getElementById('esborrar').addEventListener('click', emmagatzematge.esborrarItem, false);
document.getElementById('netejar').addEventListener('click', emmagatzematge.netejar, false);
emmagatzematge.mostrar();
