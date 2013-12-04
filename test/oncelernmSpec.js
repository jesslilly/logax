var fs = require('fs');
var Onceler = require('../bin/oncelernm.js');

describe('Onceler constructor', function() {

	it('should throw an exception when not all args passed.', function() {
		expect(function() {
			new Onceler({
				cfgFileZZZZZ : "abc.json",
				max : 100
			});
		}).toThrow();
	});

	it('should NOT throw an exception when all args passed.', function() {
		expect(function() {
			new Onceler({
				cfgFile : "abc.json",
				max : 100
			});
		}).not.toThrow();
	});
});

describe('Onceler loadCfgFile', function() {

	var o1 = new Onceler({
		cfgFile : "test/foolog/onceler.json",
		max : 100
	});

	var asyncFinished = false;
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
