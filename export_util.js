/**
 * Runs Excellent Export via https://github.com/jmaister/excellentexport
 * @param {object} anchor The anchor object this will be attached to.
 * @param {string} tableId id of the HTML table to export
 * @this exportId
 * @return {object} DataUri
 */
function runExcellentExport(anchor, tableId) {
  console.log(`Exporting ${tableId}`);
	return ExcellentExport.excel(anchor, tableId, 'Sheet1');
}

/**
 * Create a date string like 2014-05-04 from the current date
 * @return {string} Formatted date
 */
function getDateString() {
  let da = new Date();
	let y = da.getFullYear();
	let m = da.getMonth() + 1;
	let d = da.getDate();
	return y + '-' + padDigits(m, 2) + '-' + padDigits(d, 2);
}

/**
 * Take a number and pad it with leading zeros: padDigits(4,5) => 00004
 * @param {int} number The number to format
 * @param {int} digits The number of leading zeroes to pad to
 * @return {string} Formatted number
 */
function padDigits(number, digits) {
  let len = String(number).length;
  return Array(Math.max(digits - len + 1, 0)).join(0) + number;
}

/**
 * Capitalize the first character in a string
 * @param {string} string The string to format
 * @return {string} Formatted string
 */
function ucfirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};
