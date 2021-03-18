
function Character(x, y) {
   this.pos = createVector(x, y);
   this.vel = createVector(0, 0);
   this.size = createVector(25, 25);
   this.maxSpeed = 10-this.size.x/10;
   this.newPos;

   this.update = function() {
      this.pos.add(this.vel);
      this.newPos = ConvertXY(this.pos.x, this.pos.y);
      this.vel.mult(0.94);
      this.collide();
   }

   this.collide = function(){
      // Collide object
      var rangePlayer = new Circle(this.pos.x, this.pos.y, this.size.x);
      var found = quad.query(rangePlayer);
   
      if(found.length > 0) this.vel.mult(-1.1);

      // Collide Edge
      if(this.pos.x > newGui.wMap-this.size.x/2) this.pos.x = newGui.wMap-this.size.x/2;
      else if(this.pos.x < this.size.x/2) this.pos.x = this.size.x/2;
      if(this.pos.y > newGui.hMap-this.size.y/2) this.pos.y = newGui.hMap-this.size.y/2;
      else if(this.pos.y < this.size.y/2) this.pos.y = this.size.y/2;
   }

   this.move = function() {
      if((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && this.vel.x > -this.maxSpeed)
         this.vel.add(-1, 0);
      if((keyIsDown(UP_ARROW)   || keyIsDown(87)) && this.vel.y > -this.maxSpeed)
         this.vel.add(0, -1);
      if((keyIsDown(DOWN_ARROW) || keyIsDown(83)) && this.vel.y < this.maxSpeed)
         this.vel.add(0, 1);
      if((keyIsDown(RIGHT_ARROW)|| keyIsDown(68)) && this.vel.x < this.maxSpeed)
         this.vel.add(1, 0);

      if(mouseIsPressed){
         var delx = map(mouseX-this.newPos.x, 0, width, 0, this.maxSpeed);
         var dely = map(mouseY-this.newPos.y, 0, height, 0, this.maxSpeed);
         if(this.vel.y < this.maxSpeed 
         && this.vel.y > -this.maxSpeed
         && this.vel.x < this.maxSpeed
         && this.vel.x > -this.maxSpeed){
            this.vel.add(delx, dely);
         }
         stroke(0);
         strokeWeight(1);
         line(this.newPos.x, this.newPos.y, mouseX, mouseY);
      }
   }

   this.show = function() {
      if(this.newPos.x > -100 && this.newPos.x < width+100 && this.newPos.y > -100 && this.newPos.y < height+100){
         noStroke();
         push();
         translate(this.newPos.x, this.newPos.y);
         rotate(createVector(mouseX-this.newPos.x, mouseY-this.newPos.y).heading());
         fill(255); ellipse(0, 0, this.size.x, this.size.y);
         fill(0);   ellipse(this.size.x/4, 0, this.size.x/2, this.size.y/1.5);
         pop();

         fill(100);
         text("X: "+floor(this.pos.x)+"  "+"Y: "+floor(this.pos.y),
               this.newPos.x, this.newPos.y-this.size.y/2);
      }
   }
}

function Enemy(x, y){
   this.pos = createVector(x, y);
   this.vel = createVector(0, 0);
   var size = random(30, 60);
   this.size = createVector(size, size);
   this.maxSpeed = 10-this.size.x/10;
   this.newPos;

   this.update = function(){
      this.follow(player.pos.x, player.pos.y);
      this.pos.add(this.vel);
      this.newPos = ConvertXY(this.pos.x, this.pos.y);
      this.vel.mult(0.94);

      this.AI();
      this.collide();
   }

   this.follow = function(x, y){
      if(this.vel.y < this.maxSpeed 
         && this.vel.y > -this.maxSpeed
         && this.vel.x < this.maxSpeed
         && this.vel.x > -this.maxSpeed){
            var vec = createVector(x-this.pos.x, y-this.pos.y).normalize();
            this.vel.add(vec);
         }
   }

   this.AI = function(){
      var rangeEnemy = new Circle(this.pos.x, this.pos.y, this.size.x*2);
      var found = quad.query(rangeEnemy);
      if(found.length > 0) 
         if(this.vel.x < this.maxSpeed && this.vel.y < this.maxSpeed)
            this.vel.add(random(-this.maxSpeed, this.maxSpeed), 
                        random(-this.maxSpeed/3, 0));
   }

   this.collide = function(){
      // Collide object
      var rangeEnemy = new Circle(this.pos.x, this.pos.y, this.size.x);
      var found = quad.query(rangeEnemy);
      if(found.length > 0) this.vel.mult(-1.1);

      // Collide Edge
      if(this.pos.x > newGui.wMap-this.size.x/2) this.pos.x = newGui.wMap-this.size.x/2;
      else if(this.pos.x < this.size.x/2) this.pos.x = this.size.x/2;
      if(this.pos.y > newGui.hMap-this.size.y/2) this.pos.y = newGui.hMap-this.size.y/2;
      else if(this.pos.y < this.size.y/2) this.pos.y = this.size.y/2;
   }

   this.show = function(){
      if(this.newPos.x > -100 && this.newPos.x < width+100 && this.newPos.y > -100 && this.newPos.y < height+100){
         noStroke();
         push();
         translate(this.newPos.x, this.newPos.y);
         rotate(this.vel.heading());
         fill(255, 0, 0);  ellipse(0, 0, this.size.x, this.size.y);
         fill(0);          ellipse(this.size.x/4, 0, this.size.x/2, this.size.y/1.5);
         pop();
      }
      
   }
}

function Wall(x, y) {
   this.x = x;
   this.y = y;
   this.vel = createVector(0, 0);
   this.size = createVector(35, 35);
   this.col = color(random(255), random(255), random(255));
   this.name = Name[floor(random(Name.length))];
   this.newPos;

   this.show = function() {
      this.newPos = ConvertXY(this.x, this.y);
      noStroke();
      fill(this.col);
      rect(this.newPos.x, this.newPos.y, this.size.x, this.size.y);
      fill(255);
      text(this.name, this.newPos.x, this.newPos.y);

      // draw name at mouse pos
      if(mouseX > this.newPos.x-this.size.x/2 && mouseX < this.newPos.x+this.size.x/2
      && mouseY > this.newPos.y-this.size.y/2 && mouseY < this.newPos.y+this.size.y/2){
            stroke(0);
            strokeWeight(3);
            fill(255);
            line(mouseX, mouseY, mouseX+50, mouseY-50);
            text(this.name, mouseX+50, mouseY-50);
      }
   }
}

function MiniMap(x, y, w, h){
   this.pos = createVector(x, y);
   this.size = createVector(w, h);
   this.view = createVector(0, 0);
   this.viewSize = createVector(0, 0);
   this.playerPos = createVector(0, 0);
   this.enemyPos = [];
   this.wallsPosImg = createImage(this.size.x, this.size.y);

   this.insertWallsPos = function(wall){
      var newX = map(wall.x, 0, newGui.wMap, 0, this.size.x);
      var newY = map(wall.y, 0, newGui.hMap, 0, this.size.y);
      // this.wallsPosImg.loadPixels();
      this.wallsPosImg.set(newX, newY, color(150));
      // this.wallsPosImg.updatePixels();
   }

   this.update = function(){
      // player position on minimap
      this.playerPos.x = map(player.pos.x, 0, newGui.wMap, 0, this.size.x);
      this.playerPos.y = map(player.pos.y, 0, newGui.hMap, 0, this.size.y);
      // enemy  position on minimap
      for(var i = 0; i < enemys.length; i++){
         var xe = map(enemys[i].pos.x, 0, newGui.wMap, 0, this.size.x);
         var ye = map(enemys[i].pos.y, 0, newGui.hMap, 0, this.size.y);
         this.enemyPos[i] = createVector(xe, ye);
      }
      // viewport position on minimap
      this.view.x = map(Viewport.x, 0, newGui.wMap, 0, this.size.x);
      this.view.y = map(Viewport.y, 0, newGui.hMap, 0, this.size.y);
      this.viewSize.x = map(width, 0, newGui.wMap, 0, this.size.x);
      this.viewSize.y = map(height, 0, newGui.hMap, 0, this.size.y);
   }

   this.show = function(){
      noStroke();
      strokeWeight(1);

      push();
      translate(this.pos.x, this.pos.y);
      // draw player pos
      fill(100, 255, 255);
      ellipse(this.playerPos.x, this.playerPos.y, 3, 3);
      // draw enemy pos
      if(newGui.enemyMode){
         fill(255, 0, 0);
         for(var i = 0; i < this.enemyPos.length; i++){
            ellipse(this.enemyPos[i].x, this.enemyPos[i].y, 3, 3);   
         }
      }
      // draw edge
      fill(0, 0, 0, 100);
      rect(this.size.x/2, this.size.y/2, this.size.x, this.size.y);
      // draw view
      noFill();
      stroke(255);
      rect(this.view.x, this.view.y, this.viewSize.x, this.viewSize.y);
      // draw walls
      if(newGui.numOfThings <= 10000){
         image(this.wallsPosImg, 0, 0);
      } else text('Too much objects', this.size.x/2, this.size.y/2);
      pop();
   }
}

function ConvertXY(x, y){
   var delx = x - Viewport.x;
   var dely = y - Viewport.y;
   var newx = width/2 + delx;
   var newy = height/2 + dely;

   var newPos = createVector(newx, newy);
   return newPos;
}

function drawEdge(){
   var topleft = ConvertXY(0, 0);
   var topright = ConvertXY(newGui.wMap, 0);
   var botleft = ConvertXY(0, newGui.hMap);
   var botright = ConvertXY( newGui.wMap,  newGui.hMap);

   stroke(255);
   strokeWeight(2);
   line(topleft.x, topleft.y, topright.x, topright.y);
   line(topright.x, topright.y, botright.x, botright.y);
   line(botright.x, botright.y, botleft.x, botright.y);
   line(botleft.x, botleft.y, topleft.x, topleft.y);
}

function drawGrid(){
   stroke(70);
   strokeWeight(1);
   // 5 is num of rect want to draw
   var sizegrid = 250;
   var delta = 1;
   for(var x = Viewport.x-width/2; x < Viewport.x+width/2; x+=delta){
      if(floor(x)%sizegrid == 0){
         /* while you find 1 x%sizegrid==0 
         => delta will equal sizegrid => shorter loop */
         delta = sizegrid;
         var newX = ConvertXY(x, Viewport.y);
         line(newX.x, 0, newX.x, height);
      }
   }
   // do the same thing to y axis
   delta = 1;
   for(var y = Viewport.y-height/2; y < Viewport.y+height/2; y+=delta){
      if(floor(y)%sizegrid == 0){
         delta = sizegrid;
         var newY = ConvertXY(Viewport.x, y);
         line(0, newY.y, width, newY.y);
      }
   }
}

var Name = [
   "Jacob","William","Ethan","Daniel","Logan",
   "Matthew","Lucas","Jackson","David","Samuel",
   "Luke","Henry","Andrew","Nathan","Huong","Nhien",
   "Nhung","Huynh","Dat","Dinh","Hanh","Ros","Tay",
   "Thanh","SaiGon","HaNoi","Hue","Nang","Mua","Bao",
   "Dem","Sang","Toi","Chieu","Trua","Den","Tranh",
   "Zing","Music","Cute","Dude","Kiss","Hope","Car",
   "Fake","Alan","Hoi","Dang","Dam","Diem","Master",
   "Yi","Yasuo","Irela","Vi","Lux","Sion","Doctor",
   "Jinx","Jhin","Da Nang","Cao Bang","Bac Ninh",
   "Bac Giang","Nghe An","Ha Tinh","Ca Mau","Can Tho",
   "Hai Phong","Lao Cai","Japan","Campuchia","Lao",
   "Myanma","Indonesia","China","USA","Phap","Island",
   "Bac Cuc","Nam Cuc","Chau Phi","Chau A","Chauy Au",
   "Chau My","Roma","Computer","Fax","Plane","Sky","Head",
   "Tree","Lake","Water","Fire","Snow","Mountain","Dog",
   "Cat","Bird","Snack","Candy","Huu","Noah","Mason",
   "Hoang","Hien","Linh","Nam","Tam","Hau","Foria",
   "Hoa","Thao","Trang","Thuy","Huan","Luong",
   "Hao","Thuan","Nga","Huy","Hang","An","Anh",
   "Thien","Ngan","<3","Love","Michael","Seclo",
   "Heo","Julia","Jame","Thomson","LOL","Ris",
   "Tris","Nhan"
];