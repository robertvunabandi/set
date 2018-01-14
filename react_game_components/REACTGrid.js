'use strict';

class SETSReactGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			values: props.values,
			selection: props.selection,
			// window_width is in pixels
			window_width: props.window_width,
			card_action: props.card_action,
			// the update game method
			updateGame: props.updateGame
		};

		SETSReactGrid.assertValidCardCount(SETSReactGrid.getValidCardCount(this.state.values));
		this.warnSmallWidth();
		// make the key for this a concatenation of all the single values
		this.key = this.state.values.map(function(values) {
			if (values) {
				return values.join("");
			} else {
				return "";
			}
		}).join("");

	}

	componentWillReceiveProps(nextProps) {
		let self = this;
		// first, check if the update is for GRID, if
		// it is, then update. If not, do nothing.
		if (nextProps.update_for === SETS.HLP.RG.UPDATE_FOR_BOTH ||
			nextProps.update_for === SETS.HLP.RG.UPDATE_FOR_GRID) {
			self.receiveUpdatedProps(nextProps);
		}
	}

	receiveUpdatedProps(nextProps) {
		let self          = this,
		    updated_state = {
			    // see constructor for details
			    values: nextProps.values,
			    selection: nextProps.selection,
			    window_width: nextProps.window_width,
			    card_action: nextProps.card_action,
			    updateGame: nextProps.updateGame
		    };
		self.setState(updated_state);

		SETSReactGrid.assertValidCardCount(SETSReactGrid.getValidCardCount(this.state.values));
		self.warnSmallWidth();
		// make the key for this a concatenation of all the single values
		self.key = this.state.values.map(function(values) {
			if (values) {
				return values.join("");
			} else {
				return "";
			}
		}).join("");
	}

	componentDidMount() {
		let self = this;
		// when the component is mounted, it means
		// we have access to the global window. Now,
		// we will update the grid with the new
		// window.innerWidth in case the window
		// re-sizes. This ensures that we display
		// cards the best possible way as we have
		// created multiple methods to do so below.
		$(window).resize(function() {
			let new_props = {
				values: self.props.values,
				selection: self.props.selection,
				window_width: window.innerWidth,
				card_action: self.props.card_action,
				updateGame: self.props.updateGame
			};
			self.componentWillReceiveProps(new_props);
		});
	}

	static getValidCardCount(values) {
		// values is expected to be of length 18 and
		// ordered, so all the null values are at the
		// end and the non-null are at the beginning
		// from index 0.
		let i = 17;
		for (i; i > -1; i -= 1) {
			if (values[i] !== null) {
				return i + 1;
			}
		}
		return 0;
	}

	canHaveNCardsInARow(n) {
		let safety_width_addition   = 80, // pixels of safety addition
		    card_separation_w       = 20, // max numbers of pixels between each card
		    window_w                = this.state.window_width,
		    card_w                  = SETS.HLP.editableCardWidth,
		    card_separation_count   = n - 1,
		    total_card_separation_w = card_separation_w * (card_separation_count),
		    total_card_w            = card_w * n;

		console.assert(n > 1, "n must be > 1");
		return window_w > total_card_w + total_card_separation_w + safety_width_addition;
	}

	static throwInvalidValueCountError(value) {
		throw new Error('ReactGrid: Invalid Value (Received: ' + value.toString() + ') Error!');
	}

	static assertValidCardCount(valid_card_count) {
		let message = 'SETSReactGrid: Invalid Valid Card Count Received. Must be divisible by 3.';
		console.assert(SETS.HLP.isInteger(Math.round(valid_card_count / 3)), message);
	}

	warnSmallWidth() {
		let message = new StringBuffer();
		// if placing 4 cards on the window is
		// longer than the window width, then
		// we say that the window is too small
		if (SETS.HLP.editableCardWidth * 4 > this.state.window_width) {
			message.append('SETSReactGrid: The window width (');
			message.append(this.state.window_width);
			message.append(') is too small. Game may not be enjoyable');
			console.warn(message.toString());
		}
	}

	static assertExpectedValueLength(values, exp_len) {
		let error_message = `SETSReactGrid::layout${exp_len}: Values must be of length ${exp_len}`;
		console.assert(values.length === exp_len, error_message);
	}

	static assertValuesValidLength(values_length) {
		console.assert(values_length <= 6, 'Value length cannot exceed 6');
		console.assert(values_length >= 3, 'Value length must be greater than 2');
	}

	// TODO - BAD DESIGN: See next two lines
	// The design below is very bad. Whenever I need to add something new, I need to
	// go through every layouts. This is bad. I should think of something more efficient

	static row(values, selection, card_action, updateGameMethod) {
		SETSReactGrid.assertValuesValidLength(values.length);
		return React.createElement(SETSReactRow, {
			value_array: values,
			selected_array: selection,
			card_action: card_action,
			// pass down the updateGame method
			updateGame: updateGameMethod
		});
	}

	/* Each of the following layout return an array of
	SETSReactRow. The rows must be used to build the
	actual grid of cards. */

	static layout369(values, selection, card_action, updateGameMethod) {
		// layouts for either 3, 6, or 9 cards
		let values_row_1, values_row_2, values_row_3,
		    selection_1, selection_2, selection_3;

		switch (values.length) {
			case 3:
				values_row_1 = values.slice(0, 3);
				selection_1 = selection.slice(0, 3);

				return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod)];
			case 6:
				values_row_1 = values.slice(0, 3);
				selection_1 = selection.slice(0, 3);
				values_row_2 = values.slice(3, 6);
				selection_2 = selection.slice(3, 6);

				return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod),
					SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod)];
			case 9:
				values_row_1 = values.slice(0, 3);
				selection_1 = selection.slice(0, 3);
				values_row_2 = values.slice(3, 6);
				selection_2 = selection.slice(3, 6);
				values_row_3 = values.slice(6, 9);
				selection_3 = selection.slice(6, 9);

				return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod),
					SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod),
					SETSReactGrid.row(values_row_3, selection_3, card_action, updateGameMethod)];
			default:
				SETSReactGrid.throwInvalidValueCountError(values.length);
		}
	}

	static layout12_3rows_4cards(values, selection, card_action, updateGameMethod) {
		let values_row_1 = values.slice(0, 4),
		    selection_1  = selection.slice(0, 4),
		    values_row_2 = values.slice(4, 8),
		    selection_2  = selection.slice(4, 8),
		    values_row_3 = values.slice(8, 12),
		    selection_3  = selection.slice(8, 12);

		SETSReactGrid.assertExpectedValueLength(values, 12);
		SETSReactGrid.assertExpectedValueLength(selection, 12);

		return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_3, selection_3, card_action, updateGameMethod)];
	}

	static layout12_4rows_3cards(values, selection, card_action, updateGameMethod) {
		let values_row_1 = values.slice(0, 3),
		    selection_1  = selection.slice(0, 3),
		    values_row_2 = values.slice(3, 6),
		    selection_2  = selection.slice(3, 6),
		    values_row_3 = values.slice(6, 9),
		    selection_3  = selection.slice(6, 9),
		    values_row_4 = values.slice(9, 12),
		    selection_4  = selection.slice(9, 12);

		SETSReactGrid.assertExpectedValueLength(values, 12);
		SETSReactGrid.assertExpectedValueLength(selection, 12);

		return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_3, selection_3, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_4, selection_4, card_action, updateGameMethod)];
	}

	static layout15_3rows_5cards(values, selection, card_action, updateGameMethod) {
		let values_row_1 = values.slice(0, 5),
		    selection_1  = selection.slice(0, 5),
		    values_row_2 = values.slice(5, 10),
		    selection_2  = selection.slice(5, 10),
		    values_row_3 = values.slice(10, 15),
		    selection_3  = selection.slice(10, 15);

		SETSReactGrid.assertExpectedValueLength(values, 15);
		SETSReactGrid.assertExpectedValueLength(selection, 15);

		return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_3, selection_3, card_action, updateGameMethod)];
	}

	static layout15_4rows_4cards(values, selection, card_action, updateGameMethod) {
		let values_row_1 = values.slice(0, 4),
		    selection_1  = selection.slice(0, 4),
		    values_row_2 = values.slice(4, 8),
		    selection_2  = selection.slice(4, 8),
		    values_row_3 = values.slice(8, 12),
		    selection_3  = selection.slice(8, 12),
		    values_row_4 = values.slice(12, 15),
		    selection_4  = selection.slice(12, 15);

		SETSReactGrid.assertExpectedValueLength(values, 15);
		SETSReactGrid.assertExpectedValueLength(selection, 15);

		return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_3, selection_3, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_4, selection_4, card_action, updateGameMethod)];
	}

	static layout15_5rows_3cards(values, selection, card_action, updateGameMethod) {
		let values_row_1 = values.slice(0, 3),
		    selection_1  = selection.slice(0, 3),
		    values_row_2 = values.slice(3, 6),
		    selection_2  = selection.slice(3, 6),
		    values_row_3 = values.slice(6, 9),
		    selection_3  = selection.slice(6, 9),
		    values_row_4 = values.slice(9, 12),
		    selection_4  = selection.slice(9, 12),
		    values_row_5 = values.slice(12, 15),
		    selection_5  = selection.slice(12, 15);

		SETSReactGrid.assertExpectedValueLength(values, 15);
		SETSReactGrid.assertExpectedValueLength(selection, 15);

		return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_3, selection_3, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_4, selection_4, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_5, selection_5, card_action, updateGameMethod)];
	}

	static layout18_3rows_6cards(values, selection, card_action, updateGameMethod) {
		let values_row_1 = values.slice(0, 6),
		    selection_1  = selection.slice(0, 6),
		    values_row_2 = values.slice(6, 12),
		    selection_2  = selection.slice(6, 12),
		    values_row_3 = values.slice(12, 18),
		    selection_3  = selection.slice(12, 18);

		SETSReactGrid.assertExpectedValueLength(values, 18);
		SETSReactGrid.assertExpectedValueLength(selection, 18);

		return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_3, selection_3, card_action, updateGameMethod)];
	}

	static layout18_4rows_5cards(values, selection, card_action, updateGameMethod) {
		let values_row_1 = values.slice(0, 5),
		    selection_1  = selection.slice(0, 5),
		    values_row_2 = values.slice(5, 10),
		    selection_2  = selection.slice(5, 10),
		    values_row_3 = values.slice(10, 15),
		    selection_3  = selection.slice(10, 15),
		    values_row_4 = values.slice(15, 18),
		    selection_4  = selection.slice(15, 18);

		SETSReactGrid.assertExpectedValueLength(values, 18);
		SETSReactGrid.assertExpectedValueLength(selection, 18);

		return [SETSReactGrid.row(values_row_1, selection_1, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_3, selection_3, card_action, updateGameMethod),
			SETSReactGrid.row(values_row_4, selection_4, card_action, updateGameMethod)];
	}

	static layout18_5rows_4cards(values, selection, card_action, updateGameMethod) {
		let values_row_1 = values.slice(0, 15),
		    selection_1  = selection.slice(0, 15),
		    values_row_2 = values.slice(15, 18),
		    selection_2  = selection.slice(15, 18);

		SETSReactGrid.assertExpectedValueLength(values, 18);
		SETSReactGrid.assertExpectedValueLength(selection, 18);

		return SETSReactGrid.layout15_4rows_4cards(values_row_1, selection_1, card_action, updateGameMethod)
			.concat([SETSReactGrid.row(values_row_2, selection_2, card_action, updateGameMethod)]);
	}

	static layout18_6rows_3cards(values, selection, card_action, updateGameMethod) {
		let values_row_1 = values.slice(0, 9),
		    selection_1  = selection.slice(0, 9),
		    values_row_2 = values.slice(9, 18),
		    selection_2  = selection.slice(9, 18);

		SETSReactGrid.assertExpectedValueLength(values, 18);
		SETSReactGrid.assertExpectedValueLength(selection, 18);

		return SETSReactGrid.layout369(values_row_1, selection_1, card_action, updateGameMethod)
			.concat(SETSReactGrid.layout369(values_row_2, selection_2, card_action, updateGameMethod));
	}

	render() {
		let self             = this,
		    sets_rows_array,
		    values           = self.state.values,
		    selection        = self.state.selection,
		    card_action      = self.state.card_action,
		    updateGameMethod = self.state.updateGame,
		    valid_card_count = SETSReactGrid.getValidCardCount(values);

		switch (valid_card_count) {
			case 3:
				// contains 1 SETSReactRow
				sets_rows_array = SETSReactGrid
					.layout369(values.slice(0, 3), selection, card_action, updateGameMethod);
				break;
			case 6:
				// contains 2 SETSReactRow
				sets_rows_array = SETSReactGrid
					.layout369(values.slice(0, 6), selection, card_action, updateGameMethod);
				break;
			case 9:
				// contains 3 SETSReactRow
				sets_rows_array = SETSReactGrid
					.layout369(values.slice(0, 9), selection, card_action, updateGameMethod);
				break;
			case 12:
				if (self.canHaveNCardsInARow(4)) {
					// contains 3 SETSReactRow
					sets_rows_array = SETSReactGrid
						.layout12_3rows_4cards(values.slice(0, 12),
							selection.slice(0, 12),
							card_action, updateGameMethod);
				} else {
					// contains 4 SETSReactRow
					sets_rows_array = SETSReactGrid
						.layout12_4rows_3cards(values.slice(0, 12),
							selection.slice(0, 12),
							card_action, updateGameMethod);
				}
				break;
			case 15:
				if (self.canHaveNCardsInARow(5)) {
					// contains 3 SETSReactRow
					sets_rows_array = SETSReactGrid
						.layout15_3rows_5cards(values.slice(0, 15),
							selection.slice(0, 15),
							card_action, updateGameMethod);
				} else if (self.canHaveNCardsInARow(4)) {
					// contains 4 SETSReactRow
					sets_rows_array = SETSReactGrid
						.layout15_4rows_4cards(values.slice(0, 15),
							selection.slice(0, 15),
							card_action, updateGameMethod);
				} else {
					// contains 5 SETSReactRow
					sets_rows_array = SETSReactGrid
						.layout15_5rows_3cards(values.slice(0, 15),
							selection.slice(0, 15),
							card_action, updateGameMethod);
				}
				break;
			case 18:
				if (self.canHaveNCardsInARow(6)) {
					// contains 3 SETSReactRow
					sets_rows_array = SETSReactGrid
						.layout18_3rows_6cards(values.slice(0, 18),
							selection.slice(0, 18),
							card_action, updateGameMethod);
				} else if (self.canHaveNCardsInARow(5)) {
					// contains 4 SETSReactRow
					sets_rows_array = SETSReactGrid
						.layout18_4rows_5cards(values.slice(0, 18),
							selection.slice(0, 18),
							card_action, updateGameMethod);
				} else if (self.canHaveNCardsInARow(4)) {
					// contains 5 SETSReactRow
					sets_rows_array = SETSReactGrid
						.layout18_5rows_4cards(values.slice(0, 18),
							selection.slice(0, 18),
							card_action, updateGameMethod);
				} else {
					// contains 6 SETSReactRow
					sets_rows_array = SETSReactGrid
						.layout18_6rows_3cards(values.slice(0, 18),
							selection.slice(0, 18),
							card_action, updateGameMethod);
				}
				break;
			default:
				SETSReactGrid.throwInvalidValueCountError(valid_card_count);
		}

		return React.createElement(
			"div",
			{
				className: "card-grid",
				key: self.key
			},
			sets_rows_array
		);
	}
}

/*
	Example test:

	// props.cards
	let cards_test, props, parent_dom, test_grid, selection;
	cards_test = [
		[1,0,1,2], [0,1,0,1], [0,1,1,2],
		[1,0,2,1], [2,2,1,0], [0,2,2,2],
		[1,0,1,1], [2,0,0,0], [0,2,2,0],
		[0,0,0,2], [1,2,1,0], [0,2,1,2],
		[1,1,0,0], [1,1,0,2], [1,1,0,1],
		[1,1,2,1], [2,1,0,0], [0,1,0,2]];

	selection = [false, false, false,
		false, false, false,
		false, false, false,
		false, false, false,
		false, false, false,
		false, false, false];
	parent_dom = document.getElementById('game-init');
	// props
	props = {window_width: window.innerWidth, cards: cards_test, selection: selection};
	test_grid = React.createElement(SETSReactGrid, props);

	ReactDOM.render(test_grid, parent_dom);

	$(window).resize(function() {
		props = {window_width: window.innerWidth, cards: cards_test, selection: selection};
		test_grid = React.createElement(SETSReactGrid, props);
		ReactDOM.render("-", parent_dom);
		ReactDOM.render(test_grid, parent_dom);
	});
	*/