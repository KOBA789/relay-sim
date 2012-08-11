var util = require('util'),
    voltage = require('./voltage'),
    states = require('./states'),
    Switch = require('./switch'),
    Part = require('./part'),
    Point = require('./point');

function Relay () {
  this.L = new Switch();
  this.R = new Switch();

  this.status = states.OFF;
}

util.inherits(Relay, Part);

Relay.prototype.drive = function () {
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

  r1.status = states.ON;
  expect(r1.status).equal(states.ON);
  expect(r1.L.getStatus()).equal(states.OFF);
  expect(r1.R.getStatus()).equal(states.OFF);

  r1.drive();
  expect(r1.status).equal(states.ON);
  expect(r1.L.getStatus()).equal(states.ON);
  expect(r1.R.getStatus()).equal(states.ON);

  console.log('finished!');
}