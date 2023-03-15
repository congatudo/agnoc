import { expect } from 'chai';
import { bind } from './bind.decorator';

describe('bind.decorator', function () {
  it('binds a class method', function () {
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

  it('throws an error when applied to a class', function () {
    expect(() => {
      // @ts-expect-error bad signature
      @bind
      class Foo {}

      new Foo();
    }).to.throw(TypeError);
  });
});
