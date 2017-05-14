const express = require('express');
const app = express();
const server = require('http').Server(app);
const logger = require('morgan')
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

app.enable('trust proxy');

if (process.env.NODE_ENV === 'production') {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}

app.use(express.static(__dirname + '/public'));

server.listen(port, function () {
  console.log(`Runnin' on ${port}`)
});

var cursors = {};

io.on('connection', function (socket) {
  cursors[socket.id] = {x: 0, y: 0};
  socket.emit('cursors', cursors);

  socket.on('disconnect', function (reason) {
    delete cursors[socket.id];
    socket.broadcast.emit('user-leave', socket.id);
    socket.broadcast.emit('cursors', cursors);
  });

  socket.on('new-user', function () {
    socket.broadcast.emit('cursors', cursors);
  });

  socket.on('client-cursor-move', function (data) {
    cursors[socket.id].x = data.x;
    cursors[socket.id].y = data.y;
    socket.broadcast.emit('cursor-move', {socketID: socket.id, x: data.x, y: data.y});
  });

});
