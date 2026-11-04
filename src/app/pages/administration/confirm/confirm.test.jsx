import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplConfirm from './confirm';

import {
  useConfirmPendingListing,
  useFetchPendingListing,
  useRejectPendingListing,
} from 'api/pending-listings';

jest.mock('api/pending-listings', () => ({
  useConfirmPendingListing: jest.fn(),
  useFetchPendingListing: jest.fn(),
  useRejectPendingListing: jest.fn(),
}));
jest.mock('components/action-bar', () => ({
  ChplActionBar: () => null,
  useActionBar: () => {},
}));
// The steps have their own tests; here they only need to be told apart
jest.mock('components/listing/confirm', () => ({
  ...jest.requireActual('components/listing/confirm'),
  ChplConfirmDeveloper: () => <div>Developer step</div>,
  ChplConfirmProgress: () => null,
}));
jest.mock('notistack', () => ({
  useSnackbar: () => ({ closeSnackbar: jest.fn(), enqueueSnackbar: jest.fn() }),
}));

const pendingListing = {
  id: 1,
  chplProductNumber: '15.04.04.1234.ABCD.01.00.1.240101',
  developer: { id: 2, name: 'A Developer' },
  errorMessages: [],
  warningMessages: [],
};

describe('confirming a pending listing', () => {
  beforeEach(() => {
    useConfirmPendingListing.mockReturnValue({ mutate: jest.fn() });
    useRejectPendingListing.mockReturnValue({ mutate: jest.fn() });
  });

  it('shows the skeleton while the pending listing loads', () => {
    useFetchPendingListing.mockReturnValue({ data: undefined, isLoading: true, isSuccess: false });
    render(<ChplConfirm id={1} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading pending listing');
    expect(screen.queryByText('Developer step')).not.toBeInTheDocument();
  });

  it('opens on the developer step once the pending listing arrives', () => {
    useFetchPendingListing.mockReturnValue({ data: pendingListing, isLoading: false, isSuccess: true });
    render(<ChplConfirm id={1} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText(`Inspecting Listing: ${pendingListing.chplProductNumber}`)).toBeInTheDocument();
    expect(screen.getByText('Developer step')).toBeInTheDocument();
  });
});
