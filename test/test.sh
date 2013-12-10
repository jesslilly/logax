#!/bin/bash

# TODO: Implement for Windows.
rm test/output/*.json
./node_modules/jasmine-node/bin/jasmine-node test/logaxnmSpec.js
cp test/foolog/onceler.json test/output
cp test/foolog/onceler2.json test/output
./node_modules/jasmine-node/bin/jasmine-node test/oncelernmSpec.js

if [[ 1 == 0 ]]
then
	bin/logax.js --parserFile test/foolog/foolog_parser.js \
		--input test/foolog/foolog1.log \
		--output test/output/foolog1.json
	bin/logax.js --parserFile test/foolog/foolog_parser.js \
		--input test/foolog/foolog2.log \
		--output test/output/foolog2.json
fi