"use strict";

/**
 * ActionController (AC) brings another layer of abstraction
 * to VisibleCards and implements/provide exclusively the
 * methods that would be needed directly in the game. This
 * will be the main entry point of the game, and the game
 * will directly communicate with the AC. The following
 * methods are publicly accessible:
 *
 * @method ac. ::
 * TODO - complete this when done adding public functions
 * */

SETS.ActionController = function () {
	let self   = this,
	    __func = {}, // set of private functions
	    __VC   = new SETS.VisibleCards();

	/** * * * * * * * * * * * * * *
	 * Implement Private Functions (PrF)
	 * * * * * * * * * * * * * * * */

	/** PrF: Getters
	 * these do not modify the internal state of the AC. */

	__func.shouldWeFillUpVC = function () {
		let vc_state = __VC.getVCState();
		return (vc_state.visible_cards_count < 12) || (vc_state.proper_set_count < 1);
	};

	/** PrF: Modifiers
	 * these modify the internal state of the AC. */

	/* this adds cards to the visible set of cards until
	there is at least one proper set */
	__func.fillUpVisibleCards = function () {
		while (__func.shouldWeFillUpVC()) {
			// this will throw an error in case there is no more cards to draw
			// this is handled by fillUpVisibleCards
			try {
				__VC.add3Cards();
			} catch (all_cards_drawn_exception) {
				if (__func.shouldWeFillUpVC()) {
					// because all cards are drawn
					// and there are no proper set to find
					throw new Error("End game exception: The game cannot continue");
				} else {
					break;
				}
			}

		}
	};

	/** * * * * * * * * * * * * * *
	 * Implement Public Functions (PuF)
	 * * * * * * * * * * * * * * * */

	/** PuF: Getters */

	self.isSelectionProper = function () {
		return __VC.getVCState().is_selection_proper;
	};

	/** PuF: Modifiers */

	self.toggleSelectionCardWithValues = function(card_values) {
		let card_index = __VC.getCardIndexFromValues(card_values);
		if (card_values === -1) {
			// temp - selection failed:
			// currently, the selection will fail because we're in testing mode,
			// this, however, should never happen because we get the card_value
			// from the state anyway.
			console.error("Bad selection");
		} else {
			__VC.toggleSelectionAtIndex(card_index);
		}
	};

	self.deselectAllCard = function () {
		__VC.deselectAll();
	};

	/* Try to remove the cards. The return means that we
	successfully removed those cards. True is equivalent
	to giving the user points. False means no points or
	penalty. */
	self.removeSelectedCards = function () {
		try {
			__VC.removeSelectedCards();
			return true;
		} catch (selected_cards_invalid_exception) {
			// temp - the following warning is for debugging purposes
			console.warn(selected_cards_invalid_exception);
			// deselect the cards to allow for new selections
			__VC.deselectAll();
			return false;
		}

	};


	/* See __func.fillUpVisibleCards */
	self.fillUpVisibleCards = function () {
		try {
			__func.fillUpVisibleCards();
		} catch (end_game_exception) {
			// TODO - end game with React
		}
	};

	/** PuF: State getter */

	/*
	vc_state is an object with keys:
		:: cards,
		:: selection,
		:: selection_count,
		:: is_selection_proper,
		:: visible_cards_count,
		:: proper_set_count,
		:: proper_set_indexes,
		:: cards_remaining,
	See VisibleCards.js for their meanings
	*/
	self.getGameState = function () {
		return __VC.getVCState();
	};

	/** * * * * * * * * * * * * * *
	 * Initialize the ActionController
	 * * * * * * * * * * * * * * * */

	__func.fillUpVisibleCards();
};

/**
 * How to create event listeners:
 * https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
 * */