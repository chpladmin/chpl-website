import { compareBoolean, compareObject, comparePrimitive } from './reports.v2.service';

describe('compareBoolean', () => {
  const flag = (value) => ({ flag: value });
  const describeChange = (before, after) => compareBoolean(flag(before), flag(after), 'flag', 'Flag');

  it.each([
    [true, false, 'Flag changed from "Yes" to "No"'],
    [false, true, 'Flag changed from "No" to "Yes"'],
    [undefined, true, 'Flag set to "Yes"'],
    [undefined, false, 'Flag set to "No"'],
    [true, undefined, 'Flag cleared (was "Yes")'],
    [false, undefined, 'Flag cleared (was "No")'],
  ])('describes %p becoming %p', (before, after, expected) => {
    expect(describeChange(before, after)).toBe(expected);
  });

  it('treats null as unset', () => {
    expect(describeChange(null, true)).toBe('Flag set to "Yes"');
    expect(describeChange(false, null)).toBe('Flag cleared (was "No")');
    expect(describeChange(null, undefined)).toBeUndefined();
  });

  it('returns nothing when the value did not change', () => {
    expect(describeChange(true, true)).toBeUndefined();
    expect(describeChange(false, false)).toBeUndefined();
    expect(describeChange(undefined, undefined)).toBeUndefined();
  });

  it('handles a missing before or after object', () => {
    expect(compareBoolean(undefined, flag(true), 'flag', 'Flag')).toBe('Flag set to "Yes"');
    expect(compareBoolean(flag(false), undefined, 'flag', 'Flag')).toBe('Flag cleared (was "No")');
  });
});

describe('compareObject', () => {
  const lookup = {
    'root.flag': { message: (before, after) => compareBoolean(before, after, 'flag', 'Flag') },
    'root.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  };

  it('compares keys that only exist in the after object', () => {
    expect(compareObject({ name: 'a' }, { name: 'a', flag: false }, lookup))
      .toEqual(['Flag set to "No"']);
  });

  it('compares keys that only exist in the before object', () => {
    expect(compareObject({ name: 'a', flag: true }, { name: 'a' }, lookup))
      .toEqual(['Flag cleared (was "Yes")']);
  });

  it('compares every key of an empty before object against after', () => {
    expect(compareObject({}, { name: 'a', flag: true }, lookup))
      .toEqual(['Name added: a', 'Flag set to "Yes"']);
  });

  it('reports each changed key once when both sides have it', () => {
    expect(compareObject({ name: 'a', flag: true }, { name: 'b', flag: false }, lookup))
      .toEqual(['Name changed from "a" to "b"', 'Flag changed from "Yes" to "No"']);
  });
});
