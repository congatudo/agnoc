import { describe, it } from "mocha";
import { expect } from "chai";
import { flipObject } from "../../../src/utils/flip-object.util";

describe("flipObject", () => {
  it("flips object keys", () => {
    const obj = {
      foo: "bar",
      1: 2,
    };
    const ret = flipObject(obj);

    expect(ret).to.have.property("bar", "foo");
    expect(ret[2]).to.be.equal("1");
  });
});
