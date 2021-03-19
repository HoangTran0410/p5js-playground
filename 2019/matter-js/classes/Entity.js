class Entity {
    constructor(x, y, s, m) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-2, 2), random(-2, 2));
        this.acc = createVector(0, 0);

        this.shape = s;
        this.mass = m;
    }

    control() {
        if(keyIsDown(LEFT_ARROW)) this.acc.add(-1, 0);
        if(keyIsDown(RIGHT_ARROW)) this.acc.add(1, 0);
        if(keyIsDown(UP_ARROW)) this.acc.add(0, -1);
        if(keyIsDown(DOWN_ARROW)) this.acc.add(0, 1);
    }

    move() {
        // this.vel.add(this.acc);
        this.pos.add(this.vel);

        // this.vel.mult(.95);
        
        this.acc.mult(0);
    }

    applyForce(force) {
        var f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    collideEdges(bounce) {
        if(this.pos.x < this.radius) {
            this.pos.x = this.radius;
            if(bounce) this.vel.x *= -1;
        }
        if(this.pos.x > width - this.radius) {
            this.pos.x = width - this.radius;
            if(bounce) this.vel.x *= -1;
        }
        if(this.pos.y < this.radius) {
            this.pos.y = this.radius;
            if(bounce) this.vel.y *= -1;
        }
        if(this.pos.y > height - this.radius) {
            this.pos.y = height - this.radius;
            if(bounce) this.vel.y *= -1;
        }
    }

    show() {
        noStroke();
    	fill(255, 100);
    	ellipse(this.pos.x, this.pos.y, this.radius*2);
    }

    checkCollision(other) {
        // Get distances between the balls components
        var distanceVect = p5.Vector.sub(other.pos, this.pos);
    
        // Calculate magnitude of the vector separating the balls
        var distanceVectMag = distanceVect.mag();
    
        // Minimum distance before they are touching
        var minDistance = this.radius + other.radius;
    
        if (distanceVectMag < minDistance) {
          var distanceCorrection = (minDistance-distanceVectMag)/2.0;
          var d = distanceVect.copy();
          var correctionVector = d.normalize().mult(distanceCorrection);
          other.pos.add(correctionVector);
          this.pos.sub(correctionVector);
    
          // get angle of distanceVect
          var theta  = distanceVect.heading();
          // precalculate trig values
          var sine = sin(theta);
          var cosine = cos(theta);
    
          /* bTemp will hold rotated ball positions. You 
           just need to worry about bTemp[1] position*/
          var bTemp = [createVector(0, 0), createVector(0, 0)];
    
          /* this ball's position is relative to the other
           so you can use the vector between them (bVect) as the 
           reference point in the rotation expressions.
           bTemp[0].position.x and bTemp[0].position.y will initialize
           automatically to 0.0, which is what you want
           since b[1] will rotate around b[0] */
          bTemp[1].x  = cosine * distanceVect.x + sine * distanceVect.y;
          bTemp[1].y  = cosine * distanceVect.y - sine * distanceVect.x;
    
          // rotate Temporary velocities
          var vTemp = [createVector(0, 0), createVector(0, 0)];
    
          vTemp[0].x  = cosine * this.vel.x + sine * this.vel.y;
          vTemp[0].y  = cosine * this.vel.y - sine * this.vel.x;
          vTemp[1].x  = cosine * other.vel.x + sine * other.vel.y;
          vTemp[1].y  = cosine * other.vel.y - sine * other.vel.x;
    
          /* Now that velocities are rotated, you can use 1D
           conservation of momentum equations to calculate 
           the final velocity along the x-axis. */
          var vFinal = [createVector(0, 0), createVector(0, 0)];
    
          // final rotated velocity for b[0]
          vFinal[0].x = ((this.mass - other.mass) * vTemp[0].x + 2 * other.mass * vTemp[1].x) / (this.mass + other.mass);
          vFinal[0].y = vTemp[0].y;
    
          // final rotated velocity for b[0]
          vFinal[1].x = ((other.mass - this.mass) * vTemp[1].x + 2 * this.mass * vTemp[0].x) / (this.mass + other.mass);
          vFinal[1].y = vTemp[1].y;
    
          // hack to avoid clumping
          bTemp[0].x += vFinal[0].x;
          bTemp[1].x += vFinal[1].x;
    
          /* Rotate ball positions and velocities back
           Reverse signs in trig expressions to rotate 
           in the opposite direction */
          // rotate balls
          var bFinal = [createVector(0, 0), createVector(0, 0)];
    
          bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
          bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
          bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
          bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;
    
          // update balls to screen position
          other.pos.x = this.pos.x + bFinal[1].x;
          other.pos.y = this.pos.y + bFinal[1].y;
    
          this.pos.add(bFinal[0]);
    
          // update velocities
          this.vel.x = cosine * vFinal[0].x - sine * vFinal[0].y;
          this.vel.y = cosine * vFinal[0].y + sine * vFinal[0].x;
          other.vel.x = cosine * vFinal[1].x - sine * vFinal[1].y;
          other.vel.y = cosine * vFinal[1].y + sine * vFinal[1].x;
        }
      }
}

