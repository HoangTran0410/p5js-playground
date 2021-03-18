let SCREEN_RATIO = 9 / 16 // 16:9
let SCREEN_MARGIN = 0.1 // percents

let scene = "MENU";
let mouseWasPressed = false;
let images = {};

const localStorageVariable = 'RoboGame-PlayerInfo';

let player = {
    name: "",
    coins: 0,
    exps: 0
}

function getPlayerInfo() {
    let info = localStorage.getItem(localStorageVariable);
    if (info) {
        info = JSON.parse(info);
        for (let i in info) {
            player[i] = info[i];
        }
    }
}

function savePlayerInfo() {
    localStorage.setItem(localStorageVariable, JSON.stringify(player));
}

function mobilecheck() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function calculateScreenSize() {
    if (mobilecheck()) {
        return {
            w: windowWidth,
            h: windowHeight
        }
    }

    let margin = SCREEN_MARGIN * windowHeight
    let width = (windowHeight - margin) * SCREEN_RATIO
    let height = windowHeight - margin

    return {
        w: width,
        h: height
    }
}

function showMouse() {
    strokeWeight(2);
    stroke("white");
    noFill();
    ellipse(mouseX, mouseY, 10);
}

function mouseRelease() {
    return !mouseIsPressed && mouseWasPressed;
}

function collidePointRect(px, py, rx, ry, rw, rh) {
    let hw = rw * 0.5; // half width
    let hh = rh * 0.5; // half height
    return (px > rx - hw
        && px < rx + hw
        && py > ry - hh
        && py < ry + hh);
}

function collidePointCircle(px, py, cx, cy, cr) {
    return dist(px, py, cx, cy) < cr;
}

function circleButton(x, y, r, config = {}) {
    let clicked = false;
    let hovering = false;

    // check event
    if (collidePointCircle(mouseX, mouseY, x, y, r)) {
        if (mouseRelease()) clicked = true;
        hovering = true;
    }

    const {
        fillColor = "#fff7",
        strokeColor = "#ddd",
        fillText = "#fff",
        textValue = (typeof config === "string" ? config : null),
        picture,
        customDisplay
    } = config;


    if (typeof customDisplay === "function") {
        customDisplay(x, y, r, config, hovering, clicked);

    } else {
        // show
        push();
        translate(x, y);
        if (hovering) {
            strokeWeight(2);
            r -= 2.5;
        } else {
            strokeWeight(0);
        }

        if (picture) {
            image(picture, 0, 0, r * 2, r * 2);
            noFill();
            stroke(strokeColor);
            ellipse(0, 0, r * 2);
        } else {

            fill(fillColor);
            stroke(strokeColor);
            ellipse(0, 0, r * 2);
        }

        if (textValue) {
            fill(fillText);
            noStroke();
            text(textValue, 0, 0);
        }
        pop();
    }


    return clicked;
}

function button(x, y, w, h, config = {}) {
    let clicked = false;
    let hovering = false;

    // check event
    if (collidePointRect(mouseX, mouseY, x, y, w, h)) {
        if (mouseRelease()) clicked = true;
        hovering = true;
    }

    const {
        fillColor = "#fff7",
        strokeColor = "#ddd",
        fillText = "#fff",
        textValue = (typeof config === "string" ? config : null),
        picture,
        customDisplay
    } = config;

    if (typeof customDisplay === "function") {
        customDisplay(x, y, w, h, config, hovering, clicked);

    } else {
        // show
        push();
        translate(x, y);

        if (hovering) {
            strokeWeight(2);
            w -= 5;
            h -= 5;
        } else {
            strokeWeight(0);
        }

        if (picture) {
            image(picture, 0, 0, w, h);
            noFill();
            stroke(strokeColor);
            rect(0, 0, w, h);
        } else {
            fill(fillColor);
            stroke(strokeColor);
            rect(0, 0, w, h);
        }

        if (textValue) {
            fill(fillText);
            noStroke();
            text(textValue, 0, 0);
        }
        pop();
    }


    return clicked;
}

function calLevel(exp) {
    let level = 1,
        percent = 0;

    let nextLevelExp = 10,
        preLevelExp = 0,
        scale = 1.1;

    while (exp > nextLevelExp) {
        level++;
        preLevelExp = nextLevelExp;
        nextLevelExp += nextLevelExp * scale;
    }

    percent = (exp - preLevelExp) / (nextLevelExp - preLevelExp) * 100;

    return {
        "level": level,
        "percent": percent
    };
}

function showExp(x, y, r, config, hovering, clicked) {
    let { level, percent } = calLevel(player.exps);

    let endAngle = percent / 100 * 360 - 90;
    fill(0, 150, 0);
    stroke(255);
    strokeWeight(hovering ? 3 : 1);
    arc(x, y, r * 2, r * 2, -90, endAngle);

    fill(0);
    stroke(100);
    ellipse(x, y, r);

    fill(255);
    noStroke();
    textSize(20);
    text(level, x, y);

    if (hovering) {
        fill(255, 150);
        textSize(16);
        text("Exps: " + ~~player.exps, mouseX, mouseY + 20);
    }
}

// ========================= SCENES =====================
function Menu() {
    background(0, 150);
    textSize(28);

    let bigRadius = width / 7;
    let smallRadius = width / 10;

    let x1 = bigRadius;
    let y1 = height - x1 - 5;
    if (circleButton(x1, y1, bigRadius, { picture: images['btn-play'] })) {
        scene = "PLAY";
    }

    let x2 = width / 2 - smallRadius - 2;
    let y2 = height - smallRadius - 5;
    if (circleButton(x2, y2, smallRadius, { picture: images['btn-shop'] })) {
        scene = "SHOP";
    }

    let x3 = width / 2 + smallRadius + 2;
    let y3 = height - smallRadius - 5;
    if (circleButton(x3, y3, smallRadius, { picture: images['btn-pet'] })) {
        scene = "PET";
    }

    let x4 = width - bigRadius;
    let y4 = height - bigRadius - 5;
    if (circleButton(x4, y4, bigRadius, { picture: images['btn-bag'] })) {
        scene = "BAG";
    }

    let x5 = width - smallRadius;
    let y5 = height - smallRadius * 4;
    if (circleButton(x5, y5, smallRadius * 0.75, { picture: images['btn-power'] })) {
        scene = "POWER";
    }
}

function Play() {
    background("darkblue");

    image(images['play'], width / 2, height / 2, 100, 100);

    if (button(width / 2, height - 30, width - 10, 50, "BACK TO MENU")) {
        scene = "MENU";
    }
}

function Shop() {
    background("darkgreen");

    image(images['shop'], width / 2, height / 2, 100, 100);

    if (button(width / 2, height - 30, width - 10, 50, "BACK TO MENU")) {
        scene = "MENU";
    }
}

function Pet() {
    background("darkorange");

    image(images['pet'], width / 2, height / 2, 100, 100);

    if (button(width / 2, height - 30, width - 10, 50, "BACK TO MENU")) {
        scene = "MENU";
    }
}

function Bag() {
    background("green");

    image(images['bag'], width / 2, height / 2, 100, 100);

    if (button(width / 2, height - 30, width - 10, 50, "BACK TO MENU")) {
        scene = "MENU";
    }
}

function Power() {
    background("purple");

    image(images['power'], width / 2, height / 2, 100, 100);

    if (button(width / 2, height - 30, width - 10, 50, "BACK TO MENU")) {
        scene = "MENU";
    }
}

function Setting() {
    background("black");

    fill(255);
    text("Setting", width / 2, height / 2);

    if (button(width / 2, height - 30, width - 10, 50, "BACK TO MENU")) {
        scene = "MENU";
    }
}

function About() {
    background("orange");

    fill(255);
    text("About", width / 2, height / 2);

    if (button(width / 2, height - 30, width - 10, 50, "BACK TO MENU")) {
        scene = "MENU";
    }

    if (circleButton(width - 30, 30, 25, { picture: images['github-icon'] })) {
        window.open('https://github.com/hoangTran0410');
    }
}

//  ========================= Main ======================

function preload() {
    images['github-icon'] = loadImage('images/btns/btnGithub.svg');

    images['btn-back'] = loadImage('images/btns/btnBack.png');
    images['btn-play'] = loadImage('images/btns/btnPlay.png');
    images['btn-shop'] = loadImage('images/btns/btnShop.png');
    images['btn-pet'] = loadImage('images/btns/btnPet.png');
    images['btn-bag'] = loadImage('images/btns/btnBag.png');
    images['btn-power'] = loadImage('images/btns/btnPower.png');

    images['play'] = loadImage('images/btns none text/play.png');
    images['shop'] = loadImage('images/btns none text/shop.png');
    images['pet'] = loadImage('images/btns none text/pet.png');
    images['bag'] = loadImage('images/btns none text/bag.png');
    images['power'] = loadImage('images/btns none text/power.png');
}

function setup() {
    let { w, h } = calculateScreenSize()
    createCanvas(w, h);

    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);
    textAlign(CENTER, CENTER);

    getPlayerInfo();
    player.exps += 10;
    savePlayerInfo();
}

function draw() {
    switch (scene) {
        case 'MENU': Menu(); break;
        case 'PLAY': Play(); break;
        case 'SHOP': Shop(); break;
        case 'PET': Pet(); break;
        case 'BAG': Bag(); break;
        case 'POWER': Power(); break;
        case 'SETTING': Setting(); break;
        case 'ABOUT': About(); break;
        default: Menu();
    }

    // if(button(100, 30, 100, 40, `   ${player.coins}`)) {
    //     console.log(`Your coin: ${player.coins}`);
    // }

    if (circleButton(30, 30, 25, { customDisplay: showExp })) {
        alert(`Bạn đã vào web ${~~(player.exps / 10)} lần. Tương ứng ${player.exps} kinh nghiệm.`)
    }

    // player.exps += 0.1;

    showMouse();
    mouseWasPressed = mouseIsPressed;
}

function windowResized() {
    let { w, h } = calculateScreenSize();
    resizeCanvas(w, h, true);
}