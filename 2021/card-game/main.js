import { SwalForce } from './helper/swal-helper.js';
import PeerHost from './peer/peer-host.js';
import PeerClient from './peer/peer-client.js';

let peerHandler;

window.setup = async () => {
    createCanvas(min(windowWidth, 800), min(windowHeight, 600));
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textFont('Consolas');
    textStyle('bold');

    let { value: hostmode } = await SwalForce.fire({
        title: 'Chào mừng tới CardGame',
        text: 'Tiến Lên Miền Nam',
        showCancelButton: true,
        confirmButtonText: 'Tạo phòng',
        cancelButtonText: 'Vào phòng',
    });

    if (hostmode) {
        peerHandler = new PeerHost();
    } else {
        peerHandler = new PeerClient();
    }
};

window.draw = () => {
    background(50);

    peerHandler && peerHandler.run();

    showFPS();
};

window.mouseClicked = () => {
    peerHandler && peerHandler.onMouseClicked();
};

function showFPS() {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text(~~frameRate(), 15, 15);
}
