var io = require('socket.io').listen(4000);
var fs = require('fs');
var working_file = null;
io.sockets.on('connection', function(socket){


 fs.watch('files/', function(){

    socket.emit('update_files', {'updated': true});
  });


  socket.on('load_files', function(dir){

    working_path = dir;

    fs.readdir(working_path, function(error, files){

      var details = {};
      var fileList = files;


      for(var i = 0; i < fileList.length; i += 1){

          details[fileList[i]] = fs.readFileSync(working_path + '/' + fileList[i], 'utf8');
      }

        socket.emit('return_file_data', {'files': details, 'path': working_path});

    });
  });

  socket.on('getFile', function(fileData){

    fs.readFile(fileData.path + '/' + fileData.file, 'utf8', function(e, d){

      socket.emit('edit_file', {
        'file': fileData.file,
        'path': fileData.path,
        'mode': 'javascript',
        'content': d
      })
    });
  });


  socket.on('save_document', function(document){

    var content = document.content;

    var stream = fs.createWriteStream(document.path, {'flags': 'w'});
    stream.write(content);

    socket.emit('saved_doc', {saved: true});
  });

});