'use strict';

const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client.js');

describe('LDJClient', () => {
    let stream = null;
    let client = null;

    beforeEach(() => {
        stream = new EventEmitter();
        client = new LDJClient(stream);
    });

    it('should emit a message event from a single data event', done => {
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data', '{"foo": "bar"}\n');
    });

    it('should emit a message event from split data events', done => {
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data', '{"foo":');
        process.nextTick(() => stream.emit('data', '"bar"}\n'));
    });

    it('should emit a message event from split over two (or more) data events', done => {
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'hello wonderful world!'});
            done();
        });
        stream.emit('data', '{"foo":');
        process.nextTick(() => stream.emit('data', '"hello'));
        process.nextTick(() => stream.emit('data', ' wonderful '));
        process.nextTick(() => stream.emit('data', 'world!"}\n'));
    });

    it('should throw an error when LDJClient is instantiated with a null stream', () => {
        expect(() => {
            new LDJClient(null);   
        }).toThrowError(new Error('Invalid stream.')); 
    });

    it('should throw an error if message is not properly formatted JSON string', done => {
        client.on('message', message => {
            assert.deepEqual(message, {type: "invalid-json"});
            done();
        });
        stream.emit('data', '"foo":"bar"\n');
    });

    it('should append a newline character if buffer needs one', done => {
        client.on('message', message => {
            assert.deepEqual(message, {hello: "world!"});
            done();
        });
        stream.emit('data', '{"hello":');
        process.nextTick(() => stream.emit('data', '"world!"'));
        process.nextTick(() => stream.emit('data', '}'));
        process.nextTick(() => stream.emit('close'));
    });
});
