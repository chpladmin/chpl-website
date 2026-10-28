import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

import ChplComplaintEdit from './complaint-edit';
import ChplComplaintsView from './complaints-view';

import { useFetchAcbs } from 'api/acbs';
import {
  useDeleteComplaint,
  useFetchComplaints,
  usePostComplaint,
  usePostReportRequest,
  usePutComplaint,
} from 'api/complaints';
import { useFetchComplainantTypes, useFetchComplaintTypes } from 'api/data';
import { useFetchListings as useFetchListingsBasic } from 'api/listing';
import { useFetchListings } from 'api/search';
import { useFetchCriteria } from 'api/standards';
import actionBarReducer from 'components/action-bar/actionBar.slice';
import widgetReducer from 'components/action-widget/widget.slice';
import { FilterProvider } from 'components/filter';
import pageStateReducer from 'components/page-state/pageState.slice';
import { UserContext } from 'shared/contexts';

jest.mock('api/acbs', () => ({ useFetchAcbs: jest.fn() }));
jest.mock('api/complaints', () => ({
  useDeleteComplaint: jest.fn(),
  useFetchComplaints: jest.fn(),
  usePostComplaint: jest.fn(),
  usePostReportRequest: jest.fn(),
  usePutComplaint: jest.fn(),
}));
jest.mock('api/data', () => ({
  useFetchComplainantTypes: jest.fn(),
  useFetchComplaintTypes: jest.fn(),
}));
jest.mock('api/listing', () => ({ useFetchListings: jest.fn() }));
jest.mock('api/search', () => ({ useFetchListings: jest.fn() }));
jest.mock('api/standards', () => ({ useFetchCriteria: jest.fn() }));

const complaint = {
  id: 1,
  acbComplaintId: 'ACB-1',
  certificationBody: { id: 1, name: 'Drummond Group' },
  complainantType: { id: 1, name: 'Developer' },
  complaintTypes: [],
  receivedDate: '2024-01-02',
  criteria: [],
  listings: [],
  surveillances: [],
};

const loaded = (data) => ({ data, isLoading: false, isSuccess: true });
const loading = { data: undefined, isLoading: true, isSuccess: false };

const renderWith = (ui) => render(
  <Provider store={configureStore({ reducer: { actionBar: actionBarReducer, pageState: pageStateReducer, widget: widgetReducer } })}>
    <SnackbarProvider>
      <UserContext.Provider value={{ hasAnyRole: (roles) => roles.includes('chpl-onc') }}>
        { ui }
      </UserContext.Provider>
    </SnackbarProvider>
  </Provider>,
);

const renderList = ({ filtersAreLoading = false } = {}) => renderWith(
  <FilterProvider filters={[]} isLoading={filtersAreLoading} storageKey="test-complaints">
    <ChplComplaintsView bonusQuery="" canAdd={false} canEdit={false} />
  </FilterProvider>,
);

beforeEach(() => {
  sessionStorage.clear();
  usePostReportRequest.mockReturnValue({ mutate: jest.fn() });
  usePostComplaint.mockReturnValue({ mutate: jest.fn() });
  usePutComplaint.mockReturnValue({ mutate: jest.fn() });
  useDeleteComplaint.mockReturnValue({ mutate: jest.fn() });
  useFetchAcbs.mockReturnValue(loaded({ acbs: [{ id: 1, name: 'Drummond Group' }] }));
  useFetchComplainantTypes.mockReturnValue(loaded([{ id: 1, name: 'Developer' }]));
  useFetchComplaintTypes.mockReturnValue(loaded([]));
  useFetchCriteria.mockReturnValue(loaded([]));
  useFetchListings.mockReturnValue(loaded({ results: [] }));
  useFetchListingsBasic.mockReturnValue([]);
});

describe('the complaints list', () => {
  it('shows a skeleton of the complaint cards while the complaints load', () => {
    useFetchComplaints.mockReturnValue(loading);
    renderList();

    expect(screen.getByText('Loading results')).toBeInTheDocument();
    expect(screen.queryByText('ACB-1')).not.toBeInTheDocument();
  });

  it('keeps the results a skeleton, alongside the filter bar\'s, while the filters load', () => {
    useFetchComplaints.mockReturnValue(loaded({ recordCount: 1, results: [complaint] }));
    renderList({ filtersAreLoading: true });

    expect(screen.getByText('Loading search')).toBeInTheDocument();
    expect(screen.getByText('Loading results')).toBeInTheDocument();
    expect(screen.queryByText('ACB-1')).not.toBeInTheDocument();
  });

  it('still shows the complaints once everything has loaded', () => {
    useFetchComplaints.mockReturnValue(loaded({ recordCount: 1, results: [complaint] }));
    renderList();

    expect(screen.queryByText('Loading results')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading search')).not.toBeInTheDocument();
    expect(screen.getByText('ACB-1')).toBeInTheDocument();
  });
});

describe('the complaint form', () => {
  it('shows a skeleton of the form while the lists it chooses from load', () => {
    useFetchComplainantTypes.mockReturnValue(loading);
    renderWith(<ChplComplaintEdit complaint={complaint} dispatch={jest.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading complaint form');
    expect(screen.queryByText('Edit Complaint')).not.toBeInTheDocument();
  });

  it('still shows the form once they have loaded', () => {
    renderWith(<ChplComplaintEdit complaint={complaint} dispatch={jest.fn()} />);

    expect(screen.queryByText('Loading complaint form')).not.toBeInTheDocument();
    expect(screen.getByText('Edit Complaint')).toBeInTheDocument();
  });
});
