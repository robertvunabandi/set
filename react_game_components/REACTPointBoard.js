'use strict';

class SETSReactPointBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// name of the user
			user_name: props.user_name,
			// how many points the user currently have
			points: props.points,
			// the logic for the time
			timer_logic: props.timer_logic,
			// we use the variables display_time for the time we display on the screen
			display_time: null,
			// the update method, call this with a given code and data to update the game
			updateGame: props.updateGame
		};
		// we tick every 100 milliseconds
		this.tick_interval = 100;
	}

	componentWillReceiveProps(nextProps) {
		let self = this;
		// first, check if the update is for POINTBOARD,
		// if it is, then update. If not, do nothing.
		if (nextProps.update_for === SETS.HLP.RG.UPDATE_FOR_BOTH ||
			nextProps.update_for === SETS.HLP.RG.UPDATE_FOR_POINT_BOARD) {
			self.receiveUpdatedProps(nextProps);
		}
	}

	receiveUpdatedProps(nextProps) {
		let self          = this,
		    // see this.constructor(...) since this
		    // does the same thing
		    updated_state = {
			    user_name: nextProps.user_name,
			    points: nextProps.points,
			    timer_logic: nextProps.timer_logic,
			    display_time: null,
			    updateGame: nextProps.updateGame
		    };

		self.setState(updated_state);
		// because the timer logic does not update
		// quickly enough, we do it manually through
		// this line
		self.state.timer_logic = nextProps.timer_logic;
		self.componentDidMount();
	}

	fixDisplayTime() {
		let self          = this,
		    updated_state = self.state, len;
		updated_state.display_time = `${updated_state.timer_logic.time_left / 1000}`;
		len = updated_state.display_time.length;
		if (updated_state.display_time[len - 2] !== ".") {
			updated_state.display_time += ".0";
		}
		self.setState(updated_state);
	}

	/** When the state is mounted, we check what action to do */
	componentDidMount() {
		let self   = this,
		    action = self.state.timer_logic.timer_actions;

		switch (action) {
			case SETS.HLP.timerLogicActions.START_TIMER:
				self.startTimer();
				break;
			case SETS.HLP.timerLogicActions.CONTINUE_TIMER:
				self.continueTimer();
				break;
			case SETS.HLP.timerLogicActions.STOP_TIMER:
				self.stopTimer();
				break;
			case SETS.HLP.timerLogicActions.RESET_TIMER:
				self.resetTimer();
				break;
			case SETS.HLP.timerLogicActions.NO_TIMER_CHANGE:
				// basically do nothing here, just let it
				// be whatever it was before. we fix the
				// display time to display whatever was
				// there before
				self.fixDisplayTime();
				break;
			default:
				throw new Error("Invalid Timer Action Received:" + action.toString());
		}
	}

	componentWillUnmount() {
		// empty block...
	}

	/** Timer Logic */

	startTimer() {
		let self = this;
		self.resetTimer();
		self.timer_interval = setInterval(function () {
			self.tickTimer(self.tick_interval);
		}, self.tick_interval);
	}

	continueTimer() {
		let self = this;
		self.timer_interval = setInterval(function () {
			self.tickTimer();
		}, self.tick_interval);
	}

	resetTimer() {
		let self          = this,
		    updated_state = self.state;
		updated_state.timer_logic.time_left = updated_state.timer_logic.max_time;
		self.setState(updated_state);
		self.fixDisplayTime();

		// send how much time is left to the REACTGame component
		self.state.timer_logic.sendTimeLeft(updated_state.timer_logic.time_left);
	}

	tickTimer() {
		let self          = this,
		    updated_state = self.state;
		updated_state.timer_logic.time_left =
			updated_state.timer_logic.time_left - self.tick_interval;


		if (updated_state.timer_logic.time_left < 0) {
			// in case the time runs out, do the following
			// stop the interval
			clearInterval(self.timer_interval);
			// set the time to be 0
			updated_state.timer_logic.time_left = 0;
			// make sure we don't restart the timer by
			// explicitly setting no timer change
			updated_state.timer_logic.timer_actions = SETS.HLP.timerLogicActions.NO_TIMER_CHANGE;
			// set the state to the updated state
			self.setState(updated_state);
			// finally, update the game because user ran
			// out of time
			self.updateGameWithReachedMaximumTime();
		} else {
			// we just need to update the state with less time
			updated_state.timer_logic.timer_actions = SETS.HLP.timerLogicActions.NO_TIMER_CHANGE;
			self.setState(updated_state);
			self.fixDisplayTime();
		}
		// send how much time is left to the REACTGame component
		self.state.timer_logic.sendTimeLeft(updated_state.timer_logic.time_left);

	}

	stopTimer() {
		let self = this;
		clearInterval(self.timer_interval);
		if (self.state.timer_logic.add_points) {
			self.addPoints();
		}
	}

	updateGameWithReachedMaximumTime() {
		let self = this;
		self.state.updateGame(SETS.HLP.RG.SUD.MAX_TIME_REACHED, self.state.timer_logic.time_left);
		// run this to make the timer update with the new state
		self.componentDidMount();
	}

	/** Point logic */

	addPoints() {
		let self          = this,
		    updated_state = self.state;

		updated_state.points += self.__getPointsFromTime();
		self.setState(updated_state);
		self.state.updateGame(SETS.HLP.RG.SUD.REFLECT_POINT_INCREASE, updated_state.points);
	}

	/* This is a very important function. This is
	where we figure out how many points we add to
	the player. This should be a function of how
	difficult he chose his game to be. */
	__getPointsFromTime() {
		// TODO - Implement very carefully! This is the SAUCE of the game!!!
		let self  = this;

		// We just return the time_left for now. It's in ms, so we divide my 100.
		return self.state.timer_logic.time_left / 100;
	}

	/** Render */

	render() {
		let self = this;
		return React.createElement(
			"div",
			{className: 'point-board col-xs-12 col-sm-12 col-md-12 col-lg-12'},
			React.createElement(
				"div",
				// This is the first block containing the username and the points
				// right below it
				null,
				React.createElement(
					"span",
					{className: "pb-userblock col-xs-5 col-sm-4 col-md-3 col-lg-3"},
					React.createElement(
						"span",
						{className: 'pb-username'},
						self.state.user_name
					),
					React.createElement(
						"span",
						{className: 'pb-points'},
						React.createElement(
							"span",
							// this gets its own id because we can play around with its color
							{id: 'pb-points'},
							self.state.points
						),
						"points"
					)
				),
				// the timer
				React.createElement(
					"span",
					{className: 'pb-timerblock col-xs-7 col-sm-8 col-md-9 col-lg-9'},
					"time left = ",
					React.createElement(
						"span",
						{id: 'pb-time-left'},
						self.state.display_time
					),
					" sec"
				)
			)
		);
	}
}