// ====== Cac Ham Quan trong ====
function reset() {
	// reset value
	e = [];
	b = [];
	item = [];
	redzones = [];
	p = null;
	viewport.pos = createVector(0, 0);

	p = new Character(random(mapInfo.wMap), random(mapInfo.hMap), 100, pname);
	pcolor = p.col;
	viewport.target = p;
	gunInfo = new infoGunBox();

	boundMap = new Rectangle(mapInfo.wMap / 2, mapInfo.hMap / 2, mapInfo.wMap, mapInfo.hMap);

	for (var i = 0; i < maxItem; i++) { //(mapInfo.wMap * mapInfo.hMap / 70000)
		item.push(new Item(random(mapInfo.wMap), random(mapInfo.hMap)));
	}

	for (var i = 0; i < numE; i++)
		e.push(new Character(random(mapInfo.wMap), random(mapInfo.hMap), random(100, 300)));
}

function realToFake(realX, realY) {
	// tinh khoang cach tu tọa độ thật của vật thêể tới toa độ thật của viewport
	// var delx = realX - viewport.pos.x;
	// var dely = realY - viewport.pos.y;

	// var newx = width / 2 + delx;
	// var newy = height / 2 + dely;

	// trả vê dạng vector
	return createVector(width / 2 + realX - viewport.pos.x,
		height / 2 + realY - viewport.pos.y);;
}

function fakeToReal(fakeX, fakeY) {
	// var realPosX = fakeX - width/2 + viewport.pos.x;
	// var realPosY = fakeY - height/2 + viewport.pos.y;

	return createVector(fakeX - width / 2 + viewport.pos.x,
		fakeY - height / 2 + viewport.pos.y);
}

function explore(pos, numOfBull, colo, owner) {
	var dir, damage, size, col, lifeSpan;
	for (var i = 0; i < numOfBull; i++) {
		damage = random(5, 30);
		var v = 40 - damage;
		dir = {
			x: random(-v, v),
			y: random(-v, v)
		};
		size = damage / 1.75;
		col = colo || [255, 255, 0];
		lifeSpan = random(100, 800);
		b.push(new Bullet("explore", pos, dir, damage, size, col, lifeSpan, owner));
	}
}

function collisionEdge(t, bounce) {
	//khoi tao bien luu giu
	var top = t.size / 2;
	var left = t.size / 2;
	var bottom = mapInfo.hMap - t.size / 2;
	var right = mapInfo.wMap - t.size / 2;

	// bien tren
	if (t.pos.y < top) {
		t.vel.y *= -bounce;
		t.pos.y = top;

	//bien duoi
	} else if (t.pos.y > bottom) {
		t.vel.y *= -bounce;
		t.pos.y = bottom;
	}

	// bien trai
	if (t.pos.x < left) {
		t.vel.x *= -bounce;
		t.pos.x = left;

	// bien phai
	} else if (t.pos.x > right) {
		t.vel.x *= -bounce;
		t.pos.x = right;
	}
}

function addForce(vx, vy) {
	this.vel.add(createVector(vx, vy));
}

function changeGun(character, nextOrPre) {
	var gunNow = getObjectIndex(gunShop, character.gun.name);
	var nextGun = gunNow + nextOrPre;

	if (nextGun < 0) nextGun = getObjectLength(gunShop) - 1;
	else nextGun = nextGun % getObjectLength(gunShop);

	character.gun = new Gun(character, gunShop[getValueAtIndex(gunShop, nextGun)]);
}

function moveViewport(borgerSize) { // di chuyen Viewport giong Lmht
	if (viewport.followTarget || keyIsDown(32)) {
// 		viewport.pos = createVector(viewport.target.pos.x, viewport.target.pos.y);
		viewport.pos = p5.Vector.lerp(viewport.pos, viewport.target.pos, 0.2);

	} else {
		if (mouseX > width - borgerSize || mouseX < borgerSize ||
			mouseY > height - borgerSize || mouseY < borgerSize) {
			var vec = createVector(mouseX - width / 2, mouseY - height / 2)
				.setMag(15);
			viewport.pos.add(vec.mult(60 / (fr + 1)));
		}
		noStroke();
		fill(120);
		text("X:" + floor(viewport.pos.x) + "  Y:" + floor(viewport.pos.y), width / 2, height / 2 - 13);

		fill(255);
		text("+", width / 2, height / 2);

		// show distance from mouse to player
		noStroke();
		fill(255);
		text(floor(dist(viewport.target.fakepos.x, viewport.target.fakepos.y, mouseX, mouseY)), mouseX, mouseY - 10);

		var m = createVector(mouseX, mouseY);
		var vec = p5.Vector.sub(viewport.target.fakepos, m).limit(50);
		drawArrow(m, vec, "gray");
	}

	noStroke();
	fill(100);
	text("X: " + floor(viewport.target.pos.x) + "  Y: " + floor(viewport.target.pos.y), width / 2, height - 20);
}

function changeViewportTarget(target) {
	viewport.target = target;
	addMessage('Watching ' + target.name + '..', 'Server', true, target.col);
}

function help() {
	addMessage("- - - - - - Gun Game - - - - - -", '', false, color(255), function(){window.open('https://github.com/HoangTran0410/2D-Game')});
	addMessage("Eat And Fire to Survive", '', false, color(150));
	addMessage("W A S D : Move.");
	// addMessage("SpaceBar : Speed up.")
	addMessage("LEFT-Mouse : Shoot.");
	addMessage("SCROLL-Mouse, 1->8 : Change Gun.");
	addMessage("R : Reload.")
	addMessage("ENTER : Chat.");
	addMessage("C : Show/Hide Chat box.");
	addMessage("E : Attack Mode (on/off).")
	addMessage("V : FreeCam Mode (on/off).");
	addMessage("Type '/help' for more option", '', false, color(200));
	addMessage("--------------------------------");
}

function showChat(show) {
	if (show) {
		document.getElementById('showHideChat').value = 'Hide';
		document.getElementById('conversation').style.width = "100%";
		document.getElementById('chatBox').style.left = "0px";
	} else {
		document.getElementById('showHideChat').value = 'Show';
		document.getElementById('conversation').style.width = "25%";
		document.getElementById('chatBox').style.left = "-240px";
	}
}

// ========== control , show characters ============
function pMove(t) { // player control move
	if (t.vel.mag() < t.maxSpeed) {
		if (keyIsDown(65)) t.vel.add(-1, 0);
		if (keyIsDown(68)) t.vel.add(1, 0);
		if (keyIsDown(87)) t.vel.add(0, -1);
		if (keyIsDown(83)) t.vel.add(0, 1);
	} else t.vel.setMag(t.maxSpeed);
}

function pUpdate(t) {
	t.fakepos = realToFake(t.pos.x, t.pos.y);
	t.pos.add(t.vel.copy().mult(60 / (fr + 1)));
	t.vel.mult(t == p ? 0.95 : 0.995);

	collisionEdge(t, 0.7);
}

function pShow(t) {
	t.gun.update();
	showPlayer(t, createVector(mouseX - t.fakepos.x, mouseY - t.fakepos.y).heading());
}

function showPlayer(t, angle) { // draw Player
	if (isInside(t.fakepos.x, t.fakepos.y, {
			x: width / 2,
			y: height / 2
		}, {
			x: width + t.size,
			y: height + t.size
		})) {

		noStroke();
		fill(170);
		text(t.name, t.fakepos.x, t.fakepos.y - t.size / 2 - 30);
		fill(255);
		text(floor(t.health), t.fakepos.x, t.fakepos.y - t.size / 2 - 10);

		drawPlayerWithShape(t, pshape, angle);

	}
}

function speedUp(t, turnOn) {
	if (turnOn && t.health > 10) {
		var magVel = t.vel.mag() / 30;
		t.maxSpeed = 10;
		t.health -= magVel;
		updateSize(t);
		if (t.vel.mag() > t.maxSpeed / 1.5 && random(1) > 0.9) {
			var newItemPos = t.pos.copy().add(t.vel.copy().mult(-1).setMag(t.size/1.5));
			item.push(new Item(newItemPos.x, newItemPos.y, null, random(4, 7)));;
		}
		fill(50, 150, 150, 70);
		ellipse(t.fakepos.x, t.fakepos.y, t.size, t.size);

	} else {
		t.maxSpeed = 5;
	}
}

function updateSize(t) {
	var s = 30 / 100 * t.health;
	if (s > 30)
		t.size = s;
}

// =========== QuadTree =============
function eatItem(t) {
	var range = new Circle(t.pos.x, t.pos.y, t.size / 2 + 100, t.size / 2 + 100);
	var items = quadItem.query(range);

	for (var i of items) {
		i.check(t);
	}
}

function collideBullets(t) {
	var range = new Circle(t.pos.x, t.pos.y, t.size / 2);
	var bulls = quadBull.query(range);

	if (bulls.length) {
		for (var bu of bulls) {
			if (bu.name == 'Mine') {
				ep.push(new ExplorePoint(bu.pos.x, bu.pos.y, 35, [255, 100, 50], 300, bu.o));

			} else if (bu.name == 'Bazoka') {
				explore(bu.pos, 20, [255, 255, 50], bu.o);
			}

			// delete bullet and decrease health
			t.health -= bu.damage;
			updateSize(t);

			addForce.apply(t, [bu.vel.x / 10, bu.vel.y / 10]);

			if (t.health <= 0) {
				die(t, bu.o);
				b.splice(b.indexOf(bu), 1);
				break;
			}

			b.splice(b.indexOf(bu), 1);

			if (t != p) { // if hit enemy => change direction enemy
				t.nextPoint = null; // reset nextPoint
			}
		}

		// hit effect
		var r = t.size + 30;
		fill(255, 0, 0, 120);
		ellipse(t.fakepos.x, t.fakepos.y, r, r);
	}
}

function die(t, manFire) {
	// add score to who fire bullet
	var dieByOtherPlayer = true;
	if (!manFire || t == manFire) {
		manFire = e[(e.indexOf(t) + 1) % e.length];
		dieByOtherPlayer = false;

	} else {
		manFire.score += 20;
		manFire.killed++;

		// move manFire to eat items
		if (t != p)
			manFire.nextPoint = t.pos.copy();
	}

	// player die
	if (t == p) {
		addAlertBox('You was killed ' + (dieByOtherPlayer ? ('by ' + manFire.name) : 'yourself') + ', chat "/reset" to start again', '#f55', '#fff');
		if (dieByOtherPlayer) {
			addMessage(manFire.name + ' has killed ' + t.name + '.', '', true);
		} else addMessage(t.name + ' was died.', '', true);
		addMessage('You Died. Chat "/reset" to start again.', '', true, color(255, 255, 0));

		p = null;
		changeViewportTarget(manFire);

		// enemy die	
	} else {
		// add item at enemy die position
		var col = [red(t.col), green(t.col), blue(t.col)];
		for (var i = 0; i < random(t.score / 2, t.score); i++) {
			var len = createVector(random(-1, 1), random(-1, 1)).setMag(random(t.score));
			var pos = p5.Vector.add(t.pos, len);
			item.push(new Item(pos.x, pos.y, col));
		}

		// change view to manFire
		if (viewport.target == t) {
			changeViewportTarget(manFire);
		}

		// addMessage(t.name + ' was killed ' + (dieByOtherPlayer ? ('by ' + manFire.name) : 'him/her self'), '', true);
		if (dieByOtherPlayer) {
			addMessage(manFire.name + ' has killed ' + t.name + '.', '', true);
		} else addMessage(t.name + ' was died.', '', true);

		// delete
		e.splice(e.indexOf(t), 1);
	}

	// Reset if no enemy exist
	if (!e.length) {
		numE++;
		mapInfo.wMap += 500;
		mapInfo.hMap += 500;
		enemyAttack = true;
		addMessage('YOU WON with ' + p.killed + ' kill', 'server', true, color(0, 255, 0));
		addMessage('======= \u2665 =======');
		addAlertBox('You Won \u2665 Let Play with more enemy', '#5f6', '#111');
		reset();
	
	} else if(!p && e.length == 1){
		numE++;
		mapInfo.wMap += 500;
		mapInfo.hMap += 500;
		enemyAttack = true;
		addMessage(e[0].name + ' WON with ' + e[0].killed + ' kill', 'server', true, color(0, 255, 0));
		addMessage('======= \u2665 =======');
		addAlertBox('You Lose \u2665 Let Play again with more enemy', '#5f6', '#111');
		reset();
	}
}

// =========== Draw something ============
function drawArrow(base, vec, myColor, notDawLine) {
	push();

	stroke(myColor);
	fill(myColor);

	strokeWeight(3);
	translate(base.x, base.y);

	if (!notDawLine) {
		line(0, 0, vec.x, vec.y);
	}

	rotate(vec.heading());
	var arrowSize = 7;
	translate(vec.mag() - arrowSize, 0);
	triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);

	pop();
}

function drawVector(v, loc, scale) {
	push();
	var arrowsize = 4;
	translate(loc.x, loc.y);
	stroke(255);
	rotate(v.heading());

	var len = v.mag() * scale;
	line(0, 0, len, 0);
	line(len, 0, len - arrowsize, +arrowsize / 2);
	line(len, 0, len - arrowsize, -arrowsize / 2);
	pop();
}

function drawEdge() { // Vẽ biên
	// dùng 4 đỉnh đê vẽ hình chữ nhât
	var topleft = realToFake(0, 0); // đỉnh trên trái
	var topright = realToFake(mapInfo.wMap, 0); // đỉnh trên phải
	var botleft = realToFake(0, mapInfo.hMap); // đỉnh dưới trái
	var botright = realToFake(mapInfo.wMap, mapInfo.hMap); // đỉnh dưới phải

	stroke(255);
	strokeWeight(2);

	// Ve duong thang qua cac dinh
	line(topleft.x, topleft.y, topright.x, topright.y);
	line(topright.x, topright.y, botright.x, botright.y);
	line(botright.x, botright.y, botleft.x, botright.y);
	line(botleft.x, botleft.y, topleft.x, topleft.y);
}

function drawGrid(sizegrid) {
	stroke(70, 150);
	strokeWeight(1);
	var delta = 1;

	for (var x = viewport.pos.x - width / 2; x < viewport.pos.x + width / 2; x += delta) {
		if (floor(x) % sizegrid == 0) {
			/* while you find 1 x%sizegrid==0 
			=> delta will equal sizegrid => shorter loop */
			delta = sizegrid;
			var newX = realToFake(x, viewport.pos.y);
			line(newX.x, 0, newX.x, height);
		}
	}

	// do the same thing to y axis
	delta = 1;
	for (var y = viewport.pos.y - height / 2; y < viewport.pos.y + height / 2; y += delta) {
		if (floor(y) % sizegrid == 0) {
			delta = sizegrid;
			var newY = realToFake(viewport.pos.x, y);
			line(0, newY.y, width, newY.y);
		}
	}
}

// ======= Array , Object function ========

function getObjectIndex(obj, keyToFind) {
	var result = Object.keys(obj).indexOf(keyToFind);
	if (result == -1) result = null;
	return result;
}

function getValueAtIndex(obj, index) {
	return Object.keys(obj)[index];
}

function getObjectLength(obj) {
	return Object.keys(obj).length;
}

// ============= window.onload =============

window.onload = () => {
	document.getElementById('closebtn')
		.addEventListener('mouseover', (event) => {
			event.target.parentElement.style.opacity = 0;
			event.target.parentElement.style.zIndex = 0;
		});

	document.getElementById('showHideChat')
		.addEventListener('mouseover', function(event) {
			if (event.target.value == 'Hide') {
				showChat(false);

			} else {
				showChat(true);
			}
		});

	setInterval(function() {
		if (item.length > maxItem * 1.5) {
			for (var i = 0; i < item.length - maxItem; i++)
				item.shift();
		} else if (item.length < maxItem / 2) {
			for (var i = item.length; i < maxItem / 2; i++)
				item.push(new Item(random(mapInfo.wMap), random(mapInfo.hMap)));
		}
		for (var i = 0; i < 5; i++)
			item.push(new Item(random(mapInfo.wMap), random(mapInfo.hMap)));
	}, 500);

	setInterval(function() {
		redzones.push(new RedZone(random(mapInfo.wMap), random(mapInfo.hMap),
			random(500, 3000), random(15000, 60000)));
	}, 30000);

	setInterval(function() {
		var m = p ? p.size : e[0].size;
		for (var i of e) {
			if (i.size > m)
				m = i.size;
		}
		maxSizeNow = m / 2;
	}, 50000);
}

// =========== More function ==============

function addAlertBox(text, bgcolor, textcolor) {
	var al = document.getElementById('alert');
	al.childNodes[0].nodeValue = text;
	al.style.backgroundColor = bgcolor;
	al.style.opacity = 0.7;
	al.style.zIndex = 10;

	if (textcolor) al.style.color = textcolor;
}

function addMessage(mes, from, withTime, color, onclickFunc) {
	var newMes = document.createElement('p');
	if (color) {
		newMes.style.backgroundColor = ("rgba(" + color.levels[0] + "," + color.levels[1] + "," + color.levels[2] + "," + "0.3)");
	}

	if(withTime){
		var timeNode = document.createElement('span');
		timeNode.textContent = (withTime ? (prettyTime(milli / 1000) + "  ") : "");
		newMes.appendChild(timeNode);
	}

	if(from){
		var fromNode = document.createElement('span');
		fromNode.style.fontWeight = 'bold';
		fromNode.textContent = (from ? (from + ": ") : "");
		newMes.appendChild(fromNode);
	}

	if(mes){
		var mesNode = document.createTextNode(mes);
		newMes.appendChild(mesNode);
	}
	
	if(onclickFunc){
		newMes.addEventListener("mouseover", function(){
			newMes.style.cursor = 'pointer';
			newMes.style.borderWidth = "1px 0 1px 0";
			newMes.style.borderColor = "white";
			newMes.style.borderStyle = "dashed";
		});
		newMes.addEventListener("mouseout", function(){
			newMes.style.border = "none";
		});
		newMes.addEventListener("click", onclickFunc);
	}

	document.getElementById('conversation').appendChild(newMes);
	newMes.scrollIntoView();
}

function createNewAudio(au, linkMedia) {
	if (au == null) {
		au = createAudio(linkMedia);
		au.elt.controls = false;
		au.autoplay(true);
		au.connect(p5.soundOut);

	} else {
		au.src = linkMedia;
	}
}

function polygon(x, y, radius, npoints) {
	var angle = TWO_PI / npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a) * radius;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}

function isTyping() {
	return (document.getElementById('inputMes') === document.activeElement);
}

function isInside(posx, posy, pos, size) {
	return (posx > pos.x - size.x / 2 && posx < pos.x + size.x / 2 &&
		posy > pos.y - size.y / 2 && posy < pos.y + size.y / 2)
}

function prettyTime(s) {
	s = s || 0;

	var seconds = (s % 60) | 0;
	var minutes = (s / 60 % 60) | 0;
	var hours = (s / 3600) | 0;

	if (hours) return hours + ':' + ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
	else return minutes + ':' + ('0' + seconds).substr(-2);
}

function openNav() {
	document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
	document.getElementById("myNav").style.width = "0%";
}

// function dragElement(elmnt) {
//     var pos1 = 0,
//         pos2 = 0,
//         pos3 = 0,
//         pos4 = 0;
//     if (document.getElementById(elmnt.id + "header")) {
//         /* if present, the header is where you move the DIV from:*/
//         document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//     } else {
//         /* otherwise, move the DIV from anywhere inside the DIV:*/
//         elmnt.onmousedown = dragMouseDown;
//     }

//     function dragMouseDown(e) {
//         e = e || window.event;
//         e.preventDefault();
//         // get the mouse cursor position at startup:
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         document.onmouseup = closeDragElement;
//         // call a function whenever the cursor moves:
//         document.onmousemove = elementDrag;
//     }

//     function elementDrag(e) {
//         e = e || window.event;
//         e.preventDefault();
//         // calculate the new cursor position:
//         pos1 = pos3 - e.clientX;
//         pos2 = pos4 - e.clientY;
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         // set the element's new position:
//         elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//     }

//     function closeDragElement() {
//         /* stop moving when mouse button is released:*/
//         document.onmouseup = null;
//         document.onmousemove = null;
//     }
// }
