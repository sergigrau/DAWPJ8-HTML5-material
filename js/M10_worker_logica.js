function determinaRang(i, amplada, alcada) {
	return ((i >= 0) && (i < amplada * alcada * 4));
}

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

function boxBlur(dadesImatge, amplada, alcada) {
	const data = [];
	let val = 0;
	for(let i = 0; i < amplada * alcada * 4; i++) {
		val = calculaZones(dadesImatge, amplada, alcada, i);
		data[i] = val;
	}
	return data;
}