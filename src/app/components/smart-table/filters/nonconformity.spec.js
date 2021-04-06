import { nonconformity } from './nonconformity';

const mock = {
  collection: [
    '{"openNonConformityCount":0,"closedNonConformityCount":1}',
    '{"openNonConformityCount":1,"closedNonConformityCount":0}',
    '{"openNonConformityCount":1,"closedNonConformityCount":1}',
  ],
};

describe('the nonconformity filter', () => {
  it('should not allow items with no data', () => {
    const filter = {nonconformities: {}};
    let result = nonconformity(undefined, filter);
    expect(result).toEqual(false);
  });

  it('should allow all with no filter', () => {
    const filter = {nonconformities: {}};
    let results = mock.collection.map(c => nonconformity(c, filter));
    expect(results).toEqual([true, true, true]);
  });

  it('should filter on "open NCs"', () => {
    const filter = {nonconformities: {open: true}};
    let results = mock.collection.map(c => nonconformity(c, filter));
    expect(results).toEqual([false, true, true]);
  });

  it('should filter on "closed NCs"', () => {
    const filter = {nonconformities: {closed: true}};
    let results = mock.collection.map(c => nonconformity(c, filter));
    expect(results).toEqual([true, false, true]);
  });

  it('should allow all on "open or closed NCs"', () => {
    const filter = {nonconformities: {open: true, closed: true}};
    let results = mock.collection.map(c => nonconformity(c, filter));
    expect(results).toEqual([true, true, true]);
  });

  it('should not allow all on "open and closed NCs and matchAll"', () => {
    const filter = {nonconformities: {open: true, closed: true, matchAll: true}};
    let results = mock.collection.map(c => nonconformity(c, filter));
    expect(results).toEqual([false, false, true]);
  });

  it('should not allow any on "not-open and not-closed NCs and matchAll"', () => {
    const filter = {nonconformities: {matchAll: true}};
    let results = mock.collection.map(c => nonconformity(c, filter));
    expect(results).toEqual([false, false, false]);
  });
});
