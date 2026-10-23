import { setActionBar } from 'components/action-bar/actionBar.slice';
import { openWidget } from 'components/action-widget/widget.slice';
import { addCmsLookupId, addCompareListing, toggleFavorite } from 'components/browser/browserInfo.slice';

// `store.js` builds the store as it is imported, so each test loads a fresh copy
// against whatever localStorage it has set up.
const loadStore = () => {
  let store;
  jest.isolateModules(() => {
    store = require('./store').default; // eslint-disable-line global-require
  });
  return store;
};

const persisted = () => JSON.parse(localStorage.getItem('chplState'));

// A full listing, as the old `compare`, `cms` and `favorites` keys held them
const fullListing = (id) => ({
  id,
  chplProductNumber: `15.04.04.1234.PROD.0${id}.00.1.240101`,
  product: { id: 100 + id, name: `Product ${id}` },
  version: { id: 200 + id, version: '1.0' },
  certificationDay: '2024-01-01',
  certificationResults: [{ id: 1, success: true }],
});
const summary = (id) => ({
  id,
  chplProductNumber: `15.04.04.1234.PROD.0${id}.00.1.240101`,
  name: `Product ${id}`,
  product: { name: `Product ${id}` },
  version: { version: '1.0' },
  certificationDay: '2024-01-01',
});

const setOldLists = () => {
  localStorage.setItem('compare', JSON.stringify([fullListing(1), fullListing(2)]));
  localStorage.setItem('cms', JSON.stringify([fullListing(3)]));
  localStorage.setItem('favorites', JSON.stringify([fullListing(4), null, fullListing(5)]));
  localStorage.setItem('storageKey-cmsLookupIds', JSON.stringify(['A014E01O3PSTEAU', 'B014E01O3PSTEAV']));
};

describe('the store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('carrying over the old widget and favorites keys', () => {
    it('moves them into browserInfo when there is no chplState yet', () => {
      setOldLists();
      const { browserInfo } = loadStore().getState();

      expect(browserInfo.compare).toEqual([summary(1), summary(2)]);
      expect(browserInfo.cms).toEqual([summary(3)]);
      expect(browserInfo.favorites).toEqual([4, 5]);
      expect(browserInfo.cmsLookupIds).toEqual(['A014E01O3PSTEAU', 'B014E01O3PSTEAV']);
    });

    it('moves them into an existing chplState that predates them, keeping everything else', () => {
      localStorage.setItem('chplState', JSON.stringify({
        browserInfo: { previouslyViewed: [9, 8] },
        userInfo: { loginState: 'LOGGEDIN', user: { fullName: 'A User' } },
      }));
      setOldLists();
      const state = loadStore().getState();

      expect(state.browserInfo.compare).toEqual([summary(1), summary(2)]);
      expect(state.browserInfo.favorites).toEqual([4, 5]);
      expect(state.browserInfo.cmsLookupIds).toEqual(['A014E01O3PSTEAU', 'B014E01O3PSTEAV']);
      expect(state.browserInfo.previouslyViewed).toEqual([9, 8]);
      expect(state.userInfo.user).toEqual({ fullName: 'A User' });
    });

    it('prefers what chplState already holds over an old key', () => {
      localStorage.setItem('chplState', JSON.stringify({ browserInfo: { compare: [summary(7)], favorites: [7] } }));
      setOldLists();
      const { browserInfo } = loadStore().getState();

      expect(browserInfo.compare).toEqual([summary(7)]);
      expect(browserInfo.favorites).toEqual([7]);
      expect(browserInfo.cms).toEqual([summary(3)]);
    });

    it('removes the old keys once chplState holds the lists', () => {
      setOldLists();
      loadStore();

      ['compare', 'cms', 'favorites', 'storageKey-cmsLookupIds'].forEach((key) => expect(localStorage.getItem(key)).toBeNull());
      expect(persisted().browserInfo.compare).toEqual([summary(1), summary(2)]);
      expect(persisted().browserInfo.favorites).toEqual([4, 5]);
    });

    it('starts the lists empty when the old keys hold nothing usable', () => {
      localStorage.setItem('compare', 'not json');
      localStorage.setItem('favorites', JSON.stringify({ not: 'an array' }));
      localStorage.setItem('storageKey-cmsLookupIds', JSON.stringify([12, null, 'C014E01O3PSTEAW']));
      const { browserInfo } = loadStore().getState();

      expect(browserInfo.compare).toEqual([]);
      expect(browserInfo.cms).toEqual([]);
      expect(browserInfo.favorites).toEqual([]);
      expect(browserInfo.cmsLookupIds).toEqual(['C014E01O3PSTEAW']);
    });
  });

  it('still carries over the AngularJS-era keys', () => {
    localStorage.setItem('ngStorage-currentUser', JSON.stringify({ fullName: 'Old User' }));
    localStorage.setItem('ngStorage-previouslyViewed', JSON.stringify([3, 2, 1]));
    const state = loadStore().getState();

    expect(state.userInfo).toEqual({ loginState: 'LOGGEDIN', user: { fullName: 'Old User' } });
    expect(state.browserInfo.previouslyViewed).toEqual([3, 2, 1]);
    expect(localStorage.getItem('ngStorage-currentUser')).toBeNull();
  });

  it('persists the widget and favorites lists as they change', () => {
    const store = loadStore();
    store.dispatch(addCompareListing(fullListing(1)));
    store.dispatch(toggleFavorite({ id: 2 }));

    expect(persisted().browserInfo.compare).toEqual([summary(1)]);
    expect(persisted().browserInfo.favorites).toEqual([2]);
  });

  it('keeps the CMS ID lookup ids across a reload', () => {
    const store = loadStore();
    store.dispatch(addCmsLookupId('A014E01O3PSTEAU'));
    store.dispatch(addCmsLookupId('B014E01O3PSTEAV'));

    expect(persisted().browserInfo.cmsLookupIds).toEqual(['A014E01O3PSTEAU', 'B014E01O3PSTEAV']);
    expect(loadStore().getState().browserInfo.cmsLookupIds).toEqual(['A014E01O3PSTEAU', 'B014E01O3PSTEAV']);
  });

  it('persists the open widget, and restores it on the next load', () => {
    loadStore().dispatch(openWidget('cms'));

    expect(persisted().widget).toEqual({ open: 'cms' });
    expect(loadStore().getState().widget).toEqual({ open: 'cms' });
  });

  it('never persists the action bar', () => {
    loadStore().dispatch(setActionBar({ canSave: false }));

    expect(persisted()).not.toHaveProperty('actionBar');
  });
});
