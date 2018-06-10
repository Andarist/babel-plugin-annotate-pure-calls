var foo = curry((a, b) => {
  return a() + b()
})

foo = obj.prop((a, b) => {
  return a() + b()
})

foo = arr[index](function (a, b) {
  return a() + b();
})
