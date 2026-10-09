import { compareListingsForDisplay } from './listing.service';

// A full listing, as the listing page and the compare page get it
const full = (id, product, version, certificationDay) => ({
  id,
  product: { name: product },
  version: { version },
  certificationDay,
  certificationDate: Date.parse(`${certificationDay}T00:00:00Z`),
});

// A search result, as the search pages add it to the compare widget
const searchResult = (id, product, version, certificationDate) => ({
  id,
  product: { name: product },
  version: { name: version },
  certificationDate,
});

const idsInOrder = (listings) => [...listings].sort(compareListingsForDisplay).map((l) => l.id);

describe('compareListingsForDisplay', () => {
  it('orders by product name, ignoring case', () => {
    expect(idsInOrder([
      full(1, 'zeta', '1', '2020-01-01'),
      full(2, 'Alpha', '1', '2020-01-01'),
      full(3, 'beta', '1', '2020-01-01'),
    ])).toEqual([2, 3, 1]);
  });

  it('breaks a product name tie by version, with numbers in natural order', () => {
    expect(idsInOrder([
      full(1, 'Product', 'v1.10', '2020-01-01'),
      full(2, 'Product', 'v1.9', '2020-01-01'),
      full(3, 'Product', 'V2.0', '2020-01-01'),
    ])).toEqual([2, 1, 3]);
  });

  it('breaks a version tie by certification date, earliest first', () => {
    expect(idsInOrder([
      full(1, 'Product', '1', '2022-10-20'),
      full(2, 'Product', '1', '2019-03-01'),
      full(3, 'Product', '1', '2021-06-15'),
    ])).toEqual([2, 3, 1]);
  });

  it('orders search results and full listings the same way', () => {
    expect(idsInOrder([
      searchResult(1, 'Product', '1', '2022-10-20'),
      full(2, 'Product', '1', '2019-03-01'),
      searchResult(3, 'Product', 'v0', '2025-01-01'),
    ])).toEqual([2, 1, 3]);
  });
});
