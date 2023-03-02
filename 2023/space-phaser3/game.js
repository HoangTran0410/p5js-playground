var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var player;

function preload() {
  // Load the image for the player
  //   this.load.image("ship", "assets/ship.png");
}

function create() {
  // Add the player as a rectangle
  player = this.add.rectangle(400, 300, 50, 50, 0xffffff);

  // Add physics to the player rectangle
  this.physics.add.existing(player);

  // Set the player's bounce and drag
  player.body.setBounce(0.2);
  player.body.setDrag(500);

  // Set the camera to follow the player
  this.cameras.main.startFollow(player);

  // Set the background color
  this.cameras.main.setBackgroundColor("#000000");
}

function update() {
  // Rotate the player left or right
  if (
    this.input.keyboard.checkDown(
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      0
    )
  ) {
    player.angle -= 1;
  } else if (
    this.input.keyboard.checkDown(
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      0
    )
  ) {
    player.angle += 1;
  }

  // Boost the player forward
  if (
    this.input.keyboard.checkDown(
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      0
    )
  ) {
    var angle = player.rotation - Math.PI / 2;
    player.body.velocity.x += Math.cos(angle) * 10000;
    player.body.velocity.y += Math.sin(angle) * 10000;
  }
}
