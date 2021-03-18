function Draw(){

	this.Dstyle = function(){
		if(obj.fillShape){
			gr.fill(obj.color);
			gr.noStroke();

			fill(obj.color);
			noStroke();
		}
		else{
			gr.noFill();
			gr.stroke(obj.color);
			gr.strokeWeight(obj.sizePaint);

			noFill();
			stroke(obj.color);
			strokeWeight(obj.sizePaint);
		}
	}

	this.Dfree = function(){
		gr.strokeWeight(obj.sizePaint);
		gr.stroke(obj.color);
		gr.line(pmouseX, pmouseY, mouseX, mouseY);
	}

	this.Dpoint = function(x, y){
		gr.strokeWeight(obj.sizePaint);
		gr.stroke(obj.color);		
		gr.point(x, y);	
	}

	this.DlineF = function(){
		gr.strokeWeight(obj.sizePaint);
		gr.stroke(obj.color);
		gr.line(pPosmouseX, pPosmouseY, mouseX, mouseY);		
	}

	this.Dline = function(x1, y1, x2, y2, drawToimage){
		gr.strokeWeight(obj.sizePaint);
		gr.stroke(obj.color);
		stroke(obj.color);
		strokeWeight(obj.sizePaint);
		if(drawToimage){
			gr.line(x1, y1, x2, y2);
		}else{
			line(x1, y1, x2, y2);
		}
	}

	this.Dcircle = function(x1, y1, x2, y2, drawToimage){
		this.center = createVector((x2 + x1)*0.5, (y1 + y2)*0.5);
		this.r1 = abs(x1 - x2);
		this.r2 = abs(y1 - y2);

		this.Dstyle();
		if(drawToimage){
			gr.ellipse(this.center.x, this.center.y, this.r1, this.r2);
		}
		else {
			ellipse(this.center.x, this.center.y, this.r1, this.r2);
		}
	}

	this.Drect = function(x1, y1, x2, y2, drawToimage){
		this.x1 = (x1 < x2) ? x1:x2;
		this.y1 = (y1 < y2) ? y1:y2;

		this.x2 = (x1 > x2) ? x1:x2;
		this.y2 = (y1 > y2) ? y1:y2;

		this.Dstyle();
		if(drawToimage){
			gr.rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
		}
		else{
			rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);	
		}
	}

	this.Drand = function(type, num){
		for(var i = 0; i < num; i++){
			obj.color = [random(255), random(255), random(255)];
			switch(type){
				case 'circle':
					var x1 = random(w);
					var y1 = random(h);
					var rand = random(200);
					var x2 = x1 + obj.sizePaint * 2;
					var y2 = y1 + obj.sizePaint * 2;
					this.Dcircle(x1, y1, x2, y2, true);
					break;

				case 'line':
					var x1 = random(w);
					var y1 = random(h);
					var x2 = random(w);
					var y2 = random(h);
					this.Dline(x1, y1, x2, y2, true);
					break;

				case 'rect':
					var x1 = random(w*0.5);
					var y1 = random(h*0.5);
					var x2 = x1 + random(w*0.5);
					var y2 = y1 + random(h*0.5);
					this.Drect(x1, y1, x2, y2, true);
					break;

				case 'point':
					this.Dpoint(random(w), random(h));
					break;

				case 'all':
					this.Drand('circle', 1);
					this.Drand('point', 1);
					this.Drand('line', 1);
					this.Drand('rect', 1);
					break;
			}
		}
	}

}