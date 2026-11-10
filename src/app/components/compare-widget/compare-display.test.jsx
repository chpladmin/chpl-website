import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import ChplCompareDisplay from './compare-display';

import browserInfoReducer, { initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';
import { goToUrl } from 'services/navigation.service';

jest.mock('services/navigation.service', () => ({ goToUrl: jest.fn() }));

// As the widget stores them, in the order they were added. Redux freezes its state,
// so any in-place sort of the stored array throws.
const listing = (id, product, version, certificationDay) => ({
  id, name: product, product: { name: product }, version: { version }, certificationDay,
});
const listings = [
  listing(12, 'beta', '1', '2020-01-01'),
  listing(3, 'Alpha', '2', '2021-01-01'),
  listing(7, 'Alpha', '10', '2019-01-01'),
];

const renderDisplay = () => {
  const store = configureStore({
    reducer: { browserInfo: browserInfoReducer },
    preloadedState: { browserInfo: { ...browserInfoDefaults, compare: listings } },
  });
  render(
    <Provider store={store}>
      <ChplCompareDisplay onClose={jest.fn()} />
    </Provider>,
  );
  return store;
};

const storedIds = (store) => store.getState().browserInfo.compare.map((l) => l.id);

describe('the compare widget', () => {
  it('lists the listings by product name, then version, ignoring the order they were added', () => {
    const store = renderDisplay();

    expect(screen.getAllByText(/^(Alpha|beta)$/).map((el) => el.textContent)).toEqual(['Alpha', 'Alpha', 'beta']);
    expect(storedIds(store)).toEqual([12, 3, 7]);
  });

  it('opens the compare page with the ids in numeric order', () => {
    renderDisplay();
    fireEvent.click(document.getElementById('compare-listings'));

    expect(goToUrl).toHaveBeenCalledWith('/compare/3&7&12');
  });

  it('removes a single listing from the stored list', () => {
    const store = renderDisplay();
    const chip = screen.getAllByText('beta')[0].closest('.MuiChip-root');
    fireEvent.click(chip.querySelector('.MuiChip-deleteIcon'));

    expect(storedIds(store)).toEqual([3, 7]);
  });

  it('removes every listing from the stored list', () => {
    const store = renderDisplay();
    fireEvent.click(document.getElementById('remove-listings'));

    expect(storedIds(store)).toEqual([]);
    expect(document.getElementById('no-products-selected')).toBeInTheDocument();
  });
});
