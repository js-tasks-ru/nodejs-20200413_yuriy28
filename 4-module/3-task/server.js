const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  try {
    switch (req.method) {
      case 'DELETE':
        if (pathname.match('\/')) {
          response(res, 400, 'Bad Request');
        } else if (!fs.existsSync(filepath)) {
          response(res, 404, 'Not Found');
        } else {
          fs.unlinkSync(filepath);
          response(res, 200, 'OK');
        }
        break;
      default:
        response(res, 501, 'Not Implemented');
    }
  } catch (e) {
    response(res, 500, 'Server Error');
  }
});

function response(res, code, msg) {
  res.statusCode = code;
  res.end(msg);
}

module.exports = server;
