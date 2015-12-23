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
    CKEDITOR.disableAutoInline = true

    // Create toolbar
    var toolbar = document.createElement('div')
    toolbar.setAttribute('class', 'Editor__toolbar')
    toolbar.setAttribute('id', 'editorToolbar')
    el.appendChild(toolbar)

    // Create content
    var content = document.createElement('div')
    content.setAttribute('class', 'Editor__content')
    el.appendChild(content)

    // Create contenteditable
    var contenteditable = document.createElement('div')
    contenteditable.setAttribute('contenteditable', 'true')
    content.appendChild(contenteditable)

    CKEDITOR.inline(contenteditable, {
      sharedSpaces: { top: 'editorToolbar' }
    })

    yield function(cb) {
      CKEDITOR.on('instanceReady', function() {
        cb()
      })
    }

    // Maximize editor
    document.querySelector('#editor').style['height'] = '100%'
    content.style['height'] = 'calc(100% - 5em)'
    contenteditable.style['height'] = '100%'
    contenteditable.style['overflow-y'] = 'scroll'
    contenteditable.style['padding'] = '3px'

    // bind editor
    return bindEditor(contenteditable)
  })
  register()
}
