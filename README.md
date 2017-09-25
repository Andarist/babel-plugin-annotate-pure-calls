# babel-plugin-annotate-pure-calls

[![npm version](https://img.shields.io/npm/v/babel-plugin-annotate-pure-calls.svg)](https://www.npmjs.com/package/babel-plugin-annotate-pure-calls)
[![npm](https://img.shields.io/npm/dm/babel-plugin-annotate-pure-calls.svg)](https://www.npmjs.com/package/babel-plugin-annotate-pure-calls)

This plugins helps with automatic **#\_\_PURE\_\_** annotation insertion. It add the comment to top level call expressions and new expressions in assignment contexts (those are considered by the plugin as **side effect free**). This helps [UglifyJS](https://github.com/mishoo/UglifyJS2) to perform dead code elimination more efficiently and therefore reduces the bundle sizes for the consumers.

**NOTE:** It might break your code, so use on your own risk. Target audience for the plugin are libraries, which in vast major of use cases do not introduce side effects in top level calls. That doesn't mean that application bundles cannot benefit from the plugin.

## Installation

```sh
npm install --save-dev babel-plugin-annotate-pure-calls
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["annotate-pure-calls"]
}
```

### Via CLI

```sh
babel --plugins annotate-pure-calls script.js
```

### Via Node API

```javascript
require("babel-core").transform("var inc = add(1)", {
  plugins: ["annotate-pure-calls"]
});
```

## Similar projects

- [annotate-pure-call-in-variable-declarator](https://github.com/morlay/babel-plugin-annotate-pure-call-in-variable-declarator)

