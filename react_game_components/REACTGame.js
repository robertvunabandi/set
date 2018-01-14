"use strict";

class SETSReactGame extends React.Component {
	constructor(props) {
		// initialize the parameters for the start of a game
		let u_name          = props.user_name,
		    starting_points = 0,
		    // 40 sec of max_time
		    base_tl         = SETSReactGame.createBaseTimerLogic(props.max_time),
		    card_action     = SETS.HLP.cardActions.NOTHING;

		super(props);

		this.AC = new SETS.ActionController();
		this.state = this.buildState(u_name, starting_points, base_tl, card_action);

		/* this variable will be used to handle
		card updates that gets called by 3 cards.
		These updates include:
		- [ReactCard].SETSReactCard.updateOnHighlightCompletion(...)
		- [ReactCard]
		*/

		this.card_update_call_count = 2;
		// initially, set this to however maximum time we have
		this.TIME_LEFT = props.max_time;
	}

	/* The input of this function is how much
	the max time is. This will be chosen based
	on the difficulty level. */
	static createBaseTimerLogic(max_time = 40000) {
		// we give the time in milliseconds
		return {
			timer_actions: SETS.HLP.timerLogicActions.START_TIMER,
			max_time: max_time,
			time_left: max_time,
			send_point: false,
		};
	}

	makeNewTimerLogicWithAction(action, time_left = SETS.HLP.RG.NO_UPDATE, add_points = false) {
		let previous_timer_logic = this.state.timer_logic,
		    // we will take either (1) take timer_left
		    // argument if it's different than
		    // SETS.HLP.RG.NO_UPDATE for time left in
		    // this updated timer_logic or (2) remain
		    // with the old one.
		    time_left_update = time_left === SETS.HLP.RG.NO_UPDATE ?
			    previous_timer_logic.max_time : time_left;

		return {
			timer_actions: action,
			max_time: previous_timer_logic.max_time,
			time_left: time_left_update,
			add_points: add_points,
		};
	}

	buildState(user_name   = SETS.HLP.RG.NO_UPDATE,
	           points      = SETS.HLP.RG.NO_UPDATE,
	           timer_logic = SETS.HLP.RG.NO_UPDATE,
	           card_action = SETS.HLP.RG.NO_UPDATE,
	           update_for = SETS.HLP.RG.UPDATE_FOR_BOTH) {

		let state = this.AC.getGameState(),
		    self  = this;

		function setUserName() {
			if (user_name !== SETS.HLP.RG.NO_UPDATE) {
				state.user_name = user_name;
			} else {
				state.user_name = self.state.user_name;
			}
		}

		function setPoints() {
			if (points !== SETS.HLP.RG.NO_UPDATE) {
				state.points = points;
			} else {
				state.points = self.state.points;
			}
		}

		// something special about the timer logic is
		// the ability to send the time left back to
		// ReactGame. So, we pass that method to the
		// state's timer logic here.
		function setTimerLogic() {
			if (timer_logic !== SETS.HLP.RG.NO_UPDATE) {
				state.timer_logic = timer_logic;
			} else {
				state.timer_logic = self.state.timer_logic;
				// set the time left to be however
				// much time left there was
				state.timer_logic.time_left = self.TIME_LEFT;
			}
			// see [REACTGame].SETSReactGame.getSendTimeLeftMethod() below
			state.timer_logic.sendTimeLeft = self.getSendTimeLeftMethod();
		}

		function setCardAction() {
			if (card_action !== SETS.HLP.RG.NO_UPDATE) {
				state.card_action = card_action;
			} else {
				state.card_action = self.state.card_action;
			}
		}

		function setAllParameters() {
			state.AC = self.AC;
			setUserName();
			setPoints();
			setTimerLogic();
			setCardAction();
			// place who the update is for here it can
			// be for either both, REACTPointBoard, or
			// REACTGrid.
			state.update_for = update_for;
		}

		setAllParameters();

		return state;
	}

	getSendTimeLeftMethod() {
		let self = this;
		// this function will be used to easily send how
		// much time is left for special cases (such as
		// adding points).
		return function sendTimeLeftToREACTGame(time_left) {
			// this function expects the argument to be valid
			self.TIME_LEFT = time_left;
		};
	}

	/* The game will be mainly updated through this endpoint.
	This update method will be passed down to every single
	react components. Whenever they need an update from the
	parent, that update will go through this method and
	make the right update as needed. */
	updateGame(updateCode, data) {
		let self = this;

		switch (updateCode) {
			/* Below are the ReactPointBoard updates */

			// when the user runs out of time during
			// a round. we want to select the next
			// the proper set and highlight it in blue
			// DATA: the time left in ms from the ReactPointBoard's timer_logic
			case SETS.HLP.RG.SUD.MAX_TIME_REACHED:
				self.makeMaxTimeoutUpdate(data);
				break;
			// DATA: an integer representing how much points the user now has
			case SETS.HLP.RG.SUD.REFLECT_POINT_INCREASE:
				self.reflectPointIncreaseFromPointBoard(data);
				break;

			/* Below are the REACTCard updates */

			// DATA: <UNDEFINED FOR NOW>
			case SETS.HLP.RG.SUD.HIGHLIGHT_COMPLETION_RIGHT:
			case SETS.HLP.RG.SUD.HIGHLIGHT_COMPLETION_TIMEOUT:
			case SETS.HLP.RG.SUD.HIGHLIGHT_COMPLETION_WRONG:
				self.highlightUpdate(updateCode, data);
				break;
			// DATA: The values of the card that was clicked
			case SETS.HLP.RG.SUD.CARD_CLICKED:
				self.selectCardClicked(data);
				break;
			default:
				throw new Error("SETSReactGame::updateGame: Invalid Update Code for updateGame");
		}
	}

	makeMaxTimeoutUpdate(time_left) {
		let self = this,
		    proper_set_cards,
		    game_state = self.AC.getGameState(),
		    updated_state,
		    updated_time_left = time_left < 0 ? 0 : time_left,
			new_timer_logic = self.makeNewTimerLogicWithAction(
				SETS.HLP.timerLogicActions.NO_TIMER_CHANGE, updated_time_left);

		/* first, we perform the action */

		// select all three cards in the ac
		// but make sure to deselect first
		self.AC.deselectAllCard();
		proper_set_cards = game_state.proper_set_indexes.map(function(value) {
			return game_state.cards[parseInt(value)];
		});
		proper_set_cards.forEach(function(card_value) {
			self.AC.toggleSelectionCardWithValues(card_value);
		});

		/* then, we update the state */

		// we set the timeout tag for the timer,
		// which should call a next round after
		// the timing is over.
		updated_state = self.buildState(
			SETS.HLP.RG.NO_UPDATE, // user_name
			SETS.HLP.RG.NO_UPDATE, // points
			new_timer_logic,       // timer_logic
			SETS.HLP.cardActions.TIMEOUT, // card_action
			SETS.HLP.RG.UPDATE_FOR_GRID // make this update exclusive to the grid
		);
		self.setState(updated_state);

	}

	/* After the REACTPointBoard has updated the points,
	we need to reflect the points back to the game and
	just start a new state. We expect the cards to
	already be setup. We just need to start the new round. */
	reflectPointIncreaseFromPointBoard(points) {
		let self = this, updated_state, new_timer_logic;
		console.assert(SETS.HLP.isInteger(points),
			"SETSReactGame::reflectPointIncreaseFromPointBoard: points given was not an integer");

		console.assert(points >= self.state.points,
			"SETSReactGame::reflectPointIncreaseFromPointBoard: points given was lower than before!");

		// we set update the timer logic to start the timer
		new_timer_logic = self.makeNewTimerLogicWithAction(
			SETS.HLP.timerLogicActions.START_TIMER);

		updated_state = self.buildState(
			SETS.HLP.RG.NO_UPDATE, // user_name
			points,                // points
			new_timer_logic,       // timer_logic
			SETS.HLP.RG.NO_UPDATE  // card_action
		);
		self.setState(updated_state);
	}

	/* When the highlighting of the cards is
	completed. This method gets called always
	3 times at once, so we need to make sure
	we perform the action only once. */
	highlightUpdate(updateCode, data) {
		// we keep data in parameters because we
		// always send data, however, as far as
		// now there is no need to send any data
		// from this method
		let self = this,
		    updated_state,
		    new_timer_logic,
		    // we create this variable to add point just to make it explicit
		    add_point,
		    err_message = "SETSReactGame::highlightUpdate: Invalid Update Code for updateGame";
		// mechanism to prevent this method from being
		// executed 3 times in a row
		if (self.card_update_call_count > 0) {
			self.card_update_call_count -= 1;
			return;
		} else {
			// reset it back to 2, then perform the action
			self.card_update_call_count = 2;
		}

		// TODO - this is a big function, we should break up each case into their own functions
		switch (updateCode) {
			case SETS.HLP.RG.SUD.HIGHLIGHT_COMPLETION_RIGHT:
				// remove the selected cards,
				// then fill up the cards
				self.AC.removeSelectedCards();
				self.AC.fillUpVisibleCards();
				// update the timer logic to add points
				add_point = true;
				new_timer_logic = self.makeNewTimerLogicWithAction(
					SETS.HLP.timerLogicActions.STOP_TIMER, self.TIME_LEFT, add_point);
				// finally, update the state
				updated_state = self.buildState(
					SETS.HLP.RG.NO_UPDATE, // user_name
					SETS.HLP.RG.NO_UPDATE, // points
					new_timer_logic,       // timer_logic which adds the points
					// do nothing to the cards, they should all be deselected and new
					SETS.HLP.cardActions.NOTHING // card_action
				);
				// set the state to whatever the updated state is
				self.setState(updated_state);
				break;
			case SETS.HLP.RG.SUD.HIGHLIGHT_COMPLETION_TIMEOUT:
				// remove the selected cards,
				// then fill up the cards
				self.AC.removeSelectedCards();
				self.AC.fillUpVisibleCards();
				// update the timer logic to restart the
				// timer, keep how much time was left
				new_timer_logic = self.makeNewTimerLogicWithAction(
					SETS.HLP.timerLogicActions.START_TIMER, self.TIME_LEFT);
				// finally, update the state
				updated_state = self.buildState(
					SETS.HLP.RG.NO_UPDATE, // user_name
					SETS.HLP.RG.NO_UPDATE, // points
					new_timer_logic,       // timer_logic
					// do nothing to the cards, they should all be deselected
					SETS.HLP.cardActions.NOTHING // card_action
				);
				// set the state to whatever the updated state is
				self.setState(updated_state);
				break;
			case SETS.HLP.RG.SUD.HIGHLIGHT_COMPLETION_WRONG:
				// deselect the cards
				self.AC.deselectAllCard();
				// update the timer logic with how much time is left
				new_timer_logic = self.makeNewTimerLogicWithAction(
					SETS.HLP.timerLogicActions.NO_TIMER_CHANGE, self.TIME_LEFT);
				// finally update the state
				updated_state = self.buildState(
					SETS.HLP.RG.NO_UPDATE, // user_name
					SETS.HLP.RG.NO_UPDATE, // points
					new_timer_logic,       // timer_logic
					// do nothing to the cards, they should all be deselected
					SETS.HLP.cardActions.NOTHING // card_action
				);
				// set the state to whatever the updated state is
				self.setState(updated_state);
				break;
			default:
				throw new Error(err_message);
		}
	}


	/* After the user clicks on a given card,
	this method selects the card. In case there
	are three cards selected, it makes a red
	blink or green blink based on whether the
	selection is proper. */
	selectCardClicked(card_values) {
		// we expect the values to be correct
		let self = this,
		    updated_state,
		    new_timer_logic,
		    game_state_after_selection,
		    card_selected_count;

		// TODO - this isn't as simple as just selecting the cards. Be careful about this.

		// select the card then check how many cards
		// are selected. do appropriate actions
		self.AC.toggleSelectionCardWithValues(card_values);
		game_state_after_selection = self.AC.getGameState();
		card_selected_count = game_state_after_selection.selection_count;

		if (card_selected_count === 3) {
			// if we select 3 cards, then we check
			// if those 3 are a proper set
			// we stop the timer for the blinking
			// FIXME - this doesn't stop the timer
			new_timer_logic = self.makeNewTimerLogicWithAction(
				SETS.HLP.timerLogicActions.STOP_TIMER, self.TIME_LEFT);

			if (game_state_after_selection.is_selection_proper) {
				// if we're a proper set, we make
				// the card action right
				updated_state = self.buildState(
					SETS.HLP.RG.NO_UPDATE, // user_name
					SETS.HLP.RG.NO_UPDATE, // points
					new_timer_logic,       // timer_logic
					SETS.HLP.cardActions.RIGHT,  // card_action
					SETS.HLP.RG.UPDATE_FOR_GRID // update for grid only
				);
			} else {
				// if we're not a proper set, we make
				// the card action wrong
				updated_state = self.buildState(
					SETS.HLP.RG.NO_UPDATE, // user_name
					SETS.HLP.RG.NO_UPDATE, // points
					new_timer_logic,       // timer_logic
					SETS.HLP.cardActions.WRONG,  // card_action
					SETS.HLP.RG.UPDATE_FOR_GRID // update for grid only
				);
			}

			// finally, set the state to the new state
			self.setState(updated_state);

		} else {
			new_timer_logic = self.makeNewTimerLogicWithAction(
				SETS.HLP.timerLogicActions.CONTINUE_TIMER, self.TIME_LEFT);

			updated_state = self.buildState(
				SETS.HLP.RG.NO_UPDATE, // user_name
				SETS.HLP.RG.NO_UPDATE, // points
				new_timer_logic,       // timer_logic
				SETS.HLP.RG.NO_UPDATE,  // card_action
				SETS.HLP.RG.UPDATE_FOR_GRID // update for grid only
			);

			self.setState(updated_state);
		}
	}

	render() {
		let self = this;
		return React.createElement(
			"div",
			{className: "sets-game"},
			/* the point board for details about the user */
			React.createElement(SETSReactPointBoard, {
				user_name: self.state.user_name,
				points: self.state.points,
				timer_logic: self.state.timer_logic,
				update_for: self.state.update_for,
				// pass down the update method
				updateGame: (updateCode, data) => self.updateGame.apply(self, [updateCode, data])
			}),
			/* the grid for the cards */
			React.createElement(SETSReactGrid,
				{
					ac: self.AC,
					values: self.state.cards,
					selection: self.state.selection,
					window_width: window.innerWidth,
					card_action: self.state.card_action,
					update_for: self.state.update_for,
					// pass down the update method
					updateGame: (updateCode, data) => self.updateGame.apply(self, [updateCode, data])
				}),
			/* the credit box */
			SETS.HLP.createCreditReactElement()
		);
	}
}