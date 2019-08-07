'use strict';

const EventEmitter = require('events').EventEmitter;

class LDJClient extends EventEmitter {
    constructor(stream) {
        super();
        if (stream === null || typeof stream !== 'object') {
            throw new Error('Invalid stream.');
        }
        let buffer = '';
        stream.on('data', data => {
            buffer += data;
            let boundary = buffer.indexOf('\n');
            while (boundary !== -1) {
                const input = buffer.substring(0, boundary);
                buffer = buffer.substring(boundary + 1);
                this.emit('message', LDJClient.jsonParse(input));
                boundary = buffer.indexOf('\n');
            }
        });
        stream.on('close', () => {
            let boundary = buffer.indexOf('\n');
            if (!buffer) {
                return;
            }
            if (boundary === -1) {
                buffer += '\n';
            }
            this.emit('message', LDJClient.jsonParse(buffer));
        });
    }

    static jsonParse(str) {
        try {
            return JSON.parse(str);   
        } catch(e) {
            return {type:"invalid-json"};
        }
    }

    static connect(stream) {
        return new LDJClient(stream);
    }
}

module.exports = LDJClient;  
