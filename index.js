'use strict';

const {
    port: defaultPort
} = require('./server/config');

const app = require('./server/app');

const port = process.argv[2] || defaultPort;

app.listen(port, () => {
    console.log(`Started app on http://localhost:${port}`); // eslint-disable-line no-console
});
