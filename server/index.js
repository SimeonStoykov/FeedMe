const net = require('net');
let { appConfig, mongodb } = require('./config');
let processData = require('./processData');

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let httpServer = require('http').Server(app);
let io = require('socket.io')(httpServer);

let previousData = '';
let database;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

let httpPort = process.env.PORT || 8787;

let router = express.Router();

router.get('/events', (req, res) => {
    let category = req.query.category || '';
    let subCategory = req.query.subCategory || '';
    let events = [];
    let perPage = 10;
    let page = req.params.page || 1;

    let cursor = database.collection('events').find({category, subCategory, displayed: true}).limit(perPage);
        // .skip((perPage * page) - perPage)
        // .limit(perPage);
        // .exec(function (err, events) {
        //     cursor.count().exec(function(err, count) {
        //         if (err) return next(err);
        //         res.json({
        //             events,
        //             current: page,
        //             pages: Math.ceil(count / perPage)
        //         });
        //     })
        // });
        cursor.forEach((doc, err) => {
            if (err) throw err;
            events.push(doc);
        }, () => {
            res.json({ 
                events,
                // pagination: {
                //     page,
                //     perPage,
                // }
            });
        });
});

app.use('/api', router);

let tcpClient = new net.Socket();

let MongoClient = require('mongodb').MongoClient;

MongoClient.connect(mongodb.url, (err, client) => {
    if (err) throw err;
    console.log("Database created!");

    database = client.db("EventsDb");

    tcpClient.connect(appConfig.port, appConfig.host, () => {
        console.log('TCP Client Connected!');
    });

    httpServer.listen(httpPort);
    console.log('HTTP server listens on port ' + httpPort);
});

tcpClient.on('data', buffer => {
    let result = processData(buffer, undefined, previousData, database, io);
    previousData = result.previousData;
});

tcpClient.on('close', () => {
    console.log('Connection closed');
});

// TO DO:
// 1. Emit events when market or outcome is created/updated and check in the client if this market/outcome is in the events array and if it is in it update it
// 3. Show Load more button to load another 10 events
// 4. On event click open the event details + outcomes
