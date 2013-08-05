var io = require('socket.io').listen(4000);
var fs = require('fs');
var working_file = null;
io.sockets.on('connection', function(socket){


  socket.on('getFile', function(path){

    working_file = path;

    fs.readFile(working_file, 'utf8', function(error, data){

        socket.emit('return_file_data', data);
    });
  });


  socket.on('save_document', function(document){
    console.log("++++++");
    console.log(document);
    console.log("++++++")
    var content = document.content;

    var c = new Buffer(content, 'utf8');

    var stream = fs.createWriteStream(working_file, {'flags': 'w'});
    stream.write(content);

    socket.emit('saved_doc', {saved: true});
  });

});