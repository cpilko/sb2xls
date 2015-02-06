//Version 0.2
var manifestData = chrome.runtime.getManifest();
var version = manifestData.version;
//Declare rules:
var match_rules = {
    conditions: [
	   new chrome.declarativeContent.PageStateMatcher({
	       //find pages like 'https://*.scoutbook.com/*/reports/report.asp'
	       pageUrl: { 
		       hostSuffix: '.scoutbook.com', 
			   pathSuffix: '/reports/report.asp', 
			   schemes: ['https']
			}
	   })
	],
	//If found, display the Page Action icon registered in the manifest.json
	actions: [ new chrome.declarativeContent.ShowPageAction() ]
};

//Register rules:
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([match_rules]);
    });
});

// Called when the user clicks on the browser action.
chrome.pageAction.onClicked.addListener(function(tab) {
  console.log('Clicked!');
  chrome.tabs.insertCSS(null, {file: "bower_components/sweetalert/lib/sweet-alert.css"}, 
    executeScripts(null, [ 
        { file: "bower_components/excellentexport/excellentexport.min.js" }, 
        { file: "bower_components/sweetalert/lib/sweet-alert.min.js" },
        { file: "content_script.js" },
        { code: "exportTable();" }
    ])
  ) 
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

