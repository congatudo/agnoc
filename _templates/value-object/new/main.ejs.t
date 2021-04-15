---
to: packages/<%= package %>/src/value-objects/<%= h.changeCase.paramCase(name) %>.value-object.ts
---
<%
  PascalCaseName = h.changeCase.pascalCase(name)
  NoCaseName = h.changeCase.noCase(name)
-%>
import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";

export interface <%= PascalCaseName %>Props {
  foo: string;
}

export class <%= PascalCaseName %> extends ValueObject<<%= PascalCaseName %>Props> {
  get foo(): string {
    return this.props.foo;
  }

  protected validate(props: <%= PascalCaseName %>Props): void {
    if (![props.foo].map(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in <%= NoCaseName %> constructor"
      );
    }
  }
}
