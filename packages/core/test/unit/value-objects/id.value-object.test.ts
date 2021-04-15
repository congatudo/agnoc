import { describe, it } from "mocha";
import { expect } from "chai";
import { ValueObject } from "@agnoc/core/base-classes/value-object.base";
import { ID } from "@agnoc/core/value-objects/id.value-object";
import { ArgumentInvalidException } from "@agnoc/core/exceptions/argument-invalid.exception";

describe("id.value-object", () => {
  it("inherits value object", () => {
    const id = new ID(1);

    expect(id).to.be.instanceof(ValueObject);
  });

  it("returns its value", () => {
    const id = new ID(1);

    expect(id.value).to.be.equal(1);
  });

  it("throws an error when it is not a number", () => {
    expect(() => {
      // @ts-expect-error invalid argument
      new ID("foo");
    }).to.throw(ArgumentInvalidException);
  });

  it("generates random id", () => {
    const id = ID.generate();

    expect(id).to.be.instanceof(ID);
  });
});
