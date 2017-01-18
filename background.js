// Version 0.3.2
const manifestData = chrome.runtime.getManifest();
const version = manifestData.version;
// Declare rules:
// Report page
let reportRule = {
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostSuffix: '.scoutbook.com', schemes: ['https']},
        css: ['#report'],
      })],
   actions: [new chrome.declarativeContent.ShowPageAction()],
};
// Trained Leader Report Page
let leaderRule = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostSuffix: '.scoutbook.com', schemes: ['https'],
                pathSuffix: 'leadertraining.asp'},
        })],
    actions: [new chrome.declarativeContent.ShowPageAction()],
};
// Roster page
let rosterRule = {
    conditions: [
         new chrome.declarativeContent.PageStateMatcher({
           pageUrl: {hostSuffix: '.scoutbook.com', schemes: ['https'],
            pathSuffix: '/reports/roster.asp', queryContains: 'Action=Print'},
          }),
        ],
	// If found, display the Page Action icon registered in the manifest.json
  actions: [new chrome.declarativeContent.ShowPageAction()],
};

// Register rules:
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
          reportRule, rosterRule, leaderRule,
        ]);
    });
});

// Called when the user clicks on the browser action.
chrome.pageAction.onClicked.addListener(function(tab) {
  console.log('Clicked '+version+' '+tab.url);
  if ( /report\.asp/i.test(tab.url) ) {
      chrome.pageAction.setTitle({
        'tabId': tab.id,
        'title': 'Export this report to Excel',
      });
      chrome.tabs.insertCSS(null,
        {file: 'bower_components/sweetalert/dist/sweetalert.css'},
        executeScripts(null, [
            {file: 'bower_components/excellentexport/excellentexport.min.js'},
            {file: 'bower_components/sweetalert/dist/sweetalert.min.js'},
            {file: 'report_export_script.js'},
            {code: 'exportTable();'},
        ])
      );
  }
  if ( /\/reports\/roster\.asp.Action=Print/i.test(tab.url) ) {
      console.log('This is the roster screen.');
  }
});

/**
 * Recursively loads content scripts in the target page.
 * From http://stackoverflow.com/questions/21535233/injecting-multiple-scripts-through-executescript-in-google-chrome
 * @param {int} tabId The id of the tab to inject the scripts.
 * @param {array} injectDetailsArray An array of details.
 */
function executeScripts(tabId, injectDetailsArray) {
  /**
   * Recursively loads content scripts in the target page.
   * From http://stackoverflow.com/questions/21535233/injecting-multiple-scripts-through-executescript-in-google-chrome
   * @param {int} tabId The id of the tab to inject the scripts.
   * @param {array} injectDetails One detail.
   * @param {function} innerCallback callback function generated by inner script
   * @return {function} A callback function for nesting
   */
    function createCallback(tabId, injectDetails, innerCallback) {
        return function() {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }
    let callback = function(response) {
      console.log('v'+version+' '+response);
    };

    for (let i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback();   // execute outermost function
}
