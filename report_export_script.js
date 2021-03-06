// Version 0.4
// The background.js calls this to initiate the report export.
/**
 * Creates a new hidden table with the content, and exports it.
 * @return {string} Completed message
 */
function exportTable() {
  console.log('Got request');
	let cells = createHiddenTable();
  // Data urls in >2M characters crash Chrome as of 2015-02-06
  // https://code.google.com/p/chromium/issues/detail?id=44820#c1
  // Testing shows that ~41000 cells is the threshhold.
  let maxCells = 40000;
        if ( cells > maxCells ) {
            sweetAlert({
              title: 'Don\'t Be Greedy',
              text: 'Your report has ' + cells + ' data items in it.\n'+
                      'Reports with more than '+ maxCells +
                      ' data items crash Chrome.\n'+
                      'We recommend you break this up '+
                      'into two or more smaller reports.',
              type: 'warning',
              showCancelButton: true,
              cancelButtonText: 'I know what I\'m doing',
              confirmButtonColor: '#a5dc86',
              confirmButtonText: 'Ok, I\'ll fix it',
              closeOnCancel: false,
              html: false,
            }, function(isConfirm) {
                if (!isConfirm) {
                    swal({
                         title: 'Here goes nothing',
                         timer: 1000,
                    }, addDownloadLink() );
                }
            });
        } else {
            console.log('There are '+cells+' cells in the result');
            addDownloadLink();
        }
	return 'Done!';
}

let addDownloadLink = function() {
  let exportId = 'excel_export_link';
	// make sure there isn't an export link in the document already.
	if (!document.getElementById(exportId)) {
		// Find the link that gets styled to become the 'Edit Report' button
		let links = document.getElementsByTagName('a');
		let found = false;
    let targetLink;
		for (let i=0; i<links.length; i++) {
			if (links[i].innerHTML.indexOf('Edit Report') >-1 ) {
				targetLink = links[i];
				found = true;
				break;
			}
		}
		// Don't do anything if it isn't found.
		if (found) {
      let targetDiv = targetLink.parentNode;
			let newLink = document.createElement('a');
			newLink.style.visibility='hidden';
			newLink.setAttribute('href', '#');
			newLink.setAttribute('id', exportId);
			let theTitle = document.title.trim();
			let d = getDateString();
			let fn = theTitle +' '+ d +'.xls';
			console.log(fn);
			newLink.setAttribute('download', fn);
			newLink.appendChild(
        document.createTextNode('Export '+ theTitle +' to Excel')
      );
			targetDiv.appendChild(newLink);
			newLink.onclick = runExcellentExport(newLink, 'exportMe');
			console.log('Clicking new link');
			newLink.click();
		} else {
      console.log('Did not find Target Link!');
    }
	} else {
    console.log('Clicking found link');
    document.getElementById(exportId).click();
	}
};

let createHiddenTable = function() {
  // Scoutbook overwrites the DOM on page navigation,
  // so destroy any old tables first.
  let el = document.getElementById('exportMe');
	if (el) el.parentNode.removeChild(el);
	// Find the DOM element that contains the target table
	let targetTable = document.getElementById('scroller');
	// Get the ancestor div that contains the target table
	let targetDiv = document.getElementById('scrollWrapper');
	// Create a new hidden table to hold our sanitized data
	let newTable = document.createElement('table');
	newTable.setAttribute('id', 'exportMe');
	newTable.style.visibility='hidden';
	let newTbody = document.createElement('tbody');
	// Loop through the target table row by row
	let r=0;
  let c=0;
	while(typeof (row=targetTable.rows[r++]) != 'undefined') {
		c=0;
		let tr=document.createElement('tr');
		// loop through each row cell by cell
		while(typeof (cell=row.cells[c++]) != 'undefined') {
			// Get the cell's contents
      // console.log(typeof cell);
      let newContents = cell.textContent;
      if (cell.getElementsByTagName('img').length > 0) {
        // If the cell has a checkbox image in it, get its name
        let regex = /checkbox(\w+)48\.png/i;
        let match = regex.exec(cell.getElementsByTagName('img')[0].src);
        if ( match !== null) newContents = ucfirst(match[1]);
      }
      let td=document.createElement('td');
      if (newContents.indexOf('Empty') > -1) {
        newContents = 'Needs';
        td.setAttribute('style', 'font-weight:bold');
      }
      td.appendChild(document.createTextNode(newContents));
      tr.appendChild(td);
		}
		newTbody.appendChild(tr);
		}
	newTable.appendChild(newTbody);
	targetDiv.appendChild(newTable);
  return r*c;
};
