var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#333",
  parent: "canvas",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: {
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

const ACCELERATION = 200;
const MAX_SPEED = 100;

let spaceship, cursors;

function create() {
  // Create a spaceship sprite triangle
  spaceship = this.add.triangle(400, 300, 0, 0, 0, 40, 40, 20, 0xff0000);
  this.physics.add.existing(spaceship);
  spaceship.body.setMaxSpeed(MAX_SPEED);

  cursors = this.input.keyboard.createCursorKeys();

  // make camera follow the spaceship
  this.cameras.main.startFollow(spaceship);

  // Create a group of asteroids
  const asteroids = this.physics.add.group({
    key: "asteroid",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });
  asteroids.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // create a big circle planet
  const planet = this.add.circle(400, 300, 100, 0x00ff00);
  this.physics.add.existing(planet);
  planet.body.setImmovable(true);

  // colliders
  this.physics.add.collider(spaceship, asteroids);
  this.physics.add.collider(asteroids, asteroids);
  this.physics.add.collider(spaceship, planet);
}

function update() {
  // Move the spaceship with arrow keys
  if (cursors.left.isDown) {
    spaceship.body.angularVelocity = -200;
  } else if (cursors.right.isDown) {
    spaceship.body.angularVelocity = 200;
  } else {
    spaceship.body.angularVelocity = 0;
  }

  if (cursors.up.isDown) {
    // Accelerate the spaceship
    this.physics.velocityFromRotation(
      spaceship.rotation,
      ACCELERATION,
      spaceship.body.acceleration
    );
  } else if (cursors.down.isDown) {
    // Decelerate the spaceship
    this.physics.velocityFromRotation(
      spaceship.rotation,
      -ACCELERATION,
      spaceship.body.acceleration
    );
  } else {
    // Decelerate the spaceship
    spaceship.body.acceleration.set(0);
  }
}
