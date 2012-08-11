var util = require('util'),
    Electricity = require('./electricity'),
    Point = require('./point');

function World () {
  this.objects = [];
  this.electricity = null;
}

World.prototype.summon = function (part) {
  if (part instanceof Electricity) {
    this.electricity = part;
  } else {
    this.objects.push(part);
  }
};

World.prototype.tick = function () {
  if (this.electricity === null) {
    throw new Error('Any electoricity is not summoned.');
  }

  this.footprints.forEach(function (point) {
    point.reset();
  });

  this.footprints = this.electricity.run();

  this.objects.forEach(function (object) {
    object.drive();
  });
};

module.exports = World;

if (!module.parent) {
  var expect = require('expect.js'),
      Led = require('./led'),
      Relay = require('./relay'),
      Switch = require('./switch'),
      states = require('./states');

  var world1 = new World(),
      led1 = new Led(),
      el1 = new Electricity();
  
  world1.summon(el1);
  world1.summon(led1);

  el1.VCC.connect(led1.A);
  el1.GND.connect(led1.C);
  
  world1.tick();

  expect(led1.status).equal(states.ON);

  var world2 = new World(),
      relay2 = new Relay(),
      el2 = new Electricity();

  world2.summon(el2);
  world2.summon(relay2);

  el2.VCC.connect(relay2.L.B);
  relay2.L.C.connect(relay2.A);
  el2.GND.connect(relay2.C);

  expect(relay2.status).equal(states.OFF);
  world2.tick();
  expect(relay2.status).equal(states.ON);
  world2.tick();
  expect(relay2.status).equal(states.OFF);
  world2.tick();
  expect(relay2.status).equal(states.ON);
  world2.tick();
  expect(relay2.status).equal(states.OFF);
  world2.tick();
  expect(relay2.status).equal(states.ON);
  world2.tick();
  
  var world3 = new World(),
      el3 = new Electricity(),
      sw1 = new Switch(),
      sw2 = new Switch(),
      led3 = new Led();
  
  world3.summon(el3);
  world3.summon(sw1);
  world3.summon(sw2);
  world3.summon(led3);

  el3.VCC.connect(sw1.C);
  sw1.A.connect(sw2.B);
  sw1.B.connect(sw2.A);
  sw2.C.connect(led3.A);
  led3.C.connect(el3.GND);

  world3.tick();
  expect(led3.status).equal(states.OFF);

  sw1.status = states.ON;
  world3.tick();
  expect(led3.status).equal(states.ON);

  sw2.status = states.ON;
  world3.tick();
  expect(led3.status).equal(states.OFF);

  sw1.status = states.OFF;
  world3.tick();
  expect(led3.status).equal(states.ON);

  console.log('finished!');
}