import reducer, {
  MAX_REMEMBERED,
  addCmsListing,
  addCmsLookupId,
  addCompareListing,
  clearCmsListings,
  clearCompareListings,
  initialState,
  pushPreviouslyViewed,
  removeCmsListing,
  removeCmsLookupId,
  removeCompareListing,
  setCompareListings,
  toggleFavorite,
} from './browserInfo.slice';

// A full listing, as the listing and compare pages hand it over
const fullListing = (id, product = `Product ${id}`) => ({
  id,
  chplProductNumber: `15.04.04.1234.PROD.0${id}.00.1.240101`,
  product: { id: 100 + id, name: product },
  version: { id: 200 + id, version: '1.0' },
  certificationDay: '2024-01-01',
  certificationDate: 1704067200000,
  certificationResults: [{ id: 1, success: true }],
  cqmResults: [{ id: 1 }],
  curesUpdate: true,
});

// A search result, as the search pages hand it over
const searchResult = (id, product = `Product ${id}`) => ({
  id,
  chplProductNumber: `15.04.04.1234.PROD.0${id}.00.1.240101`,
  product: { id: 100 + id, name: product },
  version: { id: 200 + id, name: '2.0' },
  certificationDate: '2023-06-30',
  developer: { id: 1, name: 'Developer' },
});

const apply = (...actions) => actions.reduce(reducer, initialState);

describe('browserInfo', () => {
  it('starts with empty widget and favorites lists', () => {
    expect(initialState).toEqual(expect.objectContaining({
      cms: [],
      cmsLookupIds: [],
      compare: [],
      favorites: [],
    }));
  });

  describe.each([
    ['compare', addCompareListing, removeCompareListing, clearCompareListings],
    ['cms', addCmsListing, removeCmsListing, clearCmsListings],
  ])('the %s widget list', (key, add, remove, clear) => {
    it('keeps only a summary of a full listing', () => {
      expect(apply(add(fullListing(1)))[key]).toEqual([{
        id: 1,
        chplProductNumber: '15.04.04.1234.PROD.01.00.1.240101',
        name: 'Product 1',
        product: { name: 'Product 1' },
        version: { version: '1.0' },
        certificationDay: '2024-01-01',
      }]);
    });

    it('keeps a search result in the same shape', () => {
      expect(apply(add(searchResult(2)))[key]).toEqual([{
        id: 2,
        chplProductNumber: '15.04.04.1234.PROD.02.00.1.240101',
        name: 'Product 2',
        product: { name: 'Product 2' },
        version: { version: '2.0' },
        certificationDay: '2023-06-30',
      }]);
    });

    it('keeps the order listings were added in, and ignores a listing already there', () => {
      const ids = apply(add(fullListing(3)), add(searchResult(1)), add(fullListing(3)))[key].map((l) => l.id);

      expect(ids).toEqual([3, 1]);
    });

    it('removes a listing by id', () => {
      const ids = apply(add(fullListing(1)), add(fullListing(2)), remove({ id: 1 }))[key].map((l) => l.id);

      expect(ids).toEqual([2]);
    });

    it('clears every listing', () => {
      expect(apply(add(fullListing(1)), add(fullListing(2)), clear())[key]).toEqual([]);
    });
  });

  it('replaces the compare list, e.g. with the CMS ID widget\'s listings', () => {
    const state = apply(
      addCompareListing(fullListing(1)),
      addCmsListing(fullListing(2)),
      addCmsListing(searchResult(3)),
    );
    const replaced = reducer(state, setCompareListings(state.cms));

    expect(replaced.compare).toEqual(state.cms);
    expect(replaced.cms).toEqual(state.cms);
  });

  it('keeps the compare and CMS lists separate', () => {
    const state = apply(addCompareListing(fullListing(1)), addCmsListing(fullListing(2)));

    expect(state.compare.map((l) => l.id)).toEqual([1]);
    expect(state.cms.map((l) => l.id)).toEqual([2]);
  });

  describe('favorites', () => {
    it('adds a listing as its id', () => {
      expect(apply(toggleFavorite(fullListing(5))).favorites).toEqual([5]);
    });

    it('removes a favorited listing when toggled again', () => {
      expect(apply(toggleFavorite({ id: 5 }), toggleFavorite({ id: 6 }), toggleFavorite({ id: 5 })).favorites).toEqual([6]);
    });
  });

  describe('CMS ID lookup ids', () => {
    it('adds an id trimmed, in the order entered, ignoring one already there', () => {
      expect(apply(addCmsLookupId(' A014E01O3PSTEAU '), addCmsLookupId('B'), addCmsLookupId('A014E01O3PSTEAU')).cmsLookupIds)
        .toEqual(['A014E01O3PSTEAU', 'B']);
    });

    it('removes an id', () => {
      expect(apply(addCmsLookupId('A'), addCmsLookupId('B'), removeCmsLookupId('A')).cmsLookupIds).toEqual(['B']);
    });
  });

  it('still remembers the most recently viewed listings first, up to the limit', () => {
    const viewed = Array.from({ length: MAX_REMEMBERED + 2 }, (_, i) => pushPreviouslyViewed({ id: i }));
    const state = apply(...viewed, pushPreviouslyViewed({ id: 5 }));

    expect(state.previouslyViewed).toHaveLength(MAX_REMEMBERED);
    expect(state.previouslyViewed.slice(0, 2)).toEqual([5, MAX_REMEMBERED + 1]);
  });
});
