import babel from 'rollup-plugin-babel'
import path from 'path'
import resolve from 'rollup-plugin-node-resolve'

const bannerbars = require('./starbang')

const external = []
const globals = {}

export default {
  input: path.resolve(__dirname, '../src/index.js'),
  output: {
    file: path.resolve(__dirname, '../dist/cardinal.js'),
    format: 'umd',
    name: 'Cardinal',
    banner: bannerbars(),
    globals
  },
  external,
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
