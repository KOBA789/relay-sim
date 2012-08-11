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

Switch.prototype.getStatus = function () {
  return this.status;
};

module.exports = Switch;

if (!module.parent) {
  var expect = require('expect.js');

  var sw1 = new Switch();
  expect(sw1.status).equal(states.OFF);
  expect(sw1.A.getConnections()).eql([]);
  expect(sw1.B.getConnections()).eql([sw1.C]);
  expect(sw1.C.getConnections()).eql([sw1.B]);

  sw1.status = states.ON;
  expect(sw1.status).equal(states.ON);
  expect(sw1.A.getConnections()).eql([sw1.C]);
  expect(sw1.B.getConnections()).eql([]);
  expect(sw1.C.getConnections()).eql([sw1.A]);

  sw1.status = states.OFF;
  expect(sw1.status).equal(states.OFF);
  expect(sw1.A.getConnections()).eql([]);
  expect(sw1.B.getConnections()).eql([sw1.C]);
  expect(sw1.C.getConnections()).eql([sw1.B]);

  console.log('finished!');
}