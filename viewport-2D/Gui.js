var newGui = {
	wMap : 3000,
	hMap : 3000,
	numOfThings : 100,
	generate : function(){
		ResetGame();
	},
	enemyMode : false,
	freeCam : false,
	grid : true
}

function addGui() {
	AppGui = new dat.GUI();

	AppGui.add(newGui, 'wMap', 0, 500000).step(5).name('Width Map');
	AppGui.add(newGui, 'hMap', 0, 500000).step(5).name('Height Map');
	AppGui.add(newGui, 'numOfThings', 0, 100000).step(1).name('Objects');
	AppGui.add(newGui, 'generate').name('Create Map');
	AppGui.add(newGui, 'enemyMode').name('Enemy Mode (E)').listen();
	AppGui.add(newGui, 'freeCam').name('Free Cam (F)').listen();
	AppGui.add(newGui, 'grid').name('Show Grid (G)').listen();

	AppGui.close();
}