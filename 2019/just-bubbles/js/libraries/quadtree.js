function Point(x, y) {
    this.x = x;
    this.y = y;
    this.col = color(random(255), random(255), random(255));

    this.update = function() {
        this.x = this.x + random(-1, 1);
        this.y = this.y + random(-1, 1);
        if (this.x > width) this.x = 1;
        else if (this.x < 0) this.x = width - 1;
        if (this.y > height) this.y = 1;
        else if (this.y < 0) this.y = height - 1;
    }

    this.show = function() {
        point(this.x, this.y);
    }
}

function Rectangle(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // Return true if this rectangle contains point
    this.contains = function(point) {
        return (point.pos.x >= this.x - this.w / 2 &&
            point.pos.x <= this.x + this.w / 2 &&
            point.pos.y > this.y - this.h / 2 &&
            point.pos.y < this.y + this.h / 2);
    }

    // Return true if this rectangle overlap range
    this.intersects = function(range) {
        return !(range.x + range.w / 2 < this.x - this.w / 2 ||
            range.y + range.h / 2 < this.y - this.h / 2 ||
            range.x - range.w / 2 > this.x + this.w / 2 ||
            range.y - range.h / 2 > this.y + this.h / 2);
    }
}

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.contains = function(point) {
        return (dist(point.pos.x, point.pos.y, this.x, this.y) < this.r);
    }

    this.intersects = function(range) {
        var xDist = Math.abs(range.x - this.x);
        var yDist = Math.abs(range.y - this.y);

        // radius of the circle
        var r = this.r;
        var w = range.w;
        var h = range.h;

        var edges = dist(xDist, yDist, w, h);

        // no intersection
        if (xDist > (r + w) || yDist > (r + h))
            return false;

        // intersection within the circle
        if (xDist <= w || yDist <= h)
            return true;

        // intersection on the edge of the circle
        return edges <= this.rSquared;
    }
}

function QuadTree(boundary, capacity) {
    /*Axis-aligned bounding box stored as a center with half-dimensions
  	 to represent the boundaries of this quad tree*/
    this.boundary = boundary;
    // Arbitrary constant to indicate how many elements can be stored in this quad tree
    this.capacity = capacity;
    // Points in this quad tree
    this.points = [];
    // This Quad tree is already have children ?
    this.divided = false;
}

// Create children for this Quad tree
QuadTree.prototype.subdivice = function() {
    var x = this.boundary.x;
    var y = this.boundary.y;
    var w = this.boundary.w / 2;
    var h = this.boundary.h / 2;
    // Create boundary for all four children
    var tl = new Rectangle(x - w / 2, y - h / 2, w, h);
    var tr = new Rectangle(x + w / 2, y - h / 2, w, h);
    var bl = new Rectangle(x - w / 2, y + h / 2, w, h);
    var br = new Rectangle(x + w / 2, y + h / 2, w, h);
    // Children
    this.topLeft = new QuadTree(tl, this.capacity);
    this.topRight = new QuadTree(tr, this.capacity);
    this.botLeft = new QuadTree(bl, this.capacity);
    this.botRight = new QuadTree(br, this.capacity);

    this.divided = true;
};

// Insert a point into the QuadTree
QuadTree.prototype.insert = function(newPoint) {
    // Ignore objects that do not belong in this quad tree
    if (!this.boundary.contains(newPoint)) {
        return false;
    }
    // If there is space in this quad tree, add the object here
    if (this.points.length < this.capacity) {
        this.points.push(newPoint);
        return true;
    }
    /* Otherwise, subdivide and then add the point 
    to whichever node will accept it*/
    if (!this.divided) {
        this.subdivice();
    }

    if (this.topLeft.insert(newPoint) || this.topRight.insert(newPoint) ||
        this.botLeft.insert(newPoint) || this.botRight.insert(newPoint)) {
        return true;
    }

    /* Otherwise, the point cannot be inserted for some 
    	unknown reason (this should never happen)*/
    return false;
};

// Find all points that inside range
QuadTree.prototype.query = function(range, pointInRange, returnOneValue) {
    // Prepare an array of results
    if (!pointInRange) {
        pointInRange = [];
    }
    // Automatically abort if the range does not intersect this quad
    if (!range.intersects(this.boundary)) {
        return pointInRange;
    }
    // Check objects at this quad level
    for (var i = 0; i < this.points.length; i++) {
        if (range.contains(this.points[i])) {
            pointInRange.push(this.points[i]);
            if (returnOneValue) {
                return pointInRange;
            }
        }
    }
    // Add the points from the children if there are already have children
    if (this.divided) {
        this.topLeft.query(range, pointInRange);
        this.topRight.query(range, pointInRange);
        this.botLeft.query(range, pointInRange);
        this.botRight.query(range, pointInRange);
    }

    return pointInRange;
};

QuadTree.prototype.clear = function() {
    this.points = [];

    if (this.divided) {
        this.topLeft.clear();
        this.topRight.clear();
        this.botLeft.clear();
        this.topRight.clear();
    }

    this.divided = false;
};

QuadTree.prototype.show = function(showWhat) {
    if (showWhat != 'points at mouse') {
        stroke(100);
        if (showWhat == 'points' || showWhat == 'grid+points') {
            strokeWeight(4);
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].show();
            }
        }

        if (showWhat == 'grid' || showWhat == 'grid+points') {
            noFill();
            if (this.points.length > 0) {
                stroke(255);
                strokeWeight(2);
            } else strokeWeight(1);
            var newPos = realToFake(this.boundary.x, this.boundary.y);
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
};