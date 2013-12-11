var fs = require('fs');
var util = require('util');
var path = require('path');
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
	// TODO: There might be a npm module to do this JSON file reading.
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
	 * @description Save the cfg to the json cfgFile.
	 * @param {function}
	 *            cb - callback when it's done (async).
	 * @return {void}
	 */
	// TODO: There might be a npm module to do this JSON file reading.
	this.saveCfgFile = function(cb) {
		fs.writeFile(cfgFile, JSON.stringify(cfg, null, '\t'), function(err, data) {
			if (err) {
				throw err;
			}
			cb.call(null);
		});
	};

	/**
	 * @method
	 * @public
	 * @description Return an array of new files we can process. Optimized for
	 *              "new files" use case instead of many archived files.
	 * @param {function}
	 *            cb - callback when it's done (async).
	 * @return {Array} - files - array of mtime, file objects.
	 */
	this.findNewFiles = function(cb) {

		// TODO: Find a better cross-platform way to do this.
		// TODO: Ask the question on SO.

		// Find new text files that have appeared since last time.
		var dateFile = cfg.workingDir + path.sep + path.basename(cfgFile) + ".tmp";
		var findCmd = "";
		findCmd += "touch -d '" + cfg.newerThan + "' " + dateFile;
		findCmd += "; ";
		findCmd += "find " + cfg.searchDirs.join(" ") + " ";
		findCmd += "-newer '" + dateFile + "' ";
		findCmd += "-name '" + cfg.fileGlob + "' ";
		findCmd += "-type f ";
		// printf: %T = modified time, + = YYYY-MM-DD+HH:mm:SS.ms format, %p =
		// file with path, \\n = newline
		findCmd += "-printf '%T+ %p\\n' | sort ";
		findCmd += "| head -" + cfg.maxFiles + " ";
		findCmd += "; ";
		findCmd += "rm " + dateFile;
		//console.log(findCmd);
		child = exec(findCmd, function(err, stdout, stderr) {
			if (err) {
				throw err;
			}
			//console.log(stdout);
			var files = stdout.split("\n").map(function(row, index) {
				// TODO: I bet there is a cooler way to do this.
				var dateFile = {};
				dateFile.mtime = row.split(" ")[0].replace("+", " ");
				dateFile.file = row.split(" ")[1];
				return dateFile;
			});
			// Remove the last/bad element from the array. Split "\n" gave
			// us a bad trailing element.
			files.pop();
			cb.call(null, files);
		});
	};

	/**
	 * @method
	 * @public
	 * @description Process a list of mtime,file objects. Thanks to the async
	 *              programming of node, These commands happen in "near"
	 *              parallel. Sweeeeet.
	 * @param {Array}
	 *            files - list of mtime,file objects.
	 * @param {function}
	 *            cb - callback when it's done (async).
	 * @return {void}
	 */
	this.processFiles = function(files, cb) {

		files.forEach(function(file, idx) {

			// Build the command.
			// TODO: Move outputFile from onceler to logax since onceler has no
			// idea if
			// the outputFile should be json or csv or what.
			var outputFile = path.join(cfg.workingDir, path.sep, path.basename(file.file));
			var cmd = "";
			cmd += util.format(cfg.command, file.file, cfg.workingDir);

			// Process the file.
			//console.log(cmd);
			child = exec(cmd, function(err, stdout, stderr) {
				if (err) {
					throw err;
				}
				//console.log(stdout);

				// Immediately update the cfg "newerThan" field.
				// If this process is killed somewhere in between we
				// reprocess only 1 file.
				cfg.newerThan = file.mtime;
				self.saveCfgFile(function() {
					// On the last file, call back!
					if (idx == files.length - 1) {
						cb.call(null);
					}
				});
			});
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

			this.loadCfgFile(function() {

				self.findNewFiles(function(files) {

					self.processFiles(files, function() {
						// Done!
						cb.call(null);
					});

				});
			});

		} catch (err) {
			util.error("onceler.process had a problem!  " + err);
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

	/**
	 * @method
	 * @public
	 * @description Change a value in the cfg Object.
	 * @param {string}
	 *            key - Config key to change.
	 * @param {object}
	 *            value - New value.
	 * @return {object} this - for chaining.
	 */
	this.setCfg = function(key, value) {
		cfg[key] = value;
		return this;
	};

};
module.exports = Onceler;
