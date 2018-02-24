const net = require('net');
let { app, mongodb } = require('./config');
let processData = require('./processData');

let previousData = '';
let database;

let tcpClient = new net.Socket();

let MongoClient = require('mongodb').MongoClient;

MongoClient.connect(mongodb.url, (err, client) => {
    if (err) throw err;
    console.log("Database created!");

    database = client.db("EventsDb");

    tcpClient.connect(app.port, app.host, () => {
        console.log('TCP Client Connected!');
    });
});

tcpClient.on('data', buffer => {
    let result = processData(buffer, undefined, previousData, database);
    previousData = result.previousData;
});

tcpClient.on('close', () => {
    console.log('Connection closed');
});
