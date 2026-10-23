import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplCmsButton from './cms-button';

import widgetReducer from 'components/action-widget/widget.slice';
import browserInfoReducer, { initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';
import { FlagContext } from 'shared/contexts';

const curesListing = {
  id: 7,
  chplProductNumber: '15.04.04.1234.PROD.07.00.1.240101',
  product: { id: 1, name: 'Product' },
  version: { id: 2, name: '1.0' },
  certificationDate: '2024-01-01',
  curesUpdate: true,
};

const renderButton = ({
  listing = curesListing,
  cms = [],
  open = null,
  cmsDisabledIsOn = false,
} = {}) => {
  const store = configureStore({
    reducer: { browserInfo: browserInfoReducer, widget: widgetReducer },
    preloadedState: {
      browserInfo: { ...browserInfoDefaults, cms },
      widget: { open },
    },
  });
  render(
    <Provider store={store}>
      <FlagContext.Provider value={{ cmsDisabledIsOn }}>
        <ChplCmsButton listing={listing} />
      </FlagContext.Provider>
    </Provider>,
  );
  return store;
};

describe('the CMS ID button', () => {
  it('adds the listing to the CMS ID widget and opens it, closing the compare widget', () => {
    const store = renderButton({ open: 'compare' });
    fireEvent.click(screen.getByRole('button', { name: /Cert ID/ }));

    expect(store.getState().browserInfo.cms.map((l) => l.id)).toEqual([7]);
    expect(store.getState().widget.open).toBe('cms');
  });

  it('removes a listing already in the CMS ID widget, keeping it open', () => {
    const store = renderButton({ cms: [{ id: 7, name: 'Product' }, { id: 8, name: 'Other' }] });
    fireEvent.click(screen.getByRole('button', { name: /Cert ID/ }));

    expect(store.getState().browserInfo.cms.map((l) => l.id)).toEqual([8]);
    expect(store.getState().widget.open).toBe('cms');
  });

  it('shows for a listing with no edition', () => {
    renderButton({ listing: { ...curesListing, curesUpdate: false, edition: null } });

    expect(screen.getByRole('button', { name: /Cert ID/ })).toBeInTheDocument();
  });

  it('does not show for a listing that is neither Cures Update nor edition-less', () => {
    renderButton({ listing: { ...curesListing, curesUpdate: false, edition: { name: '2015' } } });

    expect(screen.queryByRole('button', { name: /Cert ID/ })).not.toBeInTheDocument();
  });

  it('does not show while the CMS ID creator is disabled', () => {
    renderButton({ cmsDisabledIsOn: true });

    expect(screen.queryByRole('button', { name: /Cert ID/ })).not.toBeInTheDocument();
  });
});
