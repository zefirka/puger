'use strict';

const fs = require('fs');
const {resolve} = require('path');

module.exports = {
    saveFile,
    read,
    write,
};

/**
 * @public
 * @param {string} file
 * @param {string} ext
 * @param {string} data
 * @return {Promise}
 */
function saveFile(file, ext, data) {
    const fileName = resolve(`${file}.${ext}`);
    return write(fileName, data);

}

/**
 * @public
 * @param {stirng} file
 * @return {Promise}
 */
function read(file) {
    return new Promise((res, rej) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                rej(err);
            }

            if (!data) {
                rej(new Error('File is empty'));
            }

            res(data.toString());
        });
    });
}

/**
 * @public
 * @param {string} file
 * @param {string} data
 * @return {Promise}
 */
function write(file, data) {
    return new Promise((res, rej) => {
        fs.writeFile(file, data, (err, data) => {
            if (err) {
                rej(err);
            }

            res(data);
        });
    });
}

