var express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const gameRooms = {};
class gameRoom {
  playerChars = {one:false,two:false,three:false,four:false};
}

/* Socket.IO docs

socket.emit('message', "this is a test"); //sending to sender-client only

socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender

socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender

socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)

socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid

io.emit('message', "this is a test"); //sending to all clients, include sender

io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender

io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender

socket.emit(); //send to all connected clients

socket.broadcast.emit(); //send to all connected clients except the one that sent the message

socket.on(); //event listener, can be called on client to execute on server

io.sockets.socket(); //for emiting to specific clients

io.sockets.emit(); //send to all connected clients (same as socket.emit)

io.sockets.on() ; //initial connection from a client.

*/
var roundCall = Boolean(0);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  //Reply to their connection by fetching their socket.id
  socket.emit('joined');

  var roomCode = "";

  socket.on('makeRoom', msg => {
    if(gameRooms[msg] === undefined) {
      console.log("Made room " + msg);
     // gameRooms[msg] = gameRoom();
     gameRooms[msg] = msg;
    }
    socket.join(msg);
    roomCode = msg;

    /*var shirt = -1;
    // Assign the shirt color
    Object.entries(gameRooms[msg].playerChars).forEach(([key, value]) => {
      //console.log(key, value) // "someKey" "some value", "hello" "world", "js javascript foreach object"
      if(!value) {
        shirt = key == "one" ? 0 : key == "two" ? 1 : key == "three" ? 2 : key == "four" ? 3 : -1;    
        return
      }
    })
    socket.emit("shirtNumber", shirt);*/
  });

  socket.on('delRoom', msg => {
    console.log("Deleted room" + msg);
    delete gameRooms.msg
  });

  socket.on('movement', msg => {
    socket.to(roomCode).emit('movement', msg);
  });

  socket.on('teleport', msg => {
    socket.to(roomCode).emit('teleport', msg);
  });

  socket.on('elevator', msg => {
    console.log("elevator sent");
    socket.to(roomCode).emit('elevator', msg);
  });

  socket.on('attack', msg => {
    console.log("attack sent");
    socket.to(roomCode).emit('attack', msg);
  });

  socket.on('newmap', msg => {

    // Congrats. You sent the map. Enjoy enemies targetting you. :)
    console.log("new map sent");
    socket.to(roomCode).emit('enemytarget',msg[0]);
    socket.to(roomCode).emit('newmap', msg[1]);
  });
  
  socket.on('playerjoin', msg => {
    console.log("player has joined. get replies");
    // Broadcast new player to all current players
    socket.to(roomCode).emit('playerjoinedReply',msg);
  });

  socket.on('sendPlayer', msg => {
    socket.to(msg[0]).emit('playerjoined',[msg[1],msg[2],msg[3]]);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
    socket.to(roomCode).emit('disconnected', socket.id);
  });


  // Room Code tutorial from https://github.com/hannahrobot/amongus-tutorial/blob/main/server/socket/index.js
  socket.on("isKeyValid", function (input) {

    console.log('checking ' + input);

    Object.keys(gameRooms).includes(input)
      ? socket.emit("keyIsValid", input)
      : socket.emit("keyNotValid");
  });




});

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/', express.static(__dirname + '/'));


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
