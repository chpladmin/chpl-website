import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplCompareButton from './compare-button';

import widgetReducer from 'components/action-widget/widget.slice';
import browserInfoReducer, { initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';

const listing = {
  id: 7,
  chplProductNumber: '15.04.04.1234.PROD.07.00.1.240101',
  product: { id: 1, name: 'Product' },
  version: { id: 2, name: '1.0' },
  certificationDate: '2024-01-01',
};

const renderButton = ({ compare = [], open = null } = {}) => {
  const store = configureStore({
    reducer: { browserInfo: browserInfoReducer, widget: widgetReducer },
    preloadedState: {
      browserInfo: { ...browserInfoDefaults, compare },
      widget: { open },
    },
  });
  render(
    <Provider store={store}>
      <ChplCompareButton listing={listing} />
    </Provider>,
  );
  return store;
};

describe('the compare button', () => {
  it('adds the listing to the compare widget and opens it, closing the CMS ID widget', () => {
    const store = renderButton({ open: 'cms' });
    fireEvent.click(screen.getByRole('button', { name: /Compare/ }));

    expect(store.getState().browserInfo.compare.map((l) => l.id)).toEqual([7]);
    expect(store.getState().widget.open).toBe('compare');
  });

  it('removes a listing already in the compare widget, keeping it open', () => {
    const store = renderButton({ compare: [{ id: 7, name: 'Product' }, { id: 8, name: 'Other' }] });
    fireEvent.click(screen.getByRole('button', { name: /Compare/ }));

    expect(store.getState().browserInfo.compare.map((l) => l.id)).toEqual([8]);
    expect(store.getState().widget.open).toBe('compare');
  });

  it('shows as a remove button while the listing is in the compare widget', () => {
    renderButton({ compare: [{ id: 7, name: 'Product' }] });

    expect(screen.getByRole('button', { name: /Compare/ }).className).toMatch(/deleteButtonOutlined/);
  });

  it('shows as an add button while the listing is not in the compare widget', () => {
    renderButton({ compare: [{ id: 8, name: 'Other' }] });

    expect(screen.getByRole('button', { name: /Compare/ }).className).not.toMatch(/deleteButtonOutlined/);
  });
});
