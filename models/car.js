const fs = require('fs');
const PATH = __dirname+'/../data/cars.json';
module.exports = Car;

/**
 * Student Model
 * @param {Object} data
 * @constructor
 */
function Car(data = {model: '', brand: '', year: 0, price: 0, color: '', style: ''}){
	var self = this;
	self.id = _getId(data.id);
	self.model = data.model;
	self.brand = data.brand;
	self.year = data.year;
  self.price = data.price;
  self.color = data.color;
  self.style = data.style;

	self.valid = function(){
		let price = +self.price;
    let year = +self.year;
		if(self.model === '' || self.brand === '' || self.color === '' || self.style === '' || isNaN(price) || isNaN(year))
			return false;
		return true;
	}
}

/**
 * Get the id for the student
 * If the id is valid use the passed id
 * If the id is not defined finds the counter or start a new counter
 * @param {Number} id
 * @returns {Number}
 * @private
 */
function _getId(id){
	if(id > 0) return id;
	let data = '';
	try{
		data = require(PATH);
	}catch (err){ // file is empty
		return 1;
	}
	return ++data.counter;
}
