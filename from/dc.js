var Emitter = require('y-emitter'),
    on = require('u-proto/on'),
    once = require('u-proto/once');

module.exports = function(dc){
  var inP,outP;
  
  inP = new Emitter();
  outP = new Emitter.Hybrid();
  Emitter.chain(inP,outP);
  
  switch(dc.readyState){
      
    case 'open':
      inP.set('ready');
      dc.onclose = onceClosed.bind(inP);
      break;
      
    case 'closed':
      inP.set('closed');
      break;
      
    default:
      dc.onclose = onceClosed.bind(inP);
      dc.onopen = onceOpen.bind(inP);
      break;
      
  }
  
  dc.onmessage = onMsg.bind(inP);
  
  outP.target.on('msg',sendMsg,dc);
  outP.target.once('closed',close,dc,inP);
  
  return outP;
}

function onceOpen(){
  this.set('ready');
}

function onceClosed(){
  this.unset('ready');
  this.set('closed');
}

function onMsg(e){
  var msg = e.data;
  
  lastE = e;
  
  try{
    msg = JSON.parse(msg);
    this.give('msg',msg);
  }catch(e){ }
  
}

function sendMsg(msg,en,dc){
  if(dc.readyState == 'open') dc.send(JSON.stringify(msg));
}

function close(e,en,dc,inP){
  dc.close();
  onceClosed.call(inP);
}

