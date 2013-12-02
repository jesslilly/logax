/**
 * @function
 * @public
 * @description Validate an argument hash/map.
 * @param {array}
 *            reqArgs - Array of strings listing required argument names.
 * @param {object}
 *            args - Object of the actual arguments.
 * @return {void}
 * @throws {Error}
 */
exports.validateArgs = function(reqArgs, args) {
	var missingArg = false;
	for ( var idx = 0; idx < reqArgs.length; idx += 1) {
		if (!(reqArgs[idx] in args)) {
			missingArg = true;
		}
	}
	if (missingArg) {
		throw new Error("You must pass in arguments: " + reqArgs);
	}
};
