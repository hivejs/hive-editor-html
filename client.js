/**
 * hive.js
 * Copyright (C) 2013-2016 Marcel Klehr <mklehr@gmx.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Mozilla Public License version 2
 * as published by the Mozilla Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the Mozilla Public License
 * along with this program.  If not, see <https://www.mozilla.org/en-US/MPL/2.0/>.
 */
var bindEditor = require('gulf-contenteditable')

module.exports = setup
module.exports.consumes = ['ui', 'settings', 'editor']
module.exports.provides = []
function setup(plugin, imports, register) {
  var editor = imports.editor
    , ui = imports.ui
    , settings = imports.settings

  window.CKEDITOR_BASEPATH = ui.baseURL+'/static/hive-editor-html-ckeditor/ckeditor/'

  // Load ckeditor
  var script = document.createElement('script')
  script.src = ui.baseURL+'/static/hive-editor-html-ckeditor/ckeditor/ckeditor.js'
  document.body.appendChild(script)

  editor.registerEditor('CKeditor', 'text/html', 'A feature-rich HTML editor'
  , function(el) {
    CKEDITOR.disableAutoInline = true

    // Create toolbar
    var toolbar = document.createElement('div')
    toolbar.setAttribute('class', 'Editor__toolbar')
    toolbar.setAttribute('id', 'editorToolbar')
    toolbar.style['display'] = 'none' // Don't display until the content is loaded
    el.appendChild(toolbar)

    // Create content
    var content = document.createElement('div')
    content.setAttribute('class', 'Editor__content')
    el.appendChild(content)

    // Create contenteditable
    var contenteditable = document.createElement('div')
    contenteditable.setAttribute('contenteditable', 'true')
    content.appendChild(contenteditable)

    return new Promise(function(resolve) {
      CKEDITOR.on('instanceReady', evt => resolve())

      CKEDITOR.inline(contenteditable, {
	sharedSpaces: { top: 'editorToolbar' }
      , language: settings.getForUser('ui:locale')
      , ...config
      })
    })
    .then(() => {
      // bind editor
      var doc = bindEditor(contenteditable)
      doc.once('editableInitialized', () => {
	// on init: Maximize editor + display toolbar
	el.style['height'] = '100%'
	content.style['height'] = 'calc(100% - 5em)'
	contenteditable.style['height'] = '100%'
	contenteditable.style['overflow-y'] = 'scroll'
	contenteditable.style['padding'] = '5px'
	toolbar.style['display'] = 'block'
      })

      return Promise.resolve(doc)
    })
  })
  register()
}

const config = {
  // The toolbar groups arrangement, optimized for two toolbar rows.
  toolbarGroups: [
    { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
    { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
    { name: 'links' },
    { name: 'insert' },
    { name: 'forms' },
    { name: 'tools' },
    { name: 'document',     groups: [ 'mode', 'document', 'doctools' ] },
    { name: 'others' },
    '/',
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
    { name: 'styles' },
    { name: 'colors' },
    { name: 'about' }
  ]

  // Remove some buttons provided by the standard plugins, which are
  // not needed in the Standard(s) toolbar.
, removeButtons: 'Underline,Subscript,Superscript'

  // Set the most common block elements.
, format_tags: 'p;h1;h2;h3;pre'

  // Simplify the dialog windows.
, removeDialogTabs: 'image:advanced;link:advanced'

  // disable loading of additional config files
, customConfig: ''
}
