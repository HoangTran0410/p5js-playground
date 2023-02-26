import * as f from "./js/main.js";

for (let key in f) {
  window[key] = f[key];
}

// let cloud;

// function setup() {
//   createCanvas(400, 400);
//   rectMode(CENTER);

//   cloud = new Cloud(width / 2, height / 2, 200, 100);
// }

// function draw() {
//   background(30);

//   cloud.update();
//   cloud.draw();
// }

// class Cloud {
//   constructor(x, y, w, h) {
//     this.x = x;
//     this.y = y;
//     this.w = w;
//     this.h = h;

//     this.bubbles = [];
//     for (let i = 0; i < 20; i++) {
//       let x = random(this.x - this.w / 2, this.x + this.w / 2);
//       let y = random(this.y - this.h / 2, this.y + this.h / 2);
//       let r = random(15, 30);
//       this.bubbles.push({ x, y, r });
//     }

//     this.noise = [random(100), random(100)];
//   }

//   update() {
//     // move bubbles using perlin noise, but still inside the cloud
//     for (let bubble of this.bubbles) {
//       let xoff = map(
//         this.noise[0],
//         this.x - this.w / 2,
//         this.x + this.w / 2,
//         0,
//         10
//       );
//       let yoff = map(
//         this.noise[1],
//         this.y - this.h / 2,
//         this.y + this.h / 2,
//         0,
//         10
//       );
//       let angle = noise(xoff, yoff) * TWO_PI * 4;
//       bubble.x += cos(angle);
//       bubble.y += sin(angle);

//       // still inside the cloud, appear in center if outside
//       if (bubble.x < this.x - this.w / 2 || bubble.x > this.x + this.w / 2) {
//         bubble.x = this.x;
//       }
//       if (bubble.y < this.y - this.h / 2 || bubble.y > this.y + this.h / 2) {
//         bubble.y = this.y;
//       }
//     }

//     this.noise[0] += 0.01;
//     this.noise[1] += 0.02;
//   }

//   draw() {
//     stroke(200, 100);
//     noFill();
//     rect(this.x, this.y, this.w, this.h);

//     noStroke();

//     // color will more alpha when closer to the edge
//     for (let bubble of this.bubbles) {
//       let alpha = map(
//         dist(this.x, this.y, bubble.x, bubble.y),
//         0,
//         sqrt(sq(this.w / 2) + sq(this.h / 2)),
//         255,
//         0
//       );
//       fill(255, alpha);
//       ellipse(bubble.x, bubble.y, bubble.r * 2);
//     }
//   }
// }

// let xoff;

// function setup() {
//   createCanvas(500, 400);
//   xoff = 0;
// }

// function draw() {
//   background(30);

//   noStroke();
//   fill(255);
//   for (let i = 0; i < 20; i++) {
//     // calculate the new position using Perlin noise
//     let noiseX = noise(xoff + i);
//     let noiseY = noise(xoff + i + 100);
//     let x = map(noiseX, 0, 1, 0, width);
//     let y = map(noiseY, 0, 1, 0, height);

//     // draw the circle
//     ellipse(x, y, 100, 100);
//   }
//   // increment the xoff
//   xoff += 0.005;
// }
