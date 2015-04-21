# Peer

## Interface

An object implements the Peer interface if it:

- Inherits from `y-emitter` Target
- Has been initialized by the `y-emitter` Target's constructor
- Fires a `'msg'` event when a message is received
- Has the `'ready'` state set when it can receive and send messages
- Has the `'closed'` state set when it will no longer receive and send messages
- Has a `.give('msg',msg)` method for sending messages, where the acceptable type and structure of *msg* depends on the object itself, typically JSONable data
- Has a `.set('closed')` method for terminating the connection

## Implementations

- WebSocket client

```javascript
peer = require('i-peer/ws')(url);
```
