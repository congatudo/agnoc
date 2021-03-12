import { describe, it } from "mocha";
import { expect } from "chai";
import { bind } from "@agnoc/core/decorators/bind.decorator";

describe("@bind", () => {
  it("binds a class method", () => {
    class Foo {
      wow = 1;

      @bind
      bar() {
        return this.wow;
      }
    }

    const foo = new Foo();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const bar = foo.bar;

    expect(bar()).to.be.equal(foo.wow);
  });
});
