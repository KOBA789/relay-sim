var util = require('util'),
    Part = require('./part'),
    Point = require('./point'),
    voltage = require('./voltage'),
    states = require('./states');

function Switch () {
  this.A = new Point(voltage.NEUTRAL);
  this.B = new Point(voltage.NEUTRAL);
  this.C = new Point(voltage.NEUTRAL);

  this.status = states.OFF;

  this.A.getConnections = function () {
    if (this.status) {
      return this.A.connections.concat(this.C);      
    } else {
      return this.A.connections;
    }
  }.bind(this);

  this.B.getConnections = function () {
    if (this.status) {
      return this.B.connections;
    } else {
      return this.B.connections.concat(this.C);
    }
  }.bind(this);

  this.C.getConnections = function () {
    if (this.status) {
      return this.C.connections.concat(this.A);
    } else {
      return this.C.connections.concat(this.B);
    }
  }.bind(this);
}

module.exports = Switch;

if (!module.parent) {
  var expect = require('expect.js');

  var sw1 = new Switch();
  expect(sw1.A.getConnections()).eql([]);

  console.log('finished!');
}