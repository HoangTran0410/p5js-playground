let video;

function setup() {
  createCanvas(640, 480);
  textAlign(CENTER, CENTER);
  textSize(20);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // tracker
  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(video.elt);
}

function draw() {
  image(video, 0, 0, width, height);

  const positions = faceTracker.getCurrentPosition();
  if (positions != false) {
    fill(0, 255, 0);
    for (let pos of positions) {
      circle(pos[0], pos[1], 5);
    }
  }
}
