var fs = require('fs');
var logax = require('../bin/logaxnm.js');

/* jasmine specs for logaxnm */
describe('logaxnm', function() {

	console.info('Running tests for logaxnm');

	// -----------------------------------------
	console.info('Test the Logax constructor.');
	// -----------------------------------------
	it('should throw an exception when not all args passed.', function() {
		expect(function() {
			var l1 = new logax.Logax({
				parserFile : "abc.js",
				input : "in.log"
			});
		}).toThrow();
	});

	// -----------------------------------------
	console.info('Test the parse method.');
	// -----------------------------------------
	var FOOLOG_OUTPUT = {
		"jobId" : "12345",
		"email" : "abc@abc.com",
		"logVersion" : "1.0.0",
		"startAt" : "2013-11-26T19:50:43Z",
		"area" : "7194601",
		"elapsedTime" : "1000",
		"endAt" : "2013-11-26T19:50:44Z"
	};
	var asyncFinished = false;
	var fileData = "";
	var l2 = new logax.Logax({
		parserFile : 'test/foolog/foolog_parser.js',
		input : 'test/foolog/foolog1.log',
		output : 'test/output/foolog1.json'
	});
	l2.parse(function() {
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
