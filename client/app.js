var socket = io.connect('http://sol.local:4000');
socket.on('connect', function(){

    socket.emit('getFile', 'files');

    socket.on('update_file', function(data){

        var i = document.querySelector('iframe');
        console.log("iframe = ");
        console.log(i);

        i.contentWindow.location.reload();
    });

    socket.on('return_file_data', function(data){

        var file_data = data;
        var path = data.path;
        var files = data.files;

        for(key in files) {

            var cm = CodeMirror(document.querySelector('#codeMirror'), {
                theme: 'twilight',
                value: files[key],
                lineNumbers: true,
                extraKeys: {
                    'Ctrl-S': function(cm){

                        var c = cm.doc.getValue();
                        socket.emit('save_document',{
                            'path': path + '/' + key,
                            'content': c
                        })
                    }
                },
                mode: 'javascript'
            });

            cm.on('change', function(){
                console.log("File has been changed - perhaps 'auto' save to DB?");
            });

            cm.on('saved_doc', function(data){

                console.log("is doc saved? " + data.saved);
            });
        }

    });
});