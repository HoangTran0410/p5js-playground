function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

let peer = new Peer(uuidv4(), {
    secure: true,
    host: 'hoang-peerjs-server.herokuapp.com',
    port: 443,
    debug: 2,
});
let other;

peer.on('open', function (id) {
    document.getElementById('myid').innerHTML = id;
});
peer.on('disconnected', function () {
    addLog('Connection lost. Please reconnect');
    peer.reconnect();
});
peer.on('close', function () {
    addLog('Connection destroyed');
});
peer.on('error', function (err) {
    addLog(err);
});

peer.on('connection', function (c) {
    // Sender does not accept incoming connections
    // Receiver allow only a single connection
    other = c;
    setupEvents();
});

function connect(id) {
    addLog('~ Connecting...');

    other = peer.connect(id, {
        reliable: true,
    });

    setupEvents();
}

function setupEvents() {
    other.on('open', function () {
        addLog('~ Connected to ' + other.peer);
    });
    other.on('data', function (data) {
        addLog('+ Received data: ' + data);
    });
    other.on('close', function () {
        addLog('- Connection closed.');
    });
}

function addLog(t) {
    document.getElementById('txlog').value += t + '\n';
}

function connectInp() {
    let id = document.getElementById('inp').value;
    connect(id);
}

function sendMsg() {
    let inp = document.getElementById('msgInp')
    let msg = inp.value;
    inp.value = '';

    if (other) {
        other.send(msg);
        addLog('+ Send data: ' + msg);
    } else {
        addLog('x Not connected yet.');
    }
}
