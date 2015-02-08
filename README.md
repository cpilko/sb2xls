#Export Scoutbook

##Introduction

A Chrome extension to export reports from Scoutbook to an Excel file.

To use this, install it from the [Chrome Web Store](https://chrome.google.com/webstore/detail/export-scoutbook/iibpknbhchmgbmldbloabhhopdoonlni?utm_source=chrome-app-launcher-info-dialog), or clone/download this repo and install it in Chrome locally using [Developer Mode](https://developer.chrome.com/extensions/getstarted#unpacked)

This is a side project that I work on in my free time, and pretty much on an as-needed basis (for my needs, of course...). Feel free to fork and push changes to the code here, and I'll get them updated.

##Notes

For youth protection, we designed this project to function as much on the client side as possible.
All of the report processing takes place in your browser's memory. We don't ever send your Scouts'
data across the interwebs. We think this is a good thing.

Of course, that comes with some tradeoffs. The the library we're using creates a `data` url to build the Excel file.
At the moment, [Chrome has an issue](https://code.google.com/p/chromium/issues/detail?id=44820#c1) where `data` urls greater than two million characters will crash chrome.

This means you can't download 1 report with all the merit badge requirements in it. A workaround is to make
two reports, one with Merit Badges A-M, another with Badges N-Z.


##Revision history

+ v0.3: February 2015 -
    + Fixed the issue of page icon showing on improper page by detecting css id=report
    + Added a warning if reports with > 40,000 cells are exported.
    + Updated dependencies with Bower + Preen
+ v0.2: June 2014 - Bug fixes.
+ v0.1: May 2014 - Initial release.

##TODO

+ Find a way to export the training report.

##Contributing:

+ This project uses [Bower]() for package management and [Preen]() to remove extraneous files from those packages.
+ NetBeans metadata is inclded with this repository.