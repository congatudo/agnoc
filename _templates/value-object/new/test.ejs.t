---
to: packages/<%= package %>/test/unit/value-objects/<%= h.changeCase.paramCase(name) %>.value-object.test.ts
---
<%
  ParamCaseName = h.changeCase.paramCase(name)
  PascalCaseName = h.changeCase.pascalCase(name)
  CamelCaseName = h.changeCase.camelCase(name)
-%>
import { describe, it } from "mocha";
import { expect } from "chai";
import { ValueObject } from "@agnoc/core/base-classes/value-object.base";
import { <%= PascalCaseName %> } from "@agnoc/core/value-objects/<%= ParamCaseName %>.value-object";

describe("<%= ParamCaseName %>.value-object", () => {
  it("inherits value object", () => {
    const <%= CamelCaseName%> = new <%= PascalCaseName %>();

    expect(<%= CamelCaseName%>).to.be.instanceof(ValueObject);
  });
});
