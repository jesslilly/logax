#!/bin/bash

# TODO: Implement for Windows.

# First out the test output directory
rm test/output/*.*

# ------------------
# Run jasmine tests.
# ------------------
# Note that you can call test.sh --verbose and the arg will pass through to jasmine.
set -x
./node_modules/jasmine-node/bin/jasmine-node $@ test/logaxnmSpec.js

# These are copied to output since they get modified and I don't want to commit the modified version.
cp test/config/*onceler*.json test/output
# TODO: Because of these copy command dependencies, the tests will fail if you run the below command manually.  Hmmm....
./node_modules/jasmine-node/bin/jasmine-node $@ test/oncelernmSpec.js