---
to: packages/<%= package %>/test/unit/entities/<%= h.changeCase.paramCase(name) %>.entity.test.ts
---
<%
  ParamCaseName = h.changeCase.paramCase(name)
  PascalCaseName = h.changeCase.pascalCase(name)
-%>
import { describe, it } from "mocha";
import { expect } from "chai";
import { Entity } from "@agnoc/core/base-classes/entity.base";
import { <%= PascalCaseName %> } from "@agnoc/core/entities/<%= ParamCaseName %>.entity";

describe("<%= ParamCaseName %>.entity", () => {
  it("inherits entity", () => {
    const instance = new <%= PascalCaseName %>({});

    expect(instance).to.be.instanceof(Entity);
  });
});
