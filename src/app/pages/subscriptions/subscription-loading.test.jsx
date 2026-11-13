import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplManageSubscription from './manage-subscription';
import ChplUnsubscribeAll from './unsubscribe-all';

import {
  useDeleteObjectSubscription,
  useDeleteSubscriber,
  useDeleteSubscription,
  useFetchSubscriber,
  useFetchSubscriptions,
} from 'api/subscriptions';

jest.mock('api/subscriptions', () => ({
  useDeleteObjectSubscription: jest.fn(),
  useDeleteSubscriber: jest.fn(),
  useDeleteSubscription: jest.fn(),
  useFetchSubscriber: jest.fn(),
  useFetchSubscriptions: jest.fn(),
}));

jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: jest.fn() }),
}));

// react-query v4: a query that has not fetched yet is isLoading, and stays so
// while it is disabled; isInitialLoading is only true while it is fetching
const query = (state) => ({
  data: undefined,
  isInitialLoading: false,
  isLoading: false,
  isSuccess: false,
  ...state,
});

const subscriber = { id: 'hash', email: 'user@example.com', role: { name: 'Developer' } };

describe('managing subscriptions', () => {
  beforeEach(() => {
    useDeleteSubscription.mockReturnValue({ mutate: jest.fn() });
    useDeleteObjectSubscription.mockReturnValue({ mutate: jest.fn() });
  });

  it('shows the skeleton, not "no current subscriptions", while they load', () => {
    useFetchSubscriber.mockReturnValue(query({ isInitialLoading: true, isLoading: true }));
    useFetchSubscriptions.mockReturnValue(query({ isInitialLoading: true, isLoading: true }));
    render(<ChplManageSubscription hash="hash" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading your subscriptions');
    expect(screen.queryByText('You have no current subscriptions')).not.toBeInTheDocument();
  });

  it('does not wait forever on queries that are disabled', () => {
    useFetchSubscriber.mockReturnValue(query({ isLoading: true }));
    useFetchSubscriptions.mockReturnValue(query({ isLoading: true }));
    render(<ChplManageSubscription hash="hash" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('My Subscriptions')).toBeInTheDocument();
  });

  it('shows the page once the subscriptions arrive', () => {
    useFetchSubscriber.mockReturnValue(query({ data: subscriber, isSuccess: true }));
    useFetchSubscriptions.mockReturnValue(query({ data: [], isSuccess: true }));
    render(<ChplManageSubscription hash="hash" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('You have no current subscriptions')).toBeInTheDocument();
  });
});

describe('unsubscribing from everything', () => {
  it('shows the skeleton rather than a blank page until the request answers', () => {
    useDeleteSubscriber.mockReturnValue({ mutate: jest.fn() });
    render(<ChplUnsubscribeAll hash="hash" />);
    expect(screen.getByRole('status')).toHaveTextContent('Unsubscribing');
  });

  it('shows the result once the request answers', () => {
    useDeleteSubscriber.mockReturnValue({ mutate: (_payload, { onSuccess }) => onSuccess() });
    render(<ChplUnsubscribeAll hash="hash" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('You have been unsubscribed from all CHPL notifications')).toBeInTheDocument();
  });
});
