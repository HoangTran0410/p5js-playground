// module aliases
const { Engine, World, Bodies, MouseConstraint, Mouse } = Matter;
var engine, world;

var shapes = [];
var preTime = 0;
var canvas;
var mConstrains;

var grid = {
    rows: 10,
    cols : 15,
    spacing: 35,
    sizeDot: 5
};
var gateBottom;

function addMouseControl() {
    // mouse constrains
    var canvasmouse = Mouse.create(canvas.elt);
    canvasmouse.pixelRatio = pixelDensity();
    var options = {
        mouse: canvasmouse
    }

    mConstrains = MouseConstraint.create(engine, options);
    World.add(world, mConstrains);
}

function addGrid() {
    shapes = makeGrid(width / 2, height / 3, grid.rows, grid.cols, grid.sizeDot, grid.spacing);
    for (var dot of shapes) {
        dot.addToWorld(world);
    }
    addGround();
}

function autoAddShapes() {
    setInterval(function () {
        if (focused) {
            newShape(width / 2 + random(-4 * grid.spacing, 4 * grid.spacing), 0);
        }
    }, 300);
}

function autoReleaseGate() {
    setInterval(function(){
        releaseGround();
        setTimeout(function() {
            addGround();
        }, 3000);
    }, 30000);
}

function setupWorld() {
    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);
}

function newShape(x, y) {
    var options = {
        friction: 0.001,
        restitution: 0.6
    };
    var obj;
    if (random(1) > .5)
        obj = new Circle(x, y, 10, options);
    else obj = new Box(x, y, random(10, 20), random(10, 20), options)
    obj.addToWorld(world);
    shapes.push(obj);
}

function makeGrid(posx, posy, rows, cols, sizeDot, spacing) {
    var result = [];

    // dots
    for (var i = 0; i < rows; i++) {
        var y = (posy - rows * spacing / 2) + i * spacing + spacing / 2;

        for (var j = 0; j < cols; j++) {
            var x = (posx - cols * spacing / 2) + j * spacing + spacing / 2;
            if (i % 2) {
                x += spacing / 2;
            }
            result.push(new Circle(x, y, sizeDot, {
                isStatic: true
            }));
        }
    }

    for (var i = 0; i <= cols; i++) {
        result.push(new Box(posx - cols / 2 * spacing + i * spacing, height - 80, 5, 150, {
            isStatic: true
        }));
    }

    return result;
}

function addGround() {
    // grounds
    if(gateBottom) {
        gateBottom.removeFrom(shapes, world);
    }
    gateBottom = new Box(width / 2, height, width, 20, {
        isStatic: true
    });
    gateBottom.addToWorld(world);
    shapes.push(gateBottom)
}

function releaseGround() {
    gateBottom.body.isStatic = false;
}

// ============= BEGIN P5JS ===============
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);

    setupWorld();
    addMouseControl();
    addGrid();
    autoAddShapes();
    autoReleaseGate();
}

function draw() {
    background(30);

    fill(120);
    noStroke();
    textSize(16);
    text('SpaceBar - add shapes\nMouse - drag shapes.', 5, 20)

    for (var i = shapes.length - 1; i >= 0; i--) {
        shapes[i].show();
        if (shapes[i].isOffScreen()) shapes[i].removeFrom(shapes, world);
    }

    // drag shapes
    if (mConstrains.body) {
        var pos = mConstrains.body.position;
        var offset = mConstrains.constraint.pointB;
        var m = mConstrains.mouse.position;
        stroke(0, 255, 0);
        line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }

    // add shapes with SpaceBar
    if (keyIsDown(32)) {
        if (millis() - preTime > 20) {
            preSpaw = millis();
            newShape(mouseX, mouseY);
        }
    }
}

