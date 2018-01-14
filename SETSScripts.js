'use strict';

SETS.scripts = {
	/** Variables */

	events: {
		cardClicked: null,
		getCardsFromVisible: null,
	},
	parent_dom: null,
	GAME_INSTANCE: null,
	last_clicked_card_value: 100,
	get_card_from_visible_call_count: 0,

	game_state_from_bridge: null,

	/** Functions */

	createEvents: function () {
		// here we basically create each event so that they be transmitted to the
		// top of the chain.
	},

	initialize_variables: function () {
		SETS.scripts.parent_dom = document.getElementById('game-init');
		SETS.scripts.createEvents();
	}
};