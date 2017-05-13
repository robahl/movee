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

io.on('connection', function (socket) {
  console.log('Client connection');
});
