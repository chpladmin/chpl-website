import React from 'react';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';

import ChplJobs from './system-jobs';

import { useFetchJobTypes, useFetchSystemTriggers } from 'api/jobs';
import { UserContext } from 'shared/contexts';

jest.mock('api/jobs', () => ({
  useDeleteTrigger: () => ({ mutate: jest.fn() }),
  useFetchJobTypes: jest.fn(),
  useFetchSystemTriggers: jest.fn(),
  usePostOneTimeTrigger: () => ({ mutate: jest.fn() }),
}));

const jobTypes = [{ name: 'A job', description: 'Does things', group: 'systemJobs' }];

const renderAs = (roles) => render(
  <SnackbarProvider>
    <UserContext.Provider value={{ hasAnyRole: (r) => r.some((role) => roles.includes(role)), hasAuthorityOn: () => false }}>
      <ChplJobs />
    </UserContext.Provider>
  </SnackbarProvider>,
);

describe('the System Jobs card', () => {
  it('shows the skeleton while its jobs load', () => {
    useFetchJobTypes.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    useFetchSystemTriggers.mockReturnValue({
      data: undefined, isInitialLoading: true, isLoading: true, isSuccess: false,
    });
    renderAs(['chpl-admin']);

    expect(screen.getByRole('status')).toHaveTextContent('Loading system jobs');
    expect(screen.queryByText('A job')).not.toBeInTheDocument();
  });

  it('shows the jobs once they arrive', () => {
    useFetchJobTypes.mockReturnValue({ data: jobTypes, isLoading: false, isSuccess: true });
    useFetchSystemTriggers.mockReturnValue({
      data: [], isInitialLoading: false, isLoading: false, isSuccess: true,
    });
    renderAs(['chpl-admin']);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Does things')).toBeInTheDocument();
  });

  it('does not wait on the system triggers when they are disabled for the user', () => {
    useFetchJobTypes.mockReturnValue({ data: jobTypes, isLoading: false, isSuccess: true });
    // react-query v4 keeps a disabled query isLoading, but not isInitialLoading
    useFetchSystemTriggers.mockReturnValue({
      data: undefined, isInitialLoading: false, isLoading: true, isSuccess: false,
    });
    renderAs(['chpl-onc']);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Does things')).toBeInTheDocument();
  });
});
