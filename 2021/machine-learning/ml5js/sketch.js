let video;
let currentMode;

function setup() {
  createCanvas(640, 480);
  textAlign(CENTER, CENTER);
  textSize(20);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  let select = createSelect();
  for (let key in modes) select.option(modes[key].name, key);
  select.changed(() => {
    let key = select.value();

    currentMode = modes[key];

    if (!currentMode.loaded) {
      currentMode.setup();
    }
  });

  // currentMode = modes.facemesh;
  // currentMode.setup();
}

function draw() {
  image(video, 0, 0, width, height);

  if (currentMode) {
    currentMode.draw();

    if (!currentMode.loaded) {
      fill(255);
      noStroke();
      text(`Loading ${currentMode.name} model...`, width / 2, height / 2);
    }
  }
}

let modes = {
  facemesh: {
    name: "FaceMesh",
    loaded: false,
    model: null,
    predictions: [],
    isDetecting: false,
    setup() {
      this.model = ml5.facemesh(() => {
        this.loaded = true;
      });
    },
    draw() {
      if (this.loaded && !this.isDetecting) {
        this.isDetecting = true;
        this.model.predict(video, (results) => {
          this.predictions = results;
          this.isDetecting = false;
        });
      }

      // const annos = [
      //   "leftEyebrowLower",
      //   "leftEyebrowUpper",
      //   "rightEyebrowLower",
      //   "rightEyebrowUpper",
      // ];

      // draw ellipses over the detected keypoints
      for (let pre of this.predictions) {
        // scaled mesh
        fill(0, 255, 0);
        for (let keypoint of pre.scaledMesh) {
          const [x, y] = keypoint;
          circle(x, y, 4);
        }

        // eyebrow
        // stroke(0, 255, 0);
        // noFill();
        // for (let anno of annos) {
        //   beginShape();
        //   for (let keypoint of pre.annotations[anno]) {
        //     const [x, y] = keypoint;
        //     vertex(x, y);
        //   }
        //   endShape();
        // }
      }
    },
  },
  handpose: {
    name: "HandPose",
    loaded: false,
    model: null,
    predictions: [],
    isDetecting: false,
    setup() {
      this.model = ml5.handpose(() => {
        this.loaded = true;
      });
    },
    draw() {
      if (this.loaded && !this.isDetecting) {
        this.isDetecting = true;
        this.model.predict(video, (results) => {
          this.predictions = results;
          this.isDetecting = false;
        });
      }

      // draw skeletons
      stroke(0, 255, 0);
      for (let pre of this.predictions) {
        for (let key in pre.annotations) {
          let anno = pre.annotations[key];

          fill(0, 255, 0);
          beginShape();
          for (let p of anno) {
            ellipse(p[0], p[1], 10, 10);
            vertex(p[0], p[1]);
          }
          noFill();
          endShape();
        }
      }
      // show landmarks
      //   fill(0, 255, 0);
      //   noStroke();
      //   for (let i = 0; i < predictions.length; i += 1) {
      //     const prediction = predictions[i];
      //     for (let j = 0; j < prediction.landmarks.length; j += 1) {
      //       const keypoint = prediction.landmarks[j];
      //       ellipse(keypoint[0], keypoint[1], 10, 10);
      //     }
      //   }
    },
  },
  posenet: {
    name: "PoseNET",
    loaded: false,
    model: null,
    predictions: [],
    isDetecting: false,
    setup() {
      this.model = ml5.poseNet(() => {
        this.loaded = true;
      });
    },
    draw() {
      if (this.loaded && !this.isDetecting) {
        this.isDetecting = true;
        this.model.multiPose(video, (results) => {
          this.predictions = results;
          this.isDetecting = false;
        });
      }

      this.drawKeypoints(this.predictions);
      this.drawSkeleton(this.predictions);
    },
    drawKeypoints(poses) {
      for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
          let keypoint = pose.keypoints[j];
          if (keypoint.score > 0.2) {
            fill(255, 0, 0);
            noStroke();
            ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
          }
        }
      }
    },
    drawSkeleton(poses) {
      for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        for (let j = 0; j < skeleton.length; j++) {
          let partA = skeleton[j][0];
          let partB = skeleton[j][1];
          stroke(0, 255, 0);
          line(
            partA.position.x,
            partA.position.y,
            partB.position.x,
            partB.position.y
          );
        }
      }
    },
  },
  object_detection: {
    name: "Object Detection",
    loaded: false,
    model: null,
    predictions: [],
    isDetecting: false,
    setup() {
      this.model = ml5.objectDetector("cocossd", () => {
        this.loaded = true;
      });
    },
    draw() {
      if (this.loaded && !this.isDetecting) {
        this.isDetecting = true;
        this.model.detect(video, (error, results) => {
          if (error) {
            console.error(error);
          }
          this.predictions = results;
          this.isDetecting = false;
        });
      }

      for (let obj of this.predictions) {
        stroke(0, 255, 0);
        strokeWeight(4);
        noFill();
        rect(obj.x, obj.y, obj.width, obj.height);
        noStroke();
        fill(255);
        textSize(24);
        text(obj.label, obj.x + 10, obj.y + 24);
      }
    },
  },
  faceapi: {
    name: "FaceAPI",
    loaded: false,
    model: null,
    predictions: [],
    isDetecting: false,
    setup() {
      this.model = ml5.faceApi(
        video,
        {
          withLandmarks: true,
          withDescriptors: false,
          minConfidence: 0.2,
        },
        () => {
          this.loaded = true;
        }
      );
    },
    draw() {
      if (this.loaded && !this.isDetecting) {
        this.isDetecting = true;
        this.model.detect(video, (error, results) => {
          if (error) {
            console.error(error);
          }
          this.predictions = results;
          this.isDetecting = false;
        });
      }

      if (this.predictions.length > 0) {
        this.drawBox(this.predictions);
        this.drawLandmarks(this.predictions);
      }
    },
    drawBox(detections) {
      for (let i = 0; i < detections.length; i++) {
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x;
        const y = alignedRect._box._y;
        const boxWidth = alignedRect._box._width;
        const boxHeight = alignedRect._box._height;

        noFill();
        stroke(0, 255, 0);
        strokeWeight(2);
        rect(x, y, boxWidth, boxHeight);
      }
    },
    drawLandmarks(detections) {
      noFill();
      stroke(0, 255, 0);
      strokeWeight(2);

      for (let i = 0; i < detections.length; i++) {
        const mouth = detections[i].parts.mouth;
        const nose = detections[i].parts.nose;
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        const rightEyeBrow = detections[i].parts.rightEyeBrow;
        const leftEyeBrow = detections[i].parts.leftEyeBrow;

        this.drawPart(mouth, true);
        this.drawPart(nose, false);
        this.drawPart(leftEye, true);
        this.drawPart(leftEyeBrow, false);
        this.drawPart(rightEye, true);
        this.drawPart(rightEyeBrow, false);
      }
    },
    drawPart(feature, closed) {
      beginShape();
      for (let i = 0; i < feature.length; i++) {
        const x = feature[i]._x;
        const y = feature[i]._y;
        vertex(x, y);
      }

      if (closed === true) {
        endShape(CLOSE);
      } else {
        endShape();
      }
    },
  },
  bodypix: {
    name: "Body Pix",
    loaded: false,
    model: null,
    predictions: null,
    isDetecting: false,
    setup() {
      this.model = ml5.bodyPix(() => {
        this.loaded = true;
      });
    },
    draw() {
      if (this.loaded && !this.isDetecting) {
        this.isDetecting = true;
        this.model.segment(video, (error, results) => {
          if (error) {
            console.error(error);
          }
          this.predictions = results;
          this.isDetecting = false;
        });
      }

      fill(30, 200);
      rect(0, 0, width, height);

      if (this.predictions) {
        image(this.predictions.backgroundMask, 0, 0, width, height);
      }
    },
  },
  unet: {
    name: "Unet",
    loaded: false,
    model: null,
    predictions: null,
    isDetecting: false,
    setup() {
      this.model = ml5.uNet("face", () => {
        this.loaded = true;
      });
    },
    draw() {
      if (this.loaded && !this.isDetecting) {
        this.isDetecting = true;
        this.model.segment(video, (error, results) => {
          if (error) {
            console.error(error);
          }
          this.predictions = results;
          this.isDetecting = false;
        });
      }

      fill(30, 200);
      rect(0, 0, width, height);

      if (this.predictions) {
        image(this.predictions.backgroundMask, 0, 0, width, height);
      }
    },
  },
};
