const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

var world, engine, render, runner, mouse, stack, mouseConstraint;

var width = window.innerWidth,
    height = window.innerHeight;

window.onload = function() {
    // create engine
    engine = Engine.create(),
        world = engine.world;

    // create renderer
    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: width,
            height: height,
            showAngleIndicator: true,
            showShadows: true,
            wireframes: false
        }
    });

    Render.run(render);

    // create runner
    runner = Runner.create();
    Runner.run(runner, engine);

    // gravity
    engine.world.gravity.y = 1;

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: {
            x: 0,
            y: 0
        },
        max: {
            x: width,
            y: height
        }
    });

    reset();
}

function reset() {
    World.clear(world);
    makeWalls();
    makeSlopes();
    makeThings();
    makeSlingshot();
    makeConstraint();
    makeChain();
    mouseControl();
}

function mouseControl() {
    // add mouse control
    mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
            	// allow bodies on mouse to rotate
                angularStiffness: 0,
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
    World.add(world, mouseConstraint);
}

function makeSlopes() {
    World.add(world, [
        Bodies.rectangle(width * 2 / 3, height / 3, width / 2, 20, {
            isStatic: true,
            angle: Math.PI * -0.08,
            friction: 0
        })
    ]);

    // World.add(world, [
    //     Bodies.rectangle(width / 3, height * 2 / 3, width / 2, 20, { isStatic: true, angle: Math.PI * 0.08, friction: 0 }),
    // ]);
}

function makeWalls() {
    // add walls
    World.add(world, [
        // Bodies.rectangle(width/2, 0, width, 50, {
        //     isStatic: true
        // }),
        Bodies.rectangle(width / 2, height, width, 50.5, {
            isStatic: true
        }),
        Bodies.rectangle(width, height * 2 / 3, 50, height / 2, {
            isStatic: true
        }),
        Bodies.rectangle(0, height / 2, 50, height, {
            isStatic: true
        })
    ]);
}

function makeThings() {
    // add car
    car = Composites.car(150, 100, 150, 30, 30);
    World.add(world, car);

    // add stack rect
    stack = Composites.stack(width - 200, height - 200, 5, 5, 0, 0, function(x, y) {
        return Bodies.rectangle(x, y, 30, 30);
    });
    World.add(world, stack);

    // add soft body
    softbody = Composites.softBody(50, 200, 3, 3, 0, 0, true, 15, {}, {});
    World.add(world, softbody);

    // ragdoll
    var ragdolls = Composite.create();
    for (var i = 1; i <= 2; i++) {
        var r = ragdoll(200 * i, 200, 1.1);
        Composite.add(ragdolls, r);
    }
    World.add(world, ragdolls);

    // add pyramid
    // pyramid = Composites.pyramid(400, 400, 13, 7, 0, 0, function(x, y) {
    //     return Bodies.rectangle(x, y, 30, 30);
    // })
    // World.add(world, pyramid);

    // newton
    var newtonsCradle = Composites.newtonsCradle(300, 5, 5, 20, 200);
    World.add(world, newtonsCradle);
}

function makeSlingshot() {
    var rockOptions = {
            density: 0.004
        },
        rock = Bodies.polygon(170, height - 250, 8, 20, rockOptions),
        anchor = {
            x: 170,
            y: height - 250
        },
        elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            stiffness: 0.05
        });

    World.add(world, [rock, elastic])

    Events.on(engine, 'afterUpdate', function() {
        if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 430)) {
            rock = Bodies.polygon(170, height - 250, 7, 20, rockOptions);
            World.add(engine.world, rock);
            elastic.bodyB = rock;
        }
    });
}

function makeConstraint() {
    // add revolute multi-body constraint
    var body = Bodies.rectangle(500, 400, 100, 20, {
        collisionFilter: {
            group: -1
        }
    });
    var ball = Bodies.circle(600, 400, 20, {
        collisionFilter: {
            group: -1
        }
    });

    var constraint = Constraint.create({
        bodyA: body,
        bodyB: ball,
        stiffness: 0.01
    });

    World.add(world, [body, ball, constraint]);

    // add revolute constraint
    var body = Bodies.rectangle(width / 2, height * 2 / 3, 200, 20);

    var constraint = Constraint.create({
        pointA: {
            x: width / 2,
            y: height * 2 / 3
        },
        bodyB: body,
        length: 0
    });

    World.add(world, [body, constraint]);
}

function makeChain() {
	var group = Body.nextGroup(true);

    var rope = Composites.stack(100, 50, 13, 1, 10, 10, function(x, y) {
        return Bodies.rectangle(x - 20, y, 50, 20, { collisionFilter: { group: group }, chamfer: 5 });
    });
    
    Composites.chain(rope, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });
    Composite.add(rope, Constraint.create({ 
        bodyB: rope.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: { x: rope.bodies[0].position.x, y: rope.bodies[0].position.y },
        stiffness: 0.2
    }));
    
    World.add(world, rope);
}

function shakeScene(engine) {
    var bodies = Composite.allBodies(engine.world);

    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];

        if (!body.isStatic && body.position.y >= 500) {
            var forceMagnitude = 0.03 * body.mass;

            Body.applyForce(body, body.position, {
                x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
                y: -forceMagnitude + Common.random() * -forceMagnitude
            });
        }
    }
};

function ragdoll(x, y, scale, options) {
    scale = typeof scale === 'undefined' ? 1 : scale;

    var Body = Matter.Body,
        Bodies = Matter.Bodies,
        Constraint = Matter.Constraint,
        Composite = Matter.Composite,
        Common = Matter.Common;

    var headOptions = Common.extend({
        label: 'head',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale]
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var chestOptions = Common.extend({
        label: 'chest',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]
        },
        render: {
            fillStyle: '#E0A423'
        }
    }, options);

    var leftArmOptions = Common.extend({
        label: 'left-arm',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var rightArmOptions = Common.extend({
        label: 'right-arm',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var leftLegOptions = Common.extend({
        label: 'left-leg',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var rightLegOptions = Common.extend({
        label: 'right-leg',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var head = Bodies.rectangle(x, y - 60 * scale, 34 * scale, 40 * scale, headOptions);
    var chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
    var rightUpperArm = Bodies.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions);
    var rightLowerArm = Bodies.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions);
    var leftUpperArm = Bodies.rectangle(x - 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, leftArmOptions);
    var leftLowerArm = Bodies.rectangle(x - 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, leftLowerArmOptions);
    var leftUpperLeg = Bodies.rectangle(x - 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, leftLegOptions);
    var leftLowerLeg = Bodies.rectangle(x - 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, leftLowerLegOptions);
    var rightUpperLeg = Bodies.rectangle(x + 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, rightLegOptions);
    var rightLowerLeg = Bodies.rectangle(x + 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, rightLowerLegOptions);

    var chestToRightUpperArm = Constraint.create({
        bodyA: chest,
        pointA: {
            x: 24 * scale,
            y: -23 * scale
        },
        pointB: {
            x: 0,
            y: -8 * scale
        },
        bodyB: rightUpperArm,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var chestToLeftUpperArm = Constraint.create({
        bodyA: chest,
        pointA: {
            x: -24 * scale,
            y: -23 * scale
        },
        pointB: {
            x: 0,
            y: -8 * scale
        },
        bodyB: leftUpperArm,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var chestToLeftUpperLeg = Constraint.create({
        bodyA: chest,
        pointA: {
            x: -10 * scale,
            y: 30 * scale
        },
        pointB: {
            x: 0,
            y: -10 * scale
        },
        bodyB: leftUpperLeg,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var chestToRightUpperLeg = Constraint.create({
        bodyA: chest,
        pointA: {
            x: 10 * scale,
            y: 30 * scale
        },
        pointB: {
            x: 0,
            y: -10 * scale
        },
        bodyB: rightUpperLeg,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var upperToLowerRightArm = Constraint.create({
        bodyA: rightUpperArm,
        bodyB: rightLowerArm,
        pointA: {
            x: 0,
            y: 15 * scale
        },
        pointB: {
            x: 0,
            y: -25 * scale
        },
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var upperToLowerLeftArm = Constraint.create({
        bodyA: leftUpperArm,
        bodyB: leftLowerArm,
        pointA: {
            x: 0,
            y: 15 * scale
        },
        pointB: {
            x: 0,
            y: -25 * scale
        },
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var upperToLowerLeftLeg = Constraint.create({
        bodyA: leftUpperLeg,
        bodyB: leftLowerLeg,
        pointA: {
            x: 0,
            y: 20 * scale
        },
        pointB: {
            x: 0,
            y: -20 * scale
        },
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var upperToLowerRightLeg = Constraint.create({
        bodyA: rightUpperLeg,
        bodyB: rightLowerLeg,
        pointA: {
            x: 0,
            y: 20 * scale
        },
        pointB: {
            x: 0,
            y: -20 * scale
        },
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var headContraint = Constraint.create({
        bodyA: head,
        pointA: {
            x: 0,
            y: 25 * scale
        },
        pointB: {
            x: 0,
            y: -35 * scale
        },
        bodyB: chest,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var legToLeg = Constraint.create({
        bodyA: leftLowerLeg,
        bodyB: rightLowerLeg,
        stiffness: 0.01,
        render: {
            visible: false
        }
    });

    var person = Composite.create({
        bodies: [
            chest, head, leftLowerArm, leftUpperArm,
            rightLowerArm, rightUpperArm, leftLowerLeg,
            rightLowerLeg, leftUpperLeg, rightUpperLeg
        ],
        constraints: [
            upperToLowerLeftArm, upperToLowerRightArm, chestToLeftUpperArm,
            chestToRightUpperArm, headContraint, upperToLowerLeftLeg,
            upperToLowerRightLeg, chestToLeftUpperLeg, chestToRightUpperLeg,
            legToLeg
        ]
    });

    return person;
};