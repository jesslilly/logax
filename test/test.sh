#!/bin/bash

# TODO: Implement for Windows.
rm test/output/*.json
./node_modules/jasmine-node/bin/jasmine-node test/logaxnmSpec.js
cp test/joblog/onceler.json test/output
cp test/joblog/onceler2.json test/output
./node_modules/jasmine-node/bin/jasmine-node test/oncelernmSpec.js

if [[ 1 == 0 ]]
then
	bin/logax.js --parserFile test/joblog/joblog_parser.js \
		--input test/joblog/joblog1.log \
		--output test/output/joblog1.json
	bin/logax.js --parserFile test/joblog/joblog_parser.js \
		--input test/joblog/joblog2.log \
		--output test/output/joblog2.json
fi