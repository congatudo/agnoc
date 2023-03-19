import { anything, imock, instance, spy, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ID } from '../domain-primitives/id.domain-primitive';
import { AggregateRoot } from './aggregate-root.base';
import { Repository } from './repository.base';
import type { Adapter } from './adapter.base';
import type { EntityProps } from './entity.base';
import type { EventBus } from './event-bus.base';

describe('Repository', function () {
  let eventBus: EventBus;
  let adapter: Adapter;
  let dummyRepository: DummyRepository;

  beforeEach(function () {
    eventBus = imock();
    adapter = imock();
    dummyRepository = new DummyRepository(instance(eventBus), instance(adapter));
  });

  it('should find one by id', async function () {
    const id = ID.generate();
    const entity = new DummyAggregateRoot({ id });

    when(adapter.get(anything())).thenReturn(entity);

    const ret = await dummyRepository.findOneById(id);

    expect(ret).to.be.equal(entity);

    verify(adapter.get(id)).once();
  });

  it('should find all', async function () {
    const id = ID.generate();
    const entity = new DummyAggregateRoot({ id });

    when(adapter.getAll()).thenReturn([entity]);

    const ret = await dummyRepository.findAll();

    expect(ret).to.be.deep.equal([entity]);

    verify(adapter.getAll()).once();
  });

  it('should save one', async function () {
    const id = ID.generate();
    const entity = new DummyAggregateRoot({ id });
    const entitySpy = spy(entity);

    await dummyRepository.saveOne(entity);

    verify(adapter.set(id, entity)).once();
    verify(entitySpy.publishEvents(instance(eventBus))).once();
  });

  it('should delete one', async function () {
    const id = ID.generate();
    const entity = new DummyAggregateRoot({ id });
    const entitySpy = spy(entity);

    await dummyRepository.deleteOne(entity);

    verify(adapter.delete(id)).once();
    verify(entitySpy.publishEvents(instance(eventBus))).once();
  });
});

class DummyAggregateRoot extends AggregateRoot<EntityProps> {
  protected validate(_: EntityProps): void {
    // noop
  }
}

class DummyRepository extends Repository<DummyAggregateRoot> {}
