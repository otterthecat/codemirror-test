var generateFileDisplay = function(fileList){

    var ul = document.querySelector('ul');

    ul.onclick = function(event){
        console.log(event.target);
    }

    for (key in fileList){

        var li = document.createElement('li');
        li.setAttribute('data-file', key);
        li.innerHTML = key;

        // this should really be done after the loop
        // with the full list of elements (use string instead of object)
        ul.appendChild(li);
    }
}

var socket = io.connect('http://localhost:4000');
var iframe = document.querySelector('iframe');


socket.on('connect', function(){

    socket.emit('getFile', 'files');

    socket.on('saved_doc', function(data){

        if (data.saved){

            iframe.contentWindow.location.reload();
        }
    });

    socket.on('return_file_data', function(data){

        var file_data = data;
        var path = data.path;
        var files = data.files;

        generateFileDisplay(files);

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
        }

    });
});