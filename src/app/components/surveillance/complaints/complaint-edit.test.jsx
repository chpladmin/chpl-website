import React from 'react';
import {
  cleanup, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';

import * as angularReactHelper from '../../../services/angular-react-helper';
import ChplComplaintEdit from './complaint-edit';

const networkServiceMock = {
  getListingBasic: jest.fn(() => Promise.resolve({
    surveillance: [],
  })),
};

const utilServiceMock = {
  sortCertActual: jest.fn(() => 0),
};

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const mock = {
  hoc: {
    dispatch: jest.fn(),
  },
  complaint: {
    criteria: [
      { certificationCriterion: { id: 4, number: '4', title: '4 title criterion', certificationEdition: '2015' } },
    ],
  },
  certificationBodies: [
    { id: 3, name: 'ZZZ', retired: true },
    { id: 2, name: 'AAA' },
    { id: 1, name: 'NNN' },
  ],
  certificationCriteria: [
    { id: 1, number: '1', title: '1 title criterion', certificationEdition: '2015' },
    { id: 2, number: '2', title: '2 title criterion', certificationEdition: '2015' },
    { id: 3, number: '3', title: '3 title criterion', certificationEdition: '2015' },
  ],
  complainantTypes: [
    { id: 3, name: 'ZZZ' },
    { id: 2, name: 'AAA' },
    { id: 1, name: 'Complainant Type - Other' },
  ],
};

angularReactHelper.getAngularService = jest.fn();

describe('the ChplComplaintEdit component', () => {
  beforeEach(() => {
    when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceMock);
    when(angularReactHelper.getAngularService).calledWith('utilService').mockReturnValue(utilServiceMock);
  });

  afterEach(() => {
    cleanup();
  });

  describe('when creating a complaint', () => {
    beforeEach(async () => {
      render(
        <ChplComplaintEdit
          complaint={{}}
          certificationBodies={mock.certificationBodies}
          complainantTypes={mock.complainantTypes}
          criteria={mock.certificationCriteria}
          listings={[]}
          dispatch={mock.hoc.dispatch}
        />,
      );
    });

    it('should sort the available ONC-ACBs by name, and display retired ones appropriately', async () => {
      userEvent.click(screen.getByRole('button', { name: /ONC-ACB/i }));

      await waitFor(() => {
        const options = within(screen.getByRole('listbox')).getAllByRole('option');
        expect(within(options[0]).getByText('AAA')).toBeInTheDocument();
        expect(within(options[1]).getByText('NNN')).toBeInTheDocument();
        expect(within(options[2]).getByText('ZZZ (Retired)')).toBeInTheDocument();
      });
    });

    it('should sort complainant types by name', async () => {
      userEvent.click(screen.getByRole('button', { name: /Complainant Type/i }));

      await waitFor(() => {
        const options = within(screen.getByRole('listbox')).getAllByRole('option');
        expect(within(options[0]).getByText('AAA')).toBeInTheDocument();
        expect(within(options[1]).getByText('Complainant Type - Other')).toBeInTheDocument();
        expect(within(options[2]).getByText('ZZZ')).toBeInTheDocument();
      });
    });

    describe('when acting from the action bar', () => {
      it('should allow cancellation', async () => {
        userEvent.click(screen.getByRole('button', { name: /Cancel/i }));

        await waitFor(() => {
          expect(mock.hoc.dispatch).toHaveBeenCalledWith('cancel', undefined);
        });
      });

      it('should give errors about required elements', async () => {
        userEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
          expect(screen.queryByText('ONC-ACB is required')).toBeInTheDocument();
          expect(screen.queryByText('Received Date is required')).toBeInTheDocument();
          expect(screen.queryByText('ONC-ACB Complaint ID is required')).toBeInTheDocument();
          expect(screen.queryByText('Complainant Type is required')).toBeInTheDocument();
          expect(screen.queryByText('Complainant Type - Other Description is required')).not.toBeInTheDocument();
          expect(screen.queryByText('Complaint Summary is required')).toBeInTheDocument();
        });
      });

      it('should not allow the closed date to be in the future', async () => {
        userEvent.type(screen.getByLabelText(/Received Date/i), '2020-03-15');
        userEvent.type(screen.getByLabelText(/Closed Date/i), '2028-03-16');
        userEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
          expect(screen.queryByText('Closed Date must not be in the future')).toBeInTheDocument();
        });
      });

      it('should require the closed date to be after the received date', async () => {
        userEvent.type(screen.getByLabelText(/Received Date/i), '2020-03-15');
        userEvent.type(screen.getByLabelText(/Closed Date/i), '2020-03-11');
        userEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
          expect(screen.queryByText('Closed Date must be after Received Date')).toBeInTheDocument();
        });
      });

      it('should require actions/response when closed date is populated', async () => {
        userEvent.type(screen.getByLabelText(/Closed Date/i), '2021-03-16');
        userEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
          expect(screen.queryByText('Actions/Response is required.')).toBeInTheDocument();
        });
      });

      it('should not require actions/response when closed date is not populated', async () => {
        userEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
          expect(screen.queryByText('Actions/Response is required.')).not.toBeInTheDocument();
        });
      });
    });

    describe('when adding things', () => {
      it('should allow addition of criteria', async () => {
        userEvent.click(screen.getByRole('button', { name: /Add Associated Criterion/i }));
        userEvent.click(screen.getByRole('option', { name: /1: 1 title criterion/i }));

        await waitFor(() => {
          expect(screen.queryByText('1: 1 title criterion')).toBeInTheDocument();
        });
      });
    });
  });

  describe('when editing a complaint', () => {
    beforeEach(async () => {
      render(
        <ChplComplaintEdit
          complaint={mock.complaint}
          certificationBodies={mock.certificationBodies}
          complainantTypes={mock.complainantTypes}
          criteria={mock.certificationCriteria}
          listings={[]}
          dispatch={mock.hoc.dispatch}
        />,
      );
    });

    describe('when removing things', () => {
      it('should allow removal of criteria', async () => {
        userEvent.click(screen.getByRole('button', { name: /4: 4 title criterion/i }));

        await waitFor(() => {
          expect(screen.queryByText('4: 4 title criterion/i')).not.toBeInTheDocument();
        });
      });
    });
  });
});
