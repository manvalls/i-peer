var Emitter = require('y-emitter'),
    on = require('u-proto/on'),
    once = require('u-proto/once');

function NOOP(){}

module.exports = function(wsc){
  var inP,outP;
  
  inP = new Emitter();
  outP = new Emitter.Hybrid();
  Emitter.chain(inP,outP);
  
  if(wsc.connected){
    inP.set('ready');
    wsc[once]('close',onceClosed,inP);
    wsc[on]('error',NOOP);
  }else inP.set('closed');
  
  wsc[on]('message',onMsg,inP);
  
  outP.target.on('msg',sendMsg,wsc);
  outP.target.once('closed',close,wsc,inP);
  
  return outP;
}

function onceClosed(e,c,inP){
  inP.unset('ready');
  inP.set('closed');
}

function onMsg(e,c,inP){
  var msg = e[0].utf8Data;
  
  try{
    msg = JSON.parse(msg);
    inP.give('msg',msg);
  }catch(e){ }
  
}

function sendMsg(msg,c,wsc){
  if(wsc.connected) wsc.sendUTF(JSON.stringify(msg));
}

function close(e,c,wsc,inP){
  wsc.close();
  onceClosed(e,en,inP);
}

