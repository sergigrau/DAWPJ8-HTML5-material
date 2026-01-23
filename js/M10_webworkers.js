/*
 * programa que mostra com es pot treballar amb l'API web workers
 * manipula una imatge en segon pla
 * @author sergi.grau@fje.edu
 * @version 2.0
 * date 21.02.2017
 * format del document UTF-8
 *
 * CHANGELOG
 * 21.02.2017
 * - programa que mostra com es pot treballar amb l'API web workers
  * 23.01.2026 actualització codi bones pràctiques
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */
const imageURL = "imatges/html5.jpeg";
let imatge;
let ctx;
const workers = [];

/**
 * Registra un missatge a la secció de sortida de la pàgina.
 * @param {string} s - Text a mostrar al log (pot contenir HTML bàsic).
 * @returns {void}
 */
function log(s) {
    const sortida = document.getElementById("sortida");
    sortida.innerHTML = s + "<br>" + sortida.innerHTML;
}

/**
 * Assigna l'estat dels botons d'inici/atura segons si s'està executant l'efecte.
 * @param {boolean} p - true si l'efecte està en execució (desactiva el botó d'inici).
 * @returns {void}
 */
function assignarEstatExecucio(p) {
    document.getElementById("inici").disabled = p;
    document.getElementById("atura").disabled = !p;
}

/**
 * Crea i inicialitza un Web Worker amb els manejadors d'esdeveniments.
 * @param {string} src - Ruta del fitxer worker (ex: "js/M10_worker.js").
 * @returns {Worker} - Instància del Worker creada.
 */
function iniciarWorker(src) {
    const worker = new Worker(src);
    worker.addEventListener("message", gestorMissatge, true);
    worker.addEventListener("error", gestorError, true);
    return worker;
}

/**
 * Inicia l'efecte dividint la imatge en parts i assignant cada part a un worker.
 * Llegeix el valor del comptador des del DOM per determinar el nombre de parts.
 * @returns {void}
 */
function iniciarEfecte() {
    const comptador = parseInt(document.getElementById("comptador").value);
    const width = imatge.width / comptador;
    for (let i = 0; i < comptador; i++) {
        const worker = iniciarWorker("js/M10_worker.js");
        worker.index = i;
        worker.width = width;
        workers[i] = worker;
        enviarTascaEfecte(worker, i, width);
    }
    assignarEstatExecucio(true);
}

/**
 * Envia una tasca de processament (blur) al worker amb les dades d'imatge corresponents.
 * @param {Worker} worker - Worker destinat a processar la part.
 * @param {number} i - Índex de la part (0..n-1).
 * @param {number} partAmplada - Amplada en píxels de la part.
 * @returns {void}
 */
function enviarTascaEfecte(worker, i, partAmplada) {
    const partAlcada = imatge.height;
    const partIniciX = i * partAmplada;
    const partIniciY = 0;
    const data = ctx.getImageData(partIniciX, partIniciY, partAmplada, partAlcada).data;
    worker.postMessage({
        'tipus': 'blur',
        'dadesImatge': data,
        'amplada': partAmplada,
        'alcada': partAlcada,
        'iniciX': partIniciX
    });
}

/**
 * Atura tots els workers terminant les instàncies i actualitza l'estat dels controls.
 * @returns {void}
 */
function stopBlur() {
    for (let i = 0; i < workers.length; i++) {
        workers[i].terminate();
    }
    assignarEstatExecucio(false);
}

/**
 * Manejador de missatges entrants des dels workers.
 * Depenent del tipus de missatge actualitza el log, pinta progressos, i re-assigna tasques.
 * @param {MessageEvent} e - Esdeveniment de missatge del Worker.
 * @returns {void}
 */
function gestorMissatge(e) {
    const tipusMissatge = e.data.tipus;
    switch (tipusMissatge) {
        case ("status"):
            log(e.data.statusText);
            break;
        case ("progres"):
            const dadesImatge = ctx.createImageData(e.data.amplada, e.data.alcada);
            for (let i = 0; i < dadesImatge.data.length; i++) {
                let val = e.data.dadesImatge[i];
                if (val === null || val > 255 || val < 0) {
                    log("valor ilegal: " + val + " at " + i);
                    return;
                }
                dadesImatge.data[i] = val;
            }
            ctx.putImageData(dadesImatge, e.data.iniciX, 0);
            enviarTascaEfecte(e.target, e.target.index, e.target.width);
            break;
        default:
            break;
    }
}

/**
 * Manejador d'errors dels workers.
 * Mostra l'error al log de la pàgina.
 * @param {ErrorEvent} e - Esdeveniment d'error del Worker.
 * @returns {void}
 */
function gestorError(e) {
    log("error: " + e.message);
}

/**
 * Carrega la imatge en un canvas creat dinàmicament i prepara les dades per al processament.
 * @param {string} url - Ruta de la imatge a carregar.
 * @returns {void}
 */
function carregarDadesImatge(url) {
    const canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    imatge = new Image();
    imatge.src = url;
    document.getElementById("contenidor").appendChild(canvas);
    imatge.onload = function () {
        canvas.width = imatge.width;
        canvas.height = imatge.height;
        ctx.drawImage(imatge, 0, 0);
        window.imgdata = ctx.getImageData(0, 0, imatge.width, imatge.height);
        n = ctx.createImageData(imatge.width, imatge.height);
        assignarEstatExecucio(false);
        log("imatge carregada: " + imatge.width + "x" + imatge.height + " pixels");
    };
}

/**
 * Inicialitza la lògica de la pàgina: comprova el suport de Web Workers,
 * assigna handlers als botons i carrega la imatge.
 * @returns {void}
 */
function carregar() {
    log("carregant dades imatge");
    if (typeof (Worker) !== "undefined") {
        document.getElementById("status").innerHTML = "El teu navegador suporta HTML5 Web Workers";
        document.getElementById("atura").onclick = stopBlur;
        document.getElementById("inici").onclick = iniciarEfecte;
        carregarDadesImatge(imageURL);
        document.getElementById("inici").disabled = true;
        document.getElementById("atura").disabled = true;
    }
}

window.addEventListener("load", carregar, true);