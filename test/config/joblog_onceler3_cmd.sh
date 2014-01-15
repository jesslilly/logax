#!/usr/bin/env bash
file=$1
dir=$2
if [[ $file == "test/data/joblog/joblog1.log" ]]; then
	# Simulate that joblog1 takes longder to process than joblog2.
	sleep 1
fi
echo "$(date) $file" >> $dir/cmd-line-test.txt
	