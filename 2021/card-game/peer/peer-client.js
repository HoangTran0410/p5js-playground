import { PEER_DATA_EVENTS, POSITION } from '../constant.js';
import {
    SwalForce,
    SwalForceInput,
    SwalLoading,
    SwalToast,
} from '../helper/swal-helper.js';
import PeerHandler from './peer-handler.js';

export default class PeerClient extends PeerHandler {
    constructor() {
        super();
        this.host = null;

        this.init();
    }

    async init() {
        await this.getId();
        await this.connectToHost();
    }

    async connectToHost() {
        try {
            let { value: hostId } = await SwalForceInput.fire({
                title: 'Nhập ID phòng',
            });
            SwalLoading.fire({
                title: 'Đang kết nối tới ' + hostId,
                timer: 5000,
                timerProgressBar: true,
                willClose: () => {
                    if (this.host == null) {
                        this.reconnectToHost();
                    }
                },
            });
            await this.joinRoom(hostId);
            this.setupHostEvents();
            SwalToast.fire({
                icon: 'success',
                title: 'Vào phòng ' + hostId + ' thành công',
            });
        } catch (e) {
            SwalForce.fire({
                icon: 'error',
                title: 'Lỗi',
                text: e,
            });
        }
    }

    async reconnectToHost() {
        await SwalForce.fire({
            icon: 'error',
            title: 'Không thể kết nối',
            text: 'Mất quá nhiều thời gian để kết nối, vui lòng thử lại',
        });
        this.connectToHost();
    }

    setupHostEvents() {
        this.host.on('close', () => {
            SwalForce.fire({
                icon: 'error',
                title: 'Mất kết nối tới chủ phòng',
                text: 'Bạn sẽ được đưa ra sảnh',
            }).then(() => {
                this.connectToHost();
            });
        });

        this.host.on('data', (json) => {
            let { type, data } = JSON.parse(json);

            if (type == PEER_DATA_EVENTS.EJECT) {
                SwalForce.fire({
                    icon: 'error',
                    title: 'Bạn không thể vào phòng',
                    text: data,
                });
            }

            if (type == PEER_DATA_EVENTS.CLIENT_LEAVE) {
                SwalToast.fire({
                    icon: 'error',
                    title: data + ' đã thoát',
                });
            }
            if (type == PEER_DATA_EVENTS.CLIENT_JOIN) {
                SwalToast.fire({
                    icon: 'info',
                    title: data + ' đã vào phòng',
                });
            }
            if (type == PEER_DATA_EVENTS.START_GAME) {
                this.startGame(data);
            }
            if(type == PEER_DATA_EVENTS.GIVEOUT) {
                
            }
        });
    }

    joinRoom(id) {
        return new Promise((resolve, reject) => {
            let host = this.peer.connect(id);
            host.on('open', () => {
                console.log('~ Connected to host ' + host.peer);
                this.host = host;
                resolve(true);
            });
        });
    }

    startGame() {
        this.game.addPlayer(this.id, POSITION.BOTTOM);
        this.game.addPlayer(this.host.peer, POSITION.TOP);
        this.game.newGame();
    }

    sendToHost(type, data) {
        this.host.send(type, data);
    }

    onReceiveData(func) {
        this.opponent.on('data', (json) => {
            console.log('+ Received data: ' + json);
            func(json);
        });
    }
}
