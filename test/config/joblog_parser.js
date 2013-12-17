
var convertToISO = function(captures) {
	var date = new Date(captures[1]);
	return date.toISOString();
};

var calcArea = function(captures, retObj) {
	retObj.width = (captures[2] - captures[1]);
	retObj.height = (captures[4] - captures[3]);
	return (captures[2] - captures[1]) * (captures[4] - captures[3]);
};

exports.delimiters = function() {
	return [];
};

exports.searchStrings = function() {
	// searchFor can be a string or a regex.
	return [ {
		searchFor : "^JobID: ([0-9]*)$",
		sample: "JobID: 12345",
		outputField : "jobId"
	}, {
		searchFor : /^email: (.*)$/,
		sample: "email: abc@abc.com",
		outputField : "email"
	}, {
		searchFor : /^Foo log version: (.*)/,
		sample: "Foo log version: 2.0.1",
		"default": "1.0.0",
		outputField : "logVersion"
	}, {
		searchFor : /^Begin job log at (.*)$/,
		sample : "Begin job log at Tue Nov 26 13:50:43 EST 2013",
		converter: convertToISO,
		outputField : "startAt"
	}, {
		searchFor : /^This thing sometimes happens: ([0-9]*) ([0-9]*) ([0-9]*) ([0-9]*)/,
		sample : "This thing sometimes happens: 1 2400 1 3000",
		converter: calcArea,
		outputField : "area"
	}, {
		searchFor : /^This other thing can happen: ([0-9]*) ([0-9]*) ([0-9]*) ([0-9]*)/,
		sample : "This other thing can happen: 1 2400 1 3000",
		converter: calcArea,
		outputField : "area"
	}, {
		searchFor : /^Elapsed time: ([0-9]*)ms/,
		sample : "Elapsed time: 1000ms",
		outputField : "elapsedTime"
	}, {
		searchFor : /^  End job log at (.*)$/,
		sample : "  End job log at Tue Nov 26 13:50:44 EST 2013",
		converter: convertToISO,
		outputField : "endAt"
	}, {
		comment : "Put the parsed file name into every object.  $$dataSourceFile is a key word.",
		"default": "$$dataSourceFile",
		outputField : "dataSourceFile",
	} ];
};