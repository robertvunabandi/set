'use strict';
/** React Card Implemention */

/*
This class had to be a bit nasty, but it had to be
because the shapes are made in SVG format.

To render a card, we need the four characteristics
in order (c, s, i, n) placed in the props.values.
Using those, we can render the card. There is a
different SVG for each shape obviously, which is
why there are two cases for each
getPrincipal<Shape>() method.
*/
class SETSReactCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			values: props.values,
			selected: props.is_selected,
			/* three possible card action:
			NOTHING, WRONG, and RIGHT:
			- on NOTHING, do nothing
			- on WRONG, make the card blink red then
				set it unselected (if is_selected)
			- on RIGHT, make the card blink green then
				set it unselected (if is_selected)
			At the end of either WRONG or RIGHT,
			emit the event that we need to get new
			cards from VisibleCards.
			Actions are defined in helpers. */
			action: props.card_action,
			/* this is the parent REACTRow that has this card */
			row_parent: props.row_parent,
			class_name: "card",
			// the update game method
			updateGame: props.updateGame
		};

		// all the logic of card_action require the following variables
		this.classNames = {
			right: "card-highligted-right",
			wrong: "card-highligted-wrong",
			timeout: "card-highligted-timout",
			highlight: "card-highligted"
		};
		this.max_action_blink_count = 2;
		this.highlight_delay = 100;
		this.key = this.props.values.join("");

	}

	componentWillReceiveProps(nextProps) {
		let self = this, updated_state = {
			values: nextProps.values,
			selected: nextProps.is_selected,
			action: nextProps.card_action,
			row_parent: self.state.row_parent,
			class_name: nextProps.is_selected ? `card ${self.classNames.highlight}`: "card",
			// the update game method
			updateGame: nextProps.updateGame
		};
		self.setState(updated_state);

		setTimeout(function () {
			// we perform the action only if this card
			// is selected.
			if (updated_state.selected) {
				self.performAction();
			}
		}, self.highlight_delay);
	}

	static throwInvalidValueError() {
		throw new Error('SETSReactCard: Invalid Value Argument Received.');
	}

	updateClassName() {
		let self = this,
		    updated_state = self.state;

		if (self.state.selected) {
			updated_state.class_name = `card ${self.classNames.highlight}`;
		} else {
			updated_state.class_name = 'card';
		}
		self.setState(updated_state);
	}

	onClick() {
		let self = this;
		self.state.updateGame(SETS.HLP.RG.SUD.CARD_CLICKED, self.state.values);
	}

	componentDidMount() {
		let self = this;
		// update the class name in case this card is selected
		this.updateClassName();

		setTimeout(function () {
			// we perform the action only if this card
			// is selected.
			if (self.state.selected) {
				self.performAction();
			}
		}, self.highlight_delay);
	}

	performAction() {
		let self = this;
		// perform the action in case it's not NOTHING
		switch (self.state.action) {
			case SETS.HLP.cardActions.RIGHT:
				self.indicateSelectionOutcome(self.classNames.right, 0, true);
				break;
			case SETS.HLP.cardActions.WRONG:
				self.indicateSelectionOutcome(self.classNames.wrong, 0, true);
				break;
			case SETS.HLP.cardActions.TIMEOUT:
				self.indicateSelectionOutcome(self.classNames.timeout, 0, true);
				break;
			default:
			// Empty block: do thing
		}
	}

	indicateSelectionOutcome(highlight_class_name, blink_count, set_hightighed) {
		let self          = this,
		    updated_state = self.state;

		if (set_hightighed) {
			self.setCardHighlighted(updated_state, highlight_class_name, blink_count);
		} else {
			self.setCardUnhighlighted(updated_state, highlight_class_name, blink_count);
		}
	}

	setCardHighlighted(updated_state, highlight_class_name, blink_count) {
		let self  = this,
		    delay = SETSReactCard
			    .getDelay(self.highlight_delay, blink_count, self.max_action_blink_count);

		// updateOnCardClicked the card with the highlight class name
		updated_state.class_name = `card ${highlight_class_name}`;
		self.setState(updated_state);

		// let some delay before "unhighlighting" the card
		setTimeout(function () {
			self.indicateSelectionOutcome(highlight_class_name, blink_count, false);
		}, delay);
	}

	setCardUnhighlighted(updated_state, class_name, blink_count) {
		let self  = this,
		    delay = SETSReactCard
			    .getDelay(self.highlight_delay, blink_count, self.max_action_blink_count);

		// updateOnCardClicked the card with just the card class name
		updated_state.class_name = 'card';
		self.setState(updated_state);

		// let some delay before either highlighting it
		// again or setting the card unselected at last
		/*
		FIXME: SetTimeout is problematic because it will always be executed.
		That cause a problem that I am not aware of. It says:
		"Warning: Can only update a mounted or mounting component.
		This usually means you called setState, replaceState, or
		forceUpdate on an unmounted component. This is a no-op.
		Please check the code for the SETSReactCard component."
		*/
		setTimeout(function () {
			if (blink_count < self.max_action_blink_count) {
				self.indicateSelectionOutcome(class_name, blink_count + 1, true);
			} else {
				updated_state.selected = false;
				self.setState(updated_state);
				// We update based on the highlight. If it's
				// RIGHT or TIMEOUT, we want to set a new round,
				// in any case, we need to deselect those cards
				// so that this update is reflected
				self.updateOnHighlightCompletion(class_name);
			}
		}, delay);
	}

	static getDelay(high_light_delay, blink_count, max_blink_count) {
		return high_light_delay * ((max_blink_count - blink_count + 1) / max_blink_count);
	}

	updateOnHighlightCompletion(class_name) {
		// remove the cards and give points on RIGHT, then
		// new round. remove the cards and give no points
		// on TIMEOUT, then new round. deselect the cards
		// selected on WRONG. With all that, keep in mind
		// that 3 cards will call the same exact update
		// call 3 times, we need to work around that
		// See [REACTGame].SETSReactGame.cardUpdate for how
		// that was accomplished.
		let self = this, err_message;
		err_message = "SETSReactCard::updateOnHighlightCompletion: Invalid Class Name Argument";
		switch (class_name) {
			case self.classNames.right:
				self.state.updateGame(
					SETS.HLP.RG.SUD.HIGHLIGHT_COMPLETION_RIGHT);
				break;
			case self.classNames.timeout:
				self.state.updateGame(
					SETS.HLP.RG.SUD.HIGHLIGHT_COMPLETION_TIMEOUT);
				break;
			case self.classNames.wrong:
				self.state.updateGame(
					SETS.HLP.RG.SUD.HIGHLIGHT_COMPLETION_WRONG);
				break;
			default:
				throw new Error(err_message);
		}



	}

	componentWillUnmount() {
		// empty block...
	}

	getPrincipalLosenge(key) {
		let self = this, classi, classo;
		// switch between the value of the interior (i),
		// the color is taken care by style.css
		switch (self.state.values[2]) {
			case 0:
			case 2:
				return React.createElement(
					"span",
					{className: "symbol", key: `${self.key}-${key}`},
					React.createElement(
						"svg",
						{
							xmlns: "http://www.w3.org/2000/svg",
							viewBox: "0 0 24 48"
						}, React.createElement("polygon", {
							"className": `svg${self.state.values[0]}0${self.state.values[2]}`,
							points: "12 6 2 24 12 42 22 24 12 6"
						})));
			case 1:
				classi = `svg${self.state.values[0]}1${self.state.values[2]}-i`;
				classo = `svg${self.state.values[0]}1${self.state.values[2]}-o`;
				return React.createElement(
					"span",
					{className: "symbol", key: `${self.key}-${key}`},
					React.createElement(
						"svg",
						{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 48"},
						React.createElement(
							"g",
							null,
							React.createElement("polygon", {
								"className": classi,
								points: "4.8 18.96 19.2 18.96 18.65 17.98 5.35 17.98 4.8 18.96"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "2.58 22.96 21.42 22.96 20.88 21.98 3.12 21.98 2.58 22.96"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "10.31 38.96 13.69 38.96 14.23 37.98 9.77 37.98 10.31 38.96"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "3.7 20.94 20.3 20.94 19.78 20 4.22 20 3.7 20.94"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "12 42 12.01 41.98 11.99 41.98 12 42"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "11.41 40.94 12.59 40.94 13.11 40 10.89 40 11.41 40.94"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "5.92 16.94 18.08 16.94 17.59 16.06 6.41 16.06 5.92 16.94"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "6.99 15.02 17.01 15.02 16.47 14.04 7.53 14.04 6.99 15.02"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "4.74 28.94 19.26 28.94 19.78 28 4.22 28 4.74 28.94"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "5.87 30.96 18.13 30.96 18.68 29.98 5.32 29.98 5.87 30.96"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "9.19 36.94 14.81 36.94 15.33 36 8.67 36 9.19 36.94"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "3.65 26.96 20.36 26.96 20.9 25.98 3.1 25.98 3.65 26.96"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "8.09 34.96 15.91 34.96 16.46 33.98 7.54 33.98 8.09 34.96"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "2.52 24.94 21.48 24.94 22 24 2 24 2.52 24.94"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "10.33 9 13.67 9 13.15 8.06 10.85 8.06 10.33 9"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "6.96 32.94 17.04 32.94 17.56 32 6.44 32 6.96 32.94"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "9.21 11.02 14.79 11.02 14.24 10.04 9.76 10.04 9.21 11.02"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "11.43 7.02 12.57 7.02 12.02 6.04 11.98 6.04 11.43 7.02"
							}),
							React.createElement("polygon", {
								"className": classi,
								points: "8.11 13 15.89 13 15.37 12.06 8.63 12.06 8.11 13"
							})
						),
						React.createElement(
							"g",
							null,
							React.createElement("polygon", {
								"className": classo,
								points: "12 6 2 24 12 42 22 24 12 6"
							})
						)
					)
				);
			default:
				SETSReactCard.throwInvalidValueError();
		}
	}

	getPrincipalOval(key) {
		let self = this, classi, classo;
		// switch between the value of the interior (i),
		// the color is taken care by style.css
		switch (self.state.values[2]) {
			case 0:
			case 2:
				return React.createElement(
					"span",
					{className: "symbol", key: `${self.key}-${key}`},
					React.createElement(
						"svg",
						{
							xmlns: "http://www.w3.org/2000/svg",
							viewBox: "0 0 24 48"
						}, React.createElement("path", {
							"className": `svg${self.state.values[0]}0${self.state.values[2]}`,
							d: "M2,32a10,10,0,0,0,20,0V16A10,10,0,0,0,2,16Z"
						})));
			case 1:
				classi = `svg${self.state.values[0]}1${self.state.values[2]}-i`;
				classo = `svg${self.state.values[0]}1${self.state.values[2]}-o`;
				return React.createElement(
					"span",
					{className: "symbol", key: `${self.key}-${key}`},
					React.createElement(
						"svg",
						{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 48"},
						React.createElement(
							"g",
							null,
							React.createElement("path", {
								"className": classi,
								d: "M12,42a10.08,10.08,0,0,0,1.12-.07H10.88A10.08,10.08,0,0,0,12,42Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M3.28,36.89H20.72a9.94,9.94,0,0,0,.47-.94H2.82A9.94,9.94,0,0,0,3.28,36.89Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M4.79,38.92H19.21a10,10,0,0,0,.83-1H4A10,10,0,0,0,4.79,38.92Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M2.44,34.92H21.56a9.94,9.94,0,0,0,.24-1H2.19A9.94,9.94,0,0,0,2.44,34.92Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M7.44,40.89h9.11A10,10,0,0,0,18,40H6A10,10,0,0,0,7.44,40.89Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M2,32c0,.3,0,.6,0,.89H22c0-.3,0-.59,0-.89v0H2Z"
							}),
							React.createElement("rect", {
								"className": classi,
								x: "2",
								y: "19.96",
								width: "20",
								height: "0.94"
							}),
							React.createElement("rect", {
								"className": classi,
								x: "2",
								y: "23.96",
								width: "20",
								height: "0.94"
							}),
							React.createElement("rect", {
								"className": classi,
								x: "2",
								y: "21.93",
								width: "20",
								height: "0.98"
							}),
							React.createElement("rect", {
								"className": classi,
								x: "2",
								y: "16.02",
								width: "20",
								height: "0.88"
							}),
							React.createElement("rect", {
								"className": classi,
								x: "2",
								y: "17.93",
								width: "20",
								height: "0.98"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M4.9,9H19.1A10,10,0,0,0,18,8H6A10,10,0,0,0,4.9,9Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M12,6A9.94,9.94,0,0,0,7.7,7H16.3A9.94,9.94,0,0,0,12,6Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M2.05,15h19.9q-.05-.5-.15-1H2.2Q2.1,14.48,2.05,15Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M2.47,13H21.53a9.92,9.92,0,0,0-.35-.94H2.83A9.92,9.92,0,0,0,2.47,13Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M3.36,11H20.64A10,10,0,0,0,20,10H4A10,10,0,0,0,3.36,11Z"
							}),
							React.createElement("rect", {
								"className": classi,
								x: "2",
								y: "29.93",
								width: "20",
								height: "0.98"
							}),
							React.createElement("rect", {
								"className": classi,
								x: "2",
								y: "25.93",
								width: "20",
								height: "0.98"
							}),
							React.createElement("rect", {
								"className": classi,
								x: "2",
								y: "27.96",
								width: "20",
								height: "0.94"
							})
						),
						React.createElement(
							"g",
							{id: "oval"},
							React.createElement("path", {
								"className": classo,
								d: "M2,32a10,10,0,0,0,20,0V16A10,10,0,0,0,2,16Z"
							})
						)
					)
				);
			default:
				SETSReactCard.throwInvalidValueError();
		}
	}

	getPrincipalSquiggle(key) {
		let self = this, classi, classo;
		// switch between the value of the interior (i),
		// the color is taken care by style.css
		switch (self.state.values[2]) {
			case 0:
			case 2:
				return React.createElement(
					"span",
					{className: "symbol", key: `${self.key}-${key}`},
					React.createElement(
						"svg",
						{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 48"},
						React.createElement("path", {
							"className": `svg${self.state.values[0]}0${self.state.values[2]}`,
							d: "M4.5,12.75C4.5,9.5,8.69,6,13.25,6c6.63,0,8.62,3.36,8.62,5.08,0,2.34-4.87,5.08-4.87,12.79,0,4.21,2.58,6.54,2.5,11.13-.06,3.25-4.19,6.75-8.75,6.75-6.62,0-8.62-3.36-8.62-5.08C2.13,34.33,7,31.92,7,23.88,7,19.5,4.5,17.17,4.5,12.75Z"
						})
					)
				);
			case 1:
				classi = `svg${self.state.values[0]}1${self.state.values[2]}-i`;
				classo = `svg${self.state.values[0]}1${self.state.values[2]}-o`;
				return React.createElement(
					"span",
					{className: "symbol", key: `${self.key}-${key}`},
					React.createElement(
						"svg",
						{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 48"},
						React.createElement(
							"g",
							null,
							React.createElement("path", {
								"className": classi,
								d: "M2.92,34.9H19.5c0-.34,0-.67,0-1H3.62C3.36,34.27,3.13,34.59,2.92,34.9Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M5.45,40.88H15a10,10,0,0,0,1.55-.94H3.91A7.25,7.25,0,0,0,5.45,40.88Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M2.13,36.79s0,.05,0,.08h17a5,5,0,0,0,.3-.94H2.33A2.2,2.2,0,0,0,2.13,36.79Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M2.92,38.9H17.7a7.78,7.78,0,0,0,.8-1H2.36A4.5,4.5,0,0,0,2.92,38.9Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M5.91,18.9H17.83q.18-.51.38-1H5.55Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M5.19,16.88H18.7q.24-.46.49-.87H4.93C5,16.3,5.1,16.59,5.19,16.88Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M6.56,20.88H17.3c.06-.32.13-.64.21-.94H6.28C6.38,20.24,6.48,20.56,6.56,20.88Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M4.7,15H19.84l.67-1h-16Q4.61,14.48,4.7,15Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M7,24c0,.3,0,.58,0,.87H17c0-.29,0-.58,0-.88,0,0,0,0,0-.06H7S7,24,7,24Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M6.94,22.9H17c0-.34.06-.66.1-1H6.8Q6.89,22.39,6.94,22.9Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M5,11H21.85a3.38,3.38,0,0,0-.27-1h-16A6.34,6.34,0,0,0,5,11Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M13.25,6.13A9.69,9.69,0,0,0,9.38,7H18.2A13.13,13.13,0,0,0,13.25,6.13Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M4.5,12.88s0,0,0,.06H21.21A5.64,5.64,0,0,0,21.7,12H4.61A4.09,4.09,0,0,0,4.5,12.88Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M6.43,8.94H21A5.65,5.65,0,0,0,20,8H7.55A9.27,9.27,0,0,0,6.43,8.94Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M6.76,26.9H17.41c-.09-.32-.16-.65-.22-1H6.89C6.86,26.25,6.82,26.58,6.76,26.9Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M4.34,32.88h15q-.09-.48-.2-.94H4.93C4.73,32.27,4.54,32.58,4.34,32.88Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M6.29,28.88H18.08q-.17-.47-.34-.94H6.56C6.48,28.26,6.39,28.57,6.29,28.88Z"
							}),
							React.createElement("path", {
								"className": classi,
								d: "M5.49,30.9H18.81q-.16-.5-.34-1H5.93C5.79,30.26,5.64,30.59,5.49,30.9Z"
							})
						),
						React.createElement(
							"g",
							null,
							React.createElement("path", {
								"className": classo,
								d: "M4.5,12.75C4.5,9.5,8.69,6,13.25,6c6.63,0,8.62,3.36,8.62,5.08,0,2.34-4.87,5.08-4.87,12.79,0,4.21,2.58,6.54,2.5,11.13-.06,3.25-4.19,6.75-8.75,6.75-6.62,0-8.62-3.36-8.62-5.08C2.13,34.33,7,31.92,7,23.88,7,19.5,4.5,17.17,4.5,12.75Z"
							})
						)
					)
				);
			default:
				SETSReactCard.throwInvalidValueError();
		}
	}

	getSymbol(key) {
		let self = this;
		// switch between the type of shape (s)
		switch (self.state.values[1]) {
			case 0:
				return self.getPrincipalLosenge(key);
			case 1:
				return self.getPrincipalOval(key);
			case 2:
				return self.getPrincipalSquiggle(key);
			default:
				SETSReactCard.throwInvalidValueError();
		}
	}

	render() {
		let self         = this,
		    /* FIXME - there is a bug here, see description below.
		    So, when the cards go from having a set of 12 to 15,
		    things work ok. But then, when we're back to 12 cards,
		    it displays the error: "Cannot read property '3' of null"
		    Also, the following error message results:
		    The above error occurred in the <SETSReactCard> component:
                in SETSReactCard
                in div (created by SETSReactRow)
                in SETSReactRow (created by SETSReactGrid)
                in div (created by SETSReactGrid)
                in SETSReactGrid (created by SETSReactGame)
                in div (created by SETSReactGame)
                in SETSReactGame
		    */
		    symbol_count = self.state.values[3] + 1;

		return React.createElement(
			"div",
			{
				className: self.state.class_name,
				onClick: () => self.onClick(),
				key: self.state.values.join("")
			},
			// create an array of length symbol_count
			// from that array, return a new array
			// containing self.getSymbol() duplicated
			// symbol_count times
			Array.apply(null, Array(symbol_count)).map(function (value, index_key) {
				return self.getSymbol(index_key);
			})
		);
	}
}

// card_in_dom = ReactDOM.findDOMNode(this);