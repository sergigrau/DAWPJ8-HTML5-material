importScripts("M10_worker_logica.js");

/**
 * Envia un missatge d'estat al thread principal.
 * @param {string} statusText - Text descriptiu de l'estat actual del worker.
 * @returns {void}
 */
function enviarEstat(statusText) {
    postMessage({
        "tipus" : "status",
        "statusText" : statusText
    });
}

/**
 * Gestor de missatges entrants al worker.
 * Interpreta el tipus de missatge i executa l'acció corresponent.
 * - "blur": aplica l'efecte boxBlur a les dades d'imatge rebudes i envia el resultat.
 * - altres: envia un missatge d'estat amb la dada rebuda.
 * @param {MessageEvent} e - Esdeveniment de missatge (conté `data` amb la tasca).
 *   Espera a `e.data` propietats com `tipus`, `dadesImatge`, `amplada`, `alcada`, `iniciX`.
 * @returns {void}
 */
function gestorMissatge(e) {
    const tipusMissatge = e.data.tipus;
    switch (tipusMissatge) {
        case ("blur"):
            enviarEstat("Worker treballant en el rang: " + e.data.iniciX + "-" + (e.data.iniciX + e.data.amplada));
            let dadesImatge = e.data.dadesImatge;
            dadesImatge = boxBlur(dadesImatge, e.data.amplada, e.data.alcada, e.data.iniciX);
            postMessage({
                "tipus" : "progres",
                "dadesImatge" : dadesImatge,
                "amplada" : e.data.amplada,
                "alcada" : e.data.alcada,
                "iniciX" : e.data.iniciX
            });
            enviarEstat("acabat efecte en el rang: " + e.data.iniciX + "-" + (e.data.amplada + e.data.iniciX));
            break;
        default:
            enviarEstat("Worker: " + e.data);
    }
}

/**
 * Registra el gestor de missatges per rebre tasques des del thread principal.
 * L'últim paràmetre `true` indica captura; es manté com a en l'original.
 */
addEventListener("message", gestorMissatge, true);