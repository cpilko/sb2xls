//Version 0.3
var manifestData = chrome.runtime.getManifest();
var version = manifestData.version;
//Declare rules:
//Report page
var reportRule = {
    conditions: [
	   new chrome.declarativeContent.PageStateMatcher({
	       pageUrl: { hostSuffix: '.scoutbook.com',  schemes: ['https'] },
               css: ["#report"]
	   })],
   actions: [ new chrome.declarativeContent.ShowPageAction() ]
};
//Trained Leader Report Page
var leaderRule = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: '.scoutbook.com', schemes: ['https'], 
                pathSuffix: ['leadertraining.asp'] }
        })], 
    actions: [ new chrome.declarativeContent.ShowPageAction() ]
};
//Roster page
var rosterRule = {
    conditions: [
           new chrome.declarativeContent.PageStateMatcher({
	       pageUrl: { hostSuffix: '.scoutbook.com',  schemes: ['https'] },
               css: ["#scoutRoster"]
	   })

	],
	//If found, display the Page Action icon registered in the manifest.json
	actions: [ new chrome.declarativeContent.ShowPageAction() ]
};

//Register rules:
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([reportRule, rosterRule, leaderRule]);
    });
});

// Called when the user clicks on the browser action.
chrome.pageAction.onClicked.addListener(function(tab) {
  console.log('Clicked '+version+' '+tab.url);
  if ( /report\.asp/i.test(tab.url) ) {
      chrome.pageAction.setTitle({'tabid': tab.id, 'title': 'Export this report to Excel'});
      chrome.tabs.insertCSS(null, {file: "bower_components/sweetalert/lib/sweet-alert.css"}, 
        executeScripts(null, [ 
            { file: "bower_components/excellentexport/excellentexport.min.js" }, 
            { file: "bower_components/sweetalert/lib/sweet-alert.min.js" },
            { file: "report_export_script.js" },
            { code: "exportTable();" }
        ])
      );
  } 
  if ( /messages\/default.asp/i.test(tab.url) ) {
      //chrome.pageAction.setTitle({'tabid': tab.id, 'title': 'Add your signature to this message'});
      console.log("This is the messages screen.");
  }
});

//From http://stackoverflow.com/questions/21535233/injecting-multiple-scripts-through-executescript-in-google-chrome
function executeScripts(tabId, injectDetailsArray)
{
    function createCallback(tabId, injectDetails, innerCallback) {
        return function () {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    var callback = function(response){ console.log('v'+version+' '+response); };

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback();   // execute outermost function
}

