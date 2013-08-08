var io = require('socket.io').listen(4000);
var fs = require('fs');
var working_file = null;
io.sockets.on('connection', function(socket){


 fs.watch('files/', function(){

    socket.emit('update_files', {'updated': true});
  });


  socket.on('getFile', function(path){

    working_path = path;

    fs.readdir(working_path, function(error, files){

      var details = {};
      var fileList = files;


      for(var i = 0; i < fileList.length; i += 1){

          details[fileList[i]] = fs.readFileSync(working_path + '/' + fileList[i], 'utf8');
      }

        socket.emit('return_file_data', {'files': details, 'path': working_path});

    });
  });


  socket.on('save_document', function(document){

    var content = document.content;

    var stream = fs.createWriteStream(document.path, {'flags': 'w'});
    stream.write(content);

    socket.emit('saved_doc', {saved: true});
  });

});