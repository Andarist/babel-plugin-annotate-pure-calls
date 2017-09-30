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

const hasCallableParent = ({ parentPath }) => parentPath.isCallExpression() || parentPath.isNewExpression()

const isUsedAsCallee = path => {
  if (!hasCallableParent(path)) {
    return false
  }

  return path.parentPath.get('callee') === path
}

const isTopLevel = path => path.getStatementParent().parentPath.isProgram()

const callableExpressionVisitor = path => {
  if (isUsedAsCallee(path)) {
    path.skip()
    return
  }

  if (!isTopLevel(path)) {
    let functionParent

    do {
      functionParent = (functionParent || path).getFunctionParent()

      if (!isUsedAsCallee(functionParent)) {
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
}

export default () => ({
  inherits: syntax,
  visitor: {
    CallExpression(path) {
      const callee = path.get('callee')

      if (callee.isIdentifier() && callee.get('name').node === 'require') {
        path.skip()
        return
      }

      callableExpressionVisitor(path)
    },
    NewExpression: callableExpressionVisitor,
  },
})
