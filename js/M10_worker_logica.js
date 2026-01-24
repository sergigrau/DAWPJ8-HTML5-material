/**
 * Comprova si l'índex d'un canal està dins del rang de dades de la imatge.
 * @param {number} i - índex a comprovar
 * @param {number} amplada - amplada de la imatge en píxels
 * @param {number} alcada - alçada de la imatge en píxels
 * @returns {boolean} true si l'índex és vàlid
 */
function determinaRang(i, amplada, alcada) {
	return ((i >= 0) && (i < amplada * alcada * 4));
}

/**
 * Calcula el nou valor d'un canal aplicant un box blur amb els vuit veïns.
 * Si un veí no existeix s'utilitza el mateix valor central.
 * @param {Uint8ClampedArray|Array<number>} dadesImatge - array de canals RGBA
 * @param {number} amplada - amplada de la imatge en píxels
 * @param {number} alcada - alçada de la imatge en píxels
 * @param {number} i - índex del canal a processar
 * @returns {number} nou valor del canal (enter)
 */
function calculaZones(dadesImatge, amplada, alcada, i) {
	const v = dadesImatge[i];
    
	const north = determinaRang(i - amplada * 4, amplada, alcada) ? dadesImatge[i - amplada * 4] : v;
	const south = determinaRang(i + amplada * 4, amplada, alcada) ? dadesImatge[i + amplada * 4] : v;
	const west = determinaRang(i - 4, amplada, alcada) ? dadesImatge[i - 4] : v;
	const east = determinaRang(i + 4, amplada, alcada) ? dadesImatge[i + 4] : v;
    
	const ne = determinaRang(i - amplada * 4 + 4, amplada, alcada) ? dadesImatge[i - amplada * 4 + 4] : v;
	const nw = determinaRang(i - amplada * 4 - 4, amplada, alcada) ? dadesImatge[i - amplada * 4 - 4] : v;
	const se = determinaRang(i + amplada * 4 + 4, amplada, alcada) ? dadesImatge[i + amplada * 4 + 4] : v;
	const sw = determinaRang(i + amplada * 4 - 4, amplada, alcada) ? dadesImatge[i + amplada * 4 - 4] : v;
    
	const newVal = Math.floor((north + south + east + west + se + sw + ne + nw + v) / 9);
	if(isNaN(newVal)) {
		enviarEstat("valor incorrecte " + i + " per alçada " + alcada);
		throw new Error("NaN");
	}
	return newVal;
}

/**
 * Aplica un box blur a tota la imatge i retorna un nou array de dades.
 * @param {Uint8ClampedArray|Array<number>} dadesImatge - array de canals RGBA
 * @param {number} amplada - amplada de la imatge en píxels
 * @param {number} alcada - alçada de la imatge en píxels
 * @returns {Array<number>} nou array amb els valors difuminats
 */
function boxBlur(dadesImatge, amplada, alcada) {
	const data = [];
	let val = 0;
	for(let i = 0; i < amplada * alcada * 4; i++) {
		val = calculaZones(dadesImatge, amplada, alcada, i);
		data[i] = val;
	}
	return data;
}