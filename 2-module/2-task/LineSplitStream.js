const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this._buffer += chunk;

    const parts = this._buffer.split(os.EOL);

    if (parts.length > 1) {
      this._buffer = parts.pop();
      parts.forEach((line) => callback(null, line));
    } else {
      callback();
    }
  }

  _flush(callback) {
    callback(null, this._buffer);
  }
}

module.exports = LineSplitStream;
