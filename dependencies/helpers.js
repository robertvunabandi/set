"use strict";

let SETS = {};

SETS.HLP = {};

// The card width can be edited by the user for maximum
// visual performance (this is not just the width, it's
// also the height). Since cards are made of SVG symbols,
// they will adjust to the given width.
SETS.HLP.editableCardWidth = 170;

/** Public Variables that the user updates at the start
 * of the game.
 * TODO - put internal sanity checks because someone may play with these values. See below:
 * - Literally, just refresh the page so that the person stops messing with it.
 **/
// the user name of the user will be saved in the
// following variable
SETS.HLP.userName = "Anonymous";
SETS.HLP.userMaxTime = 40000;

// See REACTCard.js for the meaning of these
SETS.HLP.cardActions = {
	NOTHING: 90001,
	RIGHT: 90002,
	TIMEOUT: 90003,
	WRONG: 90004
};

// Timer Logic Actions from REACTPointBoard.js
SETS.HLP.timerLogicActions = {
	START_TIMER: 91101,
	CONTINUE_TIMER: 91102,
	STOP_TIMER: 91103,
	RESET_TIMER: 91104,
	NO_TIMER_CHANGE: 91105
};


// RG stands for ReactGame
SETS.HLP.RG = {
	// 0 means no game is currently playing, 1 means there is a game at the moment
	GAME_STARTED: 0,
	// SUD stands for State Update Code
	SUD: {
		/* First, we SUDs from REACTPointBoard */

		// this is when the user runs out of time. See method
		// See [ReactGame].SETSReactGame.
		MAX_TIME_REACHED: 99100,
		// update the user points with whatever new points he has
		// data must be an integer containing the points to give
		// to give to the user. This comes from REACTPointBoard.js
		// See [ReactGame].SETSReactGame.reflectPointIncreaseFromPointBoard(...)
		REFLECT_POINT_INCREASE: 99101,

		/* SUDs from REACTCard */
		HIGHLIGHT_COMPLETION_RIGHT: 99200,
		HIGHLIGHT_COMPLETION_TIMEOUT: 99201,
		HIGHLIGHT_COMPLETION_WRONG: 99202,
		CARD_CLICKED: 99203,
	},
	// this code is used for when there is no update to the state.
	// Instead of checking for null, it's safer to check for a code.
	// See [ReactGame].SETSReactGame.buildState(...)
	NO_UPDATE: 99000,

	// update tags so that we can determine what component the update
	// was intended for. This prevents stupid bugs makes the separation
	// between Grid and PointBoard more prevalent. Before, every time
	// we made an update, both would take it even though it concerned
	// only one.
	UPDATE_FOR_POINT_BOARD: 99010,
	UPDATE_FOR_GRID: 99020,
	UPDATE_FOR_BOTH: 99030
};

SETS.HLP.hexColors = {
	red: "f53900",
	RED: "f53900",
	violet: "711ebd",
	VIOLET: "711ebd",
	green: "07c038",
	GREEN: "07c038"
};

SETS.HLP.__possibleColors = ["RED", "VIOLET", "GREEN"];
SETS.HLP.__possibleShapes = ["LOSENGE", "OVAL", "SQUIGGLE"];
SETS.HLP.__possibleInteriors = ["BLANK", "RAYS", "SOLID"];
SETS.HLP.__possibleNumber = [1, 2, 3];

SETS.HLP.hexColorMap = {
	RED: SETS.HLP.hexColors.red,
	VIOLET: SETS.HLP.hexColors.violet,
	GREEN: SETS.HLP.hexColors.green
};

SETS.HLP.getPossibles = function (string) {
	switch (string) {
		case "color":
			return SETS.HLP.__possibleColors;
		case "shape":
			return SETS.HLP.__possibleShapes;
		case "interior":
			return SETS.HLP.__possibleInteriors;
		case "number":
			return SETS.HLP.__possibleNumber;
		default:
			throw new Error("Invalid string argument");
	}
};

SETS.HLP.assertValueErrorMessage = "value must be either 0, 1, or 2";

SETS.HLP.assertValueIsValid = function (value) {
	console.assert(value in [0, 1, 2], SETS.HLP.assertValueErrorMessage);
};

SETS.HLP.areCardValuesEqual = function (cv1, cv2) {
	let i = 0;
	for (i; i < 4; i += 1) {
		if (cv1[i] !== cv2[i]) {
			return false;
		}
	}
	return true;
};

SETS.HLP.isInteger = function (number) {
	try {
		return (Math.round(number) === number);
	} catch (e) {
		return false;
	}
};

SETS.HLP.getRandomInteger = function (max_value_exclusive) {
	return Math.floor(Math.random() * (max_value_exclusive));
};

SETS.HLP.shuffleArray = function (array) {
	/*
	 * Randomize array element order in-place. Using Durstenfeld shuffle algorithm.
	 * from:
	 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	 *
	 * I changed the original code a bit by making
	 * a copy of the original array and changing
	 * the argument of the for loop
	 */
	let array_cp = array.slice();
	for (let i = array_cp.length; i--;) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array_cp[i];
		array_cp[i] = array_cp[j];
		array_cp[j] = temp;
	}
	return array_cp;
};

SETS.HLP.getCombinationsOf3FromArray = function (array) {
	/* generates all combinations of length 3 from
	the given array. the function combinations is
	defined in combinations.js which should be
	shared with this file */
	return combinations(array, 3);
};

SETS.HLP.arrayToString = function (array) {
	return array.join("");
};



// creating random states for testing purposes
SETS.HLP.RANDOMSTATE = {};
SETS.HLP.RANDOMSTATE.random = {
	randomInt: () => Math.round(Math.random()*2),
	randomBoolean: () => Math.random() < 0.5,
	randomValueArray: () => Array.apply(null, Array(4)).map(() => Math.round(Math.random() * 2)),
};
SETS.HLP.RANDOMSTATE.REACTRow = function () {
	return {
		value_array: Array.apply(null, Array(6)).map(() => SETS.HLP.RANDOMSTATE.random.randomValueArray()),
		selected_array: Array.apply(null, Array(6)).map(() => SETS.HLP.RANDOMSTATE.random.randomBoolean()),
		card_action: [
			SETS.HLP.cardActions.RIGHT,
			SETS.HLP.cardActions.WRONG,
			SETS.HLP.cardActions.TIMEOUT,
			SETS.HLP.cardActions.NOTHING
		][SETS.HLP.RANDOMSTATE.random.randomInt()]
	};
};

SETS.HLP.createCreditReactElement = function() {
	let warning_text = "", google_survey_link = "https://goo.gl/forms/B9CGzDC2eiQjQLmJ2";
	warning_text += "This game is currently under development and thus is extremely buggy. ";
	warning_text += "However, feedback would be useful to make this game better. ";
	warning_text += "You can help by answering this ";
	return React.createElement("div", {
			id: "credit"
		},
		// explaining the rules
		"Do you know the rules? Here's a ",
		React.createElement("a", {
			className: "link", href: "https://www.setgame.com/sites/default/files/instructions/SET%20INSTRUCTIONS%20-%20ENGLISH.pdf", target: "_blank"
		}, "link"),
		".",
		React.createElement('br', null), React.createElement('br', null),
		// credits
		"By ",
		React.createElement("a", {
			className: "link", href: "https://github.com/robertvunabandi", target: "_blank"
		}, "Robert M. Vunabandi"),
		". Inspired from ",
		React.createElement("a", {
			className: "link", href: "http://www.setgame.com/set", target: "_blank"
		}, "Sets"),
		".",
		// note on not development done
		React.createElement('br', null), React.createElement('br', null),
		". . .",
		React.createElement('br', null), React.createElement('br', null),
		warning_text,
		React.createElement('a', {
			href: google_survey_link, target: "_blank", className: "link"
		}, "survey"),
		"."
	);
};