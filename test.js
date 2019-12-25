const parser = require('./dist/main')
const fs = require('fs')

const code = fs.readFileSync('./examples/base.lisp', 'utf-8')

const node = parser.parse(code)

console.log(node.toString())