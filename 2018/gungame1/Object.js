// ====== Class Player ====
function Character(x, y, health, name) {
	this.name = name || RandomName[floor(random(RandomName.length))];
	this.col = color(random(50, 200), random(50, 200), random(50, 200));
	this.fakepos = createVector(0, 0);
	this.pos = createVector(x, y) // real position
	this.vel = createVector(0, 0) // velocity 
	this.health = health || 100;
	this.size = (30 / 100 * this.health);
	this.maxSpeed = 5;
	this.score = 0;
	this.killed = 0;
	// this.runFast = false;

	this.gun = new Gun(this, gunShop[getValueAtIndex(gunShop, floor(random(getObjectLength(gunShop))))]);
}

// =========== Class Enemy AI =============
function eMove(t) { // enemy auto move
	if (t.gun.bullsLeft == 0) {
		changeGun(t, floor(random(getObjectLength(gunShop))));

	} else {
		t.gun.update();
	}

	if (!t.nextPoint || p5.Vector.dist(t.pos, t.nextPoint) < t.size / 2) {
		var range = new Circle(t.pos.x, t.pos.y, t.size / 2 + width / 2, t.size / 2 + width / 2);
		var items = quadItem.query(range, false, true);

		if (items.length > 0) {
			t.nextPoint = items[0].pos;

		} else {
			var newx = t.pos.x + random(-500, 500);
			var newy = t.pos.y + random(-500, 500);

			// collide edge
			if (newx < t.size) newx = t.size;
			else if (newx > mapInfo.wMap - t.size) newx = mapInfo.wMap - t.size;

			if (newy < t.size) newy = t.size;
			else if (newy > mapInfo.hMap - t.size) newy = mapInfo.hMap - t.size;

			// set nextPoint
			t.nextPoint = createVector(newx, newy);
		}

	} else {
		if (t.vel.mag() < t.maxSpeed / 1.5)
			t.vel.add((t.nextPoint.x - t.pos.x) / 4, (t.nextPoint.y - t.pos.y) / 4).limit(t.maxSpeed);
		
		else if (t.vel.mag() > t.maxSpeed) 
			t.vel.setMag(t.maxSpeed);
	}
}

function eAttack(t) {
	if (eAngryAll) {
		var dir = false,
			atackTo;
		if (enemyAttack) {
			var r = min(t.size / 2 + width / 2, t.size / 2 + height / 2);
			var range = new Circle(t.pos.x, t.pos.y, r + maxSizeNow, r + maxSizeNow);
			var players = quadPlayer.query(range);

			for (var pl of players) {
				if (pl != t && p5.Vector.dist(t.pos, pl.pos) < r + pl.size) {
					// fill(255, 0, 0, 15);
					// ellipse(t.fakepos.x, t.fakepos.y, (r + maxSizeNow) * 2, (r + maxSizeNow) * 2);
					t.gun.fire(pl.pos);
					if (t.health < 50) {
						t.vel.add(p5.Vector.sub(t.pos, pl.pos)).setMag(t.maxSpeed);
						t.nextPoint = createVector(t.pos.x + random(-500, 500), t.pos.y + random(-500, 500));
					}
					atackTo = pl;
					dir = true;
					break;
				}
			}
		}

		if (dir) {
			showPlayer(t, p5.Vector.sub(atackTo.pos, t.pos).heading());
		} else {
			showPlayer(t, t.vel.heading());
		}

	} else if (p) {
		if (enemyAttack && isInside(t.pos.x, t.pos.y, p.pos, {
				x: width - 100 + p.size / 2,
				y: height - 100 + p.size / 2
			})) {

			showPlayer(t, p5.Vector.sub(p.pos, t.pos).heading());

			t.gun.fire(p.pos);
			if (t.health < 50) {
				t.vel.add(p5.Vector.sub(t.pos, p.pos)).setMag(t.maxSpeed);
			}

		} else showPlayer(t, t.vel.heading());

	} else showPlayer(t, t.vel.heading());
}

// =========== Class Gun =============
function Gun(owner, type) {
	this.o = owner;
	this.name = type.name;
	this.sound = type.soundLink;
	this.damage = type.damage;
	this.shock = type.shock;
	this.vel = type.velocity;
	this.delay = type.delayTime;
	this.sizeB = type.sizeBullet;
	this.colorB = type.bullColor;
	this.bulls = type.bulletPerTimes;
	this.hitRatio = 100 - type.hitRatio * 100;
	this.lifeSpan = type.lifeBull || 10000; // đơn vị milisecond
	this.maxBulls = type.maxBulls;
	this.reloadTime = type.reloadTime;
	this.afterShoot = type.afterShoot;

	this.firePreTime = 0; // thời điểm bắn viên đạn trước đó
	this.bullsLeft = this.maxBulls; // số đạn còn lại trong băng đạn

	this.fire = function(target) {
		if (this.bullsLeft > 0) {
			if (!this.reloading && milli - this.firePreTime > this.delay) {
				if (this.afterShoot) {
					this.afterShoot(this.o, target);

				} else {
					// createNewAudio(myAudio, this.sound);
					var dir, bpos, vel;
					for (var i = 0; i < this.bulls; i++) {
						dir = createVector(target.x - this.o.pos.x, target.y - this.o.pos.y)
							.add(random(-this.hitRatio, this.hitRatio), random(-this.hitRatio, this.hitRatio));
						vel = dir.copy().setMag(this.vel + ((this.bulls > 1) ? random(-2, 2) : 0));
						bpos = this.o.pos.copy().add(dir.copy().setMag(this.o.size / 2 + 5));
						b.push(new Bullet(this.name, bpos, vel, this.damage, this.sizeB, this.colorB, this.lifeSpan, this.o));
					}

					if (this.o.vel.mag() < this.o.maxSpeed * 2.5) {
						var force = p5.Vector.sub(this.o.pos, target)
							.setMag(this.shock);
						addForce.apply(this.o, [force.x, force.y]);
					}
				}

				this.firePreTime = milli;
				this.bullsLeft--;
			}

		} else {
			this.reload();
		}
	}

	this.reload = function() {
		this.firePreTime = milli + this.reloadTime * ((this.maxBulls - this.bullsLeft) / this.maxBulls);
		this.bullsLeft = this.maxBulls;
		this.reloading = true;
	}

	this.update = function() {
		if (this.reloading && milli > this.firePreTime) {
			this.reloading = false;

			this.firePreTime = milli - this.delay; // reset pre time
		}
	}
}

function infoGunBox(x, y, w, h) {
	this.pos = createVector(x || width - 40, y || height - 30);
	this.size = createVector(w || 70, h || 50);

	this.show = function() {
		if (isInside(mouseX, mouseY, this.pos, this.size)) {
			cursor(HAND);
			noStroke();
			if(p){
				fill(255);
				text('Click to change', mouseX - 70, mouseY - 20);
			}

		} else {
			cursor(ARROW);
			noStroke();
		}

		fill(120, 50);
		rect(this.pos.x, this.pos.y - this.size.y * 0.25, this.size.x, this.size.y * 0.5);
		fill(0, 50);
		rect(this.pos.x, this.pos.y + this.size.y * 0.25, this.size.x, this.size.y * 0.5);

		noStroke();
		fill(255);
		text(viewport.target.gun.name, this.pos.x, this.pos.y - this.size.y * 0.25);

		if (viewport.target.gun.reloading) {
			fill(255, 150, 20);
			text("..Reloading..", this.pos.x, this.pos.y + this.size.y / 3);
		} else text(viewport.target.gun.bullsLeft, this.pos.x, this.pos.y + this.size.y * 0.3);
	}
}

// ========== Class Bullet ===============
function Bullet(name, pos, dir, damage, sizeB, c, lifeSpan, owner) {
	this.o = owner;
	this.name = name;
	this.pos = createVector(pos.x, pos.y);
	this.fakepos = createVector(0, 0);
	this.vel = createVector(dir.x, dir.y);
	this.size = sizeB;
	this.col = (c ? color(c[0], c[1], c[2], c[3] || 255) : color(random(255), random(255), random(255)));
	this.damage = damage;

	this.startTime = milli;
	this.lifeSpan = lifeSpan; // sau 10000 mili s se bien mat

	this.update = function() {
		this.pos.add(this.vel.copy().mult(60 / (fr + 1)));
		this.vel.mult(0.999);

		collisionEdge(this, 0.9);

		if (milli - this.startTime > this.lifeSpan) {
			b.splice(b.indexOf(this), 1);
			if (gunShop[this.name] && gunShop[this.name].finished)
				gunShop[this.name].finished(this.o, this.pos);
		}
	}

	this.show = function() {
		if (isInside(this.pos.x, this.pos.y, viewport.pos, {
				x: width + this.size,
				y: height + this.size
			})) {

			this.fakepos = realToFake(this.pos.x, this.pos.y);
			noStroke();
			fill(this.col);
			ellipse(this.fakepos.x, this.fakepos.y, this.size, this.size);
		}
	}
}

// ========== Class Item ================
function Item(x, y, col, size) {
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.fakepos = createVector(0, 0);

	this.size = size || random(5, 15);
	this.col = col || [random(255), random(255), random(255)];

	this.show = function() {
		if (isInside(this.pos.x, this.pos.y, viewport.pos, {
				x: width + this.size,
				y: height + this.size
			})) {

			this.fakepos = realToFake(this.pos.x, this.pos.y);
			this.pos.add(random(-2, 2), random(-2, 2));

			noStroke();

			fill(this.col[0], this.col[1], this.col[2]);
			ellipse(this.fakepos.x, this.fakepos.y, this.size, this.size);

			fill(this.col[0], this.col[1], this.col[2], 150);
			ellipse(this.fakepos.x, this.fakepos.y, this.size * 1.5, this.size * 1.5);

			fill(this.col[0], this.col[1], this.col[2], 50);
			ellipse(this.fakepos.x, this.fakepos.y, this.size * 2, this.size * 2);
		}
		if (this.pos.x < 0 || this.pos.x > mapInfo.wMap ||
			this.pos.y < 0 || this.pos.y > mapInfo.hMap) {
			item.splice(item.indexOf(this), 1);
		}
	}

	this.check = function(t) { // check if player can eat this item
		var d = p5.Vector.dist(this.pos, t.pos);

		if (d < this.size + t.size / 2) {
			t.health += this.size * 0.4;
			t.score += this.size * 0.05;
			updateSize(t);

			item.splice(item.indexOf(this), 1);

		} else {
			this.vel = createVector(t.pos.x - this.pos.x, t.pos.y - this.pos.y).setMag(250 / (d - t.size / 2));
			this.pos.add(this.vel);
		}
	}
}

// ========== Redzone =================
function RedZone(x, y, r, time) {
	this.pos = createVector(x, y);
	this.fakepos = createVector(0, 0);
	this.size = r;
	this.ep = [];

	this.time = time;
	this.startTime = milli;
	this.preDrop = milli;

	this.redRange = [120, 255];
	this.redValue = random(120, 255);
	this.grow = (this.redRange[1] - this.redRange[0]) / 50;

	this.dropBoom = function() {
		if (milli - this.preDrop > 1000 / (this.size / 200)) {
			this.preDrop = milli;
			var len = createVector(random(-1, 1), random(-1, 1)).setMag(random(this.size / 2));
			var pos = p5.Vector.add(this.pos, len);
			this.ep.push(new ExplorePoint(pos.x, pos.y, random(10, 20), null, random(500, 2000)));
			if (random(1) > 0.5)
				item.push(new Item(pos.x, pos.y));
			else if(random(1) > 0.9)
				b.push(new Bullet('Mine', pos, {x:0,y:0}, 10, 20, null, 120000, null));
		}
	}

	this.show = function() {
		this.redValue += this.grow;
		if (this.redValue <= this.redRange[0] || this.redValue >= this.redRange[1])
			this.grow *= -1;

		if (isInside(this.pos.x, this.pos.y, viewport.pos, {
				x: width + this.size,
				y: height + this.size
			})) {

			this.fakepos = realToFake(this.pos.x, this.pos.y);

			noStroke();
			fill(this.redValue, 10, 10, 35);
			ellipse(this.fakepos.x, this.fakepos.y, this.size, this.size);

			for (var i = this.ep.length - 1; i >= 0; i--) {
				this.ep[i].show();
			}
		};

		for (var i = this.ep.length - 1; i >= 0; i--) {
			this.ep[i].checkExplore(this.ep);
		}

		if (milli - this.startTime > this.time) {
			redzones.splice(redzones.indexOf(this), 1);

		} else {
			this.dropBoom();
		}
	}
}

// ========== Explore point ============
function ExplorePoint(x, y, numOfBulls, colo, timeCount, owner) {
	this.o = owner;
	this.pos = createVector(x, y);
	this.fakepos = createVector(0, 0);
	this.num = numOfBulls;
	this.col = colo;

	this.timeCount = timeCount;
	this.startTime = milli;

	this.size = this.timeCount / 10;

	this.checkExplore = function(contain) {
		if (milli - this.startTime >= this.timeCount) {
			explore(this.pos, this.num, this.col, this.o);
			contain.splice(contain.indexOf(this), 1);
		}
	}

	this.show = function() {
		if (isInside(this.pos.x, this.pos.y, viewport.pos, {
				x: width + this.size,
				y: height + this.size
			})) {

			this.fakepos = realToFake(this.pos.x, this.pos.y);
			var size = map((milli - this.startTime), 0, this.timeCount, 0, this.size);
			var opacity = map(size, 0, this.size, 0, 255);
			fill(200, 10, 10, opacity);
			ellipse(this.fakepos.x, this.fakepos.y, this.size - size, this.size - size);
		}
	}
}

// ========== Circle Wall =============
function Wall(x, y, r) {
	this.pos = createVector(x, y);
	this.fakepos = createVector(0, 0);
	this.size = r;

	this.show = function() {
		if (isInside(this.pos.x, this.pos.y, viewport.pos, {
				x: width + this.size,
				y: height + this.size
			})) {

			this.fakepos = realToFake(this.pos.x, this.pos.y);


		}
	}
}

// ========== Shape Database =============
function drawPlayerWithShape(t, shape, angle) {
	switch (shape) {
		case 'Circle':
			push();
			translate(t.fakepos.x, t.fakepos.y);
			rotate(angle);

			fill(t.col);
			ellipse(0, 0, t.size, t.size);
			fill(0);
			ellipse(t.size / 4, 0, t.size / 2, t.size / 1.5);

			pop();
			break;

		case 'Pentagon':
			push();
			translate(t.fakepos.x, t.fakepos.y);

			var heading = t.vel.heading();
			rotate(heading);
			fill(t.col);
			polygon(0, 0, t.size / 2, 5);

			stroke(30);
			strokeWeight(t.size / 4);
			point(t.size / 3, 0);

			fill(0, 200);
			stroke(150);
			strokeWeight(2);

			rotate(angle - heading);
			rect(t.size / 4, 0, t.size / 1.5, t.size / 5);

			fill(0);
			ellipse(0, 0, t.size / 3, t.size / 3);

			pop();
			break;
	}
}

// ========== Gun Database ===============
var gunShop = {
	AK: {
		name: "AK",
		soundLink: "sounds/AK.mp3",
		damage: 3,
		shock: 1.5,
		bulletPerTimes: 1,
		sizeBullet: 5,
		bullColor: [255, 200, 200],
		velocity: 21,
		delayTime: 100,
		hitRatio: 0.7,
		lifeBull: 1500,
		maxBulls: 30,
		reloadTime: 1000,
		afterShoot: 0,
		finished: 0
	},
	Piston: {
		name: "Piston",
		soundLink: "sounds/Gun+Silencer.mp3",
		damage: 15,
		shock: 3,
		bulletPerTimes: 1,
		sizeBullet: 10,
		bullColor: [255, 255, 0, 150],
		velocity: 22,
		delayTime: 350,
		hitRatio: 0.9,
		lifeBull: 1700,
		maxBulls: 15,
		reloadTime: 1200,
		afterShoot: false,
		finished: 0
	},
	Shotgun: {
		name: "Shotgun",
		soundLink: "sounds/Shotgun.mp3",
		damage: 7,
		shock: 7, // độ giựt của súng
		bulletPerTimes: 5,
		sizeBullet: 8,
		bullColor: [200, 200, 20],
		velocity: 20,
		delayTime: 1000,
		hitRatio: 0.4,
		lifeBull: 1000,
		maxBulls: 7, // số viên đạn tối đa trong 1 băng đạn
		reloadTime: 2000, // đơn vị mili giây
		afterShoot: false,
		finished: 0
	},
	Sniper: {
		name: "Sniper",
		soundLink: "sounds/Shotgun.mp3",
		damage: 50,
		shock: 6,
		bulletPerTimes: 1,
		sizeBullet: 10,
		bullColor: [150, 150, 150],
		velocity: 25,
		delayTime: 350,
		hitRatio: 1,
		lifeBull: 10000,
		maxBulls: 1,
		reloadTime: 1200,
		afterShoot: false,
		finished: 0
	},
	Minigun: {
		name: "Minigun",
		soundLink: "",
		damage: 3,
		shock: 1,
		bulletPerTimes: 2,
		sizeBullet: 5,
		bullColor: [255, 255, 175],
		velocity: 21,
		delayTime: 80,
		hitRatio: 0.5,
		lifeBull: 1500,
		maxBulls: 100,
		reloadTime: 2500,
		afterShoot: false,
		finished: 0
	},
	Bazoka: {
		name: "Bazoka",
		soundLink: "sounds/Bazoka.mp3",
		bulletPerTimes: 1,
		damage: 5, // more damage when explore
		shock: 10,
		sizeBullet: 30,
		bullColor: [255, 0, 0],
		velocity: 14,
		delayTime: 1000,
		hitRatio: 0.9,
		lifeBull: 5000,
		maxBulls: 2,
		reloadTime: 2500,
		afterShoot: false,
		finished: function(owner, target) {
			explore(target, 20, null, owner);
		}
	},
	Mine: {
		name: "Mine",
		soundLink: "",
		damage: 10, // more damage when explore
		shock: 3,
		bulletPerTimes: 1,
		sizeBullet: 20,
		bullColor: false, // random color
		velocity: 0,
		delayTime: 700,
		hitRatio: 1,
		lifeBull: 240000,
		maxBulls: 5,
		reloadTime: 2000,
		afterShoot: false,
		finished: function(owner, target) {
			explore(target, 35, [255, 100, 50], owner);
		}
	},
	Bomb: {
		name: "Bomb",
		soundLink: "",
		damage: 0,
		shock: 0,
		bulletPerTimes: 1,
		sizeBullet: 0,
		bullColor: false,
		velocity: 0,
		delayTime: 1000,
		hitRatio: 1,
		lifeBull: 0,
		maxBulls: 2,
		reloadTime: 2000,
		afterShoot: function(owner, target) {
			ep.push(new ExplorePoint(target.x, target.y, 30, false, 1500, owner));
		},
		finished: 0
	}
}

// =========== Name Database =============
var RandomName = [
	"Jacob", "William", "Ethan", "Daniel", "Logan", "God Of God",
	"Matthew", "Lucas", "Jackson", "David", "Samuel", "Dont Kill Me",
	"Luke", "Henry", "Andrew", "Nathan", "Huong", "Nhien",
	"Nhung", "Huynh", "Dat", "Dinh", "Hanh", "Ros", "Tay",
	"Thanh", "Hue", "Nang", "Mua", "Bao", "Tam", "FuckYou",
	"Dem", "Sang", "Cute", "Dude", "Kiss", "Hope", "Car", "God",
	"Fake", "Alan", "Hoi", "Diem", "Master", "Be Friend or Die",
	"Yi", "Yasuo", "Irela", "Vi", "Lux", "Sion", "Doctor", "U r mine",
	"Jinx", "Jhin", "Roma", "Computer", "Fax", "Plane", "Sky", "Head",
	"Tree", "Lake", "Water", "Fire", "Snow", "Mountain", "Dog",
	"Cat", "Bird", "Snack", "Candy", "Huu", "Noah", "Mason",
	"Hoang", "Hien", "Linh", "Nam", "Tam", "Hau", "Foria",
	"Hoa", "Thao", "Trang", "Thuy", "Huan", "Luong", "Test Game",
	"Hao", "Thuan", "Nga", "Huy", "Hang", "An", "Anh", "Call me",
	"Thien", "Ngan", "<3", "Love", "Michael", "Seclo", "Play Alone",
	"Heo", "Julia", "Jame", "Thomson", "LOL", "Ris",
	"Tris", "Nhan", "Dang", "Dam"
];

// =========== Countries Database ===========
var countries = [
	"Afghanistan", "Albania", "Algeria",
	"Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda",
	"Argentina", "Armenia", "Aruba", "Australia", "Austria",
	"Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
	"Barbados", "Belarus", "Belgium", "Belize", "Benin",
	"Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina",
	"Botswana", "Brazil", "British Virgin Islands", "Brunei",
	"Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
	"Cameroon", "Canada", "Cape Verde", "Cayman Islands",
	"Central Arfrican Republic", "Chad", "Chile", "China",
	"Colombia", "Congo", "Cook Islands", "Costa Rica",
	"Cote D Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus",
	"Czech Republic", "Denmark", "Djibouti", "Dominica",
	"Dominican Republic", "Ecuador", "Egypt", "El Salvador",
	"Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
	"Falkland Islands", "Faroe Islands", "Fiji", "Finland",
	"France", "French Polynesia", "French West Indies", "Gabon",
	"Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece",
	"Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea",
	"Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong",
	"Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
	"Ireland", "Isle of Man", "Israel", "Italy", "Jamaica",
	"Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
	"Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
	"Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
	"Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi",
	"Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
	"Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
	"Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco",
	"Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal",
	"Netherlands", "Netherlands Antilles", "New Caledonia",
	"New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
	"Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
	"Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
	"Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania",
	"Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa",
	"San Marino", "Sao Tome and Principe", "Saudi Arabia",
	"Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
	"Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
	"South Korea", "South Sudan", "Spain", "Sri Lanka", "St Kitts &amp; Nevis",
	"St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland",
	"Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
	"Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga",
	"Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan",
	"Turks &amp; Caicos", "Tuvalu", "Uganda", "Ukraine",
	"United Arab Emirates", "United Kingdom", "United States of America",
	"Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
	"Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"
];
