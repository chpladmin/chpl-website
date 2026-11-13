import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplNonConformityEdit from './non-conformity-edit';
import ChplRequirementEdit from './requirement-edit';
import ChplSurveillanceEdit from './surveillance-edit';

import {
  useFetchNonConformityTypes,
  useFetchRequirementGroupTypes,
  useFetchRequirementTypes,
  useFetchSurveillanceResultTypes,
  useFetchSurveillanceTypes,
} from 'api/data';
import { ListingContext } from 'shared/contexts';

jest.mock('api/data', () => ({
  useFetchNonConformityTypes: jest.fn(),
  useFetchRequirementGroupTypes: jest.fn(),
  useFetchRequirementTypes: jest.fn(),
  useFetchSurveillanceResultTypes: jest.fn(),
  useFetchSurveillanceTypes: jest.fn(),
}));
jest.mock('api/listing', () => ({
  useDeleteSurveillance: () => ({ mutate: () => {} }),
  usePostSurveillance: () => ({ mutate: () => {} }),
  usePutSurveillance: () => ({ mutate: () => {} }),
}));
jest.mock('components/action-bar', () => ({
  ChplActionBar: () => null,
  useActionBar: () => {},
}));

const loading = { data: undefined, isLoading: true, isError: false };
// An empty list, which used to hold each form behind its spinner for good
const empty = { data: [], isLoading: false, isError: false };

const childProps = {
  dispatch: () => {},
  guid: 1,
  randomizedSitesUsed: '',
  surveillanceStartDay: '2026-01-01',
};

const renderSurveillance = () => render(
  <ListingContext.Provider value={{ listing: { id: 1, chplProductNumber: '15.04.04.1234.ABCD.01.00.1.240101' } }}>
    <ChplSurveillanceEdit surveillance={{ requirements: [] }} dispatch={() => {}} />
  </ListingContext.Provider>,
);

describe('the listing compliance edit forms', () => {
  beforeEach(() => {
    useFetchNonConformityTypes.mockReturnValue(empty);
    useFetchRequirementGroupTypes.mockReturnValue(empty);
    useFetchRequirementTypes.mockReturnValue(empty);
    useFetchSurveillanceResultTypes.mockReturnValue(empty);
    useFetchSurveillanceTypes.mockReturnValue(empty);
  });

  describe('surveillance', () => {
    it('shows a skeleton, and none of the form, while its types load', () => {
      useFetchSurveillanceTypes.mockReturnValue(loading);
      renderSurveillance();

      expect(screen.getByRole('status')).toHaveTextContent('Loading surveillance activity');
      expect(screen.queryByText('Initiate Surveillance Activity')).not.toBeInTheDocument();
    });

    it('shows the form once they have loaded, even when there are none', () => {
      renderSurveillance();

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('Initiate Surveillance Activity')).toBeInTheDocument();
    });
  });

  describe('a requirement', () => {
    it('shows a skeleton, and none of the form, while any of its options load', () => {
      useFetchSurveillanceResultTypes.mockReturnValue(loading);
      render(<ChplRequirementEdit requirement={{}} {...childProps} />); // eslint-disable-line react/jsx-props-no-spreading

      expect(screen.getByRole('status')).toHaveTextContent('Loading requirement');
      expect(screen.queryByRole('button', { name: 'Remove Requirement' })).not.toBeInTheDocument();
    });

    it('shows the form once they have loaded, even when they are empty', () => {
      render(<ChplRequirementEdit requirement={{}} {...childProps} />); // eslint-disable-line react/jsx-props-no-spreading

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove Requirement' })).toBeInTheDocument();
    });
  });

  describe('a non-conformity', () => {
    it('shows a skeleton, and none of the form, while its types load', () => {
      useFetchNonConformityTypes.mockReturnValue(loading);
      render(<ChplNonConformityEdit nonConformity={{}} {...childProps} />); // eslint-disable-line react/jsx-props-no-spreading

      expect(screen.getByRole('status')).toHaveTextContent('Loading non-conformity');
      expect(screen.queryByText('Non-Conformity')).not.toBeInTheDocument();
    });

    it('shows the form once they have loaded, even when there are none', () => {
      render(<ChplNonConformityEdit nonConformity={{}} {...childProps} />); // eslint-disable-line react/jsx-props-no-spreading

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('Non-Conformity')).toBeInTheDocument();
    });
  });
});
