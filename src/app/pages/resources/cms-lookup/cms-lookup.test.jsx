import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplCmsLookup from './cms-lookup';

import { useFetchListings } from 'api/cms';
import browserInfoReducer, { initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';

jest.mock('api/cms', () => ({
  useFetchListings: jest.fn(),
}));
// Stand-ins for the search box and the chips, which send the page the same actions
jest.mock('components/cms/search-term', () => function ChplSearchTerm({ dispatch }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('button', {
    type: 'button',
    onClick: () => dispatch({ action: 'search', payload: ' C014E01O3PSTEAW ' }),
  }, 'Search');
});
jest.mock('components/cms/chips', () => function ChplChips({ cmsIds, dispatch }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', null, cmsIds.map((id) => mockReact.createElement('button', {
    key: id,
    type: 'button',
    onClick: () => dispatch({ action: 'remove', payload: id }),
  }, `Remove ${id}`)));
});

const renderPage = (cmsLookupIds = []) => {
  const store = configureStore({
    reducer: { browserInfo: browserInfoReducer },
    preloadedState: { browserInfo: { ...browserInfoDefaults, cmsLookupIds } },
  });
  render(
    <Provider store={store}>
      <ChplCmsLookup />
    </Provider>,
  );
  return store;
};

describe('the CMS ID Reverse Lookup page', () => {
  beforeEach(() => {
    useFetchListings.mockReturnValue([]);
  });

  it('looks up the ids entered on an earlier visit', () => {
    renderPage(['A014E01O3PSTEAU', 'B014E01O3PSTEAV']);

    expect(useFetchListings).toHaveBeenLastCalledWith({ cmsIds: ['A014E01O3PSTEAU', 'B014E01O3PSTEAV'] });
    expect(screen.getByRole('button', { name: 'Remove B014E01O3PSTEAV' })).toBeInTheDocument();
  });

  it('adds a searched id, trimmed, and looks it up', () => {
    const store = renderPage(['A014E01O3PSTEAU']);
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(store.getState().browserInfo.cmsLookupIds).toEqual(['A014E01O3PSTEAU', 'C014E01O3PSTEAW']);
    expect(useFetchListings).toHaveBeenLastCalledWith({ cmsIds: ['A014E01O3PSTEAU', 'C014E01O3PSTEAW'] });
  });

  it('does not add an id already entered', () => {
    const store = renderPage(['C014E01O3PSTEAW']);
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(store.getState().browserInfo.cmsLookupIds).toEqual(['C014E01O3PSTEAW']);
  });

  it('removes an id from its chip', () => {
    const store = renderPage(['A014E01O3PSTEAU', 'B014E01O3PSTEAV']);
    fireEvent.click(screen.getByRole('button', { name: 'Remove A014E01O3PSTEAU' }));

    expect(store.getState().browserInfo.cmsLookupIds).toEqual(['B014E01O3PSTEAV']);
    expect(screen.queryByRole('button', { name: 'Remove A014E01O3PSTEAU' })).not.toBeInTheDocument();
  });
});
