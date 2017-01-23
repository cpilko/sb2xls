// Version 0.4
// The background.js calls this to initiate the report export.
/**
 * Exports the table(s) containing roster information on the page.
 * Generates multiple download links
 * @return {string} Completed message
 */
 function exportRosters() {
   let rosterItems = document.getElementsByClassName('roster');
   for (let i = 0; i < rosterItems.length; i++) {
     let el = rosterItems[i];
     console.log(el.id);
     if (el.tagName === 'TABLE') addDownloadLink(el.id);
   };
  return 'Completed';
}

/**
 * Creates the download link and calls ExcellentExport to download the table.
 * @param {string} tableId The id of the HTML table to export.
 */
function addDownloadLink(tableId) {
  let exportId = tableId + '_export_link';
	// make sure there isn't an export link in the document already.
	if (document.getElementById(exportId)) {
    // if there is, remove it
    document.getElementById(exportId).remove();
  } else {
    // create a new link to download the table
    let newLink = document.createElement('a');
    newLink.style.visibility='hidden';
    newLink.setAttribute('href', '#');
    newLink.setAttribute('id', exportId);
    let theTitle = ucfirst(tableId.replace(/roster/i, 's')) + ' Roster';
    let d = getDateString();
    let fn = theTitle +' '+ d +'.xls';
    console.log(fn);
    newLink.setAttribute('download', fn);
    newLink.appendChild(
      document.createTextNode('Export '+ theTitle +' to Excel')
    );
    document.body.appendChild(newLink);
    newLink.onclick = runExcellentExport(newLink, tableId);
    // click the link to download the table.
    console.log('Clicking the ' + theTitle + ' link');
    newLink.click();
  }
}
