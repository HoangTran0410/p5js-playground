function SpaceShip(x, y){

	this.timePre = 0;
	this.timeNow = 0;

	this.x = x;
	this.y = y;
	this.w = 70;
	this.h = 70;
	this.health = 100;
	this.Box = new b2Body('polygon', true, v(this.x, this.y), 
		[v(10, -35), v(-10, -35), v(-35, 35), v(35,35)], this.w*this.h, 0.5, 0, 0);
	this.Box.collision = collide;
	displayWithImage(this.Box, "Texture/Spaceship2.png");

	this.addShip = function(){
		ship = new SpaceShip(width/2, height/2);
	}

	this.control = function(){
		if(keyIsDown(LEFT_ARROW))
			this.Box.applyTorque(-this.w*this.h);
		if(keyIsDown(RIGHT_ARROW))
			this.Box.applyTorque(this.w*this.h);
		if(keyIsDown(UP_ARROW))
			this.Box.applyImpulse(v(cos(this.Box.angle-PI/2), 
				sin(this.Box.angle-PI/2)), this.w*this.h*0.2);
		if(keyIsDown(DOWN_ARROW))
			this.Box.applyImpulse(v(-cos(this.Box.angle-PI/2), 
				-sin(this.Box.angle-PI/2)), this.w*this.h*0.2);
		if(keyIsDown(32)) {
			this.fire();
		}
	}

	this.update = function(){
		this.x = this.Box.xy.x;
		this.y = this.Box.xy.y;
		//balance(ship);
	}


	this.fire = function(){
		this.timeNow = millis();
		if(this.timeNow - this.timePre > 100) {
			gunSound.play();
			new Bullet(mouseX, mouseY, 0, 50, "Texture/bullet2.png");
			this.timePre = this.timeNow;
		}
	}
}

function Bullet(x, y, angle, lifeSpan, imagePath){

	this.x = x + 35*cos(angle-PI/2);
	this.y = y + 35*sin(angle-PI/2);
	this.w = 15;
	this.h = 15;

	this.Box = createShape('circle', this.x, this.y, this.w, this.h, this.w*this.h, 0.5, 0.6, angle);
	this.Box.applyImpulse(v(cos(angle-PI/2), sin(angle-PI/2)), 15*15);
	this.Box.life = lifeSpan;
	this.Box.bullet = true;
	displayWithImage(this.Box, imagePath);
}

function Enemy(x, y){

	this.timeNow = 0;
	this.timePre = 0;

	this.x = x;
	this.y = y;
	this.w = 70;
	this.h = 70;

	this.Box = createShape('circle', this.x, this.y, this.w, this.h, 500, 0.5, 0.6);
	this.Box.applyForce(v(0, 15), 500);
	displayWithImage(this.Box, "Texture/Spaceship.png");

    this.update = function(){
    	this.x = this.Box.xy.x;
    	this.y = this.Box.xy.y;
    	
    	balance(enemy);
		follow(enemy, v(ship.x, 100), 1);
    }

    this.fire = function(){
    	this.timeNow = millis();
		if(this.timeNow - this.timePre > 500 && this.Box.active) {
			// gunSound.play();
			new Bullet(this.x, this.y, this.Box.angle+PI, 50, "Texture/bullet.png");
			this.timePre = this.timeNow;
		}
    }
}

function Trap(x, y){
	// this.timeNow = 0;
	// this.timePre = 0;
	this.x = x;
	this.y = y;
	this.w = 70;
	this.h = 15;

	this.Box = createShape('box', x, y, this.w, this.h, 500, 0.5, 0.6);
	this.Box.applyAngularImpulse(100);
	this.Box.applyForce(v(0, 15), 500);
	this.Box.color = color(0, 255, 140);
    this.Box.display(attr1, 0);

    this.Box.addTo('box', v(15, 0), v(30, 30));

    this.update = function(){
    	this.x = this.Box.xy.x;
    	this.y = this.Box.xy.y;
    	// follow(this.Box, enemy, 0.001);
    }
}
