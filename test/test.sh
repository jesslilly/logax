#!/bin/bash
./node_modules/jasmine-node/bin/jasmine-node test/logaxnmSpec.js

if [[ 1 == 0 ]]
then
	bin/logax.js --parserFile test/foolog/foolog_parser.js \
		--input test/foolog/foolog1.log \
		--output test/output/foolog1.json
	bin/logax.js --parserFile test/foolog/foolog_parser.js \
		--input test/foolog/foolog2.log \
		--output test/output/foolog2.json
fi