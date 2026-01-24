/*
 * programa que mostra com es pot treballar amb Firebase
 * @author sergi.grau@fje.edu
 * @version 1.0
 * date 10.05.2021
 * format del document UTF-8
 *
 * CHANGELOG
 * date 10.05.2021
 * - https://firebase.google.com/docs/firestore/
 *
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */

const firebaseConfig = {
    apiKey: "",
    authDomain: "daw21-2f51e.firebaseapp.com",
    projectId: "daw21-2f51e",
    storageBucket: "<completa amb el teu id>.appspot.com",
    messagingSenderId: "<completa amb el teu id>",
    appId: "<completa amb el teu id>"
};
// inicialitzar Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();


const emmagatzematge = {
    taula: document.getElementById('taula'),
    desar: function () {
        /* Aquesta és una opció que genera un ID propi
                db.collection("usuaris")add({
                    nom: document.getElementById('nom').value,
                    nota:  document.getElementById('nota').value
                
                })
                    .then((docRef) => {
                        console.log("Document escrit amb ID: ", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error afegint document: ", error);
                    });
        */
        db.collection("usuaris").doc(document.getElementById('nom').value).set({
            nom: document.getElementById('nom').value,
            nota: parseInt(document.getElementById('nota').value)
        })
            .then(() => {
                console.log("Document desat!");
            })
            .catch((error) => {
                console.error("Error escrivint document: ", error);
            });
        emmagatzematge.esborrarTaula();
        emmagatzematge.mostrar();
    },
    mostrar: function () {
        
        db.collection("usuaris").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const fila = taula.insertRow(0);
                fila.insertCell(0).innerHTML = doc.id;
                fila.insertCell(1).innerHTML = doc.data().nota;
            });
        });
            
    },
    esborrarTaula: function () {
        while (taula.rows.length > 0) {
            taula.deleteRow(0);
        }
    },
    esborrarItem: function () {
        db.collection("usuaris").doc(document.getElementById('nom').value).delete().then(() => {
            console.log("Document esborrat!");
        }).catch((error) => {
            console.error("Error esborrant document: ", error);
        });
        emmagatzematge.esborrarTaula();
        emmagatzematge.mostrar();
    },
    netejar: function () {
        db.collection("usuaris").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("usuaris").doc(doc.id).delete().then(() => {
                    console.log("Document esborrat!");
                }).catch((error) => {
                    console.error("Error esborrant document: ", error);
                });
            });
        });
        emmagatzematge.esborrarTaula();
        emmagatzematge.mostrar();
    },
    filtrar: function () {
        emmagatzematge.esborrarTaula();
        db.collection("usuaris").where("nota", ">", parseInt(document.getElementById('nota').value)).
        get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id);
                const fila = taula.insertRow(0);
                fila.insertCell(0).innerHTML = doc.id;
                fila.insertCell(1).innerHTML = doc.data().nota;
            });
        });
    }
}
document.getElementById('desar').addEventListener('click', emmagatzematge.desar, false);
document.getElementById('esborrar').addEventListener('click', emmagatzematge.esborrarItem, false);
document.getElementById('netejar').addEventListener('click', emmagatzematge.netejar, false);
document.getElementById('filtrar').addEventListener('click', emmagatzematge.filtrar, false);
emmagatzematge.mostrar();
