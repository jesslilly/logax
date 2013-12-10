`logax.js` and `onceler.js`: parse text files with regex strings and output as json.

# User Documentation

## Use Case
Log data mining.  Say you have a bunch of web/app log files or html files or any kind of 
text file for that matter laying around.
You want to "grep" for many different search strings within those files and output to 
a common format like json or csv.  You can subsequently insert the data into a database
for further processing and reporting.  Then this is the tool for you.

## Example
1. Find a text file you want to mine.

	Begin foo log at Tue Nov 26 13:50:43 EST 2013
	This is just some random log file you might get from an application.
	JobID: 12345
 
2. Create a parser config file like this:

	{
		searchFor : "^JobID: ([0-9]*)$",
		sample: "JobID: 12345",
		outputField : "jobId"
	}
	
3. Run `logax.js` like this:

	bin/logax.js --parserFile my_parser.js \
		--input foolog1.log \
		--output foolog1.json

4. You get JSON output like this:

	{ jobId : 12345 }

## onceler.js
`onceler.js` is a node.js command line program that processes files 'once'.  You provide
a json file with the file name globs you want to process.  `onceler.js` keeps track of 
which files have been processed already using dates.  `onceler.js` will search for 'new'
files working forward in time.  Onceler is intended to be run from a cron
or a scheduled task.

## logax.js
`logax.js` is a little guy who hacks up your log files.  (Or text files)  `logax.js` will
accept a json file as input and use the search strings (regex strings) in the json
to parse a file.

## Caveats
This tool was developed for unstructured log files.  There is no problem using it
for any kind of text file regex parsing, but other tools may do a better job.  For
example, if you want to parse html, xml or some other structured file format, you
may want to try a parser for that markup.  It's your call.

# Developer Documentation

Contributions are welcome.  Make sure changes have tests.

### Future Enhancements
This is roughly in priority order.

1. Move output file naming from Onceler to Logax.  (See oncelernm.js "// TODO: Move outputFile ")
1. Process ONE OR Multiple files to an array of js objects.  (ONE repeating log, or multiple related logs)
1. Handle gz files.
1. Get this into npm.
1. Add optimization when only searching for a few regexes.  Grep or some other cross platform search would be more efficient.
1. Support Windows (Using *nix find command right now).
1. Handle duplicate log messages such that you can specify which one you want.  (nth duplicate)
1. Output CSV or JSON.  Only json is supported right now.
1. Optimize using pipes/streams.
1. Intelligently process truncated log files
1. Search for strings on more than one line.  (Containing newlines)
1. Allow search strings to be in xpath for true XML parsing?

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.

### A Note on Egit

I am using EGit with eclipse and I have gone against the 
[EGit recommended settings](http://wiki.eclipse.org/EGit/User_Guide#Considerations_for_Git_Repositories_to_be_used_in_Eclipse)
 of having the .git folder in a parent folder of the logax project.  It mostly prevents adding more
eclipse projects later, but that's ok with me;  This is only intended to be one eclipse project.
Anyway, I created the git project in ~/git/logax with logax being the project.  So I manually
did the git init there and imported the project into my eclipse workspace.
