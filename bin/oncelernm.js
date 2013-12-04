var fs = require('fs');
var common = require('../bin/common');
var glob = require('glob');

/**
 * @constructor
 * @description Onceler constructor.
 * @param {string}
 *            cfgFile - path/file of the cfgFile json file
 * @return {object} this - for chaining.
 */
var Onceler = function(args) {

	// Parameter checking
	common.validateArgs([ "cfgFile", "max" ], args);

	// Private variables
	var cfgFile = args.cfgFile;
	var cfg = {};
	var max = args.max;
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
	 * @description Return an array of files we can process.
	 * @param {function}
	 *            cb - callback when it's done (async).
	 * @return {void}
	 */
	this.getFilesToProcess = function(cb) {

		fs.readdir(cfg.filesToProcess[0], function(err, files) {
			if (err) {
				throw err;
			}
			cb.call(null, files);
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
			this.loadCfgFile( function() {
				self.getFilesToProcess( function(files) {
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
