'use strict';

const fs = require('fs');

const {
    resolve,
    join
} = require('path');

const pug = require('pug');
const express = require('express');
const bodyParser = require('body-parser');

const loger = require('./middlwares/loger.js');

const app = express();

app.set('view engine', 'pug');
app.set('views', resolve('./static'));

app.use(bodyParser());
app.use(loger);

const templatesFolder = process.argv[3];

if (!templatesFolder) {
    throw new Error('Specify templates folder');
}

app.get('/', (req, res) => {
    fs.readdir(resolve(templatesFolder), (err, data) => {
        if (err) {
            throw new Error(err);
        }

        res.render('index', {
            blocks: data
        });
    });
});

app.get('/views/*', (req, res) => {
    getView(req.path).then(([tpl, css, data, viewName]) => {
        const compile = pug.compile(tpl);
        var template = compile(data);

        res.render('template', {
            css,
            tpl: template,
            view: viewName
        });
    }).catch(err => {
        throw new Error(err);
    });
});

function getView(p) {
    const particles = p.split('/');
    const viewDir = join.apply(null, [templatesFolder].concat(particles.slice(2)));
    const fileName = join(viewDir, particles.pop());

    return Promise.all([
        '.pug',
        '.css',
        '.json'
    ].map(ext => resolve(fileName + ext))
    .map(read))
    .then(([tpl, css, data]) => [tpl, css, JSON.parse(data), fileName]);
}

function read(file) {
    return new Promise((res, rej) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                rej(err);
            }

            res(data.toString());
        });
    });
}

app.use(express.static('static'));

module.exports = app;

