#! /usr/bin/env node

var fs = require('fs'),
    path = __dirname + '/',
    dataToWrite = [
        {
            name: 'data.int8',
            buffer: new Buffer(18),
            values: [ -127, -64, -32, -16, -8, -4, -3, -2, 0, 1, 2, 3, 4, 8, 16, 32, 64, 127 ],
            BYTES_PER_ELEMENT: 1,
            method: 'writeInt8'
        },{
            name: 'data.uint8',
            buffer: new Buffer(8),
            values: [ 0, 2, 1, 3, 5, 4, 255, 128 ],
            BYTES_PER_ELEMENT: 1,
            method: 'writeUInt8'
        },{
            name: 'data.int16.le',
            buffer: new Buffer(14),
            values: [ -32500, -1024, -512, 0, 512, 1024, 32500],
            BYTES_PER_ELEMENT: 2,
            method: 'writeInt16LE'
        },{
            name: 'data.uint16.le',
            buffer: new Buffer(18),
            values: [ 0, 512, 1024, 2048, 4096, 9192, 16384, 32768, 65535],
            BYTES_PER_ELEMENT: 2,
            method: 'writeUInt16LE'
        },{
            name: 'data.int32.le',
            buffer: new Buffer(36),
            values: [ -65000, -32500, -1024, -512, 0, 512, 1024, 32500, 65000],
            BYTES_PER_ELEMENT: 4,
            method: 'writeInt32LE'
        },{
            name: 'data.uint32.le',
            buffer: new Buffer(40),
            values: [ 0, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65535, 131071],
            BYTES_PER_ELEMENT: 4,
            method: 'writeUInt32LE'
        },{
            name: 'data.float32.le',
            buffer: new Buffer(20),
            values: [ 0, 512.1024, 2048.4096, 8192.16384, 32768.65535],
            BYTES_PER_ELEMENT: 4,
            method: 'writeFloatLE'
        },{
            name: 'data.float64.le',
            buffer: new Buffer(40),
            values: [ 0, 512.1024, 2048.4096, 8192.16384, 32768.65535],
            BYTES_PER_ELEMENT: 8,
            method: 'writeDoubleLE'
        },{
            name: 'data.int16.be',
            buffer: new Buffer(14),
            values: [ -32500, -1024, -512, 0, 512, 1024, 32500],
            BYTES_PER_ELEMENT: 2,
            method: 'writeInt16BE'
        },{
            name: 'data.uint16.be',
            buffer: new Buffer(18),
            values: [ 0, 512, 1024, 2048, 4096, 9192, 16384, 32768, 65535],
            BYTES_PER_ELEMENT: 2,
            method: 'writeUInt16BE'
        },{
            name: 'data.int32.be',
            buffer: new Buffer(36),
            values: [ -65000, -32500, -1024, -512, 0, 512, 1024, 32500, 65000],
            BYTES_PER_ELEMENT: 4,
            method: 'writeInt32BE'
        },{
            name: 'data.uint32.be',
            buffer: new Buffer(40),
            values: [ 0, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65535, 131071],
            BYTES_PER_ELEMENT: 4,
            method: 'writeUInt32BE'
        },{
            name: 'data.float32.be',
            buffer: new Buffer(20),
            values: [ 0, 512.1024, 2048.4096, 8192.16384, 32768.65535],
            BYTES_PER_ELEMENT: 4,
            method: 'writeFloatBE'
        },{
            name: 'data.float64.be',
            buffer: new Buffer(40),
            values: [ 0, 512.1024, 2048.4096, 8192.16384, 32768.65535],
            BYTES_PER_ELEMENT: 8,
            method: 'writeDoubleBE'
        }
    ];

dataToWrite.forEach(function(item) {
    // Fill buffer
    var buffer = item.buffer,
        values = item.values,
        count = values.length,
        method = item.method,
        bytesPerElement = item.BYTES_PER_ELEMENT;

    for(var i = 0; i < count; i++) {
        buffer[method](values[i], i * bytesPerElement);
    }

    // Write buffer
    var fd = fs.openSync(path + item.name, 'w');
    fs.writeSync(fd, buffer, 0, buffer.length, 0);
    fs.closeSync(fd);
});

