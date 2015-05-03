var Emitter = require('y-emitter'),
    on = require('u-proto/on'),
    once = require('u-proto/once');

module.exports = function(ws){
  var inP,outP;
  
  inP = new Emitter();
  outP = new Emitter.Hybrid();
  Emitter.chain(inP,outP);
  
  switch(ws.readyState){
      
    case 1:
      inP.set('ready');
      ws[once]('close',onceClosed,inP);
      break;
      
    case 3:
      inP.set('closed');
      break;
      
    default:
      ws[once]('close',onceClosed,inP);
      ws[once]('open',onceOpen,inP);
      break;
      
  }
  
  ws[on]('message',onMsg,inP);
  
  outP.target.on('msg',sendMsg,ws);
  outP.target.once('closed',close,ws,inP);
  
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
  var msg = e.data || e[0];
  
  try{
    msg = JSON.parse(msg);
    inP.give('msg',msg);
  }catch(e){ }
  
}

function sendMsg(msg,en,ws){
  if(ws.readyState == 1) ws.send(JSON.stringify(msg));
}

function close(e,en,ws,inP){
  ws.close();
  onceClosed(e,en,inP);
}

