logax and onceler, parse text files for strings and output as json

## Use Case
Say you have a bunch of log files or html files or any kind of text file for that matter laying around.
You want to "grep" for many different search strings within those files and output to 
a common format like json or csv.  You can subsequently insert the data into a database
for further processing and reporting.  Then this is the tool for you.

## Onceler
Onceler is a node.js command line program that processes files 'once'.  You provide
a json file with the file name globs you want to process.  Onceler keeps track of 
which files have been processed already.

## Logax
Logax is a little guy who hacks up your log files.  (Or text files)  Logax will
accept a json file as input and use the search strings (regex strings) in the json
to parse a file it is given.

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
