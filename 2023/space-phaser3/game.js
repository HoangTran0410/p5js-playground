var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  backgroundColor: "#0072bc",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var cursors;
var player;

var game = new Phaser.Game(config);

function preload() {}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

  player = this.add.rectangle(400, 300, 50, 50, 0xffffff);
  this.physics.world.enable(player);

  player.body.setCollideWorldBounds(true);
}

function update() {
  // player.setVelocity(0);

  if (cursors.left.isDown) {
    player.body.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(160);
  }

  if (cursors.up.isDown) {
    player.body.setVelocityY(-160);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(160);
  }
}
