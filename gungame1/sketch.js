var p; // player
var pname, pshape, pcolor;
var e = []; // enemy
var b = []; // bullets
var item = []; // items
var redzones = []; // red zones
var ep = []; // explore points

var boundMap;
var quadBull; // quadtree bullets
var quadItem; // quadtree items
var maxItem = 500;
var quadPlayer; // quadtree characters

var viewport = { // toa do nguoi nhin hien tai
	pos: 0,
	target: 0,
	followTarget: true
};

var maxSizeNow = 300; // size of Player
var numE = 35; // first enemy
var gunInfo;
var myAudio;
var milli;
var fr;

var enemyAttack = false;
var eAngryAll = true;
var mapInfo = {
	wMap: 7000, // width map
	hMap: 7000 // height map
}

function setup() {
	// var density = displayDensity();
	// pixelDensity(density);
	createCanvas(windowWidth, windowHeight).position(0, 0);
	textSize(16);
	textFont('Consolas');
	rectMode(CENTER);

	// get player name
	pname = window.prompt('Enter your Player Name');
	if (pname) localStorage.setItem('pname', pname);
	else pname = localStorage.getItem('pname');

	help();
	addAlertBox('Please read the Rules in chat box.', '#f55', '#fff');

	if(!localStorage.getItem('played')){
		setTimeout(function(){addMessage('The battle will start in: 10s..', '', true)}, 110000);
		setTimeout(function(){
			if(!enemyAttack){
				enemyAttack = true;
				addMessage('Attack Mode (E) has been automatically enabled.', 'Server', true, color(255, 20, 20));
			}
			addMessage('The Battle has Started. Enjoy & GoodLuck', 'Server', false, color(0, 200, 0));
			addAlertBox('The Battle has Started. Enjoy & GoodLuck',  '#5f5', '#000');
		}, 120000);
		addMessage('The battle will start in 2 minutes.','Server', false, color(255, 10, 10))
		localStorage.setItem('played', true);
	} else {
		addMessage('The battle will start in 10 second.','Server', false, color(255, 10, 10))
		setTimeout(function() {
			addMessage('The Battle has Started. Enjoy & GoodLuck', 'Server', false, color(0, 200, 0));
			addAlertBox('The Battle has Started. Enjoy & GoodLuck',  '#5f5', '#000');
			enemyAttack = true;
		}, 10000);
	}	

	pshape = "Pentagon";
	reset();
}

function draw() { // vong lap game
	background(30);
	fr = frameRate();
	milli = millis();
	textAlign(CENTER, CENTER);

	moveViewport(20);
	drawGrid(200);
	drawEdge();

	// quadtree of bullets
	quadBull = new QuadTree(boundMap, 3); // reset quadBull
	for (var i = b.length - 1; i >= 0; i--) {
		quadBull.insert(b[i]);
		b[i].show();
		b[i].update();
	}

	// quadtree of items
	quadItem = new QuadTree(boundMap, 3); // reset quadItem
	for (var i of item) {
		quadItem.insert(i);
		i.show();
	}

	// quadtree of character
	quadPlayer = new QuadTree(boundMap, 3); // reset quad Character
	if (p) quadPlayer.insert(p);
	for (var i of e) quadPlayer.insert(i);

	// enemy
	for (var i = e.length - 1; i >= 0; i--) {
		pUpdate(e[i]);
		eMove(e[i]);
		eatItem(e[i]);
		eAttack(e[i]);
		collideBullets(e[i]);
	}

	// player
	if (p) {
		pUpdate(p);
		pMove(p);
		pShow(p);
		eatItem(p);
		if (mouseIsPressed && !isInside(mouseX, mouseY, gunInfo.pos, gunInfo.size)) {
			p.gun.fire(fakeToReal(mouseX, mouseY));
		}
		// if(keyIsDown(32)) runFast(p, true);
		collideBullets(p);
	}

	gunInfo.show();

	// red zone
	for (var i = redzones.length - 1; i >= 0; i--)
		redzones[i].show();

	// explore points
	for (var i = ep.length - 1; i >= 0; i--) {
		ep[i].show();
		ep[i].checkExplore(ep);
	}

	// point at mouse
	strokeWeight(7);
	stroke(150, 100);
	point(mouseX, mouseY);

	// // show fps
	textAlign(LEFT);
	fill(255);
	strokeWeight(1);
	text('FPS: ' + floor(fr), 5, 20);

	// // show time
	text('Time: ' + prettyTime(milli / 1000), 5, 45);

	// count player
	text('Players: ' + (e.length + (p ? 1 : 0)), 5, 70);

	// killed
	text('Killed: ' + viewport.target.killed, 5, 95);
}

function keyPressed() {
	if (!isTyping()) {
		if (keyCode == unchar('V')) {
			viewport.followTarget = !viewport.followTarget;

		} else if (keyCode == unchar('R')) {
			if (p) p.gun.reload();

		} else if (keyCode >= 49 && keyCode <= 57) { // number
			if (p && keyCode - 49 < getObjectLength(gunShop)) {
				p.gun = new Gun(p, gunShop[getValueAtIndex(gunShop, keyCode - 49)])
			}

		} else if (keyCode == unchar('E')) {
			enemyAttack = !enemyAttack;
			addAlertBox('Enemy ATTACK Mode: ' + (enemyAttack ? 'ON' : 'OFF'), "#222", (enemyAttack ? "#e55" : "#2f2"));

		} else if (keyCode == unchar('Q')) {
			eAngryAll = !eAngryAll;
			if (eAngryAll) enemyAttack = true;
			addAlertBox('Enemy Attack EACH OTHER Mode: ' + (eAngryAll ? 'ON' : 'OFF'), "#222", (eAngryAll ? "#e55" : "#2f2"));

		} else if (keyCode == unchar('C')) { // T
			var value = document.getElementById('showHideChat').value;
			if (value == 'Show') showChat(true);
			else showChat(false);

		} else if (keyCode == 13) {
			showChat(true);
			document.getElementById('inputMes').focus();
		}

	} else if (keyCode == 13) {
		var ele = document.getElementById('inputMes');
		switch (ele.value) {
			case '':
				break;

			case '/help':
				addMessage('/howtoplay, /showplayers, /clear, /reset, /contact', 'Server');
				break;

			case '/howtoplay':
				help();
				break;

			case '/showplayers':
				var names = "";
				for (var i = 0; i < e.length; i++) {
					names += (e[i].name + ", ");
				}
				addMessage(names, 'Server', false, color(0));
				break;

			case '/clear':
				var myNode = document.getElementById('conversation');
				while (myNode.firstChild) {
					myNode.removeChild(myNode.firstChild);
				}
				break;

			case '/reset':
				reset();
				addMessage('The Game has been Restarted', 'Server', true, color(0, 150, 0));
				break;

			case '/contact':
				addMessage('click here \u2665', 'My Github', false, color(100), 
					function(){window.open('https://github.com/HoangTran0410')});
				addMessage('click here \u2665', 'My Facebook', false, color(0, 0, 255), 
					function(){window.open('https://www.facebook.com/people/Hoang-Tran/100004848287494')});
				break;

			default:
				addMessage(event.target.value, pname, true, pcolor);
				break;
		}

		ele.blur();
		ele.value = '';
	}
}

function mousePressed(event) {
	if (p) {
		if (gunInfo && isInside(mouseX, mouseY, gunInfo.pos, gunInfo.size)){
			changeGun(p, 1);
		}

	} else if (event.target.matches('canvas') || document.getElementById('showHideChat').value == 'Show') {
		var newTarget = e[(e.indexOf(viewport.target) + 1) % e.length]
		changeViewportTarget(newTarget);
	}
}

function mouseWheel(event) {
	if (p && (event.target.matches('canvas')) || document.getElementById('showHideChat').value == 'Show') 
		changeGun(p, event.delta > 0 ? 1 : -1);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight, true);
	gunInfo = new infoGunBox();
}