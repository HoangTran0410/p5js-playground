let video;
let face = { top: 0, left: 0, right: 0, bottom: 0 };

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

  // faceTracker.setResponseMode("single");
}

function draw() {
  // image(video, 0, 0, width, height);
  // filter(GRAY)
  background(30);

  const positions = faceTracker.getCurrentPosition();
  if (positions != false) {
    let top = Infinity,
      left = Infinity,
      right = -Infinity,
      bottom = -Infinity;

    for (let [x, y] of positions) {
      if (x > bottom) bottom = x;
      if (x < top) top = x;
      if (y > right) right = y;
      if (y < left) left = y;
    }

    face.top = lerp(face.top, top, 0.5);
    face.bottom = lerp(face.bottom, bottom, 0.5);
    face.right = lerp(face.right, right, 0.5);
    face.left = lerp(face.left, left, 0.5);

    image(
      video,
      face.top,
      face.left,
      face.bottom - face.top,
      face.right - face.left,
      face.top,
      face.left,
      face.bottom - face.top,
      face.right - face.left
    );

    noStroke();
    fill(0, 255, 0, 100);
    for (let [x, y] of positions) {
      circle(x, y, 3);
    }

    strokeWeight(3);
    stroke("rgb(0,219,36)");
    noFill();
    rect(face.top, face.left, face.bottom - face.top, face.right - face.left);
  }
}
