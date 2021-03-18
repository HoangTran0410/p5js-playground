var player;
var snakeAI;

function setup() { // Hàm khởi tạo giá trị
	createCanvas(windowWidth, windowHeight);

	player = new Player(50, 50, 45, 6);
	snakeAI = new AI_Snake(50, 250, 40, 1)

} // kết thúc khởi tạo

/* Vòng lặp game, hàm này sẽ được tự động 
chạy lặp đi lặp lại , giống while(true) */
function draw() {
	background(30);

	player.run();
	snakeAI.run();

} // kết thúc vòng lặp game



function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
}