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
import { when } from 'jest-when';

import ChplComplaints from './complaints';

import * as angularReactHelper from 'services/angular-react-helper';
import { BreadcrumbContext } from 'shared/contexts';

const angularMock = {
  $analytics: {
    eventTrack: jest.fn(),
  },
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue(angularMock.$analytics);

const mock = {
  complaints: [{
    id: 1,
    certificationBody: { name: 'fake acb' },
    closedDate: '2022-10-02',
    receivedDate: '2021-01-14',
    acbComplaintId: 'acb id test 1',
    oncComplaintId: 'fake onc id',
    complainantType: { name: 'fake type' },
  }],
};

const mockApi = {
  isLoading: false,
  isSuccess: true,
  data: {
      recordCount: mock.complaints.length,
      results: mock.complaints,
  },
  mutate: () => {},
};

jest.mock('api/acbs', () => ({
  __esModule: true,
  useFetchAcbs: () => mockApi,
}));

jest.mock('api/collections', () => ({
  __esModule: true,
  useFetchCollection: () => mockApi,
}));

jest.mock('api/complaints', () => ({
  __esModule: true,
  useDeleteComplaint: () => mockApi,
  useFetchComplaints: () => mockApi,
  usePostComplaint: () => mockApi,
  usePostReportRequest: () => mockApi,
  usePutComplaint: () => mockApi,
}));

jest.mock('api/data', () => ({
  __esModule: true,
  useFetchComplainantTypes: () => mockApi,
  useFetchCriteria: () => mockApi,
}));

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}));

const mockBreadcrumbs = {
  append: jest.fn(),
  display: jest.fn(),
  hide: jest.fn(),
};

describe('the ChplComplaints component', () => {
  beforeEach(async () => {
    render(
      <BreadcrumbContext.Provider value={mockBreadcrumbs}>
        <ChplComplaints
          bonusQuery=""
          canAdd
          disallowedFilters={[]}
        />
        ,
      </BreadcrumbContext.Provider>,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should exist', () => {
    expect(screen).not.toBe(null);
  });

  describe('when displaying data', () => {
    it('should show closed complaints as "closed"', () => {
      const cell = within(screen
                          .getByRole('cell', {name: 'acb id test 1'})
                          .closest('tr'))
            .getAllByRole('cell')[1];
      expect(cell.textContent).toBe('Closed');
    });
  });
  /*
    xdescribe('when creating a new complaint', () => {
    beforeEach(async () => {
    userEvent.click(screen.getByRole('button', {name: 'Add New Complaint'}))
    });

    describe('when acting from the action bar', () => {
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

    xit('should not allow the closed date to be in the future', async () => {
    userEvent.type(screen.getByLabelText(/Received Date/i), '2020-03-15');
    userEvent.type(screen.getByLabelText(/Closed Date/i), '2028-03-16');
    userEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
    expect(screen.queryByText('Closed Date must not be in the future')).toBeInTheDocument();
    });
    });

    xit('should require the closed date to be after the received date', async () => {
    userEvent.type(screen.getByLabelText(/Received Date/i), '2020-03-15');
    userEvent.type(screen.getByLabelText(/Closed Date/i), '2020-03-11');
    userEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
    expect(screen.queryByText('Closed Date must be after Received Date')).toBeInTheDocument();
    });
    });

    xit('should require actions/response when closed date is populated', async () => {
    userEvent.type(screen.getByLabelText(/Closed Date/i), '2021-03-16');
    userEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
    expect(screen.queryByText('Actions/Response is required.')).toBeInTheDocument();
    });
    });

    xit('should not require actions/response when closed date is not populated', async () => {
    userEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
    expect(screen.queryByText('Actions/Response is required.')).not.toBeInTheDocument();
    });
    });
    });
    });
  */
});
