/* 
	author : Hoang Tran
	date : 26 / 8 /2018
	use : p5js, dat.gui
*/

// =============== Khoi tao bien toan cuc ===================

var arr; // array
var gui; // khung dieu khien
var sortSimulate; // object sort

// ==================== Giao dien dieu khien =====================
var cgui = { // control gui
	typeSort: "BubbleSort",
	typeDraw: "line",
	len: 100,
	speed: 5,
	fr: 60, // frameRate
	inc: true,
	hightlight: true,
	w: 1, // width of line , dot
	sort: function(){reset();}
}

function setupGui(){
	gui = new dat.GUI();

	gui.add(cgui, 'typeSort', ['BubbleSort', 'InsertionSort', 'SelectionSort'])
		.name('Type Sort')
		.onChange(function(){reset();});

	gui.add(cgui, 'typeDraw', ['line', 'dot'])
		.name('Type Draw');

	gui.add(cgui, 'len').name('Array Length')
		.onChange(function(){reset();});

	gui.add(cgui, 'speed')
		.name('Speed up');

	gui.add(cgui, 'fr', 1, 60)
		.name('Framerate')
		.onChange(function(value){frameRate(value)});
	
	gui.add(cgui, 'inc').name('Sort ascending')
		.onChange(function(value){
			reset();
			sortSimulate.reset((value?'tang':'giam'));
		});

	gui.add(cgui, 'hightlight')
		.name('Hight light');

	gui.add(cgui, 'sort').name('Sort');
}

// ================ Ham khoi tao 'setup' va ham main 'draw' =================

function setup() {
	createCanvas(windowWidth, windowHeight).position(0, 0);
	colorMode(HSB, height);
	strokeCap(SQUARE);
	textAlign(LEFT);
	textSize(16);

	setupGui();

	reset();
}

function draw() {
	background(30);

	show(arr, cgui.typeDraw);
	sortSimulate.run(cgui.speed);

	fill(height);
	noStroke();
	text("speed: x" + cgui.speed, 5, 45);
	text("fps: " + floor(frameRate()), 5, 65);
}

function reset(){
	cgui.w = width / cgui.len; 
	strokeWeight(cgui.w);// do rong cua line, dot

	// tao gia tri cho array
	arr = [];
	for (var i = 0; i < cgui.len; i++)
		arr.push(random(height));

	switch(cgui.typeSort){
		case 'BubbleSort':
			sortSimulate = new BubbleSort(arr);
			break;

		case 'InsertionSort':
			sortSimulate = new InsertionSort(arr);
			break;

		case 'SelectionSort':
			sortSimulate = new SelectionSort(arr);
			break;
	}	
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight, true);
	colorMode(HSB, height);
	cgui.w = width / cgui.len;
}

// ================ Sorts Algorithm ===================
function BubbleSort(arr) {
	this.a = arr;
	this.i = 0;
	this.j = this.a.length - 1;
	this.sortType = "tang";
	this.finised = false;

	this.run = function(steps) {
		if (!this.finised) {
			for (var i = 0; i < steps; i++) {
				this.calculate();
			}
			if(cgui.hightlight){
				stroke(height);
				line(c(this.j+cgui.speed), height - this.a[this.j], c(this.j+cgui.speed), 0);
			}
		}
		fill(height);
		noStroke();
		text("Bubble Sort" + (this.finised?" (DONE)":""), 5, 20);
	}

	this.reset = function(type) {
		this.i = 0;
		this.j = this.a.length - 1;
		this.finised = false;
		if(type) this.sortType = type;
	}

	this.calculate = function() {

		if (this.i < this.a.length) {

			if (this.j >= this.i + 1) {
				if (this.a[this.j] < this.a[this.j - 1] && this.sortType == 'tang' ||
					this.a[this.j] > this.a[this.j - 1] && this.sortType == 'giam') {
					swap(this.a, this.j, this.j - 1);
				}
				this.j--;

			} else {
				this.i++;
				this.j = this.a.length - 1;
			}

		} else {
			this.finised = true;
		}
	}
}

function InsertionSort(arr){
	this.a = arr;
	this.i = 1;
	this.j = 0;
	this.sortType = "tang";
	this.finised = false;

	this.run = function(steps) {
		if (!this.finised) {
			for (var i = 0; i < steps; i++) {
				this.calculate();
			}
			if(cgui.hightlight){
				stroke(height);
				line(c(this.j+cgui.speed), height - this.a[this.j], c(this.j+cgui.speed), 0);
			}
		}
		fill(height);
		noStroke();
		text("Insertion Sort" + (this.finised?" (DONE)":""), 5, 20);
	}

	this.reset= function(type){
		this.i = 1;
		this.j = 0;
		this.finised = false;
		this.startTime = millis();
		if(type) this.sortType = type;
	}

	this.calculate = function(){
		if(this.i < this.a.length){
			if(this.j >= 0){

				if(this.sortType == "tang"){
					if(this.a[this.j-1] > this.a[this.j])
						swap(this.a, this.j, this.j-1);
					else this.j = -1;

				} else {
					if(this.a[this.j-1] < this.a[this.j])
						swap(this.a, this.j, this.j-1);
					else this.j = -1;
				}

				this.j--;
			} else {
				this.i++;
				this.j = this.i;
			}

		} else {
			this.finised = true;
		}
	}
}

function SelectionSort(arr){
	this.a = arr;
	this.i = 0;
	this.j = 1;
	this.sortType = "tang";
	this.finised = false;

	this.smallest = 1;

	this.run = function(steps) {
		if (!this.finised) {
			for (var i = 0; i < steps; i++) {
				this.calculate();
			}
			if(cgui.hightlight){
				stroke(height);
				line(c(this.j), height - this.a[this.j], c(this.j), 0);

				stroke(height);
				line(c(this.smallest), height - this.a[this.smallest], c(this.smallest), 0);
			}
		}
		fill(height);
		noStroke();
		text("Selection Sort" + (this.finised?" (DONE)":""), 5, 20);
	}

	this.reset= function(type){
		this.i = 0;
		this.j = 1;
		this.finised = false;
		if(type) this.sortType = type;
	}

	this.calculate = function(){
		if(this.i < this.a.length){
			if(this.j < this.a.length){
				if(this.a[this.j] < this.a[this.smallest] && this.sortType == "tang" || 
					this.a[this.j] > this.a[this.smallest] && this.sortType == "giam")
					this.smallest = this.j;

				this.j++;
			} else {
				swap(this.a, this.i, this.smallest);
				this.i++;
				this.j = this.i + 1;
				this.smallest = this.i;
			}

		} else {
			this.finised = true;
		}
	}
}

function swap(arr, i, j) {
	arr[i] = [arr[j], arr[j] = arr[i]][0];
}

function c(n){ // convert
	return n * cgui.w + cgui.w / 2;
}

// ================= Show arr =======================

function show(arr, type) {
	switch(type){
		case "line":
			for (var i = 0; i < arr.length; i++) {
				stroke(arr[i], height, height);
				line(c(i), height, c(i), height - arr[i]);
			}
			break;

		case "dot":
			if(cgui.w < 2) strokeWeight(2);
			for(var i = 0; i < arr.length; i++){
				stroke(arr[i], height, height);
				point(c(i), height - arr[i]);
			}
			break;
		
	}
}

