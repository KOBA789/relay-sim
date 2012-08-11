var util = require('util'),
    voltage = require('./voltage');

function Point (voltage) {
  this.connections = [];
  this.voltage = voltage;
  this._default = voltage;
}

Point.prototype.connect = function (point) {
  if (this.connections.indexOf(point) === -1) {
    this.connections.push(point);
  }

  if (point.connections.indexOf(this) === -1) {
    point.connections.push(this);
  }  
};

Point.prototype.getConnections = function () {
  return this.connections;
};

Point.prototype.reset = function () {
  this.voltage = this._default;
};

module.exports = Point;