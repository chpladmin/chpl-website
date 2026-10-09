import { compareStrings } from './sort.service';

const sorted = (values) => [...values].sort(compareStrings);

describe('compareStrings', () => {
  it('ignores case', () => {
    expect(sorted(['A', 'C', 'b', 'D', 'e', 'F']).join('')).toBe('AbCDeF');
  });

  it('treats strings differing only in case or accents as equal, keeping their incoming order', () => {
    expect(compareStrings('Apple', 'apple')).toBe(0);
    expect(compareStrings('éclair', 'eclair')).toBe(0);
    expect(sorted(['banana', 'Apple', 'apple', 'APPLE'])).toEqual(['Apple', 'apple', 'APPLE', 'banana']);
  });

  it('orders numbers inside text by value', () => {
    expect(sorted(['item10', 'item2', 'Item1'])).toEqual(['Item1', 'item2', 'item10']);
    expect(sorted(['CMS100v12', 'CMS2v13'])).toEqual(['CMS2v13', 'CMS100v12']);
  });

  it('puts null and undefined last', () => {
    expect(sorted([null, 'b', undefined, 'A'])).toEqual(['A', 'b', null, undefined]);
    expect(compareStrings(null, undefined)).toBe(0);
  });

  it('can sort descending by negating it', () => {
    expect([...['A', 'c', 'B']].sort((a, b) => -compareStrings(a, b))).toEqual(['c', 'B', 'A']);
  });
});
