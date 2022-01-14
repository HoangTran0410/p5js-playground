let player,
  dummies = [],
  camera,
  now,
  gameObject = [],
  score = 0,
  levelMaxScore = 10;

function nextLevel() {}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  // noCursor();

  strokeWeight(7);
  stroke("#3A322C");
  // stroke(30);

  player = new Player(100, 100);
  gameObject.push(player);

  for (let i = 0; i < 5; i++) {
    let d = new Dummy(width / 2, height / 2);
    dummies.push(d);
    gameObject.push(d);
  }

  camera = new Camera();
  camera.follow(player.pos);
}

function draw() {
  background(200);

  now = millis();

  // camera.update();
  // camera.beginState();

  player.control();
  player.lookAt(mouseX, mouseY);
  dummies.forEach((d) => d.lookAt(player.pos.x, player.pos.y));
  if (mouseIsPressed) {
    player.attack();
    dummies.forEach((d) => d.attack());
  }

  gameObject.forEach((o) => o.update());
  gameObject
    .sort((a, b) => a.renderOrder - b.renderOrder)
    .forEach((o) => o.render());
  gameObject = gameObject.filter((o) => !o.isDestroy);

  noFill();
  circle(mouseX, mouseY, 30);
  circle(mouseX, mouseY, 0);

  // camera.endState();

  push();
  fill(50);
  stroke(50);
  strokeWeight(2);
  textSize(30);
  text(score + "/" + levelMaxScore, width / 2, 20);

  textSize(20);
  text(~~frameRate(), 10, 10);
  pop();
}
