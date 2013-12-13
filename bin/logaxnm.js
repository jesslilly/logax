var fs = require('fs');
var path = require('path');
var util = require('util');
var common = require('../bin/common');

/**
 * @constructor
 * @description Logax constructor.
 * @param {string}
 *            parserFile - path/file of the parserFile node module
 * @param {string}
 *            input - path/file of the text file to parse
 * @param {string}
 *            outputDir - path of the text file to write.
 * @return {object} this - for chaining.
 */
var Logax = function(args) {

	// Parameter checking
	common.validateArgs([ "parserFile", "input", "outputDir" ], args);

	// Private variables
	var self = this;
	var parserFile = path.resolve(process.cwd(), args.parserFile);
	var input = args.input;
	var outputDir = args.outputDir;
	// reList should start out with nothing in case we find nothing in the text
	// file.
	var retList = [];
	var retIdx = -1;
	var retObj = null;
	// TODO: Is this an acceptable use of require?  (It works, but is async)
	var searches = require(parserFile).searchStrings();
	var delimiters = require(parserFile).delimiters();
	
	/**
	 * @method
	 * @private
	 * @description Create an output file name using the input file name and
	 *              outputDir and ".json".
	 * @return {string} - output file name.
	 */
	this.createOutputFileName = function() {
		return outputDir +  path.sep + path.basename(input, path.extname(input)) + ".json";
	};
	
	/**
	 * @method
	 * @private
	 * @description Populate the defaults into the retList.
	 * @return {void}
	 */
	var addDefaults = function() {
		searches.forEach(function(search) {
			if ("default" in search) {
				retObj[search.outputField] = search.default;
			}
		});
	};
	
	/**
	 * @method
	 * @private
	 * @description Put a new object on the end of the retList array.
	 * @return {void}
	 */
	var append = function() {
		retList.push({});
		retObj = retList[++retIdx];

		// Fill in the defaults
		addDefaults();
	};
	
	/**
	 * @method
	 * @private
	 * @description Parse the input file based on given parserFile. write output
	 *              file.
	 * @param {string}
	 *            line - callback when it's done (async).
	 * @return {void}
	 */
	var parseLine = function(line) {
		// Process one line at a time.
		// (What is more efficient, parsing each line or running many
		// greps?)
		
		// First check if line is a delimiter.
		var delimMatch = delimiters.filter(function(delim, idx) {
			return (new RegExp(delim).exec(line));
		});
		// Append if we match a delimiter.
		if (delimMatch.length > 0) {
			append();
		}
		
		// Then check if the line matches any of our search regexs.
		// Use a c-style for loop so we can break and continue.
		for ( var idx = 0; idx < searches.length; idx += 1) {
			var search = searches[idx];
			var matchedText = new RegExp(search.searchFor).exec(line);
			if (matchedText === null) {
				continue;
			}
			var value = "";
			if ("converter" in search) {
				try {
					value = search.converter.call(null, matchedText);
				} catch (err) {
					var message = "Problem with converter for " + search.outputField + "!";
					message += "\nSearch object: " + JSON.stringify(search);
					message += "\nMatched text, capture(s): " + matchedText;
					message += "\nConverter: " + search.converter;
					message += "\nError: " + err;
					util.error(message);
				}
			} else {
				// Default behavior is to grab $1.
				value = matchedText[1];
			}
			
			// It's possible the file does not have a leading delimiter.
			if (retObj === null) {
				append();
			}

			retObj[search.outputField] = value;
		}
		return;
	};

	/**
	 * @method
	 * @public
	 * @description Parse the input file based on given parserFile. write output
	 *              file.
	 * @param {function}
	 *            cb - callback when it's done (async).
	 * @return {void}
	 */
	this.parse = function(cb) {

		try {

			// Open input file for each line.
			require('readline').createInterface({
				input : fs.createReadStream(input),
				terminal : false
			}).on('line', function(line) {

				// Process the line.
				parseLine(line);

			}).on('close', function() {
				
				// Reached EOF.
				// Write output file.
				var outputFile = self.createOutputFileName();
				
				// Create as tmp file in case some other process is looking for
				// json files.
				// Rename after the write is done.
				fs.writeFile( outputFile + ".tmp", JSON.stringify(retList, null, '\t'), function() {
					fs.rename(outputFile + ".tmp", outputFile, cb);
				});
			});

		} catch (err) {
			util.error("logax.parse had a problem!  " + err);
			cb.call(null);
		}

	};
	
	return this;

};
module.exports = Logax;
