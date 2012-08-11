var util = require('util'),
    voltage = require('./voltage'),
    states = require('./states'),
    Switch = require('./switch'),
    Part = require('./part'),
    Point = require('./point');

function Relay () {
  this.A = new Point(voltage.NEUTRAL);
  this.C = new Point(voltage.NEUTRAL);

  this.L = new Switch();
  this.R = new Switch();

  this.status = states.OFF;
}

util.inherits(Relay, Part);

Relay.prototype.drive = function () {
  if (this.A.voltage * this.C.voltage === -1) {
    this.status = states.ON;
  } else {
    this.status = states.OFF;
  }

  this.L.status = this.status;
  this.R.status = this.status;
};

module.exports = Relay;

if (!module.parent) {
  var expect = require('expect.js');

  var r1 = new Relay();
  
  expect(r1.status).equal(states.OFF);
  expect(r1.L.getStatus()).equal(states.OFF);
  expect(r1.R.getStatus()).equal(states.OFF);

  r1.A.voltage = voltage.POSITIVE;
  r1.C.voltage = voltage.NEGATIVE;
  expect(r1.status).equal(states.OFF);

  r1.drive();
  expect(r1.status).equal(states.ON);

  var r2 = new Relay();
  
  expect(r2.status).equal(states.OFF);
  expect(r2.L.getStatus()).equal(states.OFF);
  expect(r2.R.getStatus()).equal(states.OFF);

  r2.A.voltage = voltage.NEGATIVE;
  r2.C.voltage = voltage.POSITIVE;
  expect(r2.status).equal(states.OFF);

  r2.drive();
  expect(r2.status).equal(states.ON);

  console.log('finished!');
}