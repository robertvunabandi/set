'use strict';

SETS.HLP.SYMBOL = {};

/* these are functions which that expect the color
value and card id. The number of symbols can be
duplicated manually. */
SETS.HLP.SYMBOL.__LOSENGES = {
	0: function SVG00(color_value, card_id) {
		let symbol = new StringBuffer(),
		    colorHex = SETS.HLP.hexColors[SETS.HLP.__possibleColors[color_value]];
		symbol.append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48">`);
		symbol.append(`<polygon class="svg${color_value}00" points="12 6 2 24 12 42 22 24 12 6"/>`);
		symbol.append(`</svg>`);
		return symbol.toString();
	},
	1: function SVG01(color_value, card_id) {
		let symbol = new StringBuffer(),
		    colorHex = SETS.HLP.hexColors[SETS.HLP.__possibleColors[color_value]];
		symbol.append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48">`);

		symbol.append(`<g>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="4.8 18.96 19.2 18.96 18.65 17.98 5.35 17.98 4.8 18.96"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="2.58 22.96 21.42 22.96 20.88 21.98 3.12 21.98 2.58 22.96"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="10.31 38.96 13.69 38.96 14.23 37.98 9.77 37.98 10.31 38.96"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="3.7 20.94 20.3 20.94 19.78 20 4.22 20 3.7 20.94"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="12 42 12.01 41.98 11.99 41.98 12 42"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="11.41 40.94 12.59 40.94 13.11 40 10.89 40 11.41 40.94"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="5.92 16.94 18.08 16.94 17.59 16.06 6.41 16.06 5.92 16.94"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="6.99 15.02 17.01 15.02 16.47 14.04 7.53 14.04 6.99 15.02"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="4.74 28.94 19.26 28.94 19.78 28 4.22 28 4.74 28.94"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="5.87 30.96 18.13 30.96 18.68 29.98 5.32 29.98 5.87 30.96"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="9.19 36.94 14.81 36.94 15.33 36 8.67 36 9.19 36.94"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="3.65 26.96 20.36 26.96 20.9 25.98 3.1 25.98 3.65 26.96"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="8.09 34.96 15.91 34.96 16.46 33.98 7.54 33.98 8.09 34.96"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="2.52 24.94 21.48 24.94 22 24 2 24 2.52 24.94"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="10.33 9 13.67 9 13.15 8.06 10.85 8.06 10.33 9"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="6.96 32.94 17.04 32.94 17.56 32 6.44 32 6.96 32.94"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="9.21 11.02 14.79 11.02 14.24 10.04 9.76 10.04 9.21 11.02"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="11.43 7.02 12.57 7.02 12.02 6.04 11.98 6.04 11.43 7.02"/>`);
		symbol.append(`<polygon class="svg${color_value}01-i" points="8.11 13 15.89 13 15.37 12.06 8.63 12.06 8.11 13"/>`);
		symbol.append(`</g>`);

		symbol.append(`<g>`);
		symbol.append(`<polygon class="svg${color_value}01-o" points="12 6 2 24 12 42 22 24 12 6"/>`);
		symbol.append(`</g>`);

		symbol.append(`</svg>`);
		return symbol.toString();
	},
	2: function SVG02(color_value, card_id) {
		let symbol = new StringBuffer(),
		    colorHex = SETS.HLP.hexColors[SETS.HLP.__possibleColors[color_value]];
		symbol.append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48">`);

		symbol.append(`<polygon class="svg${color_value}02" points="12 6 2 24 12 42 22 24 12 6"/>`);
		symbol.append(`</svg>`);
		return symbol.toString();
	},
};
SETS.HLP.SYMBOL.__OVALS = {
	0: function SVG10(color_value, card_id) {
		let symbol = new StringBuffer(),
		    colorHex = SETS.HLP.hexColors[SETS.HLP.__possibleColors[color_value]];
		symbol.append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48">`);

		symbol.append(`<path class="svg${color_value}10" d="M2,32a10,10,0,0,0,20,0V16A10,10,0,0,0,2,16Z"/>`);
		symbol.append(`</svg>`);
		return symbol.toString();
	},
	1: function SVG11(color_value, card_id) {
		let symbol = new StringBuffer(),
		    colorHex = SETS.HLP.hexColors[SETS.HLP.__possibleColors[color_value]];
		symbol.append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48">`);

		symbol.append(`<g>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M12,42a10.08,10.08,0,0,0,1.12-.07H10.88A10.08,10.08,0,0,0,12,42Z"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M3.28,36.89H20.72a9.94,9.94,0,0,0,.47-.94H2.82A9.94,9.94,0,0,0,3.28,36.89Z"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M4.79,38.92H19.21a10,10,0,0,0,.83-1H4A10,10,0,0,0,4.79,38.92Z"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M2.44,34.92H21.56a9.94,9.94,0,0,0,.24-1H2.19A9.94,9.94,0,0,0,2.44,34.92Z"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M7.44,40.89h9.11A10,10,0,0,0,18,40H6A10,10,0,0,0,7.44,40.89Z"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M2,32c0,.3,0,.6,0,.89H22c0-.3,0-.59,0-.89v0H2Z"/>`);
		symbol.append(`<rect class="svg${color_value}11-i" x="2" y="19.96" width="20" height="0.94"/>`);
		symbol.append(`<rect class="svg${color_value}11-i" x="2" y="23.96" width="20" height="0.94"/>`);
		symbol.append(`<rect class="svg${color_value}11-i" x="2" y="21.93" width="20" height="0.98"/>`);
		symbol.append(`<rect class="svg${color_value}11-i" x="2" y="16.02" width="20" height="0.88"/>`);
		symbol.append(`<rect class="svg${color_value}11-i" x="2" y="17.93" width="20" height="0.98"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M4.9,9H19.1A10,10,0,0,0,18,8H6A10,10,0,0,0,4.9,9Z"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M12,6A9.94,9.94,0,0,0,7.7,7H16.3A9.94,9.94,0,0,0,12,6Z"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M2.05,15h19.9q-.05-.5-.15-1H2.2Q2.1,14.48,2.05,15Z"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M2.47,13H21.53a9.92,9.92,0,0,0-.35-.94H2.83A9.92,9.92,0,0,0,2.47,13Z"/>`);
		symbol.append(`<path class="svg${color_value}11-i" d="M3.36,11H20.64A10,10,0,0,0,20,10H4A10,10,0,0,0,3.36,11Z"/>`);
		symbol.append(`<rect class="svg${color_value}11-i" x="2" y="29.93" width="20" height="0.98"/>`);
		symbol.append(`<rect class="svg${color_value}11-i" x="2" y="25.93" width="20" height="0.98"/>`);
		symbol.append(`<rect class="svg${color_value}11-i" x="2" y="27.96" width="20" height="0.94"/>`);
		symbol.append(`</g>`);

		symbol.append(`<g id="oval">`);
		symbol.append(`<path class="svg${color_value}11-o" d="M2,32a10,10,0,0,0,20,0V16A10,10,0,0,0,2,16Z"/>`);
		symbol.append(`</g>`);

		symbol.append(`</svg>`);
		return symbol.toString();
	},
	2: function SVG12(color_value, card_id) {
		let symbol = new StringBuffer(),
		    colorHex = SETS.HLP.hexColors[SETS.HLP.__possibleColors[color_value]];
		symbol.append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48">`);

		symbol.append(`<path class="svg${color_value}12" d="M2,32a10,10,0,0,0,20,0V16A10,10,0,0,0,2,16Z"/>`);

		symbol.append(`</svg>`);
		return symbol.toString();
	},
};
SETS.HLP.SYMBOL.__INTERIORS = {
	0: function SVG20(color_value, card_id) {
		let symbol = new StringBuffer(),
		    colorHex = SETS.HLP.hexColors[SETS.HLP.__possibleColors[color_value]];
		symbol.append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48">`);

		symbol.append(`<path class="svg${color_value}20" d="M4.5,12.75C4.5,9.5,8.69,6,13.25,6c6.63,0,8.62,3.36,8.62,5.08,0,2.34-4.87,5.08-4.87,12.79,0,4.21,2.58,6.54,2.5,11.13-.06,3.25-4.19,6.75-8.75,6.75-6.62,0-8.62-3.36-8.62-5.08C2.13,34.33,7,31.92,7,23.88,7,19.5,4.5,17.17,4.5,12.75Z"/>`);

		symbol.append(`</svg>`);
		return symbol.toString();
	},
	1: function SVG21(color_value, card_id) {
		let symbol = new StringBuffer(),
		    colorHex = SETS.HLP.hexColors[SETS.HLP.__possibleColors[color_value]];
		symbol.append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48">`);

		symbol.append(`<g>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M2.92,34.9H19.5c0-.34,0-.67,0-1H3.62C3.36,34.27,3.13,34.59,2.92,34.9Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M5.45,40.88H15a10,10,0,0,0,1.55-.94H3.91A7.25,7.25,0,0,0,5.45,40.88Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M2.13,36.79s0,.05,0,.08h17a5,5,0,0,0,.3-.94H2.33A2.2,2.2,0,0,0,2.13,36.79Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M2.92,38.9H17.7a7.78,7.78,0,0,0,.8-1H2.36A4.5,4.5,0,0,0,2.92,38.9Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M5.91,18.9H17.83q.18-.51.38-1H5.55Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M5.19,16.88H18.7q.24-.46.49-.87H4.93C5,16.3,5.1,16.59,5.19,16.88Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M6.56,20.88H17.3c.06-.32.13-.64.21-.94H6.28C6.38,20.24,6.48,20.56,6.56,20.88Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M4.7,15H19.84l.67-1h-16Q4.61,14.48,4.7,15Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M7,24c0,.3,0,.58,0,.87H17c0-.29,0-.58,0-.88,0,0,0,0,0-.06H7S7,24,7,24Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M6.94,22.9H17c0-.34.06-.66.1-1H6.8Q6.89,22.39,6.94,22.9Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M5,11H21.85a3.38,3.38,0,0,0-.27-1h-16A6.34,6.34,0,0,0,5,11Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M13.25,6.13A9.69,9.69,0,0,0,9.38,7H18.2A13.13,13.13,0,0,0,13.25,6.13Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M4.5,12.88s0,0,0,.06H21.21A5.64,5.64,0,0,0,21.7,12H4.61A4.09,4.09,0,0,0,4.5,12.88Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M6.43,8.94H21A5.65,5.65,0,0,0,20,8H7.55A9.27,9.27,0,0,0,6.43,8.94Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M6.76,26.9H17.41c-.09-.32-.16-.65-.22-1H6.89C6.86,26.25,6.82,26.58,6.76,26.9Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M4.34,32.88h15q-.09-.48-.2-.94H4.93C4.73,32.27,4.54,32.58,4.34,32.88Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M6.29,28.88H18.08q-.17-.47-.34-.94H6.56C6.48,28.26,6.39,28.57,6.29,28.88Z"/>`);
		symbol.append(`<path class="svg${color_value}21-i" d="M5.49,30.9H18.81q-.16-.5-.34-1H5.93C5.79,30.26,5.64,30.59,5.49,30.9Z"/>`);
		symbol.append(`</g>`);

		symbol.append(`<g>`);
		symbol.append(`<path class="svg${color_value}21-o" d="M4.5,12.75C4.5,9.5,8.69,6,13.25,6c6.63,0,8.62,3.36,8.62,5.08,0,2.34-4.87,5.08-4.87,12.79,0,4.21,2.58,6.54,2.5,11.13-.06,3.25-4.19,6.75-8.75,6.75-6.62,0-8.62-3.36-8.62-5.08C2.13,34.33,7,31.92,7,23.88,7,19.5,4.5,17.17,4.5,12.75Z"/>`);
		symbol.append(`</g>`);

		symbol.append(`</svg>`);
		return symbol.toString();
	},
	2: function SVG22(color_value, card_id) {
		let symbol = new StringBuffer(),
		    colorHex = SETS.HLP.hexColors[SETS.HLP.__possibleColors[color_value]];
		symbol.append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48">`);

		symbol.append(`<path class="svg${color_value}22" d="M4.5,12.75C4.5,9.5,8.69,6,13.25,6c6.63,0,8.62,3.36,8.62,5.08,0,2.34-4.87,5.08-4.87,12.79,0,4.21,2.58,6.54,2.5,11.13-.06,3.25-4.19,6.75-8.75,6.75-6.62,0-8.62-3.36-8.62-5.08C2.13,34.33,7,31.92,7,23.88,7,19.5,4.5,17.17,4.5,12.75Z"/>`);

		symbol.append(`</svg>`);
		return symbol.toString();
	},
};

SETS.HLP.SYMBOL.__getLosengeInteriors = function(){
	return SETS.HLP.SYMBOL.__LOSENGES;
};
SETS.HLP.SYMBOL.__getOvalInteriors = function(){
	return SETS.HLP.SYMBOL.__OVALS;
};
SETS.HLP.SYMBOL.__getSquiggleInteriors = function(){
	return SETS.HLP.SYMBOL.__INTERIORS;
};
SETS.HLP.SYMBOL.__getSymbolShapeInteriors = function(shape_value) {
	switch (shape_value) {
		case 0:
			return SETS.HLP.SYMBOL.__getLosengeInteriors();
		case 1:
			return SETS.HLP.SYMBOL.__getOvalInteriors();
		case 2:
			return SETS.HLP.SYMBOL.__getSquiggleInteriors();
		default:
			throw new Error('Invalid shape_value');
	}
};
SETS.HLP.SYMBOL.__getSymbolInteriorAndShape = function(shape_value, interior_value) {
	return SETS.HLP.SYMBOL.__getSymbolShapeInteriors(shape_value)[interior_value];
};

/* This returns just one symbol. In case the number is 2 or 3
the symbol still needs to be duplicated. */
SETS.HLP.SYMBOL.getHTMLSymbol = function(color_value, shape_value, interior_value, number_value) {
	let card_id = `sets-card-${color_value}${shape_value}${interior_value}${number_value}`,
	    symbol, result = "", count;

	SETS.HLP.assertValueIsValid(color_value);
	SETS.HLP.assertValueIsValid(shape_value);
	SETS.HLP.assertValueIsValid(interior_value);
	SETS.HLP.assertValueIsValid(number_value);

	symbol = SETS.HLP.SYMBOL.__getSymbolInteriorAndShape(shape_value, interior_value)(color_value, card_id);

	for (count = 0; count < number_value + 1; count += 1) {
		result += `<span class="symbol">${symbol}</span>`;
	}

	return result;
};