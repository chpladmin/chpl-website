import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplListingsPage from './listings';

import browserInfoReducer, { initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';
import { FilterProvider } from 'components/filter';

// A function declaration, so it is hoisted along with the jest.mock calls that use it
function mockLoading() {
  return { isLoading: true, isSuccess: false };
}
jest.mock('api/acbs', () => ({ useFetchAcbs: mockLoading }));
jest.mock('api/standards', () => ({
  useFetchCqms: mockLoading,
  useFetchCriteria: mockLoading,
  useFetchStandards: mockLoading,
}));
jest.mock('./listings-view', () => () => null);
// Only the filters the page builds are under test, so the provider just records them
jest.mock('components/filter', () => ({
  ...jest.requireActual('components/filter'),
  FilterProvider: jest.fn(() => null),
}));

const renderPage = (browserInfo) => {
  const store = configureStore({
    reducer: { browserInfo: browserInfoReducer },
    preloadedState: { browserInfo: { ...browserInfoDefaults, ...browserInfo } },
  });
  render(
    <Provider store={store}>
      <ChplListingsPage />
    </Provider>,
  );
  const { filters } = FilterProvider.mock.calls[FilterProvider.mock.calls.length - 1][0];
  return filters.find((filter) => filter.key === 'quickFilters');
};

const quickQuery = (quickFilters, value) => quickFilters.getQuery({ values: [{ value }] });

describe('the listings search quick filters', () => {
  beforeEach(() => {
    FilterProvider.mockClear();
  });

  it('counts the favorites', () => {
    const quickFilters = renderPage({ favorites: [30, 4, 1000] });

    expect(quickFilters.getValueDisplay({ value: 'Favorites' })).toBe('Favorites (3)');
  });

  it('searches for the favorites by id, in numeric order', () => {
    const quickFilters = renderPage({ favorites: [30, 4, 1000] });

    expect(quickQuery(quickFilters, 'Favorites')).toBe('listingIds=4,30,1000');
  });

  it('has no favorites query when there are no favorites', () => {
    const quickFilters = renderPage({ favorites: [] });

    expect(quickFilters.getValueDisplay({ value: 'Favorites' })).toBe('Favorites (0)');
    expect(quickQuery(quickFilters, 'Favorites')).toBeNull();
  });

  it('still counts and searches the previously compared and viewed listings', () => {
    const quickFilters = renderPage({ previouslyCompared: [5, 2], previouslyViewed: [9] });

    expect(quickFilters.getValueDisplay({ value: 'Previously Compared' })).toBe('Previously Compared (2)');
    expect(quickQuery(quickFilters, 'Previously Compared')).toBe('listingIds=2,5');
    expect(quickQuery(quickFilters, 'Previously Viewed')).toBe('listingIds=9');
  });
});
