import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplCompareDisplay from './compare-display';

import { goToUrl } from 'services/navigation.service';
import { CompareContext } from 'shared/contexts';

jest.mock('services/navigation.service', () => ({ goToUrl: jest.fn() }));

// Frozen, so any in-place sort of the context's array throws
const listings = Object.freeze([
  Object.freeze({ id: 3, name: 'beta' }),
  Object.freeze({ id: 1, name: 'Alpha' }),
  Object.freeze({ id: 2, name: 'Gamma' }),
]);

const renderDisplay = () => render(
  <CompareContext.Provider value={{ listings, removeListing: jest.fn() }}>
    <ChplCompareDisplay onClose={jest.fn()} />
  </CompareContext.Provider>,
);

describe('the compare widget', () => {
  it('lists the listings by name, ignoring case', () => {
    renderDisplay();
    expect(screen.getAllByText(/^(Alpha|beta|Gamma)$/).map((el) => el.textContent)).toEqual(['Alpha', 'beta', 'Gamma']);
  });

  it('compares the listings in the order they were added, without reordering the context', () => {
    renderDisplay();
    fireEvent.click(document.getElementById('compare-listings'));
    expect(goToUrl).toHaveBeenCalledWith('/compare/3&1&2');
    expect(listings.map((l) => l.id)).toEqual([3, 1, 2]);
  });
});
