
var convertToISO = function(captures) {
	var date = new Date(captures[1]);
	return date.toISOString();
};

var calcArea = function(captures) {
	return (captures[2] - captures[1]) * (captures[4] - captures[3]);
};

var toInt = function(captures) {
	return parseInt(captures[1], 10);
};

exports.delimiters = function() {
	return [ /^Begin job log at .*$/ ];
};

exports.searchStrings = function() {
//	
// Jobs will be logged into database: Z_500_DB
// Super Order ID: 555
	return [ {
		searchFor : /^([0-9]+) jobs submitted at /,
		sample: "2 jobs submitted at Tue Nov 26 13:50:00 EST 2013",
		converter: toInt,
		outputField : "jobCount"
	},{
		searchFor : /^[0-9]+ jobs submitted at (.*)/,
		sample: "2 jobs submitted at Tue Nov 26 13:50:00 EST 2013",
		converter: convertToISO,
		outputField : "submitAt"
	},{
		searchFor : /^Jobs will be logged into database: (\w*)/,
		sample: "Jobs will be logged into database: Z_500_DB",
		outputField : "database"
	},{
		searchFor : /^Super Order ID: ([0-9]*)$/,
		sample: "Super Order ID: 555",
		converter: toInt,
		outputField : "orderId"
	},{
		searchFor : /^JobID: ([0-9]*)$/,
		sample: "JobID: 12345",
		outputField : "jobId"
	}, {
		searchFor : /^email: (.*)$/,
		sample: "email: abc@abc.com",
		outputField : "email"
	}, {
		searchFor : /^Foo log version: (.*)/,
		sample: "Foo log version: 2.0.1",
		default: "1.0.0",
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
		searchFor : /^Elapsed time: ([0-9]*)ms/,
		sample : "Elapsed time: 1000ms",
		outputField : "elapsedTime"
	}, {
		searchFor : /^  End job log at (.*)$/,
		sample : "  End job log at Tue Nov 26 13:50:44 EST 2013",
		converter: convertToISO,
		outputField : "endAt"
	} ];
};