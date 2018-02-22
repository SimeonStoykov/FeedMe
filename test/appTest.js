const { assert } = require('chai');
const sinon = require('sinon');
const net = require('net');

describe('App tests', () => {
    it('should ...', done => {
        var socket = new net.Socket();
        var stub = sinon.stub(socket, 'write').callsFake(function (data, encoding, cb) {
            this.emit('data', data);
        });

        socket.on('data', function(data) {
            assert.equal(data, 'foo');
            done();
        });

        socket.write('foo1');
    })
});