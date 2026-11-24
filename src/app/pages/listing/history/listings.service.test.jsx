import { compareListing } from './listings.service';

// Older (2014 Edition) activity records: no criterion object and no id on each certification result
const result = (number, overrides = {}) => ({
  number,
  title: `Criterion ${number}`,
  success: true,
  gap: null,
  ...overrides,
});

describe('compareListing certification results', () => {
  let debug;

  beforeEach(() => {
    debug = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    debug.mockRestore();
  });

  const invalidSorts = () => debug.mock.calls.filter(([msg]) => msg === 'Invalid sort');

  it('reports no changes, and no invalid sorts, when results without ids are unchanged', () => {
    const before = { certificationResults: [result('170.314 (d)(5)'), result('170.314 (a)(9)')] };
    const after = { certificationResults: [result('170.314 (a)(9)'), result('170.314 (d)(5)')] };
    expect(compareListing(before, after)).toEqual([]);
    expect(invalidSorts()).toEqual([]);
  });

  it('reports a change inside a result that has no id', () => {
    const before = { certificationResults: [result('170.314 (d)(5)'), result('170.314 (a)(9)')] };
    const after = { certificationResults: [result('170.314 (d)(5)'), result('170.314 (a)(9)', { success: false })] };
    const changes = compareListing(before, after);
    expect(changes).toHaveLength(1);
    expect(changes[0]).toContain('Certification Criteria changes');
    expect(changes[0]).toContain('170.314 (a)(9) changes');
    expect(changes[0]).toContain('Successful changed from "Yes" to "No"');
    expect(changes[0]).not.toContain('170.314 (d)(5)');
    expect(invalidSorts()).toEqual([]);
  });

  it('reports results without ids being added and removed', () => {
    const before = { certificationResults: [result('170.314 (d)(5)'), result('170.314 (a)(9)')] };
    const after = { certificationResults: [result('170.314 (d)(5)'), result('170.314 (a)(1)')] };
    const [changes] = compareListing(before, after);
    expect(changes).toContain('Added 170.314 (a)(1)');
    expect(changes).toContain('Removed 170.314 (a)(9)');
  });

  it('still matches results carrying a criterion and id', () => {
    const withCriterion = (id, success) => ({ id, success, criterion: { id: 100 + id, number: '170.315 (b)(3)', title: 'Electronic Prescribing' } });
    const before = { certificationResults: [withCriterion(1, true)] };
    const after = { certificationResults: [withCriterion(1, false)] };
    const [changes] = compareListing(before, after);
    expect(changes).toContain('170.315 (b)(3) changes');
    expect(changes).toContain('Successful changed from "Yes" to "No"');
  });
});
