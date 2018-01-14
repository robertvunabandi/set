"use strict";

/**
 * Here we define the building blocks of a Card,
 * which are Color, Shape, Interior, Number and
 * are abbreviated CSIN by convention (this
 * convention also includes that specific order)
 *
 * Each of the four Constructors will take as
 * input an integer in the range [0-2]. */

SETS.__setValueAndName = function(constructor_type, value) {
	SETS.HLP.assertValueIsValid(value);
	this.value = value;
	this.name = SETS.HLP.getPossibles(constructor_type)[value];
};

SETS.Color = function Color(value) {
	SETS.__setValueAndName.apply(this, ["color", value]);
	this.hex = SETS.HLP.hexColorMap[this.name];
};

SETS.Shape = function Shape(value) {
	SETS.__setValueAndName.apply(this, ["shape", value]);
};

SETS.Interior = function Interior(value) {
	SETS.__setValueAndName.apply(this, ["interior", value]);
};

SETS.Number = function Number(value) {
	SETS.__setValueAndName.apply(this, ["number", value]);
};

SETS.Card = function Card(color, shape, interior, number) {
	let self = this,
	    drawn = false;

	self.color = new SETS.Color(color);
	self.shape = new SETS.Color(shape);
	self.interior = new SETS.Color(interior);
	self.number = new SETS.Color(number);

	self.getValueArray = function() {
		let c = self.color.value,
		    s = self.shape.value,
		    i = self.interior.value,
		    n = self.number.value;
		return [c, s, i, n];
	};

	self.getValueString = function() {
		return self.getValueArray().join("");
	};

	self.setStatusToDrawn = function() {
		drawn = true;
	};

	self.isDrawn = function() {
		return drawn === true;
	};
};


// we introduce the following function here because
// it makes use of SETS.Card, which gets defined only
// later.
SETS.HLP.isSetProper = function (set) {
	/*
	We say that a set of 3 card is a proper set iff
	for each of the characteristic in that set (csin),
	they are either all the same or all different.
	For example, [(0,0,0,0), (0,0,0,1), (0,0,0,2)] is
	a proper set  but [(2,0,1,0), (2,0,0,1), (2,0,0,2)]
	is not a proper set.  It's always guaranteed that
	one characteristic is different. However, all can
	be simultaneously different. */
	let color_values    = [],
	    shape_values    = [],
	    interior_values = [],
	    number_values   = [];

	if (set.length !== 3) {
		return false;
	}

	// this should push 4 values assuming the cards are
	// instances of cards
	try {
		set.forEach(function(card) {
			if (!(card instanceof SETS.Card)) {
				// throw an error to get out of this loop
				throw new Error();
			}
			color_values.push(card.color.value);
			shape_values.push(card.shape.value);
			interior_values.push(card.interior.value);
			number_values.push(card.number.value);
		});
	} catch (e) {
		return false;
	}

	/* there should be 3 values, each of which must be
	either 0, 1, or 2. if they are all different or all
	the same then return true. Otherwise return false.
	This function is declared inside this function because
	it should not be modified and will only be called
	inside. */
	function isRight(values) {
		if (values[0] === values[1]) {
			return (values[1] === values[2]);
		} else {
			return (values[1] !== values[2]) && (values[0] !== values[2]);
		}
	}

	return (isRight(color_values)) &&
		(isRight(shape_values)) &&
		(isRight(interior_values)) &&
		(isRight(number_values));
};