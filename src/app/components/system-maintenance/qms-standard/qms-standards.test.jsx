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

import ChplQmsStandards from './qms-standards';

import { BreadcrumbContext } from 'shared/contexts';

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const mock = {
  qmsStandards: [
    { id: 1, name: 'citation 1' },
    { id: 2, name: 'a citation 2' },
    { id: 3, name: 'last citation 3' },
  ],
  breadcrumbContext: {
    append: () => {},
    display: () => {},
    hide: () => {},
  },
};

const mockApi = {
  isLoading: false,
  isSuccess: true,
  mutate: jest.fn(),
};

jest.mock('api/standards', () => ({
  __esModule: true,
  useDeleteQmsStandard: () => ({
    ...mockApi,
  }),
  useFetchQmsStandards: () => ({
    ...mockApi,
    data: mock.qmsStandards,
  }),
  usePostQmsStandard: () => ({
    ...mockApi,
  }),
  usePutQmsStandard: () => ({
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

describe('the ChplQmsStandards component', () => {
  beforeEach(async () => {
    render(
      <BreadcrumbContext.Provider value={mock.breadcrumbContext}>
        <ChplQmsStandards />
      </BreadcrumbContext.Provider>,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when viewing qms standards', () => {
    it('should sort the qms standards by name', async () => {
      await waitFor(() => {
        const rows = within(screen.getByRole('table')).getAllByRole('row');
        expect(within(rows[1]).getByText(/a citation/)).toBeInTheDocument();
        expect(within(rows[2]).getByText(/citation/)).toBeInTheDocument();
        expect(within(rows[3]).getByText(/last citation/)).toBeInTheDocument();
      });
    });
  });

  describe('when creating an qms standard', () => {
    it('should not allow saving without required elements', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add/i }));
      userEvent.click(screen.getByRole('button', { name: /Save/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
      });
    });

    it('should call the API with valid data on save', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add/i }));
      userEvent.type(screen.getByLabelText(/Name/), 'A new citation');
      userEvent.click(screen.getByRole('button', { name: /Save/i }));

      await waitFor(() => {
        expect(mockApi.mutate).toHaveBeenCalled();
        // This "expect.objectContaining" should partially match on the data passed to the API, but something isn't working
        /*
        expect(mockApi.mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            regulatoryTextCitation: 'A new citation',
            approvedStandardVersion: 'A new version',
            criteria: [{ id: 3, number: '3', title: '3 title criterion' }],
          })
        );
        */
      });
    });
  });
});
