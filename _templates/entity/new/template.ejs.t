---
to: packages/<%= package %>/src/entities/<%= h.changeCase.paramCase(name) %>.entity.ts
---
<%
  PascalCaseName = h.changeCase.pascalCase(name)
  NoCaseName = h.changeCase.noCase(name)
-%>
import { Entity } from "../base-classes/entity.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";
import { ID } from "../value-objects/id.value-object";

export interface <%= PascalCaseName %>Props {
  id: ID;
}

export class <%= PascalCaseName %> extends Entity<<%= PascalCaseName %>Props> {
  constructor(props: <%= PascalCaseName %>Props) {
    super(props);
    this.validate(props);
  }

  private validate(props: <%= PascalCaseName %>Props): void {
    if (![props.id].map(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in <%= NoCaseName %> constructor"
      );
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException(
        "Invalid id in <%= NoCaseName %> constructor"
      );
    }
  }
}
