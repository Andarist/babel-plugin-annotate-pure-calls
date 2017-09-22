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

export default () => ({
  inherits: syntax,
  visitor: {
    'CallExpression|NewExpression'(path) {
      if (!isTopLevel(path)) {
        let functionParent

        do {
          functionParent = (functionParent || path).getFunctionParent()

          if (!functionParent.parentPath.isCallExpression()) {
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
