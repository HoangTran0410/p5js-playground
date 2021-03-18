let boards = [];
let imgTests = [];

let selected;

function preload() {
  imgTests.push(loadImage('assets/sprites.png'));
  imgTests.push(loadImage('assets/abc.jpg'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  boards.push(new Board({
    img: imgTests[0]
  }));

  boards.push(new Board({
    img: imgTests[1]
  }));
}

function draw() {
  background(30);

  for (let board of boards)
    board.display();

  selected && selected.hightlightBorder('red');
}

function keyPressed() {
  // if (board.mode == 'insert') {
  //   if (keyCode == 65) { // a

  //   }
  // }

  for (let board of boards)
    if (keyCode == LEFT_ARROW) {
      board.moveBy(-1, 0)
    } else if (keyCode == RIGHT_ARROW) {
      board.moveBy(1, 0)
    } else if (keyCode == UP_ARROW) {
      board.moveBy(0, -1)
    } else if (keyCode == DOWN_ARROW) {
      board.moveBy(0, 1)
    }
}

function mouseWheel(event) {
  // if (board.mode == 'normal')
  for (let board of boards)
    board.zoomBy(event.delta);
}

function mousePressed() {
  selected = null;
  for (let i = boards.length - 1; i >= 0; i--) {
    if (boards[i].isContain(mouseX, mouseY)) {
      selected = boards[i];
      return;
    }
  }
}

function mouseDragged() {
  if (selected) {
    selected.moveBy(mouseX - pmouseX, mouseY - pmouseY);

  } else {
    for (let board of boards) {
      board.moveBy(mouseX - pmouseX, mouseY - pmouseY);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ================ Utility ===========================
function invertColor(hexTripletColor) {
  var color = hexTripletColor;
  color = color.substring(1); // remove #
  color = parseInt(color, 16); // convert to integer
  color = 0xFFFFFF ^ color; // invert three bytes
  color = color.toString(16); // convert to hex
  color = ("000000" + color).slice(-6); // pad with leading zeros
  color = "#" + color; // prepend #
  return color;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex([r, g, b, a]) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function swap(a, b) {
  let temp = a;
  a = b;
  b = temp;
}
// ================ CLASSES =========================
class Board {
  constructor(config = {}) {
    const {
      img, // hình ảnh hiển thị
      position = createVector(width * .5, height * .5), // vị trí mặc định là giữa màn hình
      naturalSize = (img ? createVector(img.width, img.height) : createVector(100, 100)), // = kích thước ảnh hoặc mặc định là 100-100
      block = [],
      mode = 'normal'
    } = config;

    this.img = img;
    this.position = position;
    this.naturalSize = naturalSize; // kích thước gốc
    this.size = naturalSize.copy(); // kích thước hiện tại
    this.zoomRatio = 1; // tỉ lệ thu phóng

    this.blocks = block;
    this.mode = mode;
  }

  display() {

    if (this.img) {
      image(this.img,
        this.position.x - this.size.x * .5,
        this.position.y - this.size.y * .5,
        this.size.x,
        this.size.y
      );
    } else {

    }

    this.hightlightMouse();
  }

  showMousePos(x, y) {
    let mousePos = this.getMousePosOnBoard();

    strokeCap(ROUND);
    strokeWeight(20);
    stroke(30, 150);
    line(x - 30, y - 5, x + 30, y - 5);
    noStroke();
    fill(255);
    textAlign(CENTER);
    text(~~mousePos.x + ' ' + ~~mousePos.y, x, y);
  }

  hightlightMouse() {
    // grid
    if (this.isContain(mouseX, mouseY)) {

      const { top, left, right, bottom } = this.getBound();
      stroke('gray');
      strokeWeight(1);
      line(mouseX, top, mouseX, bottom);
      line(left, mouseY, right, mouseY);

      this.hightlightBorder();
      this.showMousePos(mouseX, mouseY);
    }

    // mouse position
    stroke('red');
    strokeWeight(5);
    noFill();
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

  hightlightBorder(c) {
    const { top, left, right, bottom } = this.getBound();

    noFill();
    stroke(c || 100);
    strokeWeight(2);
    rect(left, top, this.size.x, this.size.y);

    noStroke();
    fill(255);
    text(this.img.width, this.position.x, this.position.y - this.size.y * .5 - 5);
    text(this.img.height, this.position.x - this.size.x * .5 - 20, this.position.y);
  }

  focus() {

  }

  zoomBy(value) {
    this.zoomTo(this.zoomRatio + (value > 0 ? -0.1 : 0.1));
  }

  zoomTo(ratio) {
    ratio = max(0.1, ratio);

    let tiLe = ratio / this.zoomRatio;

    this.zoomRatio = ratio;
    this.size = this.naturalSize.copy().mult(ratio);

    // Zoom from the triggering point of the event
    this.position.x = mouseX + ((this.position.x - mouseX) * tiLe);
    this.position.y = mouseY + ((this.position.y - mouseY) * tiLe);
  }

  constrainEdge() {
    // Không cho hình ảnh khi zoom bị di chuyển đi xa quá màn hình
    this.position.x = constrain(this.position.x, -this.size.x * .5, width + this.size.x * .5)
    this.position.y = constrain(this.position.y, -this.size.y * .5, height + this.size.y * .5)
  }

  moveBy(x, y) {
    this.position.add(x, y);

    // this.constrainEdge();
  }

  isContain(x, y) {
    const { top, left, right, bottom } = this.getBound();
    return (x > left && x < right && y > top && y < bottom)
  }

  getMousePosOnBoard() {
    let { top, left } = this.getBound()
    let topLeftCorner = createVector(left, top);
    let mousePos = createVector(mouseX, mouseY);

    let sub = p5.Vector.sub(mousePos, topLeftCorner);

    sub.div(this.zoomRatio)

    return sub;
  }

  getBound() {
    return {
      left: this.position.x - this.size.x * .5,
      right: this.position.x + this.size.x * .5,
      top: this.position.y - this.size.y * .5,
      bottom: this.position.y + this.size.y * .5
    }
  }
}