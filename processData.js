module.exports = function (data, events, previousData) {
    function reverseStr(str) {
        if (typeof str !== 'string') {
            return str;
        }
        return str.split('').reverse().join('');
    }

    let receivedData = data.toString();
    let lastNewLine = receivedData.lastIndexOf('\n');
    let wholeData = previousData + receivedData.substring(0, lastNewLine);
    let unprocessedData = receivedData.substring(lastNewLine + 1);

    previousData = unprocessedData;
    let dataArr = wholeData.split('\n').filter(rec => rec != '');

    for (let i = 0; i < dataArr.length; i++) {
        let currentData = dataArr[i];
        let dataElements = reverseStr(currentData).split(/\|(?!\\)/g).filter(rec => rec !== '').reverse().map(rec => reverseStr(rec).replace(/\\\|/g, '|'));

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
            switch (type) {
                case 'event': {
                    let existingEvent = events.find(rec => rec.eventId === dataElements[4]);
                    if (existingEvent) {
                        let newStartTime = Number(dataElements[8]);
                        let newDisplayed = dataElements[9] === '1';
                        let newSuspended = dataElements[10] === '1';
                        existingEvent.category !== dataElements[5] && (existingEvent.category = dataElements[5]);
                        existingEvent.subCategory !== dataElements[6] && (existingEvent.subCategory = dataElements[6]);
                        existingEvent.name !== dataElements[7] && (existingEvent.name = dataElements[7]);
                        existingEvent.startTime !== newStartTime && (existingEvent.startTime = newStartTime);
                        existingEvent.displayed !== newDisplayed && (existingEvent.displayed = newDisplayed);
                        existingEvent.suspended !== newSuspended && (existingEvent.suspended = newSuspended);
                    }
                }
                break;
                case 'market': {
                    let event = events.find(rec => rec.eventId === dataElements[4]);
                    if (event) {
                        let existingMarket = event.markets.find(rec => rec.marketId === dataElements[5]);
                        if (existingMarket) {
                            let newDisplayed = dataElements[7] === '1';
                            let newSuspended = dataElements[8] === '1';
                            existingMarket.name !== dataElements[6] && (existingMarket.name = dataElements[6]);
                            existingMarket.displayed !== newDisplayed && (existingMarket.displayed = newDisplayed);
                            existingMarket.suspended !== newSuspended && (existingMarket.suspended = newSuspended);
                        }
                    }
                }
                break;
                case 'outcome': {
                    for (let i = 0; i < events.length; i++) {
                        let currentEvent = events[i];
                        let market = currentEvent.markets.find(rec => rec.marketId === dataElements[4]);
                        if (market) {
                            let existingOutcome = market.outcomes.find(rec => rec.outcomeId === dataElements[5]);
                            if (existingOutcome) {
                                let newDisplayed = dataElements[8] === '1';
                                let newSuspended = dataElements[9] === '1';
                                existingOutcome.name !== dataElements[6] && (existingOutcome.name = dataElements[6]);
                                existingOutcome.price !== dataElements[7] && (existingOutcome.price = dataElements[7]);
                                existingOutcome.displayed !== newDisplayed && (existingOutcome.displayed = newDisplayed);
                                existingOutcome.suspended !== newSuspended && (existingOutcome.suspended = newSuspended);
                                break;
                            }
                        }
                    }
                }
                break;
            }
        }
    }

    return { events, previousData };
}