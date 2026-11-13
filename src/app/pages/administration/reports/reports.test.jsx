import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplReports from './reports';

import { useFetchAcbs } from 'api/acbs';
import {
  useDeleteTrigger,
  useFetchJobTypes,
  useFetchUserTriggers,
  usePostTrigger,
  usePutJob,
  usePutTrigger,
} from 'api/jobs';
import { UserContext } from 'shared/contexts';

jest.mock('api/acbs', () => ({
  useFetchAcbs: jest.fn(),
}));
jest.mock('api/jobs', () => ({
  useDeleteTrigger: jest.fn(),
  useFetchJobTypes: jest.fn(),
  useFetchUserTriggers: jest.fn(),
  usePostTrigger: jest.fn(),
  usePutJob: jest.fn(),
  usePutTrigger: jest.fn(),
}));
jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: jest.fn() }),
}));

const loading = { data: undefined, isLoading: true, isSuccess: false };
const loaded = (data) => ({ data, isLoading: false, isSuccess: true });

const jobType = {
  name: 'Summary Statistics',
  description: 'Statistics about the CHPL',
  group: 'chplJobs',
  jobDataMap: {},
};

const renderReports = () => render(
  <UserContext.Provider value={{ hasAnyRole: () => true }}>
    <ChplReports />
  </UserContext.Provider>,
);

describe('the scheduled reports page', () => {
  beforeEach(() => {
    [useDeleteTrigger, usePostTrigger, usePutJob, usePutTrigger].forEach((hook) => hook.mockReturnValue({ mutate: jest.fn() }));
    useFetchAcbs.mockReturnValue(loaded({ acbs: [] }));
    useFetchJobTypes.mockReturnValue(loaded([jobType]));
    useFetchUserTriggers.mockReturnValue(loaded([]));
  });

  it('shows one skeleton for both cards while either is loading', () => {
    useFetchUserTriggers.mockReturnValue(loading);
    renderReports();
    expect(screen.getByRole('status')).toHaveTextContent('Loading scheduled reports');
    expect(screen.queryByText('Types of Reports')).not.toBeInTheDocument();
  });

  it('waits for the report types as well', () => {
    useFetchJobTypes.mockReturnValue(loading);
    renderReports();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Currently Scheduled Reports')).not.toBeInTheDocument();
  });

  it('shows both cards once everything has arrived', () => {
    renderReports();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Currently Scheduled Reports')).toBeInTheDocument();
    expect(screen.getByText('Types of Reports')).toBeInTheDocument();
    expect(screen.getByText('Summary Statistics')).toBeInTheDocument();
  });
});
