var bindEditor = require('gulf-contenteditable')

module.exports = setup
module.exports.consumes = ['ui', 'editor']
module.exports.provides = []
function setup(plugin, imports, register) {
  var editor = imports.editor
    , ui = imports.ui

  // Load ckeditor
  var script = document.createElement('script')
  script.src = ui.baseURL+'/static/hive-editor-html/ckeditor/ckeditor.js'
  document.body.appendChild(script)

  editor.registerEditor('html', function*() {
    // configure ckeditor
    CKEDITOR.editorConfig = function( config ) {
      config.toolbarGroups = [
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'forms', groups: [ 'forms' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'others', groups: [ 'others' ] },
        '/',
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'about', groups: [ 'about' ] }
      ];

      config.removeButtons = 'Underline,Subscript,Superscript,Undo,Redo,Source,About';
    };

    // Replace textarea
    var textarea = document.createElement('textarea')
    textarea.setAttribute('id', 'doc')
    document.querySelector('#editor').appendChild(textarea)
    CKEDITOR.replace(textarea)
    yield function(cb) {
      CKEDITOR.on('instanceReady', function() {
        cb()
      })
    }

    // Maximize editor
    document.body.style['position'] = 'absolute'
    document.body.style['bottom'] =
    document.body.style['top'] =
    document.body.style['left'] =
    document.body.style['right'] = '0'
    document.body.style['overflow'] = 'hidden'
    document.querySelector('#editor').style['height'] = '100%'
    document.querySelector('#cke_doc').style['height'] = '100%'
    document.querySelector('#cke_doc .cke_inner').style['height'] = '100%'
    document.querySelector('#cke_doc .cke_inner .cke_contents').style['height'] = 'calc(100% - 5em)'

    // bind editor
    var editable = document.querySelector('#cke_doc .cke_wysiwyg_frame').contentDocument.body
    return bindEditor(editable)
  })
  register()
}
