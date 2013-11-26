
/**
 * @function
 * @description Parse the input file based on given searchText.
 * write output file.
 * @param {string} path/file of the searchText node module
 * @param {string} path/file of the text file to parse
 * @param {string} path/file of the text file to write.
 * @param {function} callback when it's done (async).
 * @return {void}
 */
exports.parse = function(searchText, input, output, cb) {
	
	// TODO: Better way to do this
	var search = require("../" + searchText);
	//console.log("Search for " + search.searchStrings);
	
	console.log("parse needs to be implemented");
	
	cb.call(null);
};
