var fs = require('fs');
var path = require('path');
var people = path.join(__dirname, 'people.emojis.txt');
var nature = path.join(__dirname, 'nature.emojis.txt');
var objects = path.join(__dirname, 'objects.emojis.txt');
var places = path.join(__dirname, 'places.emojis.txt');
var symbols = path.join(__dirname, 'symbols.emojis.txt');
var totalFiles = 5;
var emojis;
var readFiles = 0;



function readFile(fileName, property) {
	return new Promise(function (resolve, reject) {
		fs.readFile(fileName, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data.toString().split('\n'));
		});
	});
}

module.exports = function () {
	if (emojis) return new Promise(function (resolve) {
		resolve(emojis)
	});
	emojis = {};
	return Promise.all([readFile(people, 'people'), readFile(nature, 'nature'), readFile(objects, 'objects'), readFile(places, 'places'), readFile(symbols, 'symbols')]).then(function (data) {
		emojis.people = data[0];
		emojis.nature = data[1];
		emojis.objects = data[2];
		emojis.places = data[3];
		emojis.symbols = data[4];
		return new Promise(function (resolve) {
			resolve(emojis);
		})
	})
}
