import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplComparePage from './compare';

import { useFetchListing } from 'api/listing';

jest.mock('api/listing', () => ({ useFetchListing: jest.fn() }));
jest.mock('components/browser/browser-compared-widget', () => () => null);
jest.mock('components/cms-widget/cms-button', () => () => null);
jest.mock('services/navigation.service', () => ({ goToState: jest.fn(), goToUrl: jest.fn() }));

const listing = (id, product, version, certificationDay) => ({
  id,
  chplProductNumber: `CHP-${id}`,
  product: { id, name: product },
  version: { id, version },
  developer: { id, name: `Developer ${id}` },
  currentStatus: { status: { name: 'Active' } },
  practiceType: {},
  certifyingBody: { name: 'ACB' },
  certificationDay,
  certificationDate: Date.parse(`${certificationDay}T00:00:00Z`),
  decertificationDay: null,
  countOpenNonconformities: 0,
  countCerts: 0,
  countCqms: 0,
  certificationResults: [],
  cqmResults: [],
});

const listings = {
  11: listing(11, 'zeta', '1', '2018-01-01'),
  12: listing(12, 'Alpha', 'v10', '2024-01-01'),
  13: listing(13, 'Alpha', 'v9', '2023-01-01'),
  14: listing(14, 'alpha', 'v9', '2020-06-01'),
};

beforeEach(() => {
  useFetchListing.mockImplementation(({ id }) => (id
    ? { data: listings[id], isLoading: false, isSuccess: true }
    : { data: undefined, isLoading: false, isSuccess: false }));
});

const productColumns = () => screen.getAllByText(/^CHP-\d+$/).map((el) => el.textContent);

describe('the compare page', () => {
  it('shows a column for each listing in the URL', async () => {
    render(<ChplComparePage ids="11&12" />);
    expect(await screen.findByText('CHP-11')).toBeInTheDocument();
    expect(screen.getByText('CHP-12')).toBeInTheDocument();
  });

  it('orders the columns like the compare widget: product name, then version, then earliest certification', async () => {
    render(<ChplComparePage ids="11&12&13&14" />);
    await screen.findByText('CHP-14');
    expect(productColumns()).toEqual(['CHP-14', 'CHP-13', 'CHP-12', 'CHP-11']);
  });

  it('uses the same order whatever order the ids are in the URL', async () => {
    render(<ChplComparePage ids="14&11&13&12" />);
    await screen.findByText('CHP-12');
    expect(productColumns()).toEqual(['CHP-14', 'CHP-13', 'CHP-12', 'CHP-11']);
  });
});
