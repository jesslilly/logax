var fs = require('fs');
var exec = require('child_process').exec, child;
var Logax = require('../bin/logaxnm.js');

describe('Logax constructor', function() {

	it('should throw an exception when not all args passed.', function() {
		expect(function() {
			new Logax({
				parserFile : "abc.js",
				input : "in.log"
			});
		}).toThrow();
	});
});

describe('Logax createOutputFileName', function() {

	it('should create the correct output file name.', function() {
		var l2 = new Logax({
			parserFile : 'test/config/joblog_parser.js',
			input : 'test/data/joblog/joblog1.log',
			outputDir : 'test/output'
		});
		expect(l2.createOutputFileName()).toEqual('test/output/joblog1.log.json');
	});
});

describe('Logax parse', function() {

	// Test $$dataSourceFile
	// Test a converter that adds extra fields to the object.
	// Test passing retObj to converter while logax is still inHeader. (fix) 
	var JOBLOG_OUTPUT = [ {
		"jobId" : "12345",
		"logType" : "job",
		"email" : "abc@abc.com",
		"logVersion" : "1.0.0",
		"startAt" : "2013-11-26T18:50:43.000Z",
		"area" : 7194601,
		"elapsedTime" : "1000",
		"endAt" : "2013-11-26T18:50:44.000Z",
		"dataSourceFile" : "test/data/joblog/joblog1.log",
		"width" : 2399,
		"height" : 2999
	} ];
	var asyncFinished = false;
	var fileData = "";
	var l2 = new Logax({
		parserFile : 'test/config/joblog_parser.js',
		input : 'test/data/joblog/joblog1.log',
		outputDir : 'test/output'
	});
	l2.parse(function() {
		asyncFinished = true;
	});

	it('should create a json file', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "logax.parse never completed.  Check for missing callback.", 10000);

		runs(function() {
			var exists = fs.existsSync('test/output/joblog1.log.json');
			expect(exists).toEqual(true);
		});
	});

	it('should output the correct json', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "logax.parse never completed.  Check for missing callback.", 10000);

		runs(function() {
			fileData = fs.readFileSync('test/output/joblog1.log.json');
			expect(JSON.parse(fileData)).toEqual(JOBLOG_OUTPUT);
		});
	});
});

// Test the command line application and sum logs at the same time.
describe('logax.js command line', function() {
	var SUMLOG_OUTPUT = [ {
		jobCount : 2,
		submitAt : '2013-11-26T18:50:00.000Z',
		database : 'Z_500_DB',
		orderId : 555,
		startAt : '2013-11-26T18:50:43.000Z',
		logVersion : '1.0.0',
		jobId : '12345',
		email : 'abc@abc.com',
		area : 7194601,
		elapsedTime : '1000',
		endAt : '2013-11-26T18:50:44.000Z',
		errMsg : 'ERROR: Oops!  There was a problem with this job.'
	}, {
		jobCount : 2,
		submitAt : '2013-11-26T18:50:00.000Z',
		database : 'Z_500_DB',
		orderId : 555,
		startAt : '2013-11-26T18:51:43.000Z',
		logVersion : '2.0.1',
		jobId : '12346',
		email : 'def@abc.com',
		elapsedTime : '1001',
		endAt : '2013-11-26T18:51:44.000Z'
	} ];
	var asyncFinished = false;
	var fileData = "";
	var cmd = "";
	cmd += "bin/logax.js --parserFile test/config/sumlog_parser.js ";
	cmd += "--input test/data/sumlog/sumlog1.log ";
	cmd += "--outputDir test/output";

	child = exec(cmd, function(error, stdout, stderr) {
		if (error) {
			console.info(error);
		}
		asyncFinished = true;
	});

	it('should create a json file', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "logax.js never completed.  Check for missing callback.", 10000);

		runs(function() {
			var exists = fs.existsSync('test/output/sumlog1.log.json');
			expect(exists).toEqual(true);
		});
	});

	it('should output the correct json', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "logax.js never completed.  Check for missing callback.", 10000);

		runs(function() {
			fileData = fs.readFileSync('test/output/sumlog1.log.json');
			expect(JSON.parse(fileData)).toEqual(SUMLOG_OUTPUT);
		});
	});

});

// TODO: Add test for text file that results in zero matches. Should output []
// JSON.
