var Electricity = require('./electricity');

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

  var footprints = this.electricity.run();

  this.objects.forEach(function (object) {
    object.drive();
  });

  footprints.forEach(function (point) {
    point.reset();
  });
};

if (!module.parent) {
  var expect = require('expect.js'),
      Led = require('./led'),
      Relay = require('./relay'),
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
      relay2 = new Relay();

  console.log('finished!');
}