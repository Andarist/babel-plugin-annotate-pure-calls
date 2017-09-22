import runner from 'babel-helper-plugin-test-runner'
import * as babel from "babel-core"
import path from 'path'

const PLUGIN_NAME = 'annotate-pure-calls'

const original = babel.transform
babel.transform = (code, opts, ...rest) => {
	const pluginIndex = opts.plugins.findIndex(plugin => plugin.indexOf(PLUGIN_NAME) !== -1)
	if (pluginIndex !== -1) {
		opts.plugins[pluginIndex] = path.resolve(opts.plugins[pluginIndex])
	}
	return original(code, opts, ...rest)
}

runner(__dirname)

babel.transform = original
