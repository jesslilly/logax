#!/usr/bin/env bash
bin/logax.js --searchStrings test/foolog/foolog_parser.js \
	--input test/foolog/foolog1.log \
	--output test/output/foolog1.json
bin/logax.js --searchStrings test/foolog/foolog_parser.js \
	--input test/foolog/foolog2.log \
	--output test/output/foolog2.json