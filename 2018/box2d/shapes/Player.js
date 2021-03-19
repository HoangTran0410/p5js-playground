function Player() {

	this.create = function(x, y, w, h){

		this.player = createShape('box', x, y, w, h, guiControl.density, guiControl.friction, guiControl.bounce);
	  	this.player.color = color(120, 150, 220);
	  	this.player.display(attr1, 0);

	  	this.player.addTo('circle', v(0, 50), v(20, 20), PI/6);
	}

	this.move = function(typeMove){
		if(keyIsDown(65)){ 
			this.player.applyImpulse(v(-1, 0), 0.07);
		} else if(keyIsDown(68)){ 
			this.player.applyImpulse(v(1, 0), 0.07);
		} 
		if(typeMove == 'jump') {
			this.player.applyImpulse(createVector(0, -5), 1);
			this.player.toString();
		}
	}

	this.fire = function(){
		this.bullet = createShape('circle', this.player.xy.x, this.player.xy.y - this.player.wh(0).x/2, 5, 5, 50, 1, 0.8);
		// this.bullet = createShape('circle', mouseX, mouseY, 5, 5, 50, 1, 0.8);
		this.bullet.life = guiControl.life;
		this.bullet.bullet = true;
		this.bullet.color = color(255, 100, 140);
		this.bullet.display(attr1, 0);
		this.bullet.applyImpulse(v( mouseX - this.player.xy.x, mouseY - this.player.xy.y), 0.09);
	}
}