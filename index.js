const net = require('net');
let { host, port } = require('./config');

function reverseStr(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return str.split('').reverse().join('');
}

let events = [];
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
        // console.log(currentData);
        let dataElements = reverseStr(currentData).split(/\|(?!\\)/g).filter(rec => rec !== '').reverse().map(rec => reverseStr(rec).replace(/\\\|/g, '|'));
        // console.log(dataElements);
        let msgId = Number(dataElements[0]);
        let operation = dataElements[1];
        let type = dataElements[2];
        let timestamp = Number(dataElements[3]);

        if (operation === 'create') {
            switch (type) {
                case 'event': {
                    events.push({
                        eventId: dataElements[4],
                        category: dataElements[5],
                        subCategory: dataElements[6],
                        name: dataElements[7],
                        startTime: Number(dataElements[8]),
                        displayed: dataElements[9] === '1',
                        suspended: dataElements[10] === '1',
                        markets: []
                    });
                }
                break;
                case 'market': {
                    let event = events.find(rec => rec.eventId === dataElements[4]);
                    if (event) {
                        event.markets.push({
                            eventId: dataElements[4],
                            marketId: dataElements[5],
                            name: dataElements[6],
                            displayed: dataElements[7] === '1',
                            suspended: dataElements[8] === '1',
                            outcomes: []
                        });
                    }
                }
                break;
                case 'outcome': {
                    for (let i = 0; i < events.length; i++) {
                        let currentEvent = events[i];
                        let market = currentEvent.markets.find(rec => rec.marketId === dataElements[4]);
                        if (market) {
                            market.outcomes.push({
                                marketId: dataElements[4],
                                outcomeId: dataElements[5],
                                name: dataElements[6],
                                price: dataElements[7],
                                displayed: dataElements[8] === '1',
                                suspended: dataElements[9] === '1'
                            });
                            break;
                        }
                    }
                }
                break;
            }
        } else if (operation === 'update') {
            
        }
    }

    console.log(events);

    // tcpClient.destroy();
});

tcpClient.on('close', () => {
	console.log('Connection closed');
});
