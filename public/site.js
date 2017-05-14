var socket = io();

var body = document.querySelector('body');

socket.on('connect', function () {
  socket.emit('new-user');
});

socket.on('cursors', function (cursors) {
  var userCount = Object.keys(cursors).length;
  document.getElementById('user-count').innerHTML = userCount;

  for (var cursor in cursors) {
    if (cursors.hasOwnProperty(cursor) && cursor != socket.id) {
      var img = getCursorImage();
      img.style.top = cursors[cursor].y + 'px';
      img.style.left = cursors[cursor].x + 'px';
      img.id = cursor;
      body.appendChild(img);
    }
  }
});

socket.on('user-leave', function (id) {
  var img = document.getElementById(id)
  img.parentNode.removeChild(img);
});

socket.on('cursor-move', function (data) {
  var img = document.getElementById(data.socketID);
  img.style.top = data.y + 'px';
  img.style.left= data.x + 'px';
});

body.addEventListener('mousemove', function (event) {
  socket.emit('client-cursor-move', {x: event.clientX, y: event.clientY});
});

function getCursorImage() {
  var cursorImg = document.createElement('img');
  cursorImg.src = 'win-cursor.png';
  return cursorImg;
}
