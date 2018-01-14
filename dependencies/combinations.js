/**
 * Copyright (c) 2017 Robert M. Vunabandi
 * Created August 6th, 2017
 * Last Edited: Oct 7th, 2017
 * Licensed under the MIT license.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Functions:
 * - combinations_indexes:
 * 		Returns the indexes of a k-sized combinations
 * 		of elements in the given array.
 * - combinations(array, k): Get k-sized combinations of elements in the given array.
 *
 */

"use strict";
/**
 *
 * Generate all possible combinations of size @size from the
 * array @array.
 *
 * @name indexesCombinations
 *
 * @param {Array} array - array from which we get combinations
 * @param {Number} size - size of each combinations from the
 *      array.
 *
 * @return {Array}
 * */
function indexesCombinations(array, size) {

	// get the size of the array and make sure the it's the same or more than @size
	const L = array.length;
	console.assert(size <= L, "Size must be smaller than array length");
	console.assert(size > 0, "Size cannot be less than 1");

	// define variables
	let array_combinations = [],
	    indexes_adder = [];
	for (let i = 0; i < size; i += 1) {
		indexes_adder.push(i); // indexes_adder = [0, 1, 2, ... , size - 1]
	}

	/* Since order does not matter for combinations, we will generate
	nCr(@L, @size) indexes for subsets of size @size. At the end, we use
	those indexes to get the actual combinations in the next functions. */

	let current_index = size - 1;

	/* We make this while loop condition because @indexes_adder[0] will have to be
	[@size-1, @size, @size+2, ..., @L-1], which is an array of length @size.
	We keep modifying indexes_adder inside of this while loop. For example, if
	@array.length=5 and @size=3, then the last indexes_adder will have to be [2,3,4].
	@L-@size+1 = 5-3+1 = 3, we want indexes_adder[0] < 3, so 2. */

	while (indexes_adder[0] < L - size + 1) {
		while (indexes_adder[current_index] < L - (size - current_index - 1)) {
			// push a copy so things don't get modified
			array_combinations.push(indexes_adder.slice(0));
			indexes_adder[current_index] += 1;
		}
		current_index -= 1;

		if (current_index < 0) {
			break; // if ever the current index is < 0, it means we are done.
		}

		for (let i = current_index; i < size; i++) {
			indexes_adder[i] = i === current_index ? indexes_adder[i] + 1 : indexes_adder[i - 1] + 1;
		}

		while (indexes_adder[current_index + 1] < L - (size - current_index - 1)) {
			current_index++;
			/* this if condition is not needed, but it's good practice to
			have it because essentially would check
			if undefined < @L - (@size - @current_index - 1), which returns false
			but that's "wrong". */
			// if (current_index == size - 1) break;
		}
	}
	// return a copy so that things don't get modified internally
	return array_combinations.slice(0);
}

function combinations(array, size) {
	// get the indexes. This will throw an assertion error if array.length < size
	let indexes = indexesCombinations(array, size);

	// from the indexes, figure out the combinations
	let res = [];
	for (let i = 0; i < indexes.length; i++) {
		let temp = [],
		    currentIndexes = indexes[i];
		for (let j = 0; j < currentIndexes.length; j++) {
			temp.push(array[currentIndexes[j]]);
		}
		res.push(temp.slice(0));
	}
	return res;
}

/**
 *
 * How this works:
 * ===============
 *
 * (Just an FYI, I use "@" to reference variables used in functions)
 *
 * For example, d = combinations(["I", "Love", "Like", "You"], 3) should produce
 * d = [["I","Love","Like"],["I","Love","You"],["I","Like","You"],"Love","Like","You"]].
 *
 * The main part is the @indexesCombinations. This functions comes from the fact that
 * a combination of things does not need an order. Therefore, if we need to have
 * combinations of size @size from an array of length @array.length or @L,
 * we only need the indexes of all the possible combinations. We can find those
 * combinations by listing all the numbers of length @size that contain uniquely digits
 * in the range [0-@L-1] (where for each number no digit repeats) in order of growth
 * (Now, this logic may not apply for numbers at index > 10, but the idea is listing
 * the digits in "order of growth". For example: 0 11 22 comes before 0 12 22 which
 * comes before 10 12 22, which this algorithm does).
 *
 * Listing all these digits gives all the possible indexes for combinations. Then,
 * we form the combinations based on those indexes. Hope that makes sense. Here's an
 * example to illustrate.
 *
 * array = ["I", "Love", "Like", "You"]
 * digitIndexes = [0, 1, 2, 3]
 * List in "order of growth": [012, 013, 023, 123]
 * List in "order of growth" in an array: [[0,1,2],[0,1,3],[0,2,3],[1,2,3]]
 * List corresponding to indexes, which is also the combinations:
 * * * [["I","Love","Like"],["I","Love","You"],["I","Like","You"],"Love","Like","You"]]
 *
 * The algorithm written works in a way to add up the numbers just like they would
 * appear in that second list in "order of growth". The way to do it is a bit hard to
 * explain however, so I will leave it to readers to understand.
 *
 */