/*!
 * Development build script to build
 * meaningful plugins for your use
 */
'use strict'

const path = require('path')
const babel = require('rollup-plugin-babel')
const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const bannerbars = require('./starbang.js')
const plugins = [
  resolve(),
  babel({
    exclude: 'node_modules/**'/*,
    externalHelpersWhitelist: [
      'defineProperties',
      'createClass',
      'objectSpread',
      'defineProperty',
      'inheritsLoose'
    ]
    */
  })
]
const cardinal = {
  Nav: path.resolve(__dirname, '../src_modules/js/nav/index.js'),
  Drawer: path.resolve(__dirname, '../src_modules/js/drawer/index.js'),
  //Sheets: path.resolve(__dirname, '../src_modules/js/sheets/index.js')
}
const distro = '../dist/js/'

function mason(mod) {
  console.log(`Your mason is building ${mod}`)
  const modToFilename = `${mod.toLowerCase()}.js`
  const outFile = path.resolve(__dirname, `${distro}${modToFilename}`)
  const external = []
  const globals = {}

  if (mod === 'Nav') {
    external.push(cardinal.Drawer)
    globals[cardinal.Drawer] = 'Drawer'
  }

  rollup.rollup({
    input: cardinal[mod],
    plugins,
    external
  }).then((bundle) => {
    bundle.write({
      banner: bannerbars(),
      file: outFile,
      format: 'umd',
      name: mod,
      sourcemap: true,
      globals
    }).then(() => console.log(`Mason successfuly built ${mod}`)).catch((err) => console.error(`Mason fell from a skyscrapper while building ${mod}`))
  })
}
Object.keys(cardinal).forEach((mod) => mason(mod))
