#!/usr/bin/env node
var util = require( "util" );
var Logax = require( "./logaxnm" );
var argv = require('optimist').usage(
'Usage: $0 --parserFile file --input infile --outputDir outdir').demand(
[ 'parserFile', 'input', 'outputDir' ]).describe(
'parserFile',
'A js file with the search strings.  See the template.  ').describe(
'input',
'Input text file to process.').describe(
'outputDir',
'Output json file to outdir.').argv;

util.puts( "Begin logax.js at " + new Date().toISOString() );

// trickery:  Logax ctor needs a map.  Map keys match argv keys!
var l1 = new Logax(argv);
l1.parse(function() {

	util.puts( "  End logax.js at " + new Date().toISOString() );

});

