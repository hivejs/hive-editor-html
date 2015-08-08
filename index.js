var path = require('path')
  , domOT = require('dom-ot')

module.exports = setup
module.exports.consumes = ['assets', 'ot']

function setup(plugin, imports, register) {
  var assets = imports.assets
  var ot = imports.ot

  assets.registerModule(path.join(__dirname, 'client.js'))

  ot.registerOTType('html', domOT)

  register()
}
