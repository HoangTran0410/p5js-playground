import { PEERJS_SERVER } from '../constant.js';
import { SwalLoading, SwalForce } from '../helper/swal-helper.js';
import Game from '../game/game.js';

export default class PeerHandler {
    constructor() {
        this.id = null;
        this.peer = null;
        this.game = new Game();
    }

    async getId() {
        try {
            SwalLoading.fire({
                title: 'Đang kết nối...',
                text: 'Chúng tôi đang lấy ID về cho bạn',
            });

            this.id = await this.connectServer();
        } catch (e) {
            SwalForce.fire({
                icon: 'error',
                title: 'Lỗi',
                text: e,
            });
        }
    }

    connectServer() {
        return new Promise((resolve, reject) => {
            this.peer = new Peer(null, {
                secure: PEERJS_SERVER.SECURE,
                host: PEERJS_SERVER.HOST,
                port: PEERJS_SERVER.PORT,
                debug: 2,
            });

            this.peer.on('open', (id) => {
                this.id = id;
                resolve(id);
            });

            this.peer.on('error', (err) => {
                reject(err);
            });

            // this.peer.on('disconnected', () => {
            //     this.peer.reconnect();
            //     Swal.fire({
            //         title: 'Mất kết nối',
            //         text: 'Đang kết nối lại..',
            //         icon: 'error',
            //     });
            // });

            // this.peer.on('close', () => {
            //     Swal.fire({
            //         title: 'Kết nối bị ngắt',
            //         text: 'Bạn sẽ được đưa ra khỏi phòng.',
            //         icon: 'error',
            //     });
            // });
        });
    }

    run() {
        this.game.update();
        this.game.show();
    }

    onMouseClicked() {
        this.game.onMouseClicked();
    }
}
