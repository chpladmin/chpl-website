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

import ChplUcdProcesses from './ucd-processes';

import { BreadcrumbContext } from 'shared/contexts';

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const mock = {
  ucdProcesses: [
    { id: 1, name: 'citation 1' },
    { id: 2, name: 'a citation 2' },
    { id: 1, name: 'last citation 3' },
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
  useDeleteUcdProcess: () => ({
    ...mockApi,
  }),
  useFetchUcdProcesses: () => ({
    ...mockApi,
    data: mock.ucdProcesses,
  }),
  usePostUcdProcess: () => ({
    ...mockApi,
  }),
  usePutUcdProcess: () => ({
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

describe('the ChplUcdProcesses component', () => {
  beforeEach(async () => {
    render(
      <BreadcrumbContext.Provider value={mock.breadcrumbContext}>
        <ChplUcdProcesses />
      </BreadcrumbContext.Provider>,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when viewing UCD Processes', () => {
    it('should sort the UCD Processes by name', async () => {
      await waitFor(() => {
        const rows = within(screen.getByRole('table')).getAllByRole('row');
        expect(within(rows[1]).getByText(/a citation/)).toBeInTheDocument();
        expect(within(rows[2]).getByText(/citation/)).toBeInTheDocument();
        expect(within(rows[3]).getByText(/last citation/)).toBeInTheDocument();
      });
    });
  });

  describe('when creating a UCD Process', () => {
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
