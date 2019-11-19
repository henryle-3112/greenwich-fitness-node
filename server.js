const express = require('express');
const app = express();
const PORT = 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

let peerIdArr = [];

io.on('connection', socket => {
  socket.on('createRoom', chatRoom => {
    socket.join(chatRoom);
    socket.room = chatRoom;
  });
  socket.on('sendMessageToRoom', chatMessage => {
    io.sockets.in(socket.room).emit('serverSendMessageToRoom', chatMessage);
  });
  socket.on('sendPeerIdToRoom', peerId => {
    socket.peerId = peerId;
    peerIdArr.push(peerId);
    io.sockets.in(socket.room).emit('serverSendPeerToRoom', peerIdArr);
  });
  socket.on('stopVideoCall', () => {
    io.sockets.in(socket.room).emit('serverStopVideoCall');
  });
  socket.on('disconnectServer', () => {
    peerIdArr.splice(peerIdArr.indexOf(socket.peerId), 1);
    socket.disconnect();
  });
});
