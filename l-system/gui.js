var LsystemGui = {
	color : [127,157,200,200],
	colorB : [2,2,2,255],

	drawForward : "F",	// Draw line foward
	moveForward : "G",	// Move foward
	axiom : "",
	sentence : "",

	rule1 : "",
	rule2 : "",
	rule3 : "",
	rule4 : "",
	rule5 : "",

	len : 10, // first value of line's length
	angle : 90,	
	generation : 1,
	generate : function(){
		LsystemGui.sentence = LsystemGui.axiom;
		LsystemGui.generation++;
		for(var i = 1; i < LsystemGui.generation; i++)
			generate();
	},
	reset : function(){
		LsystemGui.sentence = LsystemGui.axiom;
		LsystemGui.len = 10;
		LsystemGui.generation = 1;
		grStrokeW = 3;
		grPosX = -winX*0.5;
		grPosY = -winY*0.5;
		beginX = winX;
		beginY = winY;
		draw_Lsystem();
	},
	viewSentence : function(){
		alert('After applying Rules ' + (LsystemGui.generation-1) + ' times, the Axiom becomes this' +
			'\n The image was draw from this string : \n\n' +
			LsystemGui.sentence);
	},
	help : function(){
		alert('Designer : Hoang Tran \n'+
		'Make with: P5js and dat.gui\n\n'+
		'Key :\n'+
		'      F/G____Generate undo/next\n'+
		'      E/R____Change angle  \n\n'+
		'      Drag mouse____->____move image position\n'+
		'      Ctrl + Drag mouse_->_move object postion\n\n'+
		'Key word (use in Input):\n'+
		'               +  : turn right with angle \n'+
		'               -  : turn left with angle \n'+
		'               [  : save position \n'+
		'               ]  : go back to position\'s saved \n'+
		'               {  : increase line width \n'+
		'               }  : decrease line width \n'+
		'               <  : begin add color \n'+
		'               >  : end color ,color return to Color Line (in setting) \n'+
		'Note : \n'+
		'    + Color is 3 number after "<" : \n'+
		'         First number is % of RED \n'+
		'         Second number is % of GREEN \n'+
		'         Third number is % of BLUE \n\n'+
		'    + Work better on chrome \n'+
		'    + More infomation in wikipedia -> Search "L system" \n'
		);
	},

	example : 'Dragon Curves', 
	runExample : function(){
		clearRule();
		ExampleJs(); // from file example.js
		LsystemGui.generate();
	}
}

function createGui(){
	var gui = new dat.GUI();

	var input = gui.addFolder('Input');
		input.add(LsystemGui, 'axiom').name('Axiom').listen().onChange(function(value){
			LsystemGui.sentence = value;
			LsystemGui.generation--;
			LsystemGui.generate();
			grStrokeW = 3;});
		input.add(LsystemGui, 'rule1').name('Rule 1').listen().onChange(function(value){
			RulesOnChange(0, value)});
		input.add(LsystemGui, 'rule2').name('Rule 2').listen().onChange(function(value){
			RulesOnChange(1, value)});
		input.add(LsystemGui, 'rule3').name('Rule 3').listen().onChange(function(value){
			RulesOnChange(2, value)});
		input.add(LsystemGui, 'rule4').name('Rule 4').listen().onChange(function(value){
			RulesOnChange(3, value)});
		input.add(LsystemGui, 'rule5').name('Rule 5').listen().onChange(function(value){
			RulesOnChange(4, value)});
		input.add(LsystemGui, 'viewSentence').name('View String');

	var setting = gui.addFolder('Setting');
		setting.add(LsystemGui, 'drawForward').name('Line Forward').listen().onChange(function(value){
			draw_Lsystem();});
		setting.add(LsystemGui, 'moveForward').name('Move Forward').listen().onChange(function(value){
			draw_Lsystem();});
		setting.addColor(LsystemGui, 'colorB').name('Color Background').onChange(function(value){
			gr.background(LsystemGui.colorB);
			draw_Lsystem();});
		setting.addColor(LsystemGui, 'color').name('Color Line').onChange(function(value){
			gr.stroke(LsystemGui.color[0], LsystemGui.color[1], LsystemGui.color[2], LsystemGui.color[3]);
			draw_Lsystem();});
		setting.add(LsystemGui, 'angle', 0, 360).name('Angle').step(1).listen().onChange(function(value){
			draw_Lsystem();});
		setting.add(LsystemGui, 'len').name('Zoom').listen().onChange(function(value){
			draw_Lsystem();});
		setting.add(LsystemGui, 'generation').name('Generation').listen().onChange(function(value){
			LsystemGui.generation--;
			LsystemGui.generate();});

	var play = gui.addFolder('Play');
		play.add(LsystemGui, 'generate').name('Generate');
		play.add(LsystemGui, 'reset').name('Reset');
		play.add(LsystemGui, 'help').name('Help');

	var exam = gui.addFolder('Example');
		exam.add(LsystemGui, 'example', examName).name('Example Name').onChange(function(value){
			grStrokeW = 3;
			LsystemGui.runExample();
		});

// open
	input.open();
	play.open();
}