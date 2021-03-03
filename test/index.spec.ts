import { describe, it } from 'mocha';
import { helloWorld } from '../src/index';
import { expect } from 'chai';

describe('index', () => {
  it('works', () => {
    expect(helloWorld).to.exist;
  })
})
