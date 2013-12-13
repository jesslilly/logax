`logax` and `onceler`: parse text files with regex strings and output as json.

# User Documentation

## Use Case
Log data mining.  Say you have a bunch of web/app log files or html files or any kind of 
text file for that matter laying around.
You want to "grep" for many different search strings within those files and output to 
json.  You can subsequently insert the data into a database
for further processing and reporting.  Then this is the tool for you.

## Example
### 1. Find a text file you want to mine.

```bash
$ cat joblog1.log
```

```
Begin job log at Tue Nov 26 13:50:43 EST 2013
This is just some random log file you might get from an application.
JobID: 12345
email: aaa@aaa.com
```
 
### 2. Create a parser config file like this:

```bash
$ cat my_parser.js
```

```js
...
{
	"searchFor" : "^JobID: ([0-9]*)$",
	"outputField" : "jobId"
},
{
	"searchFor" : "^email: (.*)$",
	"outputField" : "email"
}
// Note that the output is "captured" using regex parentheses.
```

### 3. Run `logax` like this:

```bash
$ logax --parserFile my_parser.js \
	--input joblog1.log \
	--outputDir /some/dir
```

### 4. You get JSON output like this:

```bash
$ cat /some/dir/joblog1.json
```

```js
[ { "jobId" : 12345, "email" : "aaa@aaa.com" } ]
```

## Installation

1. [Install Node](http://nodejs.org/download/)
2. `npm install logax`
3. `npm` will put `logax` and `onceler` in the PATH for you!

## onceler
`onceler` is a node.js command line program that processes files 'once'.  You provide
a json config file with the file name globs you want to process.  `onceler` keeps track of 
which files have been processed already using dates.  `onceler` will search for 'new'
files working forward in time.  Onceler is intended to be run from a cron
or a scheduled task.  It can handle gz files!

TODO: Add example config and run of onceler

## Functionality

* Search for hundreds of regex strings.
* Supply defaults when there is no match.
* Using onceler and logax together, you can search many files in parallel.
* Configure your own log parser with onceler or a logax wrapper that also calls a http POST.
* Supports *.gz files.
* Can parse a single job log or multiple jobs in one log (with a delimiter).
* JSON array of objets output
* Test coverage
* Available from npm: https://npmjs.org/package/logax

## Caveats
This tool was developed for unstructured log files.  There is no problem using it
for any kind of text file regex parsing, but other tools may do a better job.  For
example, if you want to parse html, xml or some other structured file format, you
may want to try a parser for that markup.  It's your call.

# Developer Documentation

Contributions are welcome.  Make sure changes have tests.

### Future Enhancements
This is roughly in priority order.

1. mkdir $workindDir if not exits.
1. Uncompress .Z Files.
1. Have a template or some way of generating a oncler or logax config file.
1. Implement watson or something else cool for logging.
1. Add optimization when only searching for a few regexes.  Grep or some other cross platform search would be more efficient.
1. Support Windows (Using *nix find command right now).
1. Support calculated fields (Based on the values of already captured fields.  Post row processing step.)
1. Handle duplicate log messages such that you can specify which one you want.  (nth duplicate)
1. Output CSV or JSON.  Only json is supported right now.
1. Crazy idea. Onceler could concatenate multiple files together prior to parsing.  (Many job logs to JSON array output ;)
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
