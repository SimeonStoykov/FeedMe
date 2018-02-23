const net = require('net');
let { host, port } = require('./config');
let processData = require('./processData');

let events = [];
let previousData = '';

let tcpClient = new net.Socket();

tcpClient.connect(port, host, () => {
	console.log('Connected');
});

tcpClient.on('data', buffer => {
    let result = processData(buffer, events, previousData);
    events = result.events;
    previousData = result.previousData;
});

tcpClient.on('close', () => {
	console.log('Connection closed');
});
