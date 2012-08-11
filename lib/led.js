var util = require('util'),
    voltage = require('./voltage'),
    states = require('./states'),
    Part = require('./part'),
    Point = require('./point');

function Led () {
  this.A = new Point(voltage.NEUTRAL);
  this.C = new Point(voltage.NEUTRAL);

  this.status = states.OFF;
}

util.inherits(Led, Part);

Led.prototype.drive = function () {
  if (this.A.voltage === voltage.POSITIVE &&
      this.C.voltage === voltage.NEGATIVE) {
    this.status = states.ON;
  } else {
    this.status = states.OFF;
  }
};

module.exports = Led;

if (!module.parent) {
  var expect = require('expect.js');

  var led1 = new Led();
  expect(led1.status).equal(states.OFF);
  expect(led1.A.voltage).equal(voltage.NEUTRAL);
  expect(led1.C.voltage).equal(voltage.NEUTRAL);

  led1.A.voltage = voltage.POSITIVE;
  expect(led1.status).equal(states.OFF);
  expect(led1.A.voltage).equal(voltage.POSITIVE);
  expect(led1.C.voltage).equal(voltage.NEUTRAL);
  
  led1.drive();
  expect(led1.status).equal(states.OFF);
  expect(led1.A.voltage).equal(voltage.POSITIVE);
  expect(led1.C.voltage).equal(voltage.NEUTRAL);

  led1.C.voltage = voltage.NEGATIVE;
  expect(led1.status).equal(states.OFF);
  expect(led1.A.voltage).equal(voltage.POSITIVE);
  expect(led1.C.voltage).equal(voltage.NEGATIVE);

  led1.drive();
  expect(led1.status).equal(states.ON);
  expect(led1.A.voltage).equal(voltage.POSITIVE);
  expect(led1.C.voltage).equal(voltage.NEGATIVE);

  led1.A.voltage = voltage.NEGATIVE;
  led1.C.voltage = voltage.POSITIVE;
  led1.drive();
  expect(led1.status).equal(states.OFF);
  expect(led1.A.voltage).equal(voltage.NEGATIVE);
  expect(led1.C.voltage).equal(voltage.POSITIVE);

  console.log('finished!');
}