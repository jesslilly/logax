logax and onceler, parse text files for strings and output as json

# User Documentation

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

# Developer Documentation

Contributions are welcome.  Make sure changes have tests.

### Future Enhancements
* Process log files that are truncated intelligently
* Output various json hierarchies

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
