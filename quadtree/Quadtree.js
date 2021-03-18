
function Point(x, y){
	this.x = x;
	this.y = y;
	this.col = color(random(255), random(255), random(255));

	this.update = function(){
		this.x = this.x + random(-1, 1);
		this.y = this.y + random(-1, 1);
		if(this.x > width) this.x = 1;
		else if(this.x < 0) this.x = width - 1;
		if(this.y > height) this.y = 1; 
		else if(this.y < 0) this.y = height -1;
	}

	this.show = function(){
		point(this.x, this.y);
	}
}

function Rectangle(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	// Return true if this rectangle contains point
	this.contains = function(point){
		return (point.x >= this.x - this.w/2 &&
				point.x <= this.x + this.w/2 &&
				point.y > this.y - this.h/2 &&
				point.y < this.y + this.h/2);
	}

	// Return true if this rectangle overlap range
	this.intersects = function(range){
		return !(range.x + range.w/2 < this.x - this.w/2 ||
				range.y + range.h/2 < this.y - this.h/2 ||
				range.x - range.w/2 > this.x + this.w/2 ||
				range.y - range.h/2 > this.y + this.h/2  );
	}
}

function QuadTree(boundary, capacity){
	/*Axis-aligned bounding box stored as a center with half-dimensions
  	 to represent the boundaries of this quad tree*/
	this.boundary = boundary;
	// Arbitrary constant to indicate how many elements can be stored in this quad tree
	this.capacity = capacity;
	// Points in this quad tree
	this.points = [];
	// This Quad tree is already have children ?
	this.divided = false;
 
 	// Create children for this Quad tree
	this.subdivice = function(){
		var x = this.boundary.x;
		var y = this.boundary.y;
		var w = this.boundary.w/2;
		var h = this.boundary.h/2;
		// Create boundary for all four children
		var tl = new Rectangle(x - w/2, y - h/2, w, h);
		var tr = new Rectangle(x + w/2, y - h/2, w, h);
		var bl = new Rectangle(x - w/2, y + h/2, w, h);
		var br = new Rectangle(x + w/2, y + h/2, w, h);
		// Children
		this.topLeft  = new QuadTree(tl, this.capacity);
		this.topRight = new QuadTree(tr, this.capacity);
		this.botLeft  = new QuadTree(bl, this.capacity);
		this.botRight = new QuadTree(br, this.capacity);

		this.divided = true;
	}

// Insert a point into the QuadTree
	this.insert = function(newPoint){
		// Ignore objects that do not belong in this quad tree
		if(!this.boundary.contains(newPoint)){
			return false;
		}
		// If there is space in this quad tree, add the object here
		if(this.points.length < this.capacity){
			this.points.push(newPoint);
			return true;
		} 
		/* Otherwise, subdivide and then add the point 
		to whichever node will accept it*/
		if(!this.divided){
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
	this.query = function(range, pointInRange){
		// Prepare an array of results
		if (!pointInRange) {
			pointInRange = [];
		}
		// Automatically abort if the range does not intersect this quad
		if (!this.boundary.intersects(range)) {
			return pointInRange;
		}
		// Check objects at this quad level
		for (var i = 0; i < this.points.length; i++) {
			if (range.contains(this.points[i])) {
				pointInRange.push(this.points[i]);
				//this.points[i].update();
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

  	this.show = function(showWhat) {
  		if(showWhat != 'points at mouse'){
			stroke(100);
			if (showWhat == 'grid' || showWhat == 'grid+points'){
				noFill();
				strokeWeight(1);
				if(this.points.length > 0)
					rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
			}

			if (showWhat == 'points' || showWhat == 'grid+points'){
				strokeWeight(4);
				for (var i = 0; i < this.points.length; i++) {
					this.points[i].show();
				}
			}

			if (this.divided) {
				this.topLeft.show(showWhat);
				this.topRight.show(showWhat);
				this.botLeft.show(showWhat);
				this.botRight.show(showWhat);
			}
		}
	}
}

