"use strict";

SETS.Deck = function Deck() {
	/**
	 setup the deck environment:
	 __deck: the deck we'll do operations on,
	    it's a private variable
	 __func is a set of helper, private functions that
	    we'll use to make some procedures easier.
	 __indexes_array: contains the indexes of the cards,
	    this will be used for different operations with
	    regard to shuffling and moving cards around. It
	    remembers the originals location of the cards in
	    the deck. */

	let self            = this,
	    __deck          = [],
	    __func          = {},
	    __indexes_array = [];

	/** implement helper functions, which are all private */

	__func = {
		/* returns a fresh new deck, ordered, with all
		possible combinations of CSIN. This function
		reinitialize the __indexes_array. */
		newDeck: function () {
			let new_deck    = [],
			    total_count = 0,
			    c, s, i, n;
			// reinitialize the __indexes_array
			__indexes_array = [];
			for (c = 0; c < 3; c += 1) {
				for (s = 0; s < 3; s += 1) {
					for (i = 0; i < 3; i += 1) {
						for (n = 0; n < 3; n += 1) {
							new_deck.push(new SETS.Card(c, s, i, n));
							__indexes_array.push(total_count);
							total_count += 1;
						}
					}
				}
			}
			return new_deck;
		},
		getIndexOfLastNotDrawnCard: function () {
			let index = 0,
			    card  = __deck[0];

			for (let j = __deck.length; index < j; index += 1) {
				card = __deck[index];
				if (card.isDrawn()) {
					break;
				}
			}

			return index - 1;
		},
		getArrayOfIndexes: function () {
			return __indexes_array.slice();
		}
	};

	/** implement functions to perform on this deck */

	/*
	Checks if all the cards in the deck have been
	drawn. If the card at index 0 (on top of the
	deck) is drawn, that means all cards are drawn
	because as we "draw" a card, we put it in the
	bottom of the deck (at index len(deck)) with
	setting the status to drawn
	*/
	self.areAllCardsDrawn = function () {
		return __deck[0].isDrawn();
	};

	/* draw a card from the top of the deck: makes the
	drawn value of the card become true. this does
	not draw a card if all the cards are drawn */
	self.draw = function () {
		// picks the card on top of the deck (at index 0)
		let card = __deck[0];

		if (this.areAllCardsDrawn()) {
			throw new Error("All cards are drawn already. You must restart the deck.");
		}

		/* remove the card at index 0 and place it at the
		end with drawn set to true */
		card.setStatusToDrawn();
		__deck.shift();
		__deck.push(card);
		return card;
	};

	/* draws @card_count cards from the top of the
	deck. stops drawing if we reach the end of the
	deck. */
	self.drawSet = function (card_count) {
		let card_set = [], message = "", i, card;

		if (self.areAllCardsDrawn()) {
			message += "NoMoreCardsToDrawException:";
			message += " All cards are drawn already. You must restart the deck.";
			throw new Error(message);
		}

		for (i = card_count; i--;) {
			try {
				card = self.draw();
				card_set.push(card);
			} catch (e) {
				/* an exception is thrown in case we're
				trying to draw when there's no more
				card to draw, so we stop here */
				console.warn(e);
				console.warn("All cards are drawn. Set drawing was halted.");
				break;
			}
		}
		return card_set;
	};

	/* a set of functions making use of randomness */
	self.random = {
		// a random not-drawn card index
		cardIndex: function () {
			return SETS.getRandomInteger(__deck.length);
		},

		/* returns a random card regardless of it
		being drawn or not. It does not changes
		the status to drawn! */
		card: function () {
			return __deck[self.random.cardIndex()];
		},

		/* returns a set of @card_count random
		cards, but does not drawn them! */
		set: function (card_count) {
			let indexes_list = __func.getArrayOfIndexes(),
			    rand_index,
			    rand_number,
			    set          = [];

			for (let i = card_count; i--;) {
				rand_number = SETS.HLP.getRandomInteger(indexes_list.length);
				rand_index = indexes_list[rand_number];
				set.push(__deck[rand_index]);
				indexes_list.splice(rand_number, 1);
			}
			return set;
		}
	};

	/* returns an array of all the cards drawn so far */
	self.getDrawnCards = function () {
		let index = __func.getIndexOfLastNotDrawnCard();
		return __deck.slice(index + 1);
	};

	/* returns an array of all the cards not drawn so far */
	self.getUndrawnCards = function () {
		let index = __func.getIndexOfLastNotDrawnCard();
		return __deck.slice(0, index + 1);
	};

	/* shuffles the deck, both drawn and un-drawn, but keeps
	the two separates (so that un-drawn come first) */
	self.shuffle = function () {
		let drawn_cards     = self.getDrawnCards(),
		    not_drawn_cards = self.getUndrawnCards(),
		    shuffled_drawn_card,
		    shuffled_not_drawn_card;

		shuffled_drawn_card = SETS.HLP.shuffleArray(drawn_cards);
		shuffled_not_drawn_card = SETS.HLP.shuffleArray(not_drawn_cards);
		// make __deck equal to the concatenation of both shuffles
		__deck = shuffled_not_drawn_card.concat(shuffled_drawn_card);
		return __deck;
	};

	/* makes it so that the deck is as if we just started */
	self.restart = function () {
		__deck = __func.newDeck();
		self.shuffle();
		return __deck;
	};

	/* see the values of the drawn cards */
	self.seeDrawnValues = function () {
		let drawn_cards = self.getDrawnCards(),
		    values      = [];

		for (let i = 0, j = drawn_cards.length; i < j; i += 1) {
			let card = drawn_cards[i];
			values.push(card.getValueArray());
		}

		return values;
	};

	/* Finally, initialize the deck with the restart method */
	self.restart();
};