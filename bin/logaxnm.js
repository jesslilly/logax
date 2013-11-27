var fs = require('fs');

/**
 * @function
 * @description Parse the input file based on given searchText. write output
 *              file.
 * @param {string}
 *            path/file of the searchText node module
 * @param {string}
 *            path/file of the text file to parse
 * @param {string}
 *            path/file of the text file to write.
 * @param {function}
 *            callback when it's done (async).
 * @return {void}
 */
exports.parse = function(searchText, input, output, cb) {

	var retObj = {};

	// TODO: Better way to do this
	var searches = require("../" + searchText).searchStrings();

	// Open input file
	require('readline').createInterface({
		input : fs.createReadStream(input),
		terminal : false
	}).on('line', function(line) {

		// Process one line at a time.
		// (What is more efficient, parsing each line or running many greps?)
		searches.forEach(function(search) {
			var matchedText = new RegExp(search.searchFor).exec(line);
			if (matchedText !== null) {
				retObj[search.outputField] = matchedText[1];
			}
		});

	}).on('close', function() {
		console.log(retObj);

		cb.call(null);
	});

};
