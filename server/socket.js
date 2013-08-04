var io = require('socket.io').listen(4000);
var fs = require('fs');

io.sockets.on('connection', function(socket){


  socket.on('getFile', function(path){

    fs.readFile(path, 'utf8', function(error, data){

        socket.emit('return_file_data', data);
    });
  });


});