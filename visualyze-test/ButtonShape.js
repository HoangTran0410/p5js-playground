function buttonShape(x, y, w, h, name, textsize, textstyle, whenClick) {
	this.pos = createVector(x, y);
	this.size = createVector(w, h);
	this.name = name;
	this.textsize = textsize;
	this.textstyle = textstyle;
	this.col = color('rgb(255, 255, 255)');
	this.hightlight = false;
	this.clickBut = whenClick;
	this.boxcontain = new BoxContain(this);

	this.changeName = function(newName){
		this.name = newName;
	}

	this.setPosition = function(x, y){
		this.pos = createVector(x, y);
	}

	this.setSize = function(w, h){
		this.size = createVector(w, h);
	}

	this.show = function(){
		strokeWeight(1);
		stroke(255);

		if(this.hightlight) fill(color('hsba(150, 100%, 100%, 0.7)'));
		else noFill();
		rect(this.pos.x, this.pos.y, this.size.x, this.size.y);

		stroke(this.col);
		textSize(this.textsize);
		chooseTextStyle(this.textstyle);
		text(this.name, this.pos.x, this.pos.y); // plus this.size.y/8 to CENTER text
	}

	this.update = function(x, y){
		if(mouseX > this.pos.x - this.size.x/2 && mouseX < this.pos.x + this.size.x/2
		&& mouseY > this.pos.y - this.size.y/2 && mouseY < this.pos.y + this.size.y/2){
			this.hightlight = true;
		} else this.hightlight = false;
	}

	this.run = function(){
		this.update();
		this.show();

		// show box contain
		if(showBoxContain){
			strokeWeight(1);
			stroke(255);
			this.boxcontain.show();
		}
	}

	this.clicked = function(mousex, mousey){
		if(mousex > this.pos.x - this.size.x/2 && mousex < this.pos.x + this.size.x/2
		&& mousey > this.pos.y - this.size.y/2 && mousey < this.pos.y + this.size.y/2){
			this.clickBut();
		}
	}

	this.changeProperties = function(newPos, newSize, newName, newTextSize, newTextStyle){
		this.pos.x = newPos.x || this.pos.x;
		this.pos.y = newPos.y || this.pos.y;
		this.size.x = newSize.x || this.size.x;
		this.size.y = newSize.y || this.size.y;
		this.name = newName || this.name;
		this.textsize = newTextSize || this.textsize;
		this.textstyle = newTextStyle || this.textstyle;

		this.boxcontain = new BoxContain(this);
	}
}

function nameSongClass(x, y, w, h, name, textsize, textstyle, colortext){
	this.pos = createVector(x, y);
	this.size = createVector(w, h);
	this.textsize = textsize;
	this.textstyle = textstyle;
	this.col = colortext;
	this.name = name;
	this.boxcontain = new BoxContain(this);

	this.setPosition = function(x, y){
		this.pos = createVector(x, y);
	}

	this.setSize = function(w, h){
		this.size = createVector(w, h);
	}

	this.show = function(){
		noFill();
		strokeWeight(1);
		stroke(this.col);
		chooseTextStyle(this.textstyle);
		textSize(this.textsize);
		text(this.name, this.pos.x, this.pos.y);
		// show box contain
		if(showBoxContain){
			strokeWeight(1);
			stroke(255);
			this.boxcontain.show();
		}

	}

	this.changeProperties = function(newPos, newname, newtextsize, newtextstyle, newcolortext){
		this.pos = newPos || this.pos;
		// this.size = newSize || this.size;
		this.name = newname || this.name;
		this.textsize = newtextsize || this.textsize;
		this.textstyle = newtextstyle || this.textstyle;
		this.col = newcolortext || this.col;

		this.boxcontain = new BoxContain(this);
	}
}

function chooseTextStyle(style){
	if(style == 'BOLD')
		textStyle(BOLD);
	else if(style == 'ITALIC')
		textStyle(ITALIC);
	else if(style == 'NORMAL')
		textStyle(NORMAL);
}