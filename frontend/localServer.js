const express = require('express');
const next = require('next');

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 4444;

app.prepare().then(() => {
    const server = express();

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, '0.0.0.0', (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:'+port);
    });
});