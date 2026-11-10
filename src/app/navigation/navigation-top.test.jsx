import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplNavigationTop from './navigation-top';

import pageStateReducer from 'components/page-state/pageState.slice';
import { getCurrentUrl, goToState, reloadState } from 'services/navigation.service';

jest.mock('services/navigation.service', () => ({
  getCurrentUrl: jest.fn(),
  goToState: jest.fn(),
  reloadState: jest.fn(),
}));
// Only the logo is under test
jest.mock('./desktop-nav', () => () => null);
jest.mock('./environment-banner', () => () => null);
jest.mock('./mobile-nav-drawer', () => () => null);
jest.mock('components/announcements/announcements-fab', () => () => null);
jest.mock('components/login/toggle', () => () => null);

const hasSearched = 'storageKey-listingsPage-hasSearched';
const pageNumber = 'storageKey-listingsPage-pageNumber';

const renderNav = () => {
  const store = configureStore({
    reducer: { pageState: pageStateReducer },
    preloadedState: { pageState: { [hasSearched]: true, [pageNumber]: 2 } },
  });
  render(
    <Provider store={store}>
      <ChplNavigationTop />
    </Provider>,
  );
  return store;
};

const clickLogo = () => fireEvent.click(screen.getByRole('button', { name: 'Go to CHPL home' }));

describe('the CHPL logo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('goes to the search page from elsewhere', () => {
    getCurrentUrl.mockReturnValue('/listing/1');
    renderNav();
    clickLogo();

    expect(goToState).toHaveBeenCalledWith('search');
    expect(reloadState).not.toHaveBeenCalled();
  });

  it('reloads the search page when already on it', () => {
    getCurrentUrl.mockReturnValue('/search');
    renderNav();
    clickLogo();

    expect(reloadState).toHaveBeenCalled();
  });

  it('forgets that the listings search has been run, keeping the rest of the page state', () => {
    getCurrentUrl.mockReturnValue('/search');
    const store = renderNav();
    clickLogo();

    expect(store.getState().pageState).toEqual({ [pageNumber]: 2 });
  });
});
