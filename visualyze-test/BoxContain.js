function BoxContain(object) {
	this.pos = createVector(object.pos.x, object.pos.y);
	this.size = createVector(object.size.x, object.size.y);

	this.choosed = false;
	this.allowChangesize = false;
	this.allowChangepos = false;

	this.object = object;

	this.show = function(){
		this.update();
		noFill();
		stroke(255);
		rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		// change size shape
		if(this.allowChangesize) fill(255); else noFill();
		rect(this.pos.x+this.size.x/2, this.pos.y+this.size.y/2, 20, 20);
		// change position shape
		if(this.allowChangepos) fill(255); else noFill();
		ellipse(this.pos.x, this.pos.y, 20, 20);
	}

	this.update = function(){
		if(dist(mouseX, mouseY, this.pos.x+this.size.x/2, this.pos.y+this.size.y/2) < 10){
			this.allowChangesize = true;
		
		} else if(dist(mouseX, mouseY, this.pos.x, this.pos.y) < 10){
			this.allowChangepos = true;

		} else {
			this.allowChangesize = false;
			this.allowChangepos = false;
		}
	}

	this.mouseChoose = function(){
		if(dist(mouseX, mouseY, this.pos.x+this.size.x/2, this.pos.y+this.size.y/2) < 10
		|| dist(mouseX, mouseY, this.pos.x, this.pos.y) < 10){
			this.choosed = true;
		} else this.choosed = false;
	}

	this.drag = function() {
		if( this.choosed){
			if(this.allowChangesize){
				var delx = mouseX-(this.pos.x+this.size.x/2);
				var dely = mouseY-(this.pos.y+this.size.y/2);
				this.pos.add(delx/2, dely/2);
				this.size.add(delx, dely);

				this.object.setPosition(this.pos.x, this.pos.y);
				this.object.setSize(this.size.x, this.size.y);
			
			} else if(this.allowChangepos){
				this.pos= createVector(mouseX, mouseY);
				
				this.object.setPosition(this.pos.x, this.pos.y);
				this.object.setSize(this.size.x, this.size.y);
			}
		}
	}
}