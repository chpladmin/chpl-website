import React from 'react';
import {
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';

import ChplListingEdit from './listing-edit';

import { useFetchAcbs } from 'api/acbs';
import { useFetchAtls } from 'api/atls';
import { useFetchCertificationStatuses } from 'api/data';
import { FlagContext, ListingContext, UserContext } from 'shared/contexts';

jest.mock('api/acbs', () => ({
  useFetchAcbs: jest.fn(),
}));
jest.mock('api/atls', () => ({
  useFetchAtls: jest.fn(),
}));
jest.mock('api/data', () => ({
  useFetchCertificationStatuses: jest.fn(),
}));
jest.mock('components/action-bar', () => ({
  ChplActionBar: () => null,
  useActionBar: () => {},
}));

// Deliberately neither alphabetical nor in legend order
const certificationStatuses = [
  { id: 8, name: 'Retired' },
  { id: 6, name: 'Withdrawn by ONC-ACB' },
  { id: 1, name: 'Active' },
  { id: 7, name: 'Withdrawn by Developer' },
  { id: 4, name: 'Terminated by ONC' },
  { id: 2, name: 'Suspended by ONC' },
  { id: 5, name: 'Withdrawn by Developer Under Surveillance/Review' },
  { id: 3, name: 'Suspended by ONC-ACB' },
];

const legendOrder = [
  'Active',
  'Suspended by ONC',
  'Suspended by ONC-ACB',
  'Terminated by ONC',
  'Withdrawn by Developer Under Surveillance/Review',
  'Withdrawn by ONC-ACB',
  'Withdrawn by Developer',
  'Retired',
];

const listing = {
  acbCertificationId: '',
  certificationEvents: [],
  certifyingBody: { id: 1, name: 'Drummond Group' },
  chplProductNumber: '15.04.04.1234.ABCD.01.00.1.240101',
  testingLabs: [],
};

const renderView = () => render(
  <UserContext.Provider value={{ hasAnyRole: (roles) => roles.includes('chpl-admin') }}>
    <FlagContext.Provider value={{ hti5ErdIsOn: false }}>
      <ListingContext.Provider value={{ listing, setListing: () => {} }}>
        <ChplListingEdit dispatch={() => {}} />
      </ListingContext.Provider>
    </FlagContext.Provider>
  </UserContext.Provider>,
);

const openSelect = (name) => {
  fireEvent.mouseDown(screen.getByRole('combobox', { name }));
  return within(screen.getByRole('listbox')).getAllByRole('option').map((option) => option.textContent);
};

describe('the listing edit form', () => {
  beforeEach(() => {
    useFetchCertificationStatuses.mockReturnValue({ data: certificationStatuses, isLoading: false, isSuccess: true });
    useFetchAcbs.mockReturnValue({
      data: { acbs: [{ id: 2, name: 'drummond' }, { id: 1, name: 'ICSA Labs' }, { id: 3, name: 'Leidos' }] },
      isLoading: false,
      isSuccess: true,
    });
    useFetchAtls.mockReturnValue({
      data: { atls: [{ id: 2, name: 'SLI Compliance' }, { id: 1, name: 'drummond' }, { id: 3, name: 'ICSA Labs' }] },
      isLoading: false,
      isSuccess: true,
    });
  });

  it('offers certification statuses in legend order', () => {
    renderView();
    fireEvent.click(screen.getByRole('button', { name: 'Add Certification Status' }));

    expect(openSelect(/^Certification Status/)).toEqual(legendOrder);
  });

  it('still offers ONC-ACBs by name, ignoring case', () => {
    renderView();

    expect(openSelect(/^ONC-ACB/)).toEqual(['drummond', 'ICSA Labs', 'Leidos']);
  });

  it('still offers ONC-ATLs by name, ignoring case', () => {
    renderView();
    fireEvent.click(screen.getByRole('button', { name: 'Add ONC-ATL' }));

    expect(openSelect(/^ONC-ATL/)).toEqual(['drummond', 'ICSA Labs', 'SLI Compliance']);
  });

  describe('while its options load', () => {
    it('shows a skeleton of the form, and none of the form itself', () => {
      useFetchAtls.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
      renderView();

      expect(screen.getByRole('status')).toHaveTextContent('Loading listing edit form');
      expect(screen.queryByText('Edit Listing')).not.toBeInTheDocument();
    });

    it('shows the form once they have loaded', () => {
      renderView();

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('Edit Listing')).toBeInTheDocument();
    });
  });
});
