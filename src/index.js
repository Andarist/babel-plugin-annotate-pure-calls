import syntax from 'babel-plugin-syntax-dynamic-import'

const PURE_ANNOTATION = '#__PURE__'

const isPureAnnotated = node => {
  const { leadingComments } = node
  if (leadingComments === undefined) {
    return false
  }
  return leadingComments.some(comment => /[@#]__PURE__/.test(comment.value))
}

function annotateAsPure(path) {
  if (isPureAnnotated(path.node)) {
    return
  }
  path.addComment('leading', PURE_ANNOTATION)
}

const isTopLevel = path => {
  return path.getStatementParent().parentPath.isProgram()
}

const isIIFE = path => {
  return (
    path.isCallExpression() &&
    (path.get('callee').isFunctionExpression() || path.get('callee').isArrowFunctionExpression())
  )
}

export default () => ({
  inherits: syntax,
  visitor: {
    'CallExpression|NewExpression'(path) {
      const callee = path.get('callee')

      if (callee.isIdentifier() && callee.get('name').node === 'require') {
        path.skip()
        return
      }

      if (!isTopLevel(path)) {
        let functionParent

        do {
          functionParent = (functionParent || path).getFunctionParent()

          if (!isIIFE(functionParent.parentPath)) {
            return
          }
        } while (!isTopLevel(functionParent))
      }

      const statement = path.getStatementParent()

      if (statement.isExportDefaultDeclaration()) {
        annotateAsPure(path)
        return
      }

      let parentPath

      do {
        ;({ parentPath } = parentPath || path)

        if (parentPath.isVariableDeclaration() || parentPath.isAssignmentExpression()) {
          annotateAsPure(path)
          return
        }
      } while (parentPath !== statement)
    },
  },
})
