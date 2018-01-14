'use strict';
class StringBuffer {
	constructor(...args) {
		this.buffer = [];
		this.index = 0;
		for (let j = arguments.length; this.index < j; this.index += 1) {
			this.buffer[this.index] = arguments[this.index];
		}
	}

	append(string) {
		this.buffer[this.index] = string;
		this.index += 1;
		return this;
	}

	toString() {
		return this.buffer.join("");
	}

	static isStringBuffer(stringBuffer) {
		return stringBuffer instanceof StringBuffer;
	}
}
