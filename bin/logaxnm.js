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
	var curObj = null;
	// TODO: Is this an acceptable use of require? (It works, but is async)
	var pf = require(parserFile);
	var searches = ("searchStrings" in pf) ? pf.searchStrings() : [];
	var delimiters = ("delimiters" in pf) ? pf.delimiters() : [];
	var terminators = ("terminators" in pf) ? pf.terminators() : [];
	// We are in the header until we match a delimiter.
	// If there are no delimiters, output a single object in the array.
	var inHeader = (delimiters.length > 0) ? true : false;
	// An object that we use to append() having all configured defaults and
	// header fields.
	var defaultObj = {};
	
	/**
	 * @method
	 * @private
	 * @description Create an output file name using the outputDir, input file
	 *              name, and ".json". Don't replace the input file name's
	 *              extension else it might break its uniqueness. With many
	 *              logax processes running at the same time they could stomp on
	 *              each other's output file.
	 * @return {string} - output file name.
	 */
	this.createOutputFileName = function() {
		return outputDir +  path.sep + path.basename(input) + ".json";
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
		curObj = retList[++retIdx];
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
	var parseLine = function(line, rl) {
		// Process one line at a time.
		// (What is more efficient, parsing each line or running many
		// greps?)

		// Check if line is a terminator.
		var termMatch = terminators.filter(function(term, idx) {
			return (new RegExp(term).exec(line));
		});
		if (termMatch.length > 0) {
			// Stop reading the file line by line.
			rl.close();
			return;
		}

		// Check if line is a delimiter.
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
			
			// Some search objects may not have a "searchFor" and only supply
			// defaults.
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
					value = search.converter.call(null, matchedText, curObj);
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

			// Here curObj could be pointing to defaultObj.
			curObj[search.outputField] = value;
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
			// We parse header fields into the defaultObj.
			curObj = defaultObj;

			// Open input file for each line.
			var rl = require('readline').createInterface({
				input : fs.createReadStream(input),
				terminal : false
			}).on('line', function(line) {

				// Process the line.
				parseLine(line, rl);

			}).on('close', function() {
				
				// Reached EOF.
				// Write output file.
				var outputFile = self.createOutputFileName();
				
				// It's possible the file does not have a leading delimiter.
				if (retList.length === 0) {
					append();
				}
				
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
