const base = bar => class {
  foo() {
    return bar;
  }
};
class MyClass extends /*#__PURE__*/base() {}