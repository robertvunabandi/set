"use strict";

class ReactModalOverrideGame extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let self = this;
		return React.createElement('div', null,
			React.createElement('h1', null, 'Do you want to start over?'),
			// add buttons to confirm or cancel
			React.createElement('div', null,
				React.createElement('input', {
					type: "button",
					value: "Cancel",
					onClick: function() {
						self.props.cancelHandler();
					},
				}),
				React.createElement('input', {
					type: "button",
					value: "Yes I'm Sure",
					onClick: function() {
						// set the user name and max times
						// use default values if any of them are invalid
						self.props.startHandler();
					},
				})
			)
		);
	}
}

class ReactModalStartNewGame extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			max_time: 40
		};
	}

	static isTimeValid(time) {
		return SETS.HLP.isInteger(time) && (time >= 10) && (time <= 40);
	}

	static isNameValid(name) {
		if (typeof name === 'string') {
			if (name.length > 5) {
				return true;
			}
		}
		return false;
	}

	render() {
		let self = this;
		return React.createElement('div', null,
			React.createElement('h1', null, 'New Game'),
			// ask for name
			React.createElement('div', null, 'Your name: ',
				React.createElement('input', {
					type: "text",
					onChange: function(e) {
						let updated_state = {
							name: e.target.value,
							max_time: self.state.max_time
						};
						self.setState(updated_state);
					},
					value: this.state.name
				})
			),
			// ask for maximum iteration time
			React.createElement('div', null, 'Choose a round time: ',
				React.createElement('input', {
					type: "number",
					onChange: function(e) {
						let time = parseInt(e.target.value),
							updated_state = {
							name: self.state.name,
							max_time: time
						};
						if (ReactModalStartNewGame.isTimeValid(time)) {
							self.setState(updated_state);
						}
					},
					value: this.state.max_time,
					min: 10,
					max: 40
				})
			),
			// TODO - add a "what's this?" somehow here about the round time
			// add buttons to confirm or cancel
			React.createElement('div', null,
				React.createElement('input', {
					type: "button",
					value: "Cancel",
					onClick: function() {
						self.props.cancelHandler();
						},
				}),
				React.createElement('input', {
					type: "button",
					value: "Start",
					onClick: function() {
						// set the user name and max times
						// use default values if any of them are invalid
						SETS.HLP.userName =
							ReactModalStartNewGame.isNameValid(self.state.name) ?
								self.state.name : "Anonymous";
						SETS.HLP.userMaxTime =
							ReactModalStartNewGame.isTimeValid(self.state.max_time) ?
								self.state.max_time * 1000 : 40000;
						console.log(self.state);
						self.props.startHandler();
					},
				})
			)
		);
	}


}

class SETSModal {
	constructor() {
		this.modal = document.getElementById('modal');
		this.modal_init = document.getElementById('modal-init');
		this.timeout = null;
		this.react_content = null;
		// run the functions on startup
		this.onMounted();
	}

	onMounted() {
		this.setHeightSetterListener();
		this.hide();
	}

	setHeightSetterListener() {
		// add event listener for this to resize the height
		window.addEventListener('resize', () => this.setFullHeight.call(this));
	}
	setFullHeight() {
		this.modal.style.height = window.innerHeight + 'px';
	}

	clearTimeout() {
		clearTimeout(this.timeout);
	}

	show() {
		let modal = this.modal, self = this;
		this.clearTimeout();
		modal.setAttribute('visible', true);
		this.timeout = setTimeout(function() {
			modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
			self.render();
		}, 10);
	}

	hide() {
		let modal = this.modal;
		this.clearTimeout();
		this.unRender();
		modal.style.backgroundColor = 'rgba(0,0,0,0.0)';
		this.timeout = setTimeout(function() {
			modal.setAttribute('visible', false);
		}, 210);
	}

	toggle() {
		if (this.modal.getAttribute('visible') === 'true') {
			this.hide();
		} else {
			this.show();
		}
	}

	setContent(react_content) {
		if (SETSModal.isValidComponent(react_content)) {
			this.react_content = react_content;
			this.render();
		} else {
			console.warn("invalid content parameter:", react_content);
		}
	}

	static isValidComponent(react_content) {
		if (!react_content) {
			return false;
		}
		switch (react_content.type) {
			case ReactModalStartNewGame:
			case ReactModalOverrideGame:
				return true;
			default:
				return false;
		}
	}

	removeContent() {
		this.react_content = null;
	}



	render() {
		if (this.modal.getAttribute('visible') === 'true') {
			ReactDOM.render(this.react_content, this.modal_init);
		}
	}

	unRender() {
		if (this.modal.getAttribute('visible') === 'true') {
			ReactDOM.render(null, this.modal_init);
		}
	}
}