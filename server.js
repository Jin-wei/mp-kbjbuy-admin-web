// Copyright (c) 2012 Mark Cavage. All rights reserved.


var restify = require('restify');


function createServer() {


    var server = restify.createServer({

        name: 'FHU',
        version: '1.0.0'
    });

    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());
    server.use(restify.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));
    restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","x-requested-with,content-type");
    server.use(restify.CORS());
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.dateParser());
    server.use(restify.authorizationParser());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());

    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './web', default: 'login.html', maxAge: 0 }));
    server.get(/\.html$/i,restify.serveStatic({
        directory: './web',
        maxAge: 0}));
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './web',
        maxAge: 0}));
    server.get('/',restify.serveStatic({
        directory: './web',
        default: 'login.html',
        maxAge: 0
    }));

    server.on('NotFound', function (req, res, next) {
        res.send(404);
        next();
    })
    return (server);
}



///--- Exports

module.exports = {
    createServer: createServer
};