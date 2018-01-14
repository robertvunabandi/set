'use strict';

/*
FOR REACT:
https://stackoverflow.com/questions/46727804/update-a-react-components-state-from-its-parent
https://stackoverflow.com/questions/47858242/dealing-with-nested-react-components-state-changes

ALSO, REDUX WAS GIVEN AS ADVICE:
https://egghead.io/courses/getting-started-with-redux
*/

function Game() {
	let game_starter, kill_game;

	function startGameHard() {
		let props, game, parent_dom = document.getElementById('game-init');
		// hide the modal and clear the parent dom
		modal.hide();
		// the set that the game is started
		SETS.HLP.RG.GAME_STARTED = 1;
		props = {
			user_name: SETS.HLP.userName.length > 1 ? SETS.HLP.userName : "Anonymous",
			max_time: SETS.HLP.userMaxTime
		};
		// start the new game
		game = React.createElement(SETSReactGame, props);
		ReactDOM.render(game, parent_dom);
	}

	function startGameHardInitializer() {
		// render the credit because we always want it there
		ReactDOM.render(SETS.HLP.createCreditReactElement(), document.getElementById('game-init'));
		modal.setContent(game_starter);
		modal.show();
	}

	game_starter = React.createElement(ReactModalStartNewGame, {
		cancelHandler: () => modal.hide.call(modal),
		startHandler: () => startGameHard()
	});
	kill_game = React.createElement(ReactModalOverrideGame, {
		cancelHandler: () => modal.hide.call(modal),
		startHandler: () => startGameHardInitializer()
	});

	if (SETS.HLP.RG.GAME_STARTED === 0) {
		startGameHardInitializer();
	} else {
		modal.setContent(kill_game);
		modal.show();
	}


}

function initializeGame() {
	modal = new SETSModal();
}

let modal;
$(document).ready(function () {
	// SETSScripts = SETS.scripts;
	// SETSScripts.initialize_variables();
	// SETSScripts.attachEvents(null);
	initializeGame();

	// TODO - the rest of the following is to be deleted
	/* let card, test_row, random_react, parent_dom = document.getElementById('game-init');

	test_row = React.createElement(SETSReactRow, {
		value_array: [[1,0,1,2], [0,1,0,1], [0,1,1,2], [1,0,2,1], [2,2,1,0], [0,2,2,2]],
		selected_array: [true, true, false, false, false, true],
		card_action: SETS.HLP.cardActions.RIGHT
	});

	card = React.createElement(SETSReactCard, {
		values: [2,1,0,2],
		is_selected: true,
		card_action: SETS.HLP.cardActions.RIGHT,
	});

	// ReactDOM.render(test_row, parent_dom);
	ReactDOM.render(test_row, parent_dom); */
});
