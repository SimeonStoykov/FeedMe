const net = require('net');

const host = '192.168.99.100';
const port = 8282;

let tcpClient = new net.Socket();

let eventsData = [];

tcpClient.connect(port, host, () => {
	console.log('Connected');
});

tcpClient.on('data', (buffer) => {
    let receivedData = buffer.toString();
    let dataArr = receivedData.split('\n');
    dataArr = dataArr.filter(rec => rec != '');

    for (let i = 0; i < dataArr.length; i++) {
        let currentData = dataArr[i];
        console.log(dataArr[i]);
    }
    // let reversedData = data.toString().split('').reverse().join('');
    // let dataParts = reversedData.split('/\|(?!\\)/g');
    // dataParts.map((rec) => {
    //     return rec.reverse();
    // })
    // console.log(dataParts);
    tcpClient.destroy();
});

tcpClient.on('close', () => {
	console.log('Connection closed');
});
