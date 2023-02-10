import { expect } from "chai";
import { describe, it } from "mocha";
import { convertPropsToObject } from "./convert-props-to-object.util";

describe("convert-props-to-object.util", () => {
  it("converts props to object", () => {
    class Foo {}
    class Serializable {
      toJSON() {
        return "serializable";
      }
    }

    const props = {
      primitive: "bar",
      array: [1, 2, 3],
      object: { foo: "bar" },
      instance: new Foo(),
      serializable: new Serializable(),
    };

    expect(convertPropsToObject(props)).to.be.deep.equal({
      primitive: "bar",
      array: [1, 2, 3],
      object: { foo: "bar" },
      instance: {},
      serializable: "serializable",
    });
  });

  it("throws an error when props are not an object", () => {
    expect(() => {
      convertPropsToObject("foo");
    }).to.throw(TypeError);
  });
});
