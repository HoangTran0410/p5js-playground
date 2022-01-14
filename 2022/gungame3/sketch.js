let player,
  dummies = [],
  camera,
  now,
  gameObject = [],
  score = 0,
  levelMaxScore = 10;

function nextLevel() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont("Consolas");
  textSize(30);
  rectMode(CENTER);
  noCursor();

  strokeWeight(7);
  stroke("#3A322C");
  // stroke(30);

  player = new Player(100, 100);
  gameObject.push(player);

  for (let i = 0; i < 10; i++) {
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
  dummies.forEach((d) => d.lookAt(mouseX, mouseY));
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
  text(score + "/" + levelMaxScore, width / 2, 20);
  pop();
}
