const base = bar =>
  class {
    foo() {
      return bar
    }
  }

const MyClass = class extends base() {}
