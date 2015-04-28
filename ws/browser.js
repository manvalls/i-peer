var from = require('../from/ws.js');

module.exports = function getPeer(url){
  
  if(!url.match(/^wss?:/)){
    if(url.charAt(0) == '/') url = location.origin.replace(/^http/,'ws') + url + '/';
    else url = document.baseURI.replace(/^http/,'ws') + url + '/';
  }
  
  return from(new WebSocket(url));
}

