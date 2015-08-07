var bindEditor = require('gulf-contenteditable')

module.exports = setup
module.exports.consumes = ['editor']
module.exports.provides = []
function setup(plugin, imports, register) {
  var editor = imports.editor
  
  // Load ckeditor
  var script = document.createElement('script')
  script.src = '//cdn.ckeditor.com/4.5.1/full/ckeditor.js'
  document.body.appendChild(script)
  
  editor.registerEditor('dom', function*() {
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
    document.querySelector('#cke_doc .cke_inner .cke_contents').style['height'] = '100%'
    
    // bind editor
    var editable = document.querySelector('#cke_doc .cke_wysiwyg_frame').contentDocument.body
    return bindEditor(editable)
  })
  register()
}
