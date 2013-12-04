var fs = require('fs');
var common = require('../bin/common');
var exec = require('child_process').exec, child;

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
	var cfg = {};
	var self = this;

	/**
	 * @method
	 * @public
	 * @description Load the cfgFile json file into cfg.
	 * @param {function}
	 *            cb - callback when it's done (async).
	 * @return {void}
	 */
	this.loadCfgFile = function(cb) {
		fs.readFile(cfgFile, function(err, data) {
			if (err) {
				throw err;
			}
			cfg = JSON.parse(data);
			cb.call(null);
		});
	};

	/**
	 * @method
	 * @public
	 * @description Return an array of new files we can process.
	 * @param {function}
	 *            cb - callback when it's done (async).
	 * @return {void}
	 */
	this.findNewFiles = function(cb) {

		// TODO: Find a better cross-platform way to do this.
		// TODO: Ask the question on SO.
		
		// Find new text files that have appeared since last time.
		var findCmd = "";
		findCmd += "find " + cfg.searchDirs.join(" ") + " ";
		findCmd += "-newermt '" + cfg.newerThan + "' ";
		findCmd += "-name '" + cfg.fileGlob + "' ";
		findCmd += "-type f ";
		// printf: %T = modified time, + = YYYY-MM-DD+HH:mm:SS.ms format, %p = file with path, \\n = newline
		findCmd += "-printf '%T+ %p\\n' | sort ";
		child = exec(findCmd, function(err, stdout, stderr) {
			if (err) {
				throw err;
			}
			cb.call(null, stdout.split("\n"));
		});
	};

	/**
	 * @method
	 * @public
	 * @description Process the cfgFile, running the configured command against
	 *              each text file.
	 * @param {function}
	 *            cb - callback when it's done (async).
	 * @return {void}
	 */
	this.process = function(cb) {

		try {

			// Load config file.
			this.loadCfgFile(function() {
				self.findNewFiles(function(files) {
					console.info(files);

				});
			});

			// Find a text file to work on.

		} catch (err) {
			console.error("onceler.process had a problem!  " + err);
			cb.call(null);
		}
	};

	/**
	 * @method
	 * @public
	 * @description Return a property of the cfg object.
	 * @param {string}
	 *            key - Config key to return.
	 * @return {*} - string, array, object stored in the cfg json file.
	 */
	this.getCfg = function(key) {
		return cfg[key];
	};

};
module.exports = Onceler;
