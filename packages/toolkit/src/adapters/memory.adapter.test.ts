import { expect } from 'chai';
import { ID } from '../domain-primitives/id.domain-primitive';
import { MemoryAdapter } from './memory.adapter';

describe('MemoryAdapter', function () {
  it('should get and set data', function () {
    const adapter = new MemoryAdapter();
    const id = ID.generate();
    const data = { foo: 'bar' };

    adapter.set(id, data);

    expect(adapter.get(id)).to.equal(data);
  });

  it('should delete data', function () {
    const adapter = new MemoryAdapter();
    const id = ID.generate();
    const data = { foo: 'bar' };

    adapter.set(id, data);
    adapter.delete(id);

    expect(adapter.get(id)).to.be.undefined;
  });

  it('should get all data', function () {
    const adapter = new MemoryAdapter();
    const id1 = ID.generate();
    const id2 = ID.generate();
    const data1 = { foo: 'bar' };
    const data2 = { foo: 'baz' };

    adapter.set(id1, data1);
    adapter.set(id2, data2);

    expect(adapter.getAll()).to.deep.equal([data1, data2]);
  });
});
