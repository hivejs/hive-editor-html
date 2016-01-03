var path = require('path')
  , domOT = require('dom-ot')

module.exports = setup
module.exports.consumes = ['ui', 'ot']

function setup(plugin, imports, register) {
  var ui = imports.ui
  var ot = imports.ot

  ui.registerModule(path.join(__dirname, 'client.js'))
  ui.registerStaticDir(path.join(__dirname, 'ckeditor'))

  ot.registerOTType('html', domOT)

  register()
}
