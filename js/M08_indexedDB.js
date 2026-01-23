/*
 * programa que mostra com es pot treballar amb l'API indexedDB
 * @author sergi.grau@fje.edu
 * @version 2.0
 * date 15.12.2016
 * format del document UTF-8
 *
 * CHANGELOG
 * 15.12.2016
 * - programa que mostra com es pot treballar amb l'API indexedDB
  * 23.01.2026 actualització codi bones pràctiques
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */

const DB_VERSION = 21;
const dadesClients = [{
    ssn: "123",
    nom: "Sergi",
    edad: 45,
    email: "sergi.grau@fje.edu"
}, {
    ssn: "456",
    nom: "Joan",
    edad: 32,
    email: "joan@fje.edu"
}];

//no utilitzar var
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
    READ_WRITE: "readwrite"
};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

//la petició d'obertura no crea la DB, retorna de manera asíncrona un IDBOpenDBRequest, amb un objecte exit o error.
const peticioObertura = window.indexedDB.open("DAW2", DB_VERSION);
let db = null;

const emmagatzematge = {
    
    desar: function () {
        const magatzemObjsAlumnes = db.transaction("alumnes", "readwrite").objectStore("alumnes");
        const alumne = {
            'nom': document.getElementById('nom').value, 'nota': document.getElementById('nota').value
        };

        magatzemObjsAlumnes.add(alumne);
        emmagatzematge.esborrarTaula();
        emmagatzematge.mostrar(magatzemObjsAlumnes);

    },
    mostrar: function (magatzemObjsAlumnes) {
        magatzemObjsAlumnes.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const fila = taula.insertRow(0);
                fila.insertCell(0).innerHTML = cursor.key;
                fila.insertCell(1).innerHTML = cursor.value.nota;
                cursor.continue();
            }
        };

    },
    esborrarTaula: function () {
        while (taula.rows.length > 0) {
            taula.deleteRow(0);
        }
    },
    esborrarItem: function () {
        const magatzemObjsAlumnes = db.transaction("alumnes", "readwrite").objectStore("alumnes");
        magatzemObjsAlumnes.delete(document.getElementById('nom').value);
        emmagatzematge.esborrarTaula();
        emmagatzematge.mostrar(magatzemObjsAlumnes);
    },
    netejar: function () {
        emmagatzematge.esborrarTaula();
    }
}
document.getElementById('desar').addEventListener('click', emmagatzematge.desar, false);
document.getElementById('esborrar').addEventListener('click', emmagatzematge.esborrarItem, false);
document.getElementById('netejar').addEventListener('click', emmagatzematge.netejar, false);

peticioObertura.onerror = function (event) {
    alert("Problema!");
};
peticioObertura.onsuccess = function (event) {
    db = event.target.result;
};
peticioObertura.onupgradeneeded = function (event) {
    const db = event.target.result;
    try {
        db.deleteObjectStore("clients");
        db.deleteObjectStore("noms");
        db.deleteObjectStore("alumnes");

    }
    catch (e) {

    }
    // ObjectStore conté la informació sobre els nostres clients. El codi
    // "SSN" es la ruta de la clau perquè es garanteix que sigui única
    const magatzemObjsClients = db.createObjectStore("clients", {
        keyPath: "ssn"
    });

    // un altre magatzem amb autoIncrement com a key generator
    const magatzemObjsNoms = db.createObjectStore("noms", {
        autoIncrement: true
    });

    //  magatzem amb autoIncrement com a key generator per a les notes dels alumnes
    const magatzemObjsAlumnes = db.createObjectStore("alumnes", {
        keyPath: "nom"
    });

    for (const client of dadesClients) {
        magatzemObjsNoms.add(client.nom);
    }

    // Crear un índex per buscar clients pel seu nom. Podem tenir duplicats
    // Així que no podem utilitzar un índex únic.
    magatzemObjsClients.createIndex("nom", "nom", {
        unique: false
    });

    // Crear un índex per buscar clients per correu electrònic. Volem assegurar-nos que
    // No hi ha dos clients tenen el mateix correu electrònic, per tal d'utilitzar un índex únic.
    magatzemObjsClients.createIndex("email", "email", {
        unique: true
    });

    // Utilitzeu la transacció OnComplete per assegurar-se que la creació és ObjectStore
    // Acabat abans d'afegir dades en ell.
        magatzemObjsClients.transaction.oncomplete = function (event) {
        // Emmagatzemar els valors de la magatzemObjsClients acabat de crear.
        const magatzemObjsClients = db.transaction("clients", "readwrite").objectStore("clients");
        for (const client of dadesClients) {
            console.log(client);
            const peticioAdd = magatzemObjsClients.add(client);
        }

        const peticioGet = magatzemObjsClients.get("123");
        peticioGet.onerror = function (event) {

        };
        peticioGet.onsuccess = function (event) {
            console.log("client " + peticioGet.result.nom);
        };

        magatzemObjsClients.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                console.log(cursor.key + " es " + cursor.value.nom);
                cursor.continue();
            }
        };


    };
};

