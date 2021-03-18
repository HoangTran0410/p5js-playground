class Rectangle {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // Return true if this rectangle contains point
    contains(point) {
        return (point.x >= this.x - this.w / 2 &&
            point.x <= this.x + this.w / 2 &&
            point.y > this.y - this.h / 2 &&
            point.y < this.y + this.h / 2);
    }

    // Return true if this rectangle overlap range
    intersects(range) {
        return !(range.x + range.w / 2 < this.x - this.w / 2 ||
            range.y + range.h / 2 < this.y - this.h / 2 ||
            range.x - range.w / 2 > this.x + this.w / 2 ||
            range.y - range.h / 2 > this.y + this.h / 2);
    }
}

class Circle {
    constructor(x = 0, y = 0, r = 0) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    contains(point) {
        return (dist(point.x, point.y, this.x, this.y) < this.r);
    }

    intersects(range) {
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

class QuadTree {
    constructor(boundary = new Rectangle(), capacity = 1) {
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
    subdivice() {
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
    }

    // Insert a point into the QuadTree
    insert(newPoint) {
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
    }

    // Find all points that inside range
    query(range, pointInRange = [], returnOneValue) {
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
    }

    clear() {
        this.points = [];

        if (this.divided) {
            this.topLeft.clear();
            this.topRight.clear();
            this.botLeft.clear();
            this.topRight.clear();
        }

        this.divided = false;
    }
}


export default {
    Rectangle,
    Circle,
    QuadTree
}