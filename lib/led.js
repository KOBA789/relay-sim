var util = require('util'),
    Part = require('./part');

function Led () {
  
}

util.inherits(Led, Part);

Led.prototype.drive = function () {

};

module.exports = Led;