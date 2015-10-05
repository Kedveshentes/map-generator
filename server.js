var http = require('http'),
    fs   = require('fs'),
    path = require('path'),
    mime = require('mime');

function send404 (response) {
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.write('Error 404 : shaite happens mate.');
    response.end();
}

function sendPage (response, filePath, fileContents) {
    var mimeType = mime.lookup(path.basename(filePath));
    console.log('mimeType : ', mimeType);
    response.writeHead(200, {'Content-Type' : mimeType});
    response.end(fileContents);
}

function serverWorking (response, absPath) {
    fs.exists(absPath, function (exists) {
        if (exists) {
            fs.readFile(absPath, function (error, data) {
                if (error) {
                    send404(response);
                } else {
                    sendPage(response, absPath, data);
                }
            });
        } else {
            send404(response);
        }
    });
}

http.createServer(function (request, response) {
    var filePath = false;
    console.log(request.url);


    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }

    switch (request.url) {
        case '/node_modules/three/three.min.js':
        filePath = 'node_modules/three/three.min.js';
            break;
        case '/node_modules/gl-matrix/dist/gl-matrix-min.js':
        filePath = 'node_modules/gl-matrix/dist/gl-matrix-min.js';
            break;
        case '/node_modules/underscore/underscore-min.js':
        filePath = 'node_modules/underscore/underscore-min.js';
            break;
        default:

    }

    var absPath = './' + filePath;

    serverWorking(response, absPath);
}).listen(process.env.PORT || 3000);
