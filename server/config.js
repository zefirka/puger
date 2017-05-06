'use strict';

const {
    join
} = require('path');

module.exports = {
    port: 9037,
    logFile: join(__dirname, 'logs/logs.txt')
};
