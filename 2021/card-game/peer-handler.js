function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

const peer = new Peer(uuidv4(), { debug: 2 });
let conn;
let sender;

peer.on('open', function (id) {
    console.log('my id:', id);
    document.getElementById('myid').innerHTML = id;
});

peer.on('connection', function (c) {
    // Sender does not accept incoming connections
    // Receiver allow only a single connection
    c.on('open', function () {
        c.send('Hello from open');
    });

    c.on('data', function (data) {
        console.log('Receive data: ', data);
    });

    c.on('close', function () {
        console.log('Connection reset<br>Awaiting connection...');
        conn = null;
    });

    console.log('Connected to: ' + c.peer);
    conn = c;
});

peer.on('disconnected', function () {
    console.log('Connection lost. Please reconnect');
    peer.reconnect();
});
peer.on('close', function () {
    console.log('Connection destroyed');
});
peer.on('error', function (err) {
    console.log(err);
    alert('' + err);
});

function connect(id) {
    sender = peer.connect(id, {
        reliable: true,
    });

    sender.on('open', function () {
        console.log('Connected to ', sender.peer);
    });

    sender.on('data', function (data) {
        console.log('Received data: ', data);
    });

    sender.on('close', function () {
        console.log('Connection closed.');
    });
}

function connectInp() {
    let id = document.getElementById('inp').value;
    connect(id);
}
