const babel6 = require('babel-core')
const babel7 = require('@babel/core')
const pluginTester = require('babel-plugin-tester')
const annotatePureCallsPlugin = require('..').default

const runTests = babel => {
	const version = babel.version.split('.')[0]

	pluginTester({
		title: `babel${version}`,
		babel,
		plugin: annotatePureCallsPlugin,
		fixtures: `${__dirname}/fixtures`,
		fixtureOutputName: `output${version}`,
	})
}

runTests(babel6)
runTests(babel7)
