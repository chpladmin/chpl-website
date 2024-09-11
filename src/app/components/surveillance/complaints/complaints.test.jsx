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

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const mock = {
  complaints: [{
    id: 1,
    certificationBody: { name: 'fake acb' },
    closedDate: '2022-10-02',
    receivedDate: '2021-01-14',
    acbComplaintId: 'acb id test 1',
    oncComplaintId: 'fake onc id',
    complainantType: { name: 'fake type' },
    criteria: [
      { certificationCriterion: { number: 'number 2', title: 'title2', id: 2, removed: false } },
      { certificationCriterion: { number: 'number 3', title: 'title3', id: 3, removed: true } },
    ],
    listings: [],
    surveillances: [],
  }],
  acbs: [],
};

const mockApi = {
  isLoading: true,
  isSuccess: false,
  mutate: () => {},
};

const mockAcbs = {
  isLoading: false,
  isSuccess: true,
  data: {
    acbs: mock.acbs,
  },
};

jest.mock('api/acbs', () => ({
  __esModule: true,
  useFetchAcbs: () => mockAcbs,
}));

jest.mock('api/search', () => ({
  __esModule: true,
  useFetchListings: () => mockApi,
}));

const mockComplaints = {
  isLoading: false,
  isSuccess: true,
  data: {
    recordCount: mock.complaints.length,
    results: mock.complaints,
  },
};

jest.mock('api/complaints', () => ({
  __esModule: true,
  useDeleteComplaint: () => mockApi,
  useFetchComplaints: () => mockComplaints,
  usePostComplaint: () => mockApi,
  usePostReportRequest: () => mockApi,
  usePutComplaint: () => mockApi,
}));

const mockData = {
  isLoading: false,
  isSuccess: true,
  data: {
    data: [],
  },
};

jest.mock('api/data', () => ({
  __esModule: true,
  useFetchComplainantTypes: () => mockData,
}));

jest.mock('api/standards', () => ({
  __esModule: true,
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
        .getByRole('cell', { name: 'acb id test 1' })
        .closest('tr'))
        .getAllByRole('cell')[1];
      expect(cell.textContent).toBe('Closed');
    });
  });

  describe('when creating a new complaint', () => {
    beforeEach(async () => {
      userEvent.click(screen.getByRole('button', { name: 'Add New Complaint' }));

      await waitFor(() => {
        expect(screen.queryByText('Create Complaint')).toBeInTheDocument();
      });
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
  });

  describe('when viewing a complaint', () => {
    beforeEach(async () => {
      userEvent.click(within(screen
        .getByRole('cell', { name: 'acb id test 1' })
        .closest('tr'))
        .getByRole('button', { name: 'View' }));
    });

    it('should have "No" for the various complaint booleans', async () => {
      let item = await screen.findByText(/Complainant Contacted:/i);
      expect(item.nextSibling).toHaveTextContent('No');
      item = await screen.findByText(/Developer Contacted:/i);
      expect(item.nextSibling).toHaveTextContent('No');
      item = await screen.findByText(/ONC-ATL Contacted:/i);
      expect(item.nextSibling).toHaveTextContent('No');
      item = await screen.findByText(/Informed ONC per/i);
      expect(item.nextSibling).toHaveTextContent('No');
    });

    it('should have two criteria', async () => {
      expect(screen.getAllByRole('listitem').length).toBe(2);
    });

    it('should display the criteria', async () => {
      const criteria = screen.getAllByRole('listitem');
      expect(criteria[0]).toHaveTextContent('number 2: title2');
      expect(criteria[1]).toHaveTextContent('Removed | number 3: title3');
    });
  });
});
