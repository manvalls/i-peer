var WebSocket = require('ws'),
    from = require('../from/ws.js');

module.exports = function getPeer(url){
  return from(new WebSocket(url));
};

