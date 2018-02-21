const net = require('net');
let { host, port } = require('./config');

function reverseStr(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return str.split('').reverse().join('');
}

let eventsData = [];
let previousData = '';

let tcpClient = new net.Socket();

tcpClient.connect(port, host, () => {
	console.log('Connected');
});

tcpClient.on('data', buffer => {
    let receivedData = buffer.toString();
    let lastNewLine = receivedData.lastIndexOf('\n');
    let wholeData = previousData + receivedData.substring(0, lastNewLine);
    let unprocessedData = receivedData.substring(lastNewLine + 1);

    previousData = unprocessedData;
    let dataArr = wholeData.split('\n').filter(rec => rec != '');

    for (let i = 0; i < dataArr.length; i++) {
        let currentData = dataArr[i];
        console.log(currentData);
        let dataElements = reverseStr(currentData).split(/\|(?!\\)/g).filter(rec => rec !== '').reverse().map(rec => reverseStr(rec).replace(/\\\|/g, '|'));
        // console.log(dataElements);
        let msgId = dataElements[0];
        let operation = dataElements[1];
        let type = dataElements[2];
        let timestamp = dataElements[3];

        if (operation === 'create' && type === 'event') {
            eventsData.push({
                eventId: dataElements[4],
                category: dataElements[5],
                subCategory: dataElements[6],
                name: dataElements[7],
                startTime: dataElements[8],
                display: dataElements[9],
                suspended: dataElements[10],
                markets: []
            });

            console.log(eventsData);
        }
    }

    // tcpClient.destroy();
});

tcpClient.on('close', () => {
	console.log('Connection closed');
});
