/* jasmine specs for logaxnm */
describe('logaxnm', function() {

	console.info('Running tests for logaxnm');

	var fs = require('fs');

	var FOOLOG_OUTPUT = {
		"jobId" : "12345",
		"email" : "abc@abc.com",
		"logVersion" : "1.0.0",
		"startAt" : "2013-11-26T19:50:43Z",
		"area" : "7194601",
		"elapsedTime" : "1000",
		"endAt" : "2013-11-26T19:50:44Z"
	};

	var logax = require('../bin/logaxnm.js');

	var asyncFinished = false;
	var fileData = "";
	logax.parse('test/foolog/foolog_parser.js', 'test/foolog/foolog1.log', 'test/output/foolog1.json', function() {
		asyncFinished = true;
	});

	it('should create a json file', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "logax.parse never completed.  Check for missing callback.", 10000);

		runs(function() {
			var exists = fs.existsSync('test/output/foolog1.json');
			expect(exists).toEqual(true);
		});
	});

	it('should contain the correct json', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "logax.parse never completed.  Check for missing callback.", 10000);

		runs(function() {
			fileData = fs.readFileSync('output/foolog1.json');
			expect(fileData).toEqual(JSON.stringify(FOOLOG_OUTPUT));
		});
	});

});
