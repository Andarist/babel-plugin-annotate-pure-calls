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

const isInCallee = path => {
  do {
    path = path.parentPath

    if (isUsedAsCallee(path)) {
      return true
    }
  } while (!path.isStatement() && !path.isFunction())

  return false
}

const isTopLevel = path => path.getFunctionParent().isProgram()

const isExecutedDuringInitialization = path => {
  if (isTopLevel(path)) {
    return true
  }

  let functionParent

  do {
    functionParent = (functionParent || path).getFunctionParent()

    if (!isUsedAsCallee(functionParent)) {
      return false
    }
  } while (!isTopLevel(functionParent))

  return true
}

const isInAssignmentContext = path => {
  const statement = path.getStatementParent()
  let parentPath

  do {
    ;({ parentPath } = parentPath || path)

    if (parentPath.isVariableDeclaration() || parentPath.isAssignmentExpression()) {
      return true
    }
  } while (parentPath !== statement)

  return false
}

const callableExpressionVisitor = path => {
  if (isUsedAsCallee(path) || isInCallee(path)) {
    return
  }

  if (!isExecutedDuringInitialization(path)) {
    return
  }

  if (!isInAssignmentContext(path) && !path.getStatementParent().isExportDefaultDeclaration()) {
    return
  }

  annotateAsPure(path)
}

export default () => ({
  inherits: syntax,
  visitor: {
    'CallExpression|NewExpression': callableExpressionVisitor,
  },
})
