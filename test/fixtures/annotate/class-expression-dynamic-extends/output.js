const base = bar => class {
  foo() {
    return bar;
  }
};
const MyClass = class extends /*#__PURE__*/base() {};