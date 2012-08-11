var util = require('util'),
    voltage = require('./voltage'),
    states = require('./states'),
    Point = require('./point'),
    Led = require('./led');

function Electricity () {
  this.VCC = new Point(voltage.POSITIVE);
  this.GND = new Point(voltage.NEGATIVE);
}

Electricity.prototype.spread = function (point) {
  var dests = point.getConnections().filter(function (point) {
    return point.voltage === voltage.NEUTRAL;
  });
  
  if (dests.length === 0) {
    return point;
  }

  return dests.map(function (destPoint) {
    destPoint.voltage = point.voltage;
    return this.spread(destPoint);
  }.bind(this)).reduce(function (prev, curr) {
    return prev.concat(curr);
  }, []);
};

Electricity.prototype.run = function () {
  var vccFootprints = this.spread(this.VCC),
      gndFootprints = this.spread(this.GND);

  return vccFootprints.concat(gndFootprints);
};

module.exports = Electricity;

if (!module.parent) {
  var expect = require('expect.js');

  var el1 = new Electricity(),
      led1 = new Led();

  el1.VCC.connect(led1.A);
  el1.GND.connect(led1.C);
  var footprints = el1.run();

  expect(led1.status).equal(states.OFF);

  led1.drive();
  expect(led1.status).equal(states.ON);

  console.log('finished!');
}