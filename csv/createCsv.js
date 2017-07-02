const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

module.exports = {
  createCsv
};
/**
 * Create a new CSV file
 * @param  {String} filename filename with the path
 * @param  {Array} data      array with the data to convert to csv
 * @return {EventEmitter}    event
 */
function createCsv(filename, data){
	let event = new EventEmitter();

	// // file already exists
	// if(fs.existsSync(filename)){
	// 	event.emit('error', new Error('File alreasy exists: '+filename));
	// 	return event;
	// }

	// convert to csv

	var csv = new Array();
    data.records.forEach(function (item, index, array) {
        csv.push(item.model + ',' + item.brand + ',' + item.year + ',' + item.color + ',' + item.style);
    });

    var csv = csv.join("\n");

	// write the csv file
	fs.writeFile(filename, csv, error => {
		if(error) event.emit('error', error);
		event.emit('done', csv);
	});

	return event;
}
