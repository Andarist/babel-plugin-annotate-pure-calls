const babel = require('@babel/core')
const pluginTester = require('babel-plugin-tester')
const annotatePureCallsPlugin = require('..').default

pluginTester({
  babel,
  plugin: annotatePureCallsPlugin,
  fixtures: `${__dirname}/fixtures`,
})
