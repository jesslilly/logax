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
	// TODO: Is this an acceptable use of require? (It works, but is async)
	var searches = require(parserFile).searchStrings();
	var delimiters = require(parserFile).delimiters();
	// We are in the header until we match a delimiter.
	// If there are no delimiters, output a single object in the array.
	var inHeader = (delimiters.length > 0) ? true : false;
	// An object that we use to append() having all configured defaults and
	// header fields.
	var defaultObj = {};
	
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
	 * @description Populate the defaultObj with configured defaults.
	 * @return {Object} - defaultObj.
	 */
	this.initDefaultObj = function() {
		var defObj = {};
		searches.forEach(function(search) {
			if ("default" in search) {
				if (search.default === "$$dataSourceFile") {
					defObj[search.outputField] = input;
				}
				else {
					defObj[search.outputField] = search.default;
				}
			}
		});
		return defObj;
	};
	
	/**
	 * @method
	 * @private
	 * @description Put a new object on the end of the retList array.
	 * @return {void}
	 */
	var append = function() {
		// Make a copy of defaultObj and add it to the return array.
		retList.push(JSON.parse(JSON.stringify(defaultObj)));
		retObj = retList[++retIdx];
		inHeader = false;
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
			
			// Some search objects may not have a "searchFor" and only supply defaults.
			if (!("searchFor" in search)) {
				continue;
			}
			
			var matchedText = new RegExp(search.searchFor).exec(line);
			if (matchedText === null) {
				continue;
			}
			var value = "";
			if ("converter" in search) {
				try {
					value = search.converter.call(null, matchedText, retObj);
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

			if (inHeader) {
				defaultObj[search.outputField] = value;
			}
			else {
				// It's possible the file does not have a leading delimiter.
				if (retObj === null) {
					append();
				}
				retObj[search.outputField] = value;
			}
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
			
			defaultObj = this.initDefaultObj();

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
