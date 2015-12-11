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



function readFile() {
	return new Promise(function (resolve, reject) {
		if (emojis !== undefined) resolve(emojis);
		else {
			emojis = {};
			
			fs.readFile(people, function (err, data) {
				emojis.people = data.toString().split('\n');
				console.log('people')
				if (readFiles++ === totalFiles) resolve();
			});

			fs.readFile(nature, function (err, data) {
				emojis.nature = data.toString().split('\n');
				console.log('nature')
				if (readFiles++ === totalFiles) resolve();
			});

			fs.readFile(objects, function (err, data) {
				emojis.objects = data.toString().split('\n');
				console.log('objects');
				if (readFiles++ === totalFiles) resolve();
			});

			fs.readFile(places, function (err, data) {
				emojis.places = data.toString().split('\n');
				console.log('places')
				if (readFiles++ === totalFiles) resolve();
			});

			fs.readFile(symbols, function (err, data) {
				emojis.symbols = data.toString().split('\n');
				console.log('symbols')
				if (readFiles++ === totalFiles) resolve();
			});
		}
	});
}

module.exports = readFile;
