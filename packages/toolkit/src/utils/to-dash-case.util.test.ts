import { expect } from 'chai';
import { toDashCase } from './to-dash-case.util';

describe('toDashCase', function () {
  it('should convert camelCase to dash-case', function () {
    expect(toDashCase('camelCase')).to.be.equal('camel-case');
  });

  it('should convert PascalCase to dash-case', function () {
    expect(toDashCase('PascalCase')).to.be.equal('pascal-case');
  });

  it('should convert snake_case to dash-case', function () {
    expect(toDashCase('snake_case')).to.be.equal('snake-case');
  });

  it('should convert UPPER_CASE to dash-case', function () {
    expect(toDashCase('UPPER_CASE')).to.be.equal('upper-case');
  });

  it('should convert dot.case to dash-case', function () {
    expect(toDashCase('dot.case')).to.be.equal('dot-case');
  });

  it('should convert space case to dash-case', function () {
    expect(toDashCase('space case')).to.be.equal('space-case');
  });

  it('should convert Title Case to dash-case', function () {
    expect(toDashCase('Title Case')).to.be.equal('title-case');
  });
});
