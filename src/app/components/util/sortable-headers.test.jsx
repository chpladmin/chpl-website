import { sortComparator } from './sortable-headers';

// The comparator as it was before string sorts ignored case
const previousComparator = (property, sortDescending) => (a, b) => ((a[property] < b[property]) ? -1 : 1) * (sortDescending ? -1 : 1);

const rows = (property, values) => values.map((value) => ({ [property]: value }));
const sortedValues = (property, values, comparator) => rows(property, values).sort(comparator).map((r) => r[property]);

describe('sortComparator', () => {
  describe('existing behavior that must not change', () => {
    const cases = {
      numbers: [42, 7, 1000, -3, 0],
      'epoch dates': [1696118400000, 1577836800000, 1704067200000],
      'ISO dates': ['2024-01-02', '2023-12-31', '2024-10-09', '2019-06-17'],
      'CHPL product numbers': ['15.04.04.2913.Proc.10.01.1.231201', '15.04.04.2913.Proc.09.01.1.231201', '15.02.05.1234.ABCD.01.00.0.190101'],
      booleans: [true, false],
    };
    Object.entries(cases).forEach(([name, values]) => {
      [false, true].forEach((descending) => {
        it(`sorts ${name} ${descending ? 'descending' : 'ascending'} as before`, () => {
          expect(sortedValues('key', values, sortComparator('key', descending)))
            .toEqual(sortedValues('key', values, previousComparator('key', descending)));
        });
      });
    });
  });

  describe('strings', () => {
    it('ignore case', () => {
      expect(sortedValues('name', ['A', 'C', 'b', 'D', 'e', 'F'], sortComparator('name')).join('')).toBe('AbCDeF');
      expect(sortedValues('name', ['A', 'C', 'b', 'D', 'e', 'F'], previousComparator('name')).join('')).toBe('ACDFbe');
    });

    it('order numbers inside text by value', () => {
      expect(sortedValues('number', ['170.315 (a)(10)', '170.315 (a)(2)', '170.315 (a)(1)'], sortComparator('number')))
        .toEqual(['170.315 (a)(1)', '170.315 (a)(2)', '170.315 (a)(10)']);
    });

    it('sort descending ignoring case', () => {
      expect(sortedValues('name', ['a', 'C', 'b'], sortComparator('name', true))).toEqual(['C', 'b', 'a']);
    });

    it('keep equal values in their incoming order', () => {
      expect(sortComparator('name')({ name: 'Apple' }, { name: 'apple' })).toBe(0);
      expect(sortComparator('count')({ count: 3 }, { count: 3 })).toBe(0);
    });

    it('put missing values last when sorting strings', () => {
      expect(sortedValues('name', ['b', null, 'A'], sortComparator('name'))).toEqual(['A', 'b', null]);
    });
  });
});
