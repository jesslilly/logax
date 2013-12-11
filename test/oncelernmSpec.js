var fs = require('fs');
var exec = require('child_process').exec, child;
var Onceler = require('../bin/oncelernm.js');

describe('Onceler constructor', function() {

	it('should throw an exception when not all args passed.', function() {
		expect(function() {
			new Onceler({
				cfgFileZZZZZ : "abc.json"
			});
		}).toThrow();
	});

	// TODO: This should actually throw since the file does not exist.
	it('should NOT throw an exception when all args passed.', function() {
		expect(function() {
			new Onceler({
				cfgFile : "abc.json"
			});
		}).not.toThrow();
	});

	// TODO: Add test with existing file.
});

describe('Onceler loadCfgFile', function() {

	// Load a config file and test contents.
	var asyncFinished = false;

	var o1 = new Onceler({
		cfgFile : "test/output/joblog_onceler1.json"
	});

	o1.loadCfgFile(function() {
		asyncFinished = true;
	});

	it('should load the cfg json file', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "Onceler.loadCfgFile never completed.  Check for missing callback.", 10000);

		runs(function() {
			expect(o1.getCfg("command").length).toBeGreaterThan(10);
		});
	});
});

describe('Onceler saveCfgFile', function() {

	// 1. Save the config file with a change.
	// 2. Load again and test saved values.
	var asyncFinished = false;

	var o1 = new Onceler({
		cfgFile : "test/output/joblog_onceler4.json"
	});

	o1.loadCfgFile(function() {
		o1.setCfg('newerThan', '2013-12-11 10:09:08.7654321');
		o1.saveCfgFile(function() {
			o1.loadCfgFile(function() {
				asyncFinished = true;
			});
		});
	});

	it('should save the cfg json file', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "Onceler.saveCfgFile never completed.  Check for missing callback.", 10000);

		runs(function() {
			expect(o1.getCfg("newerThan")).toEqual('2013-12-11 10:09:08.7654321');
		});
	});
});

describe('Onceler findNewFiles', function() {
	var dateFiles = [];

	var o1 = new Onceler({
		cfgFile : "test/output/joblog_onceler5.json"
	});

	var asyncFinished = false;
	o1.loadCfgFile(function() {
		o1.findNewFiles(function(files) {
			dateFiles = files;
			asyncFinished = true;
		});
	});

	it('should find 2 new files to process', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "Onceler.findNewFiles never completed.  Check for missing callback.", 10000);

		runs(function() {
			expect(dateFiles.length).toEqual(2);
		});
	});

	it('should find these new files', function() {
		var expectedFiles = [ {
			mtime : '2013-12-10 16:16:09.8562549410',
			file : 'test/data/joblog/joblog1.log'
		}, {
			mtime : '2013-12-10 16:16:09.8602550950',
			file : 'test/data/joblog/joblog2.log'
		} ];

		waitsFor(function() {
			return asyncFinished;
		}, "Onceler.findNewFiles never completed.  Check for missing callback.", 10000);

		runs(function() {
			expect(dateFiles).toEqual(expectedFiles);
		});
	});

});

describe('Onceler process (first batch)', function() {
	var asyncFinished = false;
	var exists = false;
	var o1 = new Onceler({
		cfgFile : "test/output/joblog_onceler6.json"
	});

	o1.process(function() {
		fs.exists('test/output/joblog1.json', function(exists1) {
			fs.exists('test/output/joblog2.json', function(exists2) {
				exists = exists1 && exists2;
				asyncFinished = true;
			});
		});
	});

	it('should create 2 new output files', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "Onceler.process never completed.  Check for missing callback.", 10000);

		runs(function() {
			expect(exists).toEqual(true);
		});
	});
});

describe('Onceler process (second batch)', function() {
	var asyncFinished = false;
	var exists = false;
	var o1 = new Onceler({
		cfgFile : "test/output/joblog_onceler2.json"
	});

	o1.process(function() {
		fs.exists('test/output/joblog3.json', function(exists1) {
			exists = exists1;
			asyncFinished = true;
		});
	});

	it('should create 1 new output file', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "Onceler.process never completed.  Check for missing callback.", 10000);

		runs(function() {
			expect(exists).toEqual(true);
		});
	});
});

describe('Onceler process (gzip batch)', function() {
	var asyncFinished = false;
	var exists = false;
	var o1 = new Onceler({
		cfgFile : "test/output/jobloggz_onceler1.json"
	});

	o1.process(function() {
		fs.exists('test/output/joblog4.json', function(exists1) {
			exists = exists1;
			asyncFinished = true;
		});
	});

	it('should create 1 new output file', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "Onceler.process never completed.  Check for missing callback.", 10000);

		runs(function() {
			expect(exists).toEqual(true);
		});
	});

	it('should properly unzip the input file', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "Onceler.process never completed.  Check for missing callback.", 10000);

		runs(function() {
			var data1 = fs.readFileSync("test/data/jobloggz/joblog4.log", {
				encoding : "utf8"
			});
			var data2 = fs.readFileSync("test/output/joblog4.log", {
				encoding : "utf8"
			});
			expect(data1).toEqual(data2);
		});
	});
});

// Test the command line application.
describe('onceler.js command line', function() {
	var asyncFinished = false;
	var cmd = "";
	cmd += "bin/onceler.js --cfgFile test/output/joblog_onceler3.json ";

	child = exec(cmd, function(error, stdout, stderr) {
		if (error) {
			console.info(error);
		}
		asyncFinished = true;
	});

	it('should process the configured command (in onceler3.json)', function() {
		waitsFor(function() {
			return asyncFinished;
		}, "onceler.js never completed.  Check for missing callback.", 10000);

		runs(function() {
			var exists = fs.existsSync('test/output/cmd-line-test.txt');
			expect(exists).toEqual(true);
		});
	});
});
