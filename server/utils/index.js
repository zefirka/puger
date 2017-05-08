'use strict';

const rimraf = require('rimraf');
const fs = require('fs');
const {
    resolve,
    join,
} = require('path');

module.exports = {
    saveFile,
    read,
    write,
    createFiles,
    removeDir,
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
    return new Promise((res, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                return reject(err);
            }

            if (!data) {
                return reject(new Error('File is empty'));
            }

            return res(data.toString());
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

function createDir(dir) {
    return new Promise((res, rej) => {
        fs.exists(resolve(dir), function (exists) {
            if (!exists) {
                return fs.mkdir(resolve(dir), mkErr => {
                    if (mkErr) {
                        rej(mkErr);
                    }

                    res();
                });
            }

            rej(new Error('Directory is already exists'));
        });
    });
}

/**
 * @private
 * @param {string} path
 * @param {string} name
 * @return {Promise}
 */
function createFiles(path, name) {
    return createDir(path).then(() => {
        return Promise.all([
            write(join(path, name) + '.pug', `.${name}`),
            write(join(path, name) + '.css', `.${name} {\n\t\n}`),
            write(join(path, name) + '.json', '{}')
        ]);
    }).catch(error => {
        throw new Error(error);
    });
}

/**
 * @public
 * @param {string} dir
 * @return {Promise}
 */
function removeDir(dir) {
    return new Promise((res, rej) => {
        rimraf(dir, err => {
            if (err) {
                rej(err);
            }

            res();
        });
    });
}
