class PhysicObject {
    constructor(_x, _y, _r, _vx, _vy, _ax, _ay) {
        this.position = createVector(_x, _y);
        this.velocity = createVector(_vx, _vy);
        this.acceleration = createVector(_ax, _ay);
        this.radius = _r;
        this.friction = .93;
        this.bounce = .7;
        this.maxSpeed = 10;
    }

    move() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        this.velocity.mult(this.friction);
        this.acceleration.mult(0);
    }

    applyForce(_fx, _fy) {
        this.acceleration.add(_fx, _fy);
    }

    jump() {
        this.applyForce(0, -15);
    }

    collideEdge(_map) {
        var tx = this.position.x;
        var ty = this.position.y;
        var r = this.radius;

        var _mx = _map.position.x;
        var _my = _map.position.y;
        var _mw = _map.width;
        var _mh = _map.height;

        var collide = false;

        if(tx < _mx + r) {
            this.position.x = _mx + r;
            this.velocity.x *= -this.bounce;
            collide = true;
        }
        if(tx > _mx + _mw - r) {
            this.position.x = _mx +_mw - r;
            this.velocity.x *= -this.bounce;
            collide = true;
        }
        if(ty < _my + r) {
            this.position.y = _my + r;
            this.velocity.y *= -this.bounce;
            collide = true;
        }
        if(ty > _my + _mh - r) {
            this.position.y = _my + _mh - r;
            this.velocity.y *= -this.bounce;
            collide = true;
        }
        
        return collide;
    }
}