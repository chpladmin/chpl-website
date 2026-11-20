import { sortCriteria } from './criteria.service';

describe('sortCriteria', () => {
  it('orders criteria by their regulatory position, not alphabetically', () => {
    const criteria = [
      { id: 1, number: '170.314 (a)(10)' },
      { id: 2, number: '170.315 (b)(1)' },
      { id: 3, number: '170.314 (a)(2)' },
      { id: 4, number: '170.315 (a)(1)' },
    ];
    expect([...criteria].sort(sortCriteria).map((c) => c.number)).toEqual([
      '170.315 (a)(1)',
      '170.315 (b)(1)',
      '170.314 (a)(2)',
      '170.314 (a)(10)',
    ]);
  });

  it('falls back to certificationNumber when there is no number', () => {
    expect(sortCriteria({ certificationNumber: '170.315 (a)(1)' }, { number: '170.315 (a)(2)' })).toBeLessThan(0);
    expect(sortCriteria({ certificationNumber: '170.315 (a)(2)' }, { number: '170.315 (a)(1)' })).toBeGreaterThan(0);
  });

  it('breaks a tie between criteria with the same number by id', () => {
    expect(sortCriteria({ id: 1, number: '170.315 (b)(3)' }, { id: 2, number: '170.315 (b)(3)' })).toBeLessThan(0);
    expect(sortCriteria({ id: 2, number: '170.315 (b)(3)' }, { id: 1, number: '170.315 (b)(3)' })).toBeGreaterThan(0);
    expect(sortCriteria({ id: 1, number: '170.315 (b)(3)' }, { id: 1, number: '170.315 (b)(3)' })).toBe(0);
  });

  it('treats criteria with the same number and no id as equal, rather than returning NaN', () => {
    expect(sortCriteria({ number: '170.314 (d)(5)' }, { number: '170.314 (d)(5)' })).toBe(0);
  });

  it('still orders criteria without ids by number', () => {
    expect(sortCriteria({ number: '170.314 (a)(1)' }, { number: '170.314 (a)(2)' })).toBeLessThan(0);
  });
});
