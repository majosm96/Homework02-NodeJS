const fs = require('fs');
const Style = require('../models/style');
const querystring = require('querystring');
const url = require('url');

const DEFAULT_DATA = {
	records: [],
	counter: 0,
	total: 0
};
const PATH = __dirname+'/../data/styles.json';

module.exports = {
	getAll,
	create,
	options
};

/**
 * Get all the students
 * @param {Object} req
 * @param {Object} res
 */
function getAll(req, res){
	let data = '';
	try{
		data = require(PATH);
	}catch (err){ // empty json
		data = DEFAULT_DATA;
	}
	return _jsonResponse(res, data);
}

/**
 * Creates a new student
 * @param {Object} req
 * @param {Object} res
 */
function create(req, res){
	let body = '';
	req.on('data', chuck => body += chuck);
	req.on('end', () => {
		let params = querystring.parse(body);
		let style = new Style(params);
		if(!style.valid()) return _errorResponse(res, 'Invalid style');

		let data = '';
		try{
			data = require(PATH);
		}catch (err){
			data = DEFAULT_DATA;
		}

		// update the data
		data.records.push(style);
		data.total = data.records.length;
		data.counter = data.records[data.records.length-1].id;

		// save the data
		fs.writeFile(PATH, JSON.stringify(data), err => {
			if(err) return _errorResponse(res, 'Could not save new car.');
			return _jsonResponse(res, data);
		});
	});
}


/**
 * Finds a student by id
 * @param {String} id
 * @param {Boolean} getIdx
 * @returns {*}
 * @private
 */
function _findStyle(id, getIdx = false){
	let data = '';
	let idx = -1;

	try{
		data = require(PATH);
	}catch (err){
		return getIdx ? idx : null;
	}

	// find the student to delete
	data.records.forEach((style, index) => {
		if(style.id === +id) idx = index;
	});

	if(getIdx) return idx;
	return data[idx];
}

/**
 * Response with the available HTTP methods for the students route
 * @param {Object} req
 * @param {Object} res
 */
function options(req, res){
	res.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
	});
	res.end();
}

/**
 * Converts Array|Object to JSON string
 * Includes error  catching
 * @param {Array|Object} data
 * @returns {String|Null} Json or null when fails
 * @private
 */
function _toJson(data){
	try{
		data = JSON.stringify(data);
	}catch (err) {
		data = null;
	}
	return data;
}

/**
 * Response for json data
 * @param {Object res
 * @param {Object|Array} data
 * @param toJson
 * @private
 */
function _jsonResponse(res, data, toJson = true){
	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	});
	data = toJson ? _toJson(data) : data;
	res.write(data);
	return res.end();
}

/**
 * Response for the errors
 * @param {Object} res
 * @param {String} message error
 * @private
 */
function _errorResponse(res, message){
	res.writeHead(400, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	});
	return res.end(_toJson({
		error: true,
		message
	}));
}
