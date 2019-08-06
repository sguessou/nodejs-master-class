'use strict';

const fs = require('fs');
const spawn = require('child_process').spawn;
const filename = process.argv[2];

if (!filename) {
    throw Error('A file to watch must be specified!');
}

const cmd = process.argv[3];
let params = process.argv;
params = params.splice(4);

fs.watch(filename, () => {
    const ls = spawn(process.argv[3], [...params, filename]);
    let output = '';

    ls.stdout.on('data', chunk => output += chunk);

    ls.on('close', () => {
        const parts = output.split(/\s+/);
        console.log([parts[0], parts[4], parts[8]]);
    });
});

console.log(`Now watching ${filename} for changes...`);
