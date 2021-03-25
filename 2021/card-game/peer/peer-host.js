import { PEER_DATA_EVENTS, POSITION, TURNS } from '../constant.js';
import Button from '../helper/button.js';
import { sleep } from '../helper/helper.js';
import { SwalForce, SwalToast } from '../helper/swal-helper.js';
import PeerHandler from './peer-handler.js';

export default class PeerHost extends PeerHandler {
    constructor() {
        super();
        this.clients = [];

        this.gameStarted = false;

        this.initUI();
        this.init();
    }

    initUI() {
        this.startGameBtn = new Button(
            'Start Game',
            width / 2,
            height / 2,
            150,
            50
        )
            .visibleIf(() => !this.gameStarted)
            .activeIf(() => this.clients.length >= 1)
            .onMouseClicked(this.startGame.bind(this));
    }

    async init() {
        await this.getId();

        SwalForce.fire({
            icon: 'success',
            title: 'Id phòng: ' + this.id,
            text: 'Chia sẻ ID này với bạn bè để cùng chơi nhé',
        });

        // on client join room
        this.peer.on('connection', (c) => {
            console.log(this.clients);
            if (this.clients.length >= 1) {
                setTimeout(() => {
                    this.sendToClient(
                        c,
                        PEER_DATA_EVENTS.EJECT,
                        'Phòng đã đủ 4 người'
                    );
                    setTimeout(() => {
                        c.close();
                    }, 2000);
                }, 1000);
            } else {
                this.setupClientEvents(c);
                this.clients.push(c);
                SwalToast.fire({
                    icon: 'info',
                    title: c.peer + ' đã vào phòng',
                });
                this.broadcast(PEER_DATA_EVENTS.CLIENT_JOIN, c.peer);
            }
        });
    }

    async startGame() {
        this.game.addPlayer(this.id, POSITION.BOTTOM);
        this.clients[0] && this.game.addPlayer(this.id, POSITION.TOP);
        // this.clients[1] && this.game.addPlayer(this.id, POSITION.RIGHT);
        // this.clients[2] && this.game.addPlayer(this.id, POSITION.LEFT);

        this.broadcast(PEER_DATA_EVENTS.START_GAME);

        await sleep(1000);

        await this.game.newGame((player, card) => {
            this.broadcast(PEER_DATA_EVENTS.GIVEOUT, {
                player: player.name,
                card: {
                    suit: card.suit,
                    value: card.value,
                },
            });
        });

        this.gameStarted = true;
    }

    setupClientEvents(client) {
        client.on('close', () => {
            SwalToast.fire({
                icon: 'error',
                title: client.peer + ' đã thoát',
            });
            this.broadcast(PEER_DATA_EVENTS.CLIENT_LEAVE, client.peer);
            this.clients.splice(this.clients.indexOf(client));
        });
        client.on('data', (json) => {
            console.log(json);
        });
    }

    sendToClient(client, type, data) {
        client.send(JSON.stringify({ type, data }));
    }

    broadcast(type, data) {
        for (let c of this.clients) {
            c.send(JSON.stringify({ type, data }));
        }
    }

    run() {
        super.run();
        this.startGameBtn.show();
    }

    onMouseClicked() {
        super.onMouseClicked();
        this.startGameBtn.handleMouseClicked();
    }
}
