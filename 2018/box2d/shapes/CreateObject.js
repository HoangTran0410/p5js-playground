
function createWall(x, y, w, h) { 
    return new b2Body('box', false, createVector(x, y), createVector(w, h)); 
}

function pyramid(n, x, y, w , h) { 
    // Build a pyramid with an n-can base 
    var xy = createVector(x,y); 
    var wh = createVector(w,h); 
    while (n > 0) { 
        var i = 0; 
        var _xy = xy.copy(); 
        while (i < n) { 
            var b = createShape('box', _xy.x, _xy.y, wh.x, wh.y);
            b.color = color(random(255),random(255),random(255), random(10, 200));
            b.display(attr1);
            b.density = 5; 
            _xy.x += wh.x / 2 + wh.x; 
            i++; 
        } 
        n--; 
        xy.x += wh.x/2+wh.x/4; 
        xy.y -= wh.y*1.25; 
    } 
} 

function createShape(type, x, y, w, h, density = 1, friction = 0.5, bounce = 0.6) { 
    var shape = new b2Body(type, true, createVector(x || width / 2, y || 0), createVector(w || 20, h || 20), density, friction, bounce);
    shape.bullet = true;
    return shape;
} 

function v(x, y) {
    return createVector(x, y);
 }

function attr1(body, fixture, position) {
    fill(body.color);
    b2Display(body, fixture, position);
}