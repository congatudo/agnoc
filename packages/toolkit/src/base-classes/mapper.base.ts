export interface Mapper<Domain, Target> {
  toDomain(from: Target): Domain;
  fromDomain(from: Domain): Target;
}
