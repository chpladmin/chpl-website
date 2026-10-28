import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

import ChplChangeRequest from './change-request';
import ChplChangeRequestsView from './change-requests-view';

import {
  useFetchChangeRequest,
  useFetchChangeRequestStatusTypes,
  useFetchChangeRequests,
  usePostReportRequest,
  usePutChangeRequest,
} from 'api/change-requests';
import actionBarReducer from 'components/action-bar/actionBar.slice';
import widgetReducer from 'components/action-widget/widget.slice';
import { FilterProvider } from 'components/filter';
import pageStateReducer from 'components/page-state/pageState.slice';
import { UserContext } from 'shared/contexts';

jest.mock('api/change-requests', () => ({
  useFetchChangeRequest: jest.fn(),
  useFetchChangeRequestStatusTypes: jest.fn(),
  useFetchChangeRequests: jest.fn(),
  usePostReportRequest: jest.fn(),
  usePutChangeRequest: jest.fn(),
}));

const changeRequest = {
  id: 1,
  changeRequestType: { name: 'Other Change Request' },
  developer: { id: 7, name: 'Some Developer' },
  submittedDateTime: 1700000000000,
  currentStatus: {
    name: 'Pending ONC-ACB Action',
    changeRequestStatusType: { name: 'Pending ONC-ACB Action' },
    statusChangeDateTime: 1700000000000,
  },
  certificationBodies: [],
  details: {},
  statuses: [],
};

const withUser = (roles, children) => (
  <Provider store={configureStore({ reducer: { actionBar: actionBarReducer, pageState: pageStateReducer, widget: widgetReducer } })}>
    <SnackbarProvider>
      <UserContext.Provider value={{ hasAnyRole: (r) => r.some((role) => roles.includes(role)) }}>
        { children }
      </UserContext.Provider>
    </SnackbarProvider>
  </Provider>
);

const renderList = (roles, embedded = false) => render(withUser(roles, (
  <FilterProvider filters={[]} storageKey="test-changeRequests">
    <ChplChangeRequestsView
      disallowedFilters={[]}
      bonusQuery=""
      dispatch={jest.fn()}
      embedded={embedded}
    />
  </FilterProvider>
)));

beforeEach(() => {
  sessionStorage.clear();
  usePostReportRequest.mockReturnValue({ mutate: jest.fn() });
  usePutChangeRequest.mockReturnValue({ mutate: jest.fn(), isLoading: false });
  useFetchChangeRequestStatusTypes.mockReturnValue({ data: [], isLoading: false, isSuccess: true });
});

describe('the change requests list', () => {
  it('shows a skeleton of developer-titled result cards while the requests load', () => {
    useFetchChangeRequests.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    renderList(['chpl-onc']);

    expect(screen.getByRole('status')).toHaveTextContent('Loading results');
    expect(screen.queryByText('Some Developer')).not.toBeInTheDocument();
  });

  it('shows a skeleton for a developer looking at their own requests', () => {
    useFetchChangeRequests.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    renderList(['chpl-developer'], true);

    expect(screen.getByRole('status')).toHaveTextContent('Loading results');
  });

  it('still shows the requests once they arrive', () => {
    useFetchChangeRequests.mockReturnValue({
      data: { recordCount: 1, results: [changeRequest] },
      isLoading: false,
      isSuccess: true,
    });
    renderList(['chpl-onc']);

    expect(screen.queryByText('Loading results')).not.toBeInTheDocument();
    expect(screen.getByText('Some Developer')).toBeInTheDocument();
    expect(screen.getByText('Other Change Request')).toBeInTheDocument();
  });
});

describe('a single change request', () => {
  it('shows a skeleton of the request card while it loads', () => {
    useFetchChangeRequest.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    render(withUser(['chpl-onc'], (
      <ChplChangeRequest changeRequest={changeRequest} dispatch={jest.fn()} />
    )));

    expect(screen.getByRole('status')).toHaveTextContent('Loading change request');
    expect(screen.queryByText('Creation Date:')).not.toBeInTheDocument();
  });

  it('still shows the request once it arrives', () => {
    useFetchChangeRequest.mockReturnValue({ data: changeRequest, isLoading: false, isSuccess: true });
    render(withUser(['chpl-onc'], (
      <ChplChangeRequest changeRequest={changeRequest} dispatch={jest.fn()} />
    )));

    expect(screen.queryByText('Loading change request')).not.toBeInTheDocument();
    expect(screen.getByText('Creation Date:')).toBeInTheDocument();
  });
});
