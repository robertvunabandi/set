'use strict';

class SETSReactRow extends React.Component {


	constructor(props) {
		super(props);
		let self = this;
		self.state = self.constructNewState(props);
		// make the key for this a concatenation of all the single values
		self.key = self.state.value_array.map(function(values) {
			return values.join("");
		}).join("");
	}

	componentWillReceiveProps(nextProps) {
		// basically the same as constructor
		let self = this;
		self.setState(self.constructNewState(nextProps));
	}

	constructNewState(props) {
		let self = this, updated_state = {
			// the value array for the cards on this row
			value_array: props.value_array,
			// array of booleans
			selected_array: props.selected_array,
			// get the action to be passed in to every cards
			card_action: props.card_action,
			// the update game method
			updateGame: props.updateGame
		};

		updated_state.react_cards = updated_state.value_array.map(function (values, index) {
			// for each set of values in the value array,
			// we make a SETSReactCard out of it
			return React.createElement(SETSReactCard, {
				values: values,
				is_selected: updated_state.selected_array[index],
				card_action: updated_state.card_action,
				row_parent: self,
				// pass down the updateGame method
				updateGame: updated_state.updateGame
			});
		});

		SETSReactRow.assertValidCardCount(updated_state.value_array.length);
		SETSReactRow.assertValidSelectedArrayCount(updated_state.selected_array.length,
			updated_state.value_array.length);

		return updated_state;
	}



	static assertValidCardCount(card_count) {
		let message = 'invalid card count. Must be either 3, 4, 5, or 6';
		console.assert(card_count >= 3 && card_count <= 6, message);
	}

	static assertValidSelectedArrayCount(selection_array_count, card_count) {
		let message = 'selection_array_count does not match card_count';
		console.assert(selection_array_count === card_count, message);
	}

	componentDidMount() {
		let self = this;
	}

	render() {
		let self = this;
		return React.createElement(
			"div",
			{
				className: `card-row`,
				key: self.key},
			self.state.react_cards
		);
	}
}