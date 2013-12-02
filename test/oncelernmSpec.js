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
});

