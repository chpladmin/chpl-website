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

const mock = {
  hoc: {
    dispatch: jest.fn(),
  },
  certificationBodies: [
    { id: 3, name: 'ZZZ', retired: true },
    { id: 2, name: 'AAA' },
    { id: 1, name: 'NNN' },
  ],
  complainantTypes: [
    { id: 3, name: 'ZZZ' },
    { id: 2, name: 'AAA' },
    { id: 1, name: 'NNN' },
  ],
};

angularReactHelper.getAngularService = jest.fn();

describe('the ChplComplaintEdit component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when creating a complaint', () => {
    beforeEach(async () => {
      when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceMock);
      when(angularReactHelper.getAngularService).calledWith('utilService').mockReturnValue(utilServiceMock);
      render(
        <ChplComplaintEdit
          complaint={{}}
          certificationBodies={mock.certificationBodies}
          complainantTypes={mock.complainantTypes}
          criteria={[]}
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
        expect(within(options[1]).getByText('NNN')).toBeInTheDocument();
        expect(within(options[2]).getByText('ZZZ')).toBeInTheDocument();
      });
    });

    describe('when acting', () => {
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
    });
  });
});
