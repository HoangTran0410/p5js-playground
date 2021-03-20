let tienlen;

function preload() {

}

function setup() {
    createCanvas(800, 600);
    
    rectMode(CENTER);
    textFont("Consolas");
    textStyle("bold");

    tienlen = new TienLen();
    tienlen.themNguoi("Hoang");
    tienlen.themNguoi("Hien");
    tienlen.themNguoi("Nam");
    tienlen.vanMoi();

    console.log(tienlen);
}

function draw() {
    background(30);

    tienlen.tinhToan();
    tienlen.hienThi();

    showFPS();
}

function showFPS() {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20)
    text(~~frameRate(), 15, 15);
}
