const PURE_ANNOTATION = '#__PURE__'

const isPureAnnotated = node => {
  const { leadingComments } = node

  if (!leadingComments) {
    return false
  }

  return leadingComments.some(comment => /[@#]__PURE__/.test(comment.value))
}

const annotateAsPure = path => {
  if (isPureAnnotated(path.node)) {
    return
  }
  path.addComment('leading', PURE_ANNOTATION)
}

const hasCallableParent = ({ parentPath }) =>
  parentPath.isCallExpression() || parentPath.isNewExpression()

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

const isExecutedDuringInitialization = path => {
  let functionParent = path.getFunctionParent()

  while (functionParent) {
    if (!isUsedAsCallee(functionParent)) {
      return false
    }

    functionParent = functionParent.getFunctionParent()
  }

  return true
}

const isInAssignmentContext = path => {
  const statement = path.getStatementParent()
  let parentPath

  do {
    ;({ parentPath } = parentPath || path)

    if (
      parentPath.isVariableDeclaration() ||
      parentPath.isAssignmentExpression() ||
      parentPath.isClass()
    ) {
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

  if (
    !isInAssignmentContext(path) &&
    !path.getStatementParent().isExportDefaultDeclaration()
  ) {
    return
  }

  annotateAsPure(path)
}

export default () => ({
  name: 'annotate-pure-calls',
  visitor: {
    'CallExpression|NewExpression': callableExpressionVisitor,
  },
})
