"use strict";
/**
 * VisibleCards is a mean of managing the visible cards
 * on a given SETS game. This helps with safer removal
 * and addition into the visible cards. The following
 * methods can be accessed publicly:
 *
 * @method vc.toggleSelectionAtIndex::
 *      @param {index} {Integer in range [0,17] inclusive}
 *      This methods selects or deselects the card at the
 *      given index if the card exists.
 *
 * @method vc.add3Cards::
 *      No parameter. This method adds 3 cards to the VC
 *      from its internal SETS.Deck.
 *
 * @method vc.removeSelectedCards::
 *      Removes the selected cards (through
 *      vc.toggleSelectionAtIndex) IFF they are proper as
 *      defined in SETS.Card with SETS.HLP.isSetProper.
 *
 * @method vc.deselectAll::
 *      Deselects all the selected cards (through
 *      vc.toggleSelectionAtIndex). If there are no cards
 *      selected, then it does nothing.
 *
 * @method vc.getCardIndexFromValues::
 *      Given an array of card values (e.g. [1, 1, 1, 0]),
 *      if there is a card in VC that has those values,
 *      this method will return its index. This will be
 *      used to make vc.toggleSelectionAtIndex more
 *      accessible (i.e. no need to pass in the index
 *      outside). It also solves the problem of unexpected
 *      changes to an index that was passed outside or
 *      modified when the cards are shifted down. If the
 *      card is not found, this will return -1.
 *
 * @method vc.getProperSetCount::
 *      Returns the number of proper set currently in the VC.
 *      This is useful to know in case we are unsure whether
 *      to add 3 cards or not.
 *
 * @method vc.getVCState::
 *      Returns an object containing enough details about the
 *      VC to figure out what to do next with the game. **See
 *      the method at the end of this file for more details.
 * */

SETS.VisibleCards = function () {
	let self               = this,
	    __func             = {},
	    // array containing the cards the game is played on
	    __card_array       = [],
	    // selected card index, which matches the index at the __card_array
	    __selected         = {},
	    __proper_set_count = 0,
	    __proper_set_list  = [],
	    // initialize with a fresh new deck that is private here
	    __DECK             = new SETS.Deck();

	/** * * * * * * * * * * * * * * * *
	 * Implement private functions
	 * * * * * * * * * * * * * * * * **/

	/** Private functions: Asserters */

	/* Makes sure that
	- (1) the index is in the range [0, 17]
	- (2) index is an integer */
	__func.assertIndexIsValid = function (index) {
		let m1 = 'VC :: __assertCardAtIndexIsNull :\n index must be >= 0',
		    m2 = 'VC :: __assertCardAtIndexIsNull :\n index must be < 18',
		    m3 = 'VC :: __assertCardAtIndexIsNull :\n index must be an integer';
		console.assert(index >= 0, m1);
		console.assert(index < 18, m2);
		console.assert(SETS.HLP.isInteger(index), m3);
	};

	__func.assertCardAtIndexIsNull = function (index) {
		let m = 'VC :: __assertCardAtIndexIsNull :\n card at given index is not null';
		console.assert(__card_array[index] === null, m);
	};

	__func.assertCardAtIndexIsNotNull = function (index) {
		let m = 'VC :: __assertCardAtIndexIsNotNull :\n card at given index is null';
		console.assert(__card_array[index] !== null, m);
	};
	/* In addition to the above, this checks that
	(3) the card at the given index is null. This
	is used to add a new card into the sets.  */
	__func.assertCardIndexIsValid = function (index) {
		__func.assertIndexIsValid(parseInt(index));
		__func.assertCardAtIndexIsNull(parseInt(index));
	};

	/* Checks if the the card actually exists at the
	given index. I.e. it's not null and it's a SETS.Card.
	For it to be valid, the index has to be valid. */
	__func.assertCardExistenceAtIndex = function (index) {
		__func.assertIndexIsValid(parseInt(index));
		__func.assertCardAtIndexIsNotNull(parseInt(index));
	};

	__func.assertMaximumCardSelectionNotReached = function () {
		let m = `VC :: __assertMaximumCardSelectionNotReached :\n maximum selection count is reached`;
		console.assert(__func.getSelectionCount() < 3, m);
	};

	__func.assertObjectIsCard = function (potential_card) {
		let m = `VC :: __assertObjectIsCard :\n object is not a SETS.Card`;
		console.assert(potential_card instanceof SETS.Card, m);
	};

	/** Private functions: Initializers */

	/* set all the cards to null and all the
	selections to false (i.e. nothing is
	selected,so __card_array are all null)
	and the values of __selected to false. */
	__func.reinitializeCardArrayAndSelected = function () {
		__card_array = [
			null, null, null, null, null, null,
			null, null, null, null, null, null,
			null, null, null, null, null, null
		];
		__selected = {
			0: false, 1: false, 2: false, 3: false, 4: false, 5: false,
			6: false, 7: false, 8: false, 9: false, 10: false, 11: false,
			12: false, 13: false, 14: false, 15: false, 16: false, 17: false
		};
	};

	/* Instantiate the private deck, sets
	all the cards to null, and makes all
	selected false. 16 is the maximum number
	of cards  we can have visible without
	having a set. Adding any one other card
	creates a set. So, we set our cap to 18. */
	__func.initialize = function () {
		__func.reinitializeCardArrayAndSelected();
	};

	/** Private functions: Getters */

	__func.isCardAtIndexNull = function (index) {
		return __card_array[index] === null;
	};

	__func.getSelectionCount = function () {
		let count = 0,
		    index = 0;

		for (index; index < 18; index += 1) {
			if (__selected[index]) {
				count += 1;
			}
		}
		return count;
	};

	/* this returns a dictionary (object) for
	which the keys are the selection indexes
	and the values are cards */
	__func.getSelectedCards = function () {
		let index     = 0,
		    selection = {};

		for (index; index < 18; index += 1) {
			if (__selected[index]) {
				selection[index] = __card_array[index];
			}
		}
		return selection;
	};

	/* the keys of the object returned by
	__func.getSelectedCards() are the
	indexes of the selected cards. */
	__func.getSelectedCardsIndexes = function () {
		return Object.keys(__func.getSelectedCards());
	};

	/* Returns the number of visible cards currently
	on the card array */
	__func.getVisibleCardsCount = function () {
		let index = 0,
		    count = 0;

		for (index; index < 18; index += 1) {
			// check if the card is not null
			if (!(__func.isCardAtIndexNull(index))) {
				count += 1;
			}
		}
		return count;
	};

	/* return -1 in case all the cards are filled.
	in, the appropriate action must be handled by
	function caller. */
	__func.getSmallestUnfilledCardIndex = function () {
		let index = 0;

		for (index; index < 18; index += 1) {
			if (__func.isCardAtIndexNull(index)) {
				return index;
			}
		}
		// the only function that calls this method is
		// __func.addCard(card), which throws an error
		// when the result in -1. So, this is valid and
		// ok. We could just have a smallest unfilled
		// index that gets updated every time a card
		// is added or removed, but that creates a lot
		// of complexity within some of the functions.
		// We thus value clarity here over complexity
		// at the cost of running this worst-case
		// 18-iterations loop.
		return -1;
	};

	__func.getAvailableCardsIndexes = function () {
		let index, card_index_array = [];
		for (index = 0; index < 18; index += 1) {
			// check if the card is not null
			if (!(__func.isCardAtIndexNull(index))) {
				card_index_array.push(index);
			}
		}
		return card_index_array;
	};

	__func.getAvailableCards = function () {
		let card_index_array = __func.getAvailableCardsIndexes(),
		    card_array       = [];

		card_index_array.forEach(function (index) {
			card_array.push(__card_array[index]);
		});
		return card_array;
	};

	/* Returns the card values in array. For example,
	if a card was made with "new SETS.Card(1,1,1,0)",
	then its value will be [1,1,1,0]. */
	__func.getCardValues = function () {
		let card_values = [];
		__card_array.forEach(function (card) {
			if (card instanceof SETS.Card) {
				card_values.push(card.getValueArray());
			} else {
				card_values.push(null);
			}
		});
		return card_values;
	};

	/* This gives the number of proper sets currently
	in the set of visible cards (excluding those that
	are null). */
	__func.getProperSetCountAndListOnVisibles = function () {
		let card_index_array      = __func.getAvailableCardsIndexes(),
		    combinations_of_three = SETS.HLP.getCombinationsOf3FromArray(card_index_array),
		    proper_set_count      = 0,
		    proper_set_index_list = [];

		// loop through every combinations of 3 indexes
		combinations_of_three.forEach(function (index_combination) {
			let combination = [];
			// for each index in the combination (total
			// of 3), add the corresponding card into
			// the combination array above.
			index_combination.forEach(function (index) {
				combination.push(__card_array[index]);
			});

			if (SETS.HLP.isSetProper(combination)) {
				proper_set_count += 1;
				proper_set_index_list.push(index_combination);
			}
		});
		return [proper_set_count, proper_set_index_list];
	};

	/* I want these to be computed every time we add
	or remove sets, not every time they get called. So,
	the value __proper_set_count gets updated for every
	add. */
	__func.getProperSetCount = function () {
		return __proper_set_count;
	};

	/* Just return the first proper set in the
	proper set list. Just be aware that this
	array is an array of objects for which the
	key is the index and the value is the card */
	__func.getArbitraryProperSet = function () {
		return __proper_set_list[0];
	};

	/* Given a card value in an array, return its
	index in the __card_array. This expects a valid
	input (i.e. the values of a card currently part
	of this instance of VisibleCards). */
	__func.getCardIndexFromCardValues = function (card_values) {
		let index = 0,
		    current_card,
		    current_card_values,
			message = `VC :: __getCardIndexFromCardValues: \n`;

		for (index; index < 18; index += 1) {
			current_card = __card_array[index];
			// check if the card is not null
			if (!(__func.isCardAtIndexNull(index))) {
				current_card_values = current_card.getValueArray();

				// check if the values match
				if (SETS.HLP.areCardValuesEqual(card_values, current_card_values)) {
					return index;
				}
			}
		}
		// this means we passed an invalid card value
		// that was not part of VC.
		message += `the card_values passed (i.e. ${card_values}) was not found. Returned -1.`;
		console.warn(message);
		return -1;
	};

	/* Returns whether the current selection is proper */
	__func.isSelectionProper = function () {
		let selected_cards = __func.getSelectedCards();
		// we get the keys since selected_cards is an
		// object with keys as index and cards as values
		return SETS.HLP.isSetProper(Object.values(selected_cards));
	};

	/** Private functions: Selectors */

	/* We can select a maximum of 3 cards. After that
	we reach a limit. This is because we test if those
	3 cards form a proper set. */

	__func.selectCard = function (index) {
		__func.assertMaximumCardSelectionNotReached();
		__selected[index] = true;
	};

	__func.deselectCard = function (index) {
		__selected[index] = false;
	};

	__func.deselectAllSelectedCards = function () {
		let index;
		for (index = 0; index < 18; index += 1) {
			__func.deselectCard(index);
		}
	};

	/** Private functions: Modifiers */

	__func.updateProperSetList = function (proper_set_index_list) {
		__proper_set_list = [];

		proper_set_index_list.forEach(function (index_combination) {
			let combination = {};

			// there should be 3 indexes in this index_combination
			index_combination.forEach(function (index) {
				combination[index] = __card_array[index];
			});

			__proper_set_list.push(combination);
		});
	};

	__func.updateProperSetCountAndList = function () {
		let count_and_index_list = __func.getProperSetCountAndListOnVisibles();
		__proper_set_count = count_and_index_list[0];
		__func.updateProperSetList(count_and_index_list[1]);
	};

	/* Shift the cards down from where they used to be so that
	the cards at the beginning of the array are the ones that
	are selected and the cards indexes at the end are the ones
	that are null. */
	__func.shiftCardsDown = function () {
		let index,
		    lowest_null_index,
		    current_card,
		    dirty = true;

		function computeLowestIndex() {
			for (index = 0; index < 18; index += 1) {
				if (__func.isCardAtIndexNull(index)) {
					return index;
				}
				if (index === 17) {
					return -1;
				}
			}
		}

		// keep shifting down until we're don't shift
		// anything on one of the cycles. This ensures
		// that the shifting is done right
		while (dirty) {
			dirty = false;
			// first, get the lowest null index
			lowest_null_index = computeLowestIndex();
			if (lowest_null_index === -1) {
				break;
			}
			// then shift every cards down from
			// the lowest null card index
			for (index = lowest_null_index + 1; index < 18; index += 1) {
				if (!__func.isCardAtIndexNull(index)) {
					// get the card
					current_card = __card_array[index];
					// place that card at a lower index
					__card_array[lowest_null_index] = current_card;
					// remove the card in our card array
					__func.removeCardAtIndex(index);
					// then set the lowest null index to
					// be the current index
					lowest_null_index = index;
					dirty = true;
				}
			}
		}
		// Although there is a more efficient way to do this, such
		// as pulling one card one by one when finding a hole until
		// there is no card that can be pulled down, we don't want
		// to do premature optimization. Additionally, this loops
		// is only 18-36 iterations which can result in no more than
		// 3-6 times to be run (this is a guess). So, it's not that
		// costly.

	};

	__func.addCardAtIndex = function (card, index) {
		__func.assertCardIndexIsValid(index);
		__func.assertCardAtIndexIsNull(index);
		__func.assertObjectIsCard(card);

		__card_array[index] = card;
		// newly added card cannot be selected
		__selected[index] = false;
	};

	__func.addCard = function (card) {
		let smallest_unfilled_index = __func.getSmallestUnfilledCardIndex();

		if (smallest_unfilled_index !== -1) {
			__func.addCardAtIndex(card, smallest_unfilled_index);
		} else {
			throw new Error('VC :: _addCard : Attempted to overfill the visible cards list!');
		}
	};

	__func.removeCardAtIndex = function (index) {
		// card must exist in the first place in
		// order to be removed
		__func.assertCardExistenceAtIndex(index);
		__card_array[index] = null;
		// recently removed card cannot be selected
		__selected[index] = false;
	};

	/** Private functions: Exclusive for the state */

	__func.getSelectionState = function () {
		let selected = [], index = 0;

		for (index; index < 18; index += 1) {
			selected.push(__selected[index]);
		}

		return selected;
	};

	/* the indexes of one arbitrary proper set,
	so array of length 3 */
	__func.getProperSetIndexesState = function () {
		let proper_set_card_indexes;
		if (__func.getArbitraryProperSet() !== undefined) {
			proper_set_card_indexes = Object.keys(__func.getArbitraryProperSet());
		} else {
			proper_set_card_indexes = null;
		}
		return proper_set_card_indexes;
	};

	/** ================================================================================
	 * =================================================================================
	 * =================================================================================
	 * =================================================================================
	 * =================================================================================
	 * =================================================================================
	 * =================================================================================
	 * =================================================================================
	 * =================================================================================
	 * =================================================================================
	 * =================================================================================
	 * =================================================================================
	 * ================================================================================= */

	/** * * * * * * * * * * * * * * * *
	 * Implement public functions:
	 * first, timer_actions that modify the internal
	 * structure of VisibleCards
	 * * * * * * * * * * * * * * * * **/

	self.toggleSelectionAtIndex = function (index) {
		__func.assertCardExistenceAtIndex(index);
		if (__selected[index]) {
			__func.deselectCard(index);
		} else {
			__func.selectCard(index);
		}
	};

	/* We can only add three cards at once. After
	we add 3 cards, we update the proper set. */
	self.add3Cards = function () {
		let card_array,
		    smallest_unfilled_index = __func.getSmallestUnfilledCardIndex(),
			error_message;

		if ((smallest_unfilled_index !== -1) && (smallest_unfilled_index < 16)) {
			// this try/catch makes the possibility of
			// an exception explicit so that it can be
			// properly handled. Also, we don't want
			// to draw the set until we reach here
			// because we cannot put it back.
			try {
				card_array = __DECK.drawSet(3);
			} catch (all_cards_drawn_exception) {
				throw all_cards_drawn_exception;
			}

			// no need to assert that the card array is
			// valid if our __DECK is valid.
			__func.addCard(card_array[0]);
			__func.addCard(card_array[1]);
			__func.addCard(card_array[2]);

			// updateOnCardClicked the proper set count now
			// that we've added 3 cards
			__func.updateProperSetCountAndList();
		} else {
			// in this case, the VC is already full, so we
			// cannot overfill it. So, we will just not do
			// anything.
			error_message = new StringBuffer();
			error_message.append(`VC :: add3Cards:\nStopped Attempt to overfill by 3 cards `);
			error_message.append(`when all 18 spots are already filled.`);
			console.warn(error_message.toString());
		}

	};

	/* We can only remove three cards at once,
	and to be removed, they must be proper.
	Additionally, cards are removed from this
	method only, which removes from the cards
	that are selected. */
	self.removeSelectedCards = function () {
		let selection_count     = __func.getSelectionCount(),
		    selection_is_proper = __func.isSelectionProper(),
		    selected_cards_indexes,
			message = new StringBuffer();

		// prepare the error message a selection
		// cannot be proper if there is less than
		// 3 cards selected
		message.append('VC :: removeSelectedCards :: removeCards:\n');
		message.append('Either you did not select 3 card ');
		message.append('(you can only remove 3 cards at a time), ');
		message.append(`or the selection was not proper. The selection`);
		message.append(`count was ${selection_count}`);

		// here's a private functions used just
		// for the use of promises, the promise
		// gets called after (see the self
		// invoking function below).
		function removeCards(resolve, reject) {
			if (selection_is_proper) {
				selected_cards_indexes = __func.getSelectedCardsIndexes();

				selected_cards_indexes.forEach(function (index) {
					let parsed_index = parseInt(index);
					__func.removeCardAtIndex(parsed_index);
				});
				// finally resolve, which will basically shift
				// all the cards down and updates proper sets
				resolve();
			} else {
				reject(new Error(message.toString()));
			}
		}

		// we invoke this function and then
		// shift all the cards down in case
		// we succeeded in removing the cards
		(() => {
			return new Promise(removeCards);
		})().then(function () {
			// shifting twice actually guarantees,
			// with the way the algorithm is working,
			// to shift all cards down.
			__func.shiftCardsDown();
			// update the proper set count now
			// that we've removed 3 cards
			__func.updateProperSetCountAndList();
		}, function (error) {
			throw error;
		});

	};

	self.deselectAll = function () {
		__func.deselectAllSelectedCards();
	};

	/** * * * * * * * * * * * * * * * *
	 * Implement public functions:
	 * second, timer_actions that do not modify
	 * the internal structure of VisibleCards
	 * * * * * * * * * * * * * * * * **/

	self.getCardIndexFromValues = function (card_values) {
		return __func.getCardIndexFromCardValues(card_values);
	};

	self.getProperSetCount = function () {
		return __func.getProperSetCount();
	};

	/* the state Getter. This is the
	main thing needed to updateOnCardClicked the HTML */
	self.getVCState = function () {
		return {
			// cards are the values and not the actual cards :D
			cards: __func.getCardValues(),
			// returns an array with indexes either true or false
			selection: __func.getSelectionState(),
			// returns how many cards are selected
			selection_count: __func.getSelectionCount(),
			// whether the selection is proper
			is_selection_proper: __func.isSelectionProper(),
			// the number of cards that are in the VisibleCards (i.e. not null)
			visible_cards_count: __func.getVisibleCardsCount(),
			// the number of proper sets that are present in the cards
			proper_set_count: __func.getProperSetCount(),
			// the indexes of one arbitrary proper set, so array of length 3
			proper_set_indexes: __func.getProperSetIndexesState(),
			// the number of remaining cards in the deck, this can be displayed to user
			cards_remaining: __DECK.getUndrawnCards().length,
		};
	};

	/** * * * * * * * * * * * * * * * *
	 * Initialize the visible cards to be empty
	 * * * * * * * * * * * * * * * * **/

	__func.initialize();
};