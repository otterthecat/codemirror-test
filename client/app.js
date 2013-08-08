var generateFileDisplay = function(fileList){

    var ul = document.querySelector('ul');

    ul.onclick = function(event){
        console.log(event.target);

        var selection = event.target;
        socket.emit('getFile', {
            'path': 'files',
            'file': selection.getAttribute('data-file')
        });
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

var createEditor = function(project){
    console.log('create editor for ' + project.file);
    var content = project.content;
    var the_file = project.file;
    var cm = CodeMirror(document.querySelector('#codeMirror'), {
        theme: 'twilight',
        value: content,
        lineNumbers: true,
        extraKeys: {
            'Ctrl-S': function(cm){

                socket.emit('save_document',{
                    'path': 'file/' + the_file,
                    'content': cm.doc.getValue()
                })
            }
        },
        mode: 'javascript'
    });

    cm.on('change', function(){
        console.log("File has been changed - perhaps 'auto' save to DB?");
    });
}

var socket = io.connect('http://localhost:4000');
var iframe = document.querySelector('iframe');


socket.on('connect', function(){

    socket.emit('load_files', 'files');

    socket.on('update_files', function(data){

        if (data.updated){

            iframe.contentWindow.location.reload();
        }
    });

    socket.on('saved_doc', function(data){

        console.log("was document saved? " + data.saved);
    });

    socket.on('return_file_data', function(data){

        var file_data = data;
        var path = data.path;
        var files = data.files;

        generateFileDisplay(files);

    });

    socket.on('edit_file', function(data){

        createEditor(data);
    });
});