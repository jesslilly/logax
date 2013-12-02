var fs = require('fs');
var common = require('../bin/common');

/**
 * @constructor
 * @description Onceler constructor.
 * @param {string}
 *            cfgFile - path/file of the cfgFile json file
 * @return {object} this - for chaining.
 */
var Onceler = function(args) {

	// Parameter checking
	common.validateArgs([ "cfgFile" ], args);

	// Private variables
	var cfgFile = args.cfgFile;
};
exports.Onceler = Onceler;
