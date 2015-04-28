var Emitter = require('y-emitter'),
    on = require('u-proto/on'),
    once = require('u-proto/once');

module.exports = function(ws){
  var inP,outP;
  
  inP = new Emitter();
  outP = new Emitter.Hybrid();
  Emitter.chain(inP,outP);
  
  ws[once]('open',onceOpen,inP);
  ws[once]('close',onceClosed,inP);
  ws[on]('message',onMsg,inP);
  
  outP.target.on('msg',sendMsg,ws);
  outP.target.once('closed',close,ws);
  
  return outP;
}

function onceOpen(e,en,inP){
  inP.set('ready');
}

function onceClosed(e,en,inP){
  inP.unset('ready');
  inP.set('closed');
}

function onMsg(e,en,inP){
  var msg = e[0];
  
  msg = JSON.parse(msg);
  inP.give('msg',msg);
}

function sendMsg(msg,en,ws){
  ws.send(JSON.stringify(msg));
}

function close(e,en,ws){
  ws.close();
  
  this.unset('ready');
  this.set('closed');
}

