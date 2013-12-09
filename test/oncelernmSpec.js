var fs = require('fs');
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
		cfgFile : "test/output/onceler.json"
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
		cfgFile : "test/output/onceler.json"
	});

	// Subtest 1
	o1.loadCfgFile(function() {
		o1.setCfg('newerThan','2013-12-11 10:09:08.7654321');
		o1.saveCfgFile(function() {
			o1.loadCfgFile(function() {
				asyncFinished = true;
			});
		});
	});

	it('should load the cfg json file', function() {
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
		cfgFile : "test/output/onceler.json"
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
			mtime : '2013-11-26 14:20:01.7723095220',
			file : 'test/foolog/foolog1.log'
		}, {
			mtime : '2013-11-26 14:21:57.5167016480',
			file : 'test/foolog/foolog2.log'
		} ];

		waitsFor(function() {
			return asyncFinished;
		}, "Onceler.findNewFiles never completed.  Check for missing callback.", 10000);

		runs(function() {
			expect(dateFiles).toEqual(expectedFiles);
		});
	});

});
