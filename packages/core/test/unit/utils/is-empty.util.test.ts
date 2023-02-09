/* eslint-disable mocha/no-setup-in-describe, @typescript-eslint/restrict-template-expressions */
import { isEmpty } from "@agnoc/core/utils/is-empty.util";
import { expect } from "chai";
import { describe, it } from "mocha";

const emptyList = [null, undefined, [], "", new Object(null), {}];
const presentList = [true, "foo", { foo: "bar" }, [1, 2, 3], new Date()];

describe("is-empty.util", () => {
  [...emptyList, emptyList].forEach((item) => {
    it("returns true when it is empty", () => {
      expect(isEmpty(item), `${item} is empty`).to.be.true;
    });
  });

  presentList.forEach((item) => {
    it("returns false when it is not empty", () => {
      expect(isEmpty(item), `${item} is empty`).to.be.false;
    });
  });
});
