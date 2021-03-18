import RoboGame from './RoboGame.js'

for (let o in RoboGame) {
	window[o] = RoboGame[o]
}

window.onload = function () {
	document.addEventListener('contextmenu', e => e.preventDefault());
}

console.log('main.js is loaded...')