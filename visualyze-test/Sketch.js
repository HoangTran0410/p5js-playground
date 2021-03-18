var amplitudeGraph;
var fftGraph;
var showBoxContain = false;
var buts = [];
var slideVolume;
var designMode = false;

var backG;
var backgNow;
var isShowGuide = true;
var imageSong;

var myAudio;
var songNow;
var nameSongNow;

var jsonWeb_song_Now;
var jsonFile_all_ID;

function createFirstAll(state){
	slideVolume = new SlideBar(width/2, height/2-150, 200, 20, 0, 1, 0.7);
	nameSongNow = new nameSongClass(width/2, height/2-270, 200, 20, "", 27, 'ITALIC', color('rgb(255, 255, 255)'));
	songNow = floor(random(0,jsonFile_all_ID.data.length));

	// this code i learn from p5js.org and chrome console
	// solution for load local file https://stackoverflow.com/questions/44167012/html5-audio-to-play-a-playlist-of-local-mp3-files 
	myAudio = createAudio();
	myAudio.id = "myAudio";
	myAudio.autoplay(true);	
	myAudio.loop(true);
	myAudio.volume(slideVolume.val);
	myAudio.onended(function(){NextPre('next');});
	myAudio.connect(p5.soundOut);

	// get data from web ang .. PLAY it
	if(state == "loaded")
		addSongFromIdZing(jsonFile_all_ID.data[songNow].id);

	// prepare all object
	backgNow = floor(random(1, 48));
	backG = loadImage("image/BackG"+backgNow+".jpg");

	amplitudeGraph = new AmplitudeGraph(width/2, height/2, width/2, height/4, 100, "Visualyze\nDemo");
	fftGraph = new FFTGraph(width/2, height/2+height/4+50, width/2, height/4, 64);

	buts.push(new buttonShape(width/2	, height/2-200, 100, 60, "Loading"  , 27, 'NORMAL', function(){PlayPause();}));
	buts.push(new buttonShape(width/2+80, height/2-190, 50 , 35, "Next"  , 15, 'ITALIC', function(){NextPre('next');}));
	buts.push(new buttonShape(width/2-80, height/2-190, 50 , 35, "Pre"   , 15, 'ITALIC', function(){NextPre('pre');}));
	buts.push(new buttonShape(width/2+75, height/2-220, 40 , 20, "Loop", 10, 'NORMAL', function(){LoopMusic(myAudio.elt.loop);}));
	buts.push(new buttonShape(width/2-75, height/2-220, 40 , 20, "Random", 10, 'NORMAL', function(){
															var len = jsonFile_all_ID.data.length;
															songNow += floor(random(1, len/2));
															if(songNow >= len) songNow -= len;
															if(songNow < 0) songNow += len;
																addSongFromIdZing(jsonFile_all_ID.data[songNow].id);}));
}

function setup() {
	createCanvas(windowWidth, windowHeight).position(0, 0)
		.drop(getFileLocal);
	background(10);
	textAlign(CENTER, CENTER);
	rectMode(CENTER);
	colorMode(HSB);
	imageMode(CENTER);
	
	// load data "name"&"id song" from file with callback
	jsonFile_all_ID = loadJSON("ZingMp3_IDSong.txt", "json",
		// loaded
		function(dataJsonFile){ 
			console.log(dataJsonFile);
			createFirstAll("loaded");
		}, 
		// if error play default song (Khi phai quen di)
		function(){
			alert("ERROR while load data from server, default song will play \n"
				+"You can drag music file into this web to play it");
			jsonFile_all_ID = {data:0}; // default setting
			addSongFromIdZing('LGJHTknaziacRdcyHtFnknTkWFzBchQbS'); // IDsong: Khi phai quen di
			createFirstAll("error");
		}
	);	
}

function draw(){
	if(jsonWeb_song_Now){
		image(backG, width/2, height/2, width, height, 0, 0, backG.width, backG.height);

		showCurrentState();
		nameSongNow.show();
		showTime(amplitudeGraph.pos.x+amplitudeGraph.size.x/2-20, amplitudeGraph.pos.y+20);
		slideVolume.show();

		amplitudeGraph.run();
		fftGraph.run();

		if(isShowGuide)
			showGuide();

		for(var i = 0; i < buts.length; i++)
			buts[i].run();
		animationAvatar(); // show image at play button (demo)

	} else {
		fill(random(255), random(255), random(255));
		ellipse(width/2+random(-100, 100), height/2+random(-100, 100), millis()/50, millis()/50);
	}
}

function keyPressed(){
	if(keyCode == ENTER){
		showBoxContain = !showBoxContain;
		designMode = !designMode;

	} else if(keyCode == LEFT_ARROW){
		if(myAudio.elt.currentTime >= 5)
			myAudio.play().time(myAudio.elt.currentTime-5);

	} else if(keyCode == RIGHT_ARROW){
		if(myAudio.elt.currentTime < myAudio.elt.duration-5)
			myAudio.play().time(myAudio.elt.currentTime+5);

	} else if(keyCode == 32) {	// Space
		PlayPause();

	} else if(keyCode == 67) {	// C key
		if(!myAudio.elt.controls)
			myAudio.showControls();
		else myAudio.hideControls();

	} else if(keyCode == 66) { 	// B key
		backgNow++;
		changeBackGround(backgNow);

	} else if(keyCode == 71) {	// G key
		isShowGuide = !isShowGuide;

	} else if(keyCode == 78) { // N key
		NextPre("next");

	} else if(keyCode == 80) { // P key
		NextPre("pre");

	} else if(keyCode == 82) { // R key
		buts[4].clickBut();

	} else if(keyCode == 83) { //S key
		saveSetting();
	}
}

function mouseClicked(){
	if(!designMode){
		for(var i = 0 ; i < buts.length; i ++){
			buts[i].clicked(mouseX, mouseY);
		}

		slideVolume.clicked(mouseX, mouseY);
		fftGraph.clicked(mouseX, mouseY);
	}
}

function mouseDragged(){
	if(designMode){
		amplitudeGraph.boxcontain.drag();
		fftGraph.boxcontain.drag();
		slideVolume.boxcontain.drag();
		nameSongNow.boxcontain.drag();
		for(var i = 0; i < buts.length; i++)
			buts[i].boxcontain.drag();
	
	} else {
		slideVolume.clicked(mouseX, mouseY);
	}
}

function mousePressed(){
	if(designMode){
		amplitudeGraph.boxcontain.mouseChoose();
		fftGraph.boxcontain.mouseChoose();
		slideVolume.boxcontain.mouseChoose();
		nameSongNow.boxcontain.mouseChoose();
		for(var i = 0; i < buts.length; i++)
			buts[i].boxcontain.mouseChoose();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight, true);

  	amplitudeGraph.changeProperties(v(width/2, height/2), v(width/2, height/4));
	fftGraph.changeProperties(v(width/2, height/2+height/4+50), v(width/2, height/4));

	buts[0].changeProperties(v(width/2   , height/2-200), v(100, 60));
	buts[1].changeProperties(v(width/2+80, height/2-190), v(50 , 35));
	buts[2].changeProperties(v(width/2-80, height/2-190), v(50 , 35));
	buts[3].changeProperties(v(width/2+75, height/2-220), v(40 , 20));
	buts[4].changeProperties(v(width/2-75, height/2-220), v(40 , 20));

	slideVolume.changeProperties(v(width/2, height/2-150), v(200, 20));
	nameSongNow.changeProperties(v(width/2, height/2-270));
}

function v(x, y){
	return createVector(x, y);
}
