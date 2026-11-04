import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplRealWorldTestingView from './real-world-testing-view';

import { useFetchRealWorldTestingPlans, useFetchRealWorldTestingResults } from 'api/developer';
import { FlagContext, UserContext } from 'shared/contexts';

jest.mock('api/developer', () => ({
  useFetchRealWorldTestingPlans: jest.fn(),
  useFetchRealWorldTestingResults: jest.fn(),
}));

const query = (state) => ({
  data: undefined,
  isError: false,
  isInitialLoading: false,
  isLoading: false,
  ...state,
});

const view = () => (
  <FlagContext.Provider value={{ hti5ErdIsOn: false, rwtChangeRequestIsOn: false }}>
    <UserContext.Provider value={{ hasAnyRole: () => false, hasAuthorityOn: () => false }}>
      <ChplRealWorldTestingView developer={{ id: 1, name: 'Dev' }} dispatch={jest.fn()} />
    </UserContext.Provider>
  </FlagContext.Provider>
);

describe('the Real World Testing section', () => {
  it('shows its skeleton while the plans and results load', () => {
    useFetchRealWorldTestingPlans.mockReturnValue(query({ isInitialLoading: true, isLoading: true }));
    useFetchRealWorldTestingResults.mockReturnValue(query({ isInitialLoading: true, isLoading: true }));
    render(view());
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('does not wait forever on queries that are disabled', () => {
    useFetchRealWorldTestingPlans.mockReturnValue(query({ isLoading: true }));
    useFetchRealWorldTestingResults.mockReturnValue(query({ isLoading: true }));
    render(view());
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Real World Testing')).toBeInTheDocument();
  });

  it('says the information is unavailable when a request fails, rather than staying a skeleton', () => {
    useFetchRealWorldTestingPlans.mockReturnValue(query({ isError: true }));
    useFetchRealWorldTestingResults.mockReturnValue(query({ data: [] }));
    render(view());
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText(/not currently available/)).toBeInTheDocument();
    expect(screen.queryByText('No Real World Testing data is available')).not.toBeInTheDocument();
  });

  it('shows the URLs once they arrive', () => {
    useFetchRealWorldTestingPlans.mockReturnValue(query({ data: [{ url: 'https://example.com/plan' }] }));
    useFetchRealWorldTestingResults.mockReturnValue(query({ data: [] }));
    render(view());
    expect(screen.getByText('RWT Plans URL')).toBeInTheDocument();
  });
});
