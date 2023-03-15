/** Base class for building a mapper. */
export abstract class Mapper<Domain, Target> {
  /** Map a domain object to an external object. */
  abstract toDomain(from: Target, ...args: unknown[]): Domain;
  /** Map an external object to a domain object. */
  abstract fromDomain(from: Domain, ...args: unknown[]): Target;
}
