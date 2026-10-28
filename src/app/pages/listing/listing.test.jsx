import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplListingPage from './listing';

import { useFetchListing } from 'api/listing';
import browserInfoReducer, { initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';
import userInfoReducer from 'components/login/userInfo.slice';

jest.mock('api/axios', () => ({
  useFreshAccessToken: () => jest.fn(),
}));
jest.mock('api/listing', () => ({
  useFetchListing: jest.fn(),
}));
// The rest of the page is covered elsewhere; only the favorite toggle in the header is under test
jest.mock('components/action-widget/action-button', () => () => null);
jest.mock('components/listing/listing-view', () => () => null);
jest.mock('./history/listing-history', () => () => null);

const listing = {
  id: 42,
  chplProductNumber: '15.04.04.1234.PROD.01.00.1.240101',
  product: { id: 1, name: 'Product' },
  currentStatus: { status: { name: 'Active' } },
  certifyingBody: { id: 1, name: 'ACB' },
  edition: null,
};

const renderPage = (favorites = []) => {
  const store = configureStore({
    reducer: { browserInfo: browserInfoReducer, userInfo: userInfoReducer },
    preloadedState: { browserInfo: { ...browserInfoDefaults, favorites } },
  });
  render(
    <Provider store={store}>
      <ChplListingPage id={listing.id} />
    </Provider>,
  );
  return store;
};

describe('favoriting a listing', () => {
  beforeEach(() => {
    useFetchListing.mockReturnValue({ data: listing, isLoading: false, isSuccess: true });
  });

  it('adds the listing to the favorites, as its id', () => {
    const store = renderPage([7]);
    fireEvent.click(screen.getByRole('button', { name: 'Favorite' }));

    expect(store.getState().browserInfo.favorites).toEqual([7, 42]);
    expect(screen.getByRole('button', { name: 'Unfavorite' })).toBeInTheDocument();
    expect(screen.getByText('This listing is in your favorites!')).toBeInTheDocument();
  });

  it('shows a listing already in the favorites as favorited', () => {
    renderPage([42]);

    expect(screen.getByRole('button', { name: 'Unfavorite' })).toBeInTheDocument();
  });

  it('removes a favorited listing, keeping the other favorites', () => {
    const store = renderPage([7, 42, 9]);
    fireEvent.click(screen.getByRole('button', { name: 'Unfavorite' }));

    expect(store.getState().browserInfo.favorites).toEqual([7, 9]);
    expect(screen.getByRole('button', { name: 'Favorite' })).toBeInTheDocument();
  });

  it('still remembers the listing as previously viewed', () => {
    const store = renderPage();

    expect(store.getState().browserInfo.previouslyViewed).toEqual([42]);
  });
});
