var util = require('util');

function Point () {
  this.connections = [];
}

Point.prototype.connect = function (point) {
  if (this.connections.indexOf(point) !== -1) {
    this.connections.push(point);
  }
};

Point.prototype.getConnections = function () {
  return this.connections;
};

module.exports = Point;