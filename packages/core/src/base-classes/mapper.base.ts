export interface Mapper<Domain, Robot> {
  toDomain(from: Robot): Domain;
  toRobot(from: Domain): Robot;
}
