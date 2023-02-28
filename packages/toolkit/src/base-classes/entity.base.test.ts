import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ID } from '../domain-primitives/id.domain-primitive';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { Entity } from './entity.base';

describe('entity.base', () => {
  it('throws an error when does not have props', () => {
    type EntityProps = { id: ID };

    class DummyEntity extends Entity<EntityProps> {
      protected validate(_: EntityProps): void {
        // noop
      }
    }

    expect(() => {
      // @ts-expect-error expected argument
      new DummyEntity();
    }).to.throw(ArgumentInvalidException, 'Cannot create DummyEntity from non-object props');
  });

  it('throws an error when does not have an id', () => {
    type EntityProps = { id: ID };

    class DummyEntity extends Entity<EntityProps> {
      protected validate(_: EntityProps): void {
        // noop
      }
    }

    expect(() => {
      // @ts-expect-error argument invalid
      new DummyEntity({ foo: 'bar' });
    }).to.throw(ArgumentNotProvidedException, `Property 'id' for DummyEntity not provided`);
  });

  it('throws an error when has an invalid id', () => {
    type EntityProps = { id: ID };

    class DummyEntity extends Entity<EntityProps> {
      protected validate(_: EntityProps): void {
        // noop
      }
    }

    expect(() => {
      // @ts-expect-error argument invalid
      new DummyEntity({ id: 123 });
    }).to.throw(ArgumentInvalidException, `Property 'id' for DummyEntity must be an instance of ID`);
  });

  it('has id property', () => {
    type EntityProps = { id: ID };

    class DummyEntity extends Entity<EntityProps> {
      protected validate(_: EntityProps): void {
        // noop
      }
    }

    const id = ID.generate();
    const dummyEntity = new DummyEntity({ id });

    expect(dummyEntity.id.equals(id)).to.be.true;
  });

  it('has identity equality', () => {
    type EntityProps = { id: ID };

    class DummyEntity extends Entity<EntityProps> {
      protected validate(_: EntityProps): void {
        // noop
      }
    }

    const firstEntity = new DummyEntity({ id: new ID(1) });
    const secondEntity = new DummyEntity({ id: new ID(1) });
    const thirdEntity = new DummyEntity({ id: new ID(2) });

    expect(firstEntity.equals(firstEntity), 'a equals a').to.be.true;
    expect(firstEntity.equals(secondEntity), 'a equals b').to.be.true;
    expect(firstEntity.equals(thirdEntity), 'a not equals c').to.be.false;
    expect(firstEntity.equals(), 'a not equals null').to.be.false;
    // @ts-expect-error argument not assignable
    expect(firstEntity.equals('foo'), 'a not equals a non-entity').to.be.false;
  });

  it('is an entity', () => {
    type EntityProps = { id: ID };

    class DummyEntity extends Entity<EntityProps> {
      protected validate(_: EntityProps): void {
        // noop
      }
    }

    const dummyEntity = new DummyEntity({ id: ID.generate() });

    expect(Entity.isEntity(dummyEntity)).to.be.true;
  });

  it('returns a copy of itself', () => {
    type EntityProps = { id: ID; foo: string };

    class DummyEntity extends Entity<EntityProps> {
      protected validate(_: EntityProps): void {
        // noop
      }
    }

    const dummyEntity = new DummyEntity({ id: new ID(1), foo: 'bar' });
    const cloneEntity = dummyEntity.clone({ foo: 'foo' });

    expect(cloneEntity).to.be.instanceof(DummyEntity);
    expect(cloneEntity.toJSON()).to.be.deep.equal({
      id: 1,
      foo: 'foo',
    });
  });

  it('returns a copy of its props as a frozen object', () => {
    type EntityProps = { id: ID; foo: string };

    class DummyEntity extends Entity<EntityProps> {
      protected validate(_: EntityProps): void {
        // noop
      }
    }

    const dummyEntity = new DummyEntity({ id: new ID(1), foo: 'bar' });

    expect(dummyEntity.toJSON()).to.be.deep.equal({
      id: 1,
      foo: 'bar',
    });
  });

  it('returns a copy of its props as a string', () => {
    type EntityProps = { id: ID; foo: string };

    class DummyEntity extends Entity<EntityProps> {
      protected validate(_: EntityProps): void {
        // noop
      }
    }

    const dummyEntity = new DummyEntity({ id: new ID(1), foo: 'bar' });

    expect(dummyEntity.toString()).to.be.deep.equal('{"id":1,"foo":"bar"}');
  });
});
