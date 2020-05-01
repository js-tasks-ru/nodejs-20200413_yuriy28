const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.match(/\//)) {
        response(res, 400, 'Bad Request');
      } else if (fs.existsSync(filepath)) {
        response(res, 409, 'Conflict');
      } else {
        const limitSizeStream = new LimitSizeStream({limit: 1024 * 1024});
        const fileStream = fs.createWriteStream(filepath);

        req.pipe(limitSizeStream).pipe(fileStream);
        limitSizeStream.once('error', () => {
          deleteFile(filepath);
          response(res, 413, 'Payload Too Large');
        });
        fileStream.once('finish', () => response(res, 201, 'Created'));

        req.once('close', () => {
          if (!res.finished) {
            deleteFile(filepath);
          }
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function response(res, code, msg) {
  res.statusCode = code;
  res.end(msg);
}

function deleteFile(filepath) {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}

module.exports = server;
