// Thanks for
// http://www.jeffreythompson.org/collision-detection/table_of_contents.php

//================ POINT - POINT =======================
function pointPoint(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y;
}

//================= POINT - CIRCLE =====================
function pointCircle(p, c) {
    // get distance between the point and circle's center
    // using the Pythagorean Theorem
    var distX = p.x - c.center.x;
    var distY = p.y - c.center.y;
    var distance = sqrt((distX * distX) + (distY * distY));

    // if the distance is less than the circle's
    // radius the point is inside!
    return distance <= c.radius;
}

function circlePoint(c, p) {
    return pointCircle(p, c);
}

//===================== CIRCLE - CIRCLE =====================
function circleCircle(c1, c2) {
    // get distance between the circle's centers
    // use the Pythagorean Theorem to compute the distance
    var distX = c1.center.x - c2.center.x;
    var distY = c1.center.y - c2.center.y;
    var distance = sqrt((distX * distX) + (distY * distY));

    // if the distance is less than the sum of the circle's
    // radii, the circles are touching!
    return distance <= c1.radius + c2.radius;
}

// ==================== POINT - RECTANGLE ===================
function pointRect(p, r) {
    return (p.x >= r.center.x - r.width / 2 && // right of the left edge AND
        p.x <= r.center.x + r.width / 2 && // left of the right edge AND
        p.y >= r.center.y - r.height / 2 && // below the top AND
        p.y <= r.center.y + r.height / 2) // above the bottom
}

function rectPoint(r, p) {
    return pointRect(p, r);
}

//==================== RECT - RECT ========================
function rectRect(r1, r2) {
    if (r1.center.x + r1.width / 2 >= r2.center.x - r2.width / 2 && // r1 right edge past r2 left
        r1.center.x - r1.width / 2 <= r2.center.x + r2.width / 2 && // r1 left edge past r2 right
        r1.center.y + r1.height / 2 >= r2.center.y - r2.height / 2 && // r1 bottom edge past r2 top
        r1.center.y - r1.height / 2 <= r2.center.y + r2.height / 2) { // r1 top edge past r2 bottom
        return true;
    }
    return false;
}

//==================== CIRCLE - RECT ======================
function circleRect(c, r) {
    // check rect container first
    if (!rectRect(c.getRectContainer(), r)) return false;

    // temporary variables to set edges for testing
    var testX = c.center.x;
    var testY = c.center.y;

    // which edge is closest?
    if (c.center.x < r.center.x - r.width / 2) testX = r.center.x - r.width / 2; // test left edge
    else if (c.center.x > r.center.x + r.width / 2) testX = r.center.x + r.width / 2; // right edge
    if (c.center.y < r.center.y - r.height / 2) testY = r.center.y - r.height / 2; // top edge
    else if (c.center.y > r.center.y + r.height / 2) testY = r.center.y + r.height / 2; // bottom edge

    // get distance from closest edges
    var distX = c.center.x - testX;
    var distY = c.center.y - testY;
    var distance = sqrt((distX * distX) + (distY * distY));

    // if the distance is less than the radius, collision!
    return distance <= c.radius;
}

function rectCircle(r, c) {
    return circleRect(c, r);
}

//===================== LINE - POINT =====================
function linePoint(l, p) {
    // check rect container first
    if (!rectRect(l.getRectContainer(), p.getRectContainer())) return false;

    // get distance from the point to the two ends of the line
    var d1 = dist(p.x, p.y, l.head.x, l.head.y);
    var d2 = dist(p.x, p.y, l.tail.x, l.tail.y);

    // get the length of the line
    var lineLen = dist(l.head.x, l.head.y, l.tail.x, l.tail.y);

    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    var buffer = 0.1; // higher # = less accurate

    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    return (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer);
}

function pointLine(p, l) {
    return linePoint(l, p);
}

//===================== LINE - CIRCLE =====================
function lineCircle(l, c) {
    // check rect container first
    if (!rectRect(l.getRectContainer(), c.getRectContainer())) return false;
    // is either end INSIDE the circle?
    // if so, return true immediately
    var inside1 = pointCircle(l.head, c);
    var inside2 = pointCircle(l.tail, c);
    // if(inside1 && inside2) return false; //check if line inside circle 
    if (inside1 || inside2) return true;

    // get length of the line
    var distX = l.head.x - l.tail.x;
    var distY = l.head.y - l.tail.y;
    var len = sqrt((distX * distX) + (distY * distY));

    // get dot product of the line and circle
    // ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / pow(len,2)
    var dot = (((c.center.x - l.head.x) * (l.tail.x - l.head.x)) + ((c.center.y - l.head.y) * (l.tail.y - l.head.y))) / (len * len);

    // find the closest point on the line
    var closestX = l.head.x + (dot * (l.tail.x - l.head.x));
    var closestY = l.head.y + (dot * (l.tail.y - l.head.y));

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    var onSegment = linePoint(l, new Point(closestX, closestY));
    if (!onSegment) return false;

    // optionally, draw a circle at the closest
    // point on the line
    fill(255, 0, 0);
    noStroke();
    ellipse(closestX, closestY, 20, 20);

    // get distance to closest point
    distX = closestX - c.center.x;
    distY = closestY - c.center.y;
    var distance = sqrt((distX * distX) + (distY * distY));

    return distance <= c.radius;
}

function circleLine(c, l) {
    return lineCircle(l, c);
}

//==================== LINE - LINE =======================
function lineLine(l1, l2) {
    // calculate the distance to intersection point
    var a = (l2.tail.x - l2.head.x) * (l1.head.y - l2.head.y) - (l2.tail.y - l2.head.y) * (l1.head.x - l2.head.x);
    var a2 = (l1.tail.x - l1.head.x) * (l1.head.y - l2.head.y) - (l1.tail.y - l1.head.y) * (l1.head.x - l2.head.x);
    var b = (l2.tail.y - l2.head.y) * (l1.tail.x - l1.head.x) - (l2.tail.x - l2.head.x) * (l1.tail.y - l1.head.y);

    var uA = a / b;
    var uB = a2 / b;

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

        // optionally, draw a circle where the lines meet
        var intersectionX = l1.head.x + (uA * (l1.tail.x - l1.head.x));
        var intersectionY = l1.head.y + (uA * (l1.tail.y - l1.head.y));
        fill(255, 0, 0);
        noStroke();
        ellipse(intersectionX, intersectionY, 20, 20);

        return true;
    }
    return false;
}

//==================== LINE - RECT =======================
function lineRect(l, r) {
    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    var top_left = new Point(r.center.x - r.width / 2, r.center.y - r.height / 2);
    var top_right = new Point(r.center.x - r.width / 2, r.center.y + r.height / 2);
    var bottom_left = new Point(r.center.x + r.width / 2, r.center.y - r.height / 2);
    var bottom_right = new Point(r.center.x + r.width / 2, r.center.y + r.height / 2)

    var leftEdge = new Line(top_left.x, top_left.y, bottom_left.x, bottom_left.y);
    var rightEdge = new Line(top_right.x, top_right.y, bottom_right.x, bottom_right.y);
    var topEdge = new Line(top_left.x, top_left.y, top_right.x, top_right.y);
    var downEdge = new Line(bottom_left.x, bottom_left.y, bottom_right.x, bottom_right.y);

    // if ANY of the above are true, the line has hit the rectangle
    return lineLine(l, leftEdge) || lineLine(l, rightEdge) || lineLine(l, topEdge) || lineLine(l, downEdge);
}

function rectLine(r, l) {
    return lineRect(l, r);
}

//=================== POLYGON - POINT ======  ===============
function polygonPoint(poly, p) {
    // check rect container first
    if (!rectRect(poly.getRectContainer(), p.getRectContainer())) return false;

    var collision = false;
    // go through each of the poly.corners, plus
    // the next vertex in the list
    var next = 0;
    for (var current = 0; current < poly.corners.length; current++) {
        // get next vertex in list
        // if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == poly.corners.length) next = 0;

        // get the corner position at our current position
        // this makes our if statement a little cleaner
        var vc = poly.corners[current].copy().addVec(poly.center); // c for "current"
        var vn = poly.corners[next].copy().addVec(poly.center); // n for "next"

        // compare position, flip 'collision' variable
        // back and forth
        if (((vc.y >= p.y && vn.y < p.y) || (vc.y < p.y && vn.y >= p.y)) &&
            (p.x < (vn.x - vc.x) * (p.y - vc.y) / (vn.y - vc.y) + vc.x)) {
            collision = !collision;
        }
    }
    return collision;
}

function pointPolygon(p, poly) {
    return polygonPoint(poly, p);
}

//================== POLYGON - CIRCLE ====================
function polygonCircle(poly, c) {
    // check rect container first
    if (!rectRect(poly.getRectContainer(), c.getRectContainer())) return false;

    // go through each of the poly.corners, plus
    // the next vertex in the list
    var next = 0;
    for (var current = 0; current < poly.corners.length; current++) {

        // get next vertex in list
        // if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == poly.corners.length) next = 0;

        // get the poly.corners at our current position
        // this makes our if statement a little cleaner
        var vc = poly.corners[current].copy().addVec(poly.center); // c for "current"
        var vn = poly.corners[next].copy().addVec(poly.center); // n for "next"

        // check for collision between the circle and
        // a line formed between the two poly.corners
        var collision = lineCircle(new Line(vc.x, vc.y, vn.x, vn.y), c);
        if (collision) return true;
    }

    // the above algorithm only checks if the circle
    // is touching the edges of the polygon – in most
    // cases this is enough, but you can un-comment the
    // following code to also test if the center of the
    // circle is inside the polygon
    // var centerInside = polygonPoint(vertices, cx,cy);
    // if (centerInside) return true;

    // otherwise, after all that, return false
    return false;
}

function circlePolygon(c, poly) {
    return polygonCircle(poly, c);
}

//================= POLYGON - RECTANGLE ==================
function polygonRect(poly, r) {
    // check rect container first
    if (!rectRect(poly.getRectContainer(), r)) return false;

    // go through each of the vertices, plus the next
    // vertex in the list
    var next = 0;
    for (var current = 0; current < poly.corners.length; current++) {

        // get next vertex in list
        // if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == poly.corners.length) next = 0;

        // get the PVectors at our current position
        // this makes our if statement a little cleaner
        var vc = poly.corners[current].copy().addVec(poly.center); // c for "current"
        var vn = poly.corners[next].copy().addVec(poly.center); // n for "next"

        // check against all four sides of the rectangle
        var collision = lineRect(new Line(vc.x, vc.y, vn.x, vn.y), r);
        if (collision) return true;

        // optional: test if the rectangle is INSIDE the polygon
        // note that this iterates all sides of the polygon
        // again, so only use this if you need to
        // var inside = polygonPoint(poly.corners, r.center);
        // if (inside) return true;
    }

    return false;
}

function rectPolygon(r, poly) {
    return polygonRect(poly, r);
}

//================ POLYGON - LINE ========================
function polygonLine(poly, l) {
    // check rect container first
    if (!rectRect(poly.getRectContainer(), l.getRectContainer())) return false;

    // go through each of the vertices, plus the next
    // vertex in the list
    var next = 0;
    for (var current = 0; current < poly.corners.length; current++) {
        // get next vertex in list
        // if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == poly.corners.length) next = 0;

        // get the PVectors at our current position
        // extract X/Y coordinates from each
        var headL = poly.corners[current].copy().addVec(poly.center);
        var tailL = poly.corners[next].copy().addVec(poly.center); 

        // do a Line/Line comparison
        // if true, return 'true' immediately and
        // stop testing (faster)
        var hit = lineLine(l, new Line(headL.x, headL.y, tailL.x, tailL.y));
        if (hit) {
            return true;
        }
    }

    // never got a hit
    return false;
}

function linePolygon(l, poly) {
    return polygonLine(poly, l);
}

//=============== POLYGON - POLYGON ======================
function polyPoly(poly1, poly2) {
    // check rect container first
    if (!rectRect(poly1.getRectContainer(), poly2.getRectContainer())) return false;

    // go through each of the vertices, plus the next
    // vertex in the list
    var next = 0;
    for (var current = 0; current < poly1.corners.length; current++) {

        // get next vertex in list
        // if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == poly1.corners.length) next = 0;

        // get the PVectors at our current position
        // this makes our if statement a little cleaner
        var vc = poly1.corners[current].copy().addVec(poly1.center); // c for "current"
        var vn = poly1.corners[next].copy().addVec(poly1.center); // n for "next"

        // now we can use these two points (a line) to compare
        // to the other polygon's vertices using polyLine()
        var collision = polygonLine(poly2, new Line(vc.x, vc.y, vn.x, vn.y));
        if (collision) return true;

        // optional: check if the 2nd polygon is INSIDE the first
        // collision = polygonPoint(poly1, poly2.corners[0]);
    }

    return false;
}


//============== RESPONsE =================
function responseRectCircle(rect, circle){
    var NearestX = Max(rect.x, Min(circle.pos.x, rect.x + rect.w));
    var NearestY = Max(rect.y, Min(circle.pos.y, rect.y + rect.h));
  
    var dist = createVector(circle.pos.x - NearestX, circle.pos.y - NearestY);
    var tangent_vel = dist.normalize().dot(circle.vel);
    circle.vel = circle.vel.sub(tangent_vel.mult(2));
  }