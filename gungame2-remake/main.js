import GunGame from './js/GunGame.js'

for (let o in GunGame) {
	window[o] = GunGame[o]
}

window.onload = function () {
	document.addEventListener('contextmenu', e => e.preventDefault());
}

console.log('main.js is loaded...')