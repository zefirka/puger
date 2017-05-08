'use strict';

const fs = require('fs');

const {js_beautify: beautify} = require('js-beautify');

const {
    resolve,
    join
} = require('path');

const pug = require('pug');
const express = require('express');
const bodyParser = require('body-parser');

const loger = require('./middlwares/loger.js');

const {
    saveFile,
    read,
    createFiles,
    removeDir,
} = require('./utils/');

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

function onError(res, error) {
    res.status(500).send({
        ok: false,
        error: error.stack
    });
}

app.post('/update/', (req, res) => {
    const {
        file,
        value,
        json,
        type
    } = req.body;

    let action = Promise.resolve(null);

    try {
        action = type === 'pug'
        ? updatePug(value, JSON.parse(json))
        : updateView(file, JSON.parse(value));
    } catch (e) {
        return onError(res, e);
    }

    action.then(view => {
        res.send(view);
    }).catch(onError.bind(null, res));
});

app.post('/save/', (req, res) => {
    const {
        file,
        value,
        type
    } = req.body;

    saveFile(file, type, value).then(() => {
        res.json({
            ok: true
        });
    }).catch(error => {
        res.json({
            ok: false,
            error
        });
    });
});

app.get('/views/*', (req, res) => {
    getView(req.path).then(([tpl, css, data, viewName]) => {
        const compile = pug.compile(tpl);
        var template = compile(JSON.parse(data));

        res.render('template', {
            data: beautify(data, {
                indent_size: 4
            }),
            css,
            pugtpl: tpl,
            tpl: template,
            view: viewName,
            templateName: viewName.split('/').pop()
        });
    }).catch(err => {
        throw new Error(err);
    });
});

app.get('/new/', (req, res) => {
    res.render('new');
});

app.post('/create/', (req, res) => {
    const {
        name, url
    } = req.body;

    const addr = join(templatesFolder, url, name);

    createFiles(addr, name).then(() => {
        res.json({
            ok: true,
            url: '/views/' + name
        });
    }).catch(onError.bind(null, res));

});

app.get('/view/', (req, res) => {
    const {
        type,
        file
    } = req.query;

    const fileName = resolve(file + '.' + type);
    read(fileName).then(data => {
        res.send(data);
    });
});

app.post('/remove/:file/', (req, res) => {
    const {
        file
    } = req.params;

    const dirName = resolve(join(templatesFolder, file));

    removeDir(dirName).then(() => res.json({
        ok: true
    })).catch(onError.bind(null, res));
});

/**
 * @private
 * @param {string} p - particles
 * @return {Promise}
 */
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
    .then(([tpl, css, data]) => [tpl, css, data, fileName]);
}

function updateView(file, data) {
    const fileName = resolve(file + '.pug');

    return read(fileName).then(tpl => {
        const compile = pug.compile(tpl);
        return compile(data);
    });
}

/**
 * @private
 * @param {string} pugfile
 * @param {object} data
 * @return {Promise}
 */
function updatePug(pugfile, data) {
    const compile = pug.compile(pugfile);
    return Promise.resolve(compile(data));
}

app.use(express.static('static'));
app.use(express.static('node_modules'));

module.exports = app;

