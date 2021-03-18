var poly, poly2, c;

function setup() {
    createCanvas(windowWidth, windowHeight).position(0, 0);

    l = new Line(0, 0, 50, 70);
    c = new Circle(400, 100, 100);
    poly = randomPolygon(width / 2, height / 2, 50, 70);
    poly2 = randomPolygon(width / 2 - 100, height / 2, 40, 100);
}

function draw() {
    background(30);
    // clear();

    poly.show();
    poly2.show();

    polyPoly(poly, poly2)
}

function mouseDragged() {
    poly2.center = new Point(mouseX, mouseY);
    
}

function keyPressed() {
    poly = randomPolygon(width / 2, height / 2, 50, 30);
}

function drawVector(v, loc, scale) {
    push();
    var arrowsize = 4;
    translate(loc.x, loc.y);
    stroke(255);
    rotate(v.heading());

    var len = v.mag() * scale;
    line(0, 0, len, 0);
    line(len, 0, len - arrowsize, +arrowsize / 2);
    line(len, 0, len - arrowsize, -arrowsize / 2);
    pop();
}

function beautyPolygon(x, y, corners, r) {
    var arrCorners = [];
    // set position of the pentagon's vertices
    var angle = TWO_PI / corners;
    for (var i = 0; i < corners; i++) {
        var a = angle * i;
        var posx = cos(a) * r;
        var posy = sin(a) * r;
        arrCorners.push(posx);
        arrCorners.push(posy);
    }

    return new Polygon(x, y, arrCorners);
}

function randomPolygon(x, y, rMin, rMax, n) {
    var a = 0;
    var arrCorners = [];
    while (a < 360) {
        var posx = cos(radians(a)) * random(rMin, rMax);
        var posy = sin(radians(a)) * random(rMin, rMax);
        arrCorners.push(posx);
        arrCorners.push(posy);
        a += 360/n || random(15, 40);
    }

    return new Polygon(x, y, arrCorners);
}