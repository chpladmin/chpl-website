import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplCompareDisplay from './compare-display';

import { goToUrl } from 'services/navigation.service';
import { CompareContext } from 'shared/contexts';

jest.mock('services/navigation.service', () => ({ goToUrl: jest.fn() }));

const deepFreeze = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

// As the widget stores them (search results plus `name`), in the order they were added.
// Frozen, so any in-place sort of the context's array throws.
const listing = (id, product, version, certificationDate) => ({
  id, name: product, product: { name: product }, version: { name: version }, certificationDate,
});
const listings = deepFreeze([
  listing(12, 'beta', '1', '2020-01-01'),
  listing(3, 'Alpha', '2', '2021-01-01'),
  listing(7, 'Alpha', '10', '2019-01-01'),
]);

const renderDisplay = () => render(
  <CompareContext.Provider value={{ listings, removeListing: jest.fn() }}>
    <ChplCompareDisplay onClose={jest.fn()} />
  </CompareContext.Provider>,
);

describe('the compare widget', () => {
  it('lists the listings by product name, then version, ignoring the order they were added', () => {
    renderDisplay();
    expect(screen.getAllByText(/^(Alpha|beta)$/).map((el) => el.textContent)).toEqual(['Alpha', 'Alpha', 'beta']);
    expect(listings.map((l) => l.id)).toEqual([12, 3, 7]);
  });

  it('opens the compare page with the ids in numeric order', () => {
    renderDisplay();
    fireEvent.click(document.getElementById('compare-listings'));
    expect(goToUrl).toHaveBeenCalledWith('/compare/3&7&12');
  });
});
