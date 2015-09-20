var bindEditor = require('gulf-contenteditable')

module.exports = setup
module.exports.consumes = ['ui', 'editor']
module.exports.provides = []
function setup(plugin, imports, register) {
  var editor = imports.editor
    , ui = imports.ui

  // Load ckeditor
  var script = document.createElement('script')
  script.src = ui.baseURL+'/static/hive-editor-html-ckeditor/ckeditor/ckeditor.js'
  document.body.appendChild(script)

  editor.registerEditor('CKeditor', 'html', 'A feature-rich HTML editor'
  , function*(el) {
    // Replace textarea
    var textarea = document.createElement('textarea')
    textarea.setAttribute('id', 'doc')
    el.appendChild(textarea)
    CKEDITOR.replace(textarea, {
      removeButtons: 'Underline,Undo,Redo,Source,About'
    })
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
