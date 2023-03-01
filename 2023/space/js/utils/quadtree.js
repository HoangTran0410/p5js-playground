export default class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.objects = [];
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;
    let tl = new Rectangle(x - w / 2, y - h / 2, w, h);
    let tr = new Rectangle(x + w / 2, y - h / 2, w, h);
    let bl = new Rectangle(x - w / 2, y + h / 2, w, h);
    let br = new Rectangle(x + w / 2, y + h / 2, w, h);
    this.topLeft = new QuadTree(tl, this.capacity);
    this.topRight = new QuadTree(tr, this.capacity);
    this.botLeft = new QuadTree(bl, this.capacity);
    this.botRight = new QuadTree(br, this.capacity);
    this.divided = true;
  }

  insert(obj) {
    if (!this.boundary.contains(obj)) {
      return false;
    }

    if (this.objects.length < this.capacity) {
      this.objects.push(obj);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (
      this.topLeft.insert(obj) ||
      this.topRight.insert(obj) ||
      this.botLeft.insert(obj) ||
      this.botRight.insert(obj)
    );
  }

  remove(obj) {
    if (!this.boundary.contains(obj)) {
      return false;
    }

    let index = this.objects.indexOf(obj);
    if (index > -1) {
      this.objects.splice(index, 1);
      return true;
    }

    if (!this.divided) {
      return false;
    }

    return (
      this.topLeft.remove(obj) ||
      this.topRight.remove(obj) ||
      this.botLeft.remove(obj) ||
      this.botRight.remove(obj)
    );
  }

  update(obj) {
    if (this.remove(obj)) {
      return this.insert(obj);
    }
    return false;
  }

  query(range, objectsInRange, returnOneValue) {
    // Prepare an array of results
    if (!objectsInRange) {
      objectsInRange = [];
    }
    // Automatically abort if the range does not intersect this quad
    if (!range.intersects(this.boundary)) {
      return objectsInRange;
    }
    // Check objects at this quad level
    for (const p of this.objects) {
      if (range.contains(p)) {
        objectsInRange.push(p);
        if (returnOneValue) {
          return objectsInRange;
        }
      }
    }
    // Add the points from the children if there are already have children
    if (this.divided) {
      this.topLeft.query(range, objectsInRange);
      this.topRight.query(range, objectsInRange);
      this.botLeft.query(range, objectsInRange);
      this.botRight.query(range, objectsInRange);
    }

    return objectsInRange;
  }

  clear() {
    this.objects = [];

    if (this.divided) {
      this.topLeft.clear();
      this.topRight.clear();
      this.botLeft.clear();
      this.topRight.clear();
    }

    this.divided = false;
  }

  show(showWhat) {
    stroke(100);
    if (showWhat == "points" || showWhat == "grid+points") {
      strokeWeight(4);
      for (let p of this.objects) {
        p.show();
      }
    }

    if (showWhat == "grid" || showWhat == "grid+points") {
      noFill();
      if (this.objects.length > 0) {
        stroke(255);
        strokeWeight(2);
      } else strokeWeight(1);
      let newPos = realToFake(this.boundary.x, this.boundary.y);
      rect(newPos.x, newPos.y, this.boundary.w, this.boundary.h);
      //rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    }

    if (this.divided) {
      this.topLeft.show(showWhat);
      this.topRight.show(showWhat);
      this.botLeft.show(showWhat);
      this.botRight.show(showWhat);
    }
  }
}

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.col = color(random(255), random(255), random(255));
  }
  update() {
    this.x = this.x + random(-1, 1);
    this.y = this.y + random(-1, 1);
    if (this.x > width) this.x = 1;
    else if (this.x < 0) this.x = width - 1;
    if (this.y > height) this.y = 1;
    else if (this.y < 0) this.y = height - 1;
  }

  show() {
    point(this.x, this.y);
  }
}

export class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  contains(point) {
    return (
      point.pos.x >= this.x - this.w / 2 &&
      point.pos.x <= this.x + this.w / 2 &&
      point.pos.y > this.y - this.h / 2 &&
      point.pos.y < this.y + this.h / 2
    );
  }
  intersects(range) {
    return !(
      range.x + range.w / 2 < this.x - this.w / 2 ||
      range.y + range.h / 2 < this.y - this.h / 2 ||
      range.x - range.w / 2 > this.x + this.w / 2 ||
      range.y - range.h / 2 > this.y + this.h / 2
    );
  }
}

export class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  contains(point) {
    return dist(point.pos.x, point.pos.y, this.x, this.y) < this.r;
  }

  intersects(range) {
    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    // radius of the circle
    let r = this.r;
    let w = range.w;
    let h = range.h;

    let edges = dist(xDist, yDist, w, h);

    // no intersection
    if (xDist > r + w || yDist > r + h) return false;

    // intersection within the circle
    if (xDist <= w || yDist <= h) return true;

    // intersection on the edge of the circle
    return edges <= this.rSquared;
  }
}
