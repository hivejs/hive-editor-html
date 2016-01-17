var path = require('path')
  , domOT = require('dom-ot')
  , vdomToHtml = require('vdom-to-html')

module.exports = setup
module.exports.consumes = ['ui', 'ot', 'importexport']

function setup(plugin, imports, register) {
  var ui = imports.ui
  var ot = imports.ot
  var importexport = imports.importexport

  ui.registerModule(path.join(__dirname, 'client.js'))
  ui.registerStaticDir(path.join(__dirname, 'ckeditor'))

  ot.registerOTType('text/html', domOT)

  importexport.registerExportProvider('text/html', 'text/html'
  , function*(document, snapshot) {
    return vdomToHtml(JSON.parse(snapshot.contents))
  })

  register()
}
