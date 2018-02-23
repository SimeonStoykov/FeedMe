const assert = require('chai').assert;
const sinon = require('sinon');
const net = require('net');
const processData = require('../processData');

let socket, events, previousData;

beforeEach(function() {
    events = [];
    previousData = '';
    socket = new net.Socket();
    let stub = sinon.stub(socket, 'write').callsFake(function (data, encoding, cb) {
        this.emit('data', data);
    });
});

describe('Create event tests', () => {
    it('should have 1 element in the events array after creating only 1 event', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            assert.equal(result.events.length, 1);
            done();
        });

        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n');
    });
    it('after adding only one event, the first element in the events array should have the same eventId as the added event', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            assert.equal(result.events[0].eventId, 'ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2');
            done();
        });

        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n');
    });
    it('should have empty markets array for certain event, after creating this event', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            assert.equal(result.events[0].markets.length, 0);
            done();
        });

        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n');
    });
});

describe('Create market tests', () => {
    it('should have 1 element in the markets array for certain event after creating only 1 market for it', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            let markets = result.events[0].markets;
            assert.equal(markets.length, 1);
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|create|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|0|1|\n');
    });
    it('should have empty otucomes array for certain market, after creating this market', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            let market = result.events[0].markets[0];
            assert.equal(market.outcomes.length, 0);
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|create|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|0|1|\n');
    });
});

describe('Create outcome tests', () => {
    it('should have 1 element in the otucomes array for certain market after creating only 1 outcome for that market', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            let outcomes = result.events[0].markets[0].outcomes;
            assert.equal(outcomes.length, 1);
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|create|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|0|1|\n|2056|create|outcome|1519393570267|69982adf-e93e-4c74-b5e6-0c66a596a9f1|560e59f1-6c2b-4d59-b22a-0c7e246e9e0e|\\|Accrington\\||1/20|0|1|\n');
    });
});

describe('Update event tests', () => {
    it('should change the subcategory of an event', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            assert.equal(result.events[0].subCategory, 'Sky Bet League Five');
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|update|event|1497359166355|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Five|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n');
    });
    it('should change the displayed property of an event to true', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            assert.equal(result.events[0].displayed, true);
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|update|event|1497359166355|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|1|1|\n');
    });
    it('should change the suspended property of an event to false', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            assert.equal(result.events[0].suspended, false);
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|update|event|1497359166355|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|0|\n');
    });
});

describe('Update market tests', () => {
    it('should change the displayed property of a market to true', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            let market = result.events[0].markets[0];
            assert.equal(market.displayed, true);
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|create|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|0|1|\n|2056|update|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|1|1|\n');        
    });
    it('should change the suspended property of a market to false', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            let market = result.events[0].markets[0];
            assert.equal(market.suspended, false);
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|create|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|0|1|\n|2056|update|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|0|0|\n');        
    });
});

describe('Update outcome tests', () => {
    it('should change the price of an outcome', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            let outcome = result.events[0].markets[0].outcomes[0];
            assert.equal(outcome.price, '1/22');
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|create|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|0|1|\n|2056|create|outcome|1519393570267|69982adf-e93e-4c74-b5e6-0c66a596a9f1|560e59f1-6c2b-4d59-b22a-0c7e246e9e0e|\\|Accrington\\||1/20|0|1|\n|2057|update|outcome|1519393570267|69982adf-e93e-4c74-b5e6-0c66a596a9f1|560e59f1-6c2b-4d59-b22a-0c7e246e9e0e|\\|Accrington\\||1/22|0|1|\n');        
    });
    it('should change the displayed property of an outcome to true', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            let outcome = result.events[0].markets[0].outcomes[0];
            assert.equal(outcome.displayed, true);
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|create|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|0|1|\n|2056|create|outcome|1519393570267|69982adf-e93e-4c74-b5e6-0c66a596a9f1|560e59f1-6c2b-4d59-b22a-0c7e246e9e0e|\\|Accrington\\||1/20|0|1|\n|2057|update|outcome|1519393570267|69982adf-e93e-4c74-b5e6-0c66a596a9f1|560e59f1-6c2b-4d59-b22a-0c7e246e9e0e|\\|Accrington\\||1/20|1|1|\n');        
    });
    it('should change the suspended of an outcome to false', done => {
        socket.on('data', data => {
            let result = processData(data, events, previousData);
            let outcome = result.events[0].markets[0].outcomes[0];
            assert.equal(outcome.suspended, false);
            done();
        });
    
        socket.write('|2054|create|event|1497359166352|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|Football|Sky Bet League Two|\\|Accrington\\| vs \\|Cambridge\\||1497359216693|0|1|\n|2055|create|market|1519390963565|ee4d2439-e1c5-4cb7-98ad-9879b2fd84c2|69982adf-e93e-4c74-b5e6-0c66a596a9f1|Full Time Result|0|1|\n|2056|create|outcome|1519393570267|69982adf-e93e-4c74-b5e6-0c66a596a9f1|560e59f1-6c2b-4d59-b22a-0c7e246e9e0e|\\|Accrington\\||1/20|0|1|\n|2057|update|outcome|1519393570267|69982adf-e93e-4c74-b5e6-0c66a596a9f1|560e59f1-6c2b-4d59-b22a-0c7e246e9e0e|\\|Accrington\\||1/20|0|0|\n');        
    });
});
