function reverseStr(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return str.split('').reverse().join('');
}

module.exports = function (data, events, previousData, database) {
    let receivedData = data.toString();
    let lastNewLine = receivedData.lastIndexOf('\n');
    let wholeData = previousData + receivedData.substring(0, lastNewLine);
    let unprocessedData = receivedData.substring(lastNewLine + 1);

    previousData = unprocessedData;
    let dataArr = wholeData.split('\n').filter(rec => rec != '');

    for (let i = 0; i < dataArr.length; i++) {
        let currentData = dataArr[i];
        let dataElements = reverseStr(currentData).split(/\|(?!\\)/g).filter(rec => rec !== '').reverse().map(rec => reverseStr(rec).replace(/\\\|/g, '|'));

        let msgId = parseInt(dataElements[0]);
        let operation = dataElements[1];
        let type = dataElements[2];
        let timestamp = parseInt(dataElements[3]);

        if (operation === 'create') {
            switch (type) {
                case 'event': {
                    let event = {
                        eventId: dataElements[4],
                        category: dataElements[5],
                        subCategory: dataElements[6],
                        name: dataElements[7],
                        startTime: parseInt(dataElements[8]),
                        displayed: dataElements[9] === '1',
                        suspended: dataElements[10] === '1',
                        markets: []
                    };

                    if (database) {
                        database.collection('events').insertOne(event);
                    } else if (events) { // Unit testing with in memory object
                        events.push(event);
                    }
                }
                    break;
                case 'market': {
                    let market = {
                        eventId: dataElements[4],
                        marketId: dataElements[5],
                        name: dataElements[6],
                        displayed: dataElements[7] === '1',
                        suspended: dataElements[8] === '1',
                        outcomes: []
                    };

                    if (database) {
                        database.collection('markets').insertOne(market);
                    } else if (events) { // Unit testing with in memory object
                        let event = events.find(rec => rec.eventId === market.eventId);
                        event && event.markets.push(market);
                    }
                }
                    break;
                case 'outcome': {
                    let outcome = {
                        marketId: dataElements[4],
                        outcomeId: dataElements[5],
                        name: dataElements[6],
                        price: dataElements[7],
                        displayed: dataElements[8] === '1',
                        suspended: dataElements[9] === '1'
                    };

                    if (database) {
                        database.collection('outcomes').insertOne(outcome);
                    } else if (events) { // Unit testing with in memory object
                        for (let i = 0; i < events.length; i++) {
                            let currentEvent = events[i];
                            let market = currentEvent.markets.find(rec => rec.marketId === outcome.marketId);
                            if (market) {
                                market.outcomes.push(outcome);
                                break;
                            }
                        }
                    }
                }
                    break;
            }
        } else if (operation === 'update') {
            switch (type) {
                case 'event': {
                    let newEventData = {
                        category: dataElements[5],
                        subCategory: dataElements[6],
                        name: dataElements[7],
                        startTime: parseInt(dataElements[8]),
                        displayed: dataElements[9] === '1',
                        suspended: dataElements[10] === '1'
                    }

                    if (database) {
                        database.collection('events').updateOne({ eventId: dataElements[4] }, { $set: newEventData });
                    } else if (events) { // Unit testing with in memory object
                        let existingEvent = events.find(rec => rec.eventId === dataElements[4]);
                        if (existingEvent) {
                            existingEvent.category = newEventData.category;
                            existingEvent.subCategory = newEventData.subCategory;
                            existingEvent.name = newEventData.name;
                            existingEvent.startTime = newEventData.startTime;
                            existingEvent.displayed = newEventData.displayed;
                            existingEvent.suspended = newEventData.suspended;
                        }
                    }
                }
                    break;
                case 'market': {
                    let newMarketData = {
                        name: dataElements[6],
                        displayed: dataElements[7] === '1',
                        suspended: dataElements[8] === '1'
                    };

                    if (database) {
                        database.collection('markets').updateOne({ marketId: dataElements[5] }, { $set: newMarketData });
                    } else if (events) { // Unit testing with in memory object
                        let event = events.find(rec => rec.eventId === dataElements[4]);
                        if (event) {
                            let existingMarket = event.markets.find(rec => rec.marketId === dataElements[5]);
                            if (existingMarket) {
                                existingMarket.name = newMarketData.name;
                                existingMarket.displayed = newMarketData.displayed;
                                existingMarket.suspended = newMarketData.suspended;
                            }
                        }
                    }
                }
                    break;
                case 'outcome': {
                    let newOutcomeData = {
                        name: dataElements[6],
                        price: dataElements[7],
                        displayed: dataElements[8] === '1',
                        suspended: dataElements[9] === '1'
                    };

                    if (database) {
                        database.collection('outcomes').updateOne({ outcomeId: dataElements[5] }, { $set: newOutcomeData });
                    } else if (events) {
                        for (let i = 0; i < events.length; i++) {
                            let currentEvent = events[i];
                            let market = currentEvent.markets.find(rec => rec.marketId === dataElements[4]);
                            if (market) {
                                let existingOutcome = market.outcomes.find(rec => rec.outcomeId === dataElements[5]);
                                if (existingOutcome) {
                                    existingOutcome.name = newOutcomeData.name;
                                    existingOutcome.price = newOutcomeData.price;
                                    existingOutcome.displayed = newOutcomeData.displayed;
                                    existingOutcome.suspended = newOutcomeData.suspended;
                                    break;
                                }
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