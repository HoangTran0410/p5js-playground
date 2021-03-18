var guiControl = {

	blur  : 155,
	pause : false,
	life : 50,
	density : 1,
	friction : 0.5,
	bounce : 0.6,
	playOrPasue : function () {
		guiControl.pause = !guiControl.pause;
	},
	help : function () {
		alert('Designer  : Hoang Tran\n'+
			  'Made with : dat.Gui, P5js, box2D\n\n'+
			  'How to Play : \n'+
			  '     Use mouse to pick and move object\n'+
			  '     Player(is a first circle): Left Right, Up Arrow to move and jump\n\n'+
			  'Key :\n'+
			  '     R : reCreate player\n'+
			  '     B : Create box at mouse position\n'+
			  '     C : Create circle at mouse position\n'+
			  '     N : Create pyramid\n'+
			  '     Q : Delete shape at mouse position\n'+
			  ' Space : Fire\n'+
			  '     P : Play / Pause\n'+
			  'Note :\n'+
			  '     Work better on Chrome'
			  );
	}
}

function createGui(){
  	var gui = new dat.GUI();

  	var setting = gui.addFolder('Setting');

  		setting.add(guiControl, 'blur', 0, 255).name('Blur').listen();
  		setting.add(guiControl, 'life', 10, 500).step(10).name('Bullet life').listen();
  		setting.add(guiControl, 'density', 0, 50).step(0.5).name('Density').listen();
  		setting.add(guiControl, 'friction', 0, 1).step(0.1).name('Friction').listen();
  		setting.add(guiControl, 'bounce', 0, 2).step(0.02).name('Bounce').listen();  		
  		setting.add(guiControl, 'playOrPasue').name('Play/Pause').listen();

  		gui.add(guiControl, 'help').name('Help').listen();	
}