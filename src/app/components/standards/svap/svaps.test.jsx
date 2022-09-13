import React from 'react';
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplSvaps from './svaps';

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const mock = {
  hoc: {
    dispatch: jest.fn(),
  },
  svaps: [
    { svapId: 1, regulatoryTextCitation: 'citation 1', approvedStandardVersion: 'version 1', criteria: [{ id: 1, number: '1', title: '1 title criterion' }] },
    { svapId: 1, regulatoryTextCitation: 'a citation 2', approvedStandardVersion: 'version 2', criteria: [{ id: 2, number: '2', title: '2 title criterion' }] },
    { svapId: 1, regulatoryTextCitation: 'last citation 3', approvedStandardVersion: 'version 3', criteria: [{ id: 3, number: '3', title: '3 title criterion' }] },
  ],
  certificationCriteria: [
    { id: 1, number: '1', title: '1 title criterion' },
    { id: 2, number: '2', title: '2 title criterion' },
    { id: 3, number: '3', title: '3 title criterion' },
  ],
};

const mockApi = {
  isLoading: true,
  isSuccess: false,
  mutate: () => {},
};

jest.mock('api/standards', () => ({
  __esModule: true,
  useDeleteSvap: () => ({
    ...mockApi,
  }),
  useFetchCriteriaForSvaps: () => ({
    ...mockApi,
    data: mock.certificationCriteria,
  }),
  useFetchSvaps: () => ({
    ...mockApi,
    data: mock.svaps,
  }),
  usePostSvap: () => ({
    ...mockApi,
  }),
  usePutSvap: () => ({
    ...mockApi,
  }),
}));

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}));

describe('the ChplSvaps component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when viewing SVAPs', () => {
    beforeEach(async () => {
      render(
        <ChplSvaps
          dispatch={mock.hoc.dispatch}
        />,
      );
    });

    it('should sort the SVAPs by citation', async () => {
      await waitFor(() => {
        const rows = within(screen.getByRole('table')).getAllByRole('row');
        expect(rows(rows[0]).getByText('a citation')).toBeInTheDocument();
        expect(rows(rows[1]).getByText('citation')).toBeInTheDocument();
        expect(rows(rows[2]).getByText('last citation')).toBeInTheDocument();
      });
    });
  });

  describe('when editing an svap', () => {
    it('should give errors about required elements', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add/i }));
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

    it('should allow removal of criteria', async () => {
      const rows = within(screen.getByRole('table')).getAllByRole('row');
      userEvent.click(rows[0].getByRole('button', { name: /Edit/i }));
      userEvent.click(screen.getByRole('button', { name: /1: 1 title criterion/i }));

      await waitFor(() => {
        expect(screen.queryByText('1: 1 title criterion/i')).not.toBeInTheDocument();
      });
    });

    it('should allow addition of criteria', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add/i }));
      userEvent.click(screen.getByRole('button', { name: /Add Associated Criterion/i }));
      userEvent.click(screen.getByRole('option', { name: /1: 1 title criterion/i }));

      await waitFor(() => {
        expect(screen.queryByText('1: 1 title criterion')).toBeInTheDocument();
      });
    });

    describe('when acting from the action bar', () => {
      it('should allow cancellation', async () => {
        const rows = within(screen.getByRole('table')).getAllByRole('row');
        userEvent.click(rows[0].getByRole('button', { name: /Edit/i }));
        userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        userEvent.click(screen.getByRole('button', { name: /Yes/i }));

        await waitFor(() => {
          expect(rows(rows[0]).getByText('a citation')).toBeInTheDocument();
          expect(rows(rows[1]).getByText('citation')).toBeInTheDocument();
          expect(rows(rows[2]).getByText('last citation')).toBeInTheDocument();
        });
      });
    });
  });
});
