var foo = /*#__PURE__*/curry((a, b) => {
  return a() + b();
});
foo = /*#__PURE__*/obj.prop((a, b) => {
  return a() + b();
});
foo = /*#__PURE__*/arr[index](function (a, b) {
  return a() + b();
});