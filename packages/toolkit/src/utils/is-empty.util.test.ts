/* eslint-disable mocha/no-setup-in-describe */
import { expect } from 'chai';
import { isEmpty } from './is-empty.util';

interface Item {
  title: string;
  value: unknown;
}

const emptyList: Item[] = [
  { title: 'null', value: null },
  { title: 'undefined', value: undefined },
  { title: 'empty array', value: [] },
  { title: 'array of empty values', value: [null, undefined, ''] },
  { title: 'empty string', value: '' },
  { title: 'empty null object', value: new Object(null) },
  { title: 'empty object', value: {} },
];

const presentList: Item[] = [
  { title: 'boolean', value: true },
  { title: 'string', value: 'foo' },
  { title: 'object', value: { foo: 'bar' } },
  { title: 'array', value: [1, 2, 3] },
  { title: 'date', value: new Date() },
];

describe('is-empty.util', function () {
  emptyList.forEach(({ title, value }) => {
    it(`returns true when it is empty [${title}]`, function () {
      expect(isEmpty(value), `${title} is empty`).to.be.true;
    });
  });

  presentList.forEach(({ title, value }) => {
    it(`returns false when it is not empty [${title}]`, function () {
      expect(isEmpty(value), `${title} is empty`).to.be.false;
    });
  });
});
