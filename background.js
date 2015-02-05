//Version 0.2
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
      chrome.tabs.executeScript(null, {file: 'content_script.js'}, 	function(result){
	  chrome.tabs.executeScript(null, {file: 'js/excellentexport.js'} , function() { 
		chrome.tabs.sendMessage(tab.id, {action: 'go'}, 
			function(response){
			    console.log('v0.2'+response); 
				//Reload the tab to clean up residual scripts still hanging around
                //chrome.tabs.reload ();

		    });
	    });
    });
 
});

