#!/usr/bin/env node
var util = require( "util" );
var logax = require( "./logaxnm" );
var argv = require('optimist').usage(
'Usage: $0 --searchStrings file --input infile --output outfile').demand(
[ 'searchStrings', 'input', 'output' ]).describe(
'searchStrings',
'A js file with the search strings.  See the template.  ').describe(
'input',
'Input text file to process.').describe(
'output',
'Output file name and type (must be csv or json).').argv;

util.puts( "Begin logax.js at " + new Date().toISOString() );

logax.parse(argv.searchStrings, argv.input, argv.output, function() {

	util.puts( "  End logax.js at " + new Date().toISOString() );

});

