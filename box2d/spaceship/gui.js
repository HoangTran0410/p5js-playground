var newGUI = {
	w : 50,
	h : 50,
	pause : false,
	pauseF : function(){
		newGUI.pause = !newGUI.pause;
	},
	addShip : function(){
		ship.addShip();
	},
	addBox : function() {
		var newShape = createShape('box', 100, 100, newGUI.w, newGUI.h, newGUI.w*newGUI.h, 0.5, 0.6);
		newShape.color = color(random(100, 255), random(100, 255), random(100, 255));
        newShape.display(attr1, 0);
	},
	addCir : function(){
		var newShape = createShape('circle', 100, 100, newGUI.w, newGUI.h, newGUI.w*newGUI.h, 0.5, 0.6);
		newShape.color = color(random(100, 255), random(100, 255), random(100, 255));
        newShape.display(attr1, 0);	
	},
	addMeteorite : function(){
		createMeteorite();
	},
	rain : false,
	help : function(){
		alert(	'Designer  : Hoang Tran\n' +
				'Made with : P5js + box2D + dat.gui \n\n' +
				'KEY : \n' +
				'   Arrow : control ship \n' +
				'   Space : gun fire \n' +
				'     B : add box \n' +
				'     C : add circle \n' +
				'     S : add ship \n' +
				'     P : pause/resume game \n' +
				'     Q : delete object at mouse position \n');
	}
}

function createGui(){
	var gui = new dat.GUI();

	gui.add(newGUI, 'w', 0, 100).name('width').listen();
	gui.add(newGUI, 'h', 0, 100).name('height').listen();
	gui.add(newGUI, 'addShip').name('Add Ship');
	gui.add(newGUI, 'addBox').name('Add Box');
	gui.add(newGUI, 'addCir').name('Add Circle');
	gui.add(newGUI, 'addMeteorite').name('Add Meteorite');
	gui.add(newGUI, 'rain').name('Rain');
	gui.add(newGUI, 'pauseF').name('Pause');
	gui.add(newGUI, 'help').name('Help');
}