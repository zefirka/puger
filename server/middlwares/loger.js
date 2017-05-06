'use strict';

const fs = require('fs');

const {
    logFile
} = require('../config.js');

module.exports = function (req, res, next) {
    let logData = `${req.url} | ${req.method} | ${Date.now()}\n`;

    fs.appendFile(logFile, logData, err => {
        if (err) {
            throw new Error(err);
        }
    });

    next();
};
