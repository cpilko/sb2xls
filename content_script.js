//Version 0.2
// The background page is asking us to parse the table on the page.
function exportTable() {
        console.log("Got request");
	var cells = createHiddenTable();
        console.log('There are '+cells+' cells in the result');
	//addDownloadLink();
	return 'Done!';
};

var addDownloadLink = function(){
    var export_id = 'excel_export_link';
	//make sure there isn't an export link in the document already.
	if (!document.getElementById(export_id)) {
		//Find the link that gets styled to become the 'Edit Report' button
		var links = document.getElementsByTagName('a');
		var found = false;
		for (var i=0; i<links.length; i++) {
			if (links[i].innerHTML.indexOf("Edit Report") >-1 )  
			{
				var target_link = links[i];
				found = true;
				break;
			}
		}	
		//Don't do anything if it isn't found.
		if (found) {
			var target_div = target_link.parentNode;
			var new_link = document.createElement('a');
			new_link.style.visibility="hidden";
			new_link.setAttribute('href', '#');
			new_link.setAttribute('id', export_id);
			var the_title = document.title.trim();
			var d = getDateString();
			var fn = the_title +' '+ d +'.xls';
			console.log(fn);
			new_link.setAttribute('download', fn);
			new_link.appendChild(document.createTextNode('Export "'+ the_title +'" to Excel'));
			target_div.appendChild(new_link);
			new_link.onclick = runExcellentExport;
			console.log("Clicking new link");
			new_link.click();
		}
	} else {
	    console.log("Clicking found link");
		document.getElementById(export_id).click();
	}
};

var createHiddenTable = function(){
    //Scoutbook overwrites the DOM on page navigation, so destroy any old tables first.
    var el = document.getElementById('exportMe');
	if (el) el.parentNode.removeChild(el);
	//Find the DOM element that contains the target table
	var target_table = document.getElementById('scroller');
	//Get the ancestor div that contains the target table
	var target_div = document.getElementById('scrollWrapper');
	//Create a new hidden table to hold our sanitized data
	var new_table = document.createElement('table');
	new_table.setAttribute("id", "exportMe");
	new_table.style.visibility="hidden";
	var new_tbody = document.createElement('tbody');
	//Loop through the target table row by row
	var r=0;
	while(row=target_table.rows[r++])
	{
		var c=0;
		var tr=document.createElement('tr');
		//loop through each row cell by cell
		while(cell=row.cells[c++])
		{
			//Get the cell's contents
			var new_contents = cell.innerText;
			if (cell.getElementsByTagName("img").length > 0)
			{	
				//If the cell has a checkbox image in it, get its name
				var regex = /checkbox(\w+)48\.png/i;
				var match = regex.exec(cell.getElementsByTagName("img")[0].src);
				if ( match !== null) new_contents = match[1].ucfirst();
			}
			var td=document.createElement('td');
			if (new_contents.indexOf('Empty') > -1) {
				new_contents = "Needs";
				td.setAttribute('style', 'font-weight:bold');
			}
			td.appendChild(document.createTextNode(new_contents));
			tr.appendChild(td);
		}
		new_tbody.appendChild(tr);
		}	
	new_table.appendChild(new_tbody);
	target_div.appendChild(new_table);
        return r*c;
};

function runExcellentExport() {
    //Excellent Export via https://github.com/jmaister/excellentexport
	return ExcellentExport.excel(this, 'exportMe', 'Sheet1');
}

function getDateString() {
    //Create a date string like 2014-05-04 from the current date
    var da = new Date;
	var y = da.getFullYear();
	var m = da.getMonth() + 1;
	var d = da.getDate();
	return y + '-' + padDigits(m,2) + '-' + padDigits(d,2);
}

function padDigits(number, digits) {
	//Take a number and pad it with leading zeros: padDigits(4,5) => 00004
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

String.prototype.ucfirst = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};