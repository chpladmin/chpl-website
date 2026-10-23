import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplCompareUploadedAndSystemDevelopers from './compare-uploaded-and-system-developers';
import ChplConfirmDeveloper from './confirm-developer';
import ChplConfirmListings from './confirm-listings';
import ChplConfirmProduct from './confirm-product';

import { useFetchDevelopers } from 'api/developer';
import {
  useFetchPendingListing,
  useFetchPendingListings,
  useFetchUploadedDeveloper,
  useRejectPendingListing,
} from 'api/pending-listings';
import { useFetchProductsByDeveloper } from 'api/product';

jest.mock('api/developer', () => ({
  useFetchDevelopers: jest.fn(),
}));
jest.mock('api/pending-listings', () => ({
  useFetchPendingListing: jest.fn(),
  useFetchPendingListings: jest.fn(),
  useFetchUploadedDeveloper: jest.fn(),
  useRejectPendingListing: jest.fn(),
}));
jest.mock('api/product', () => ({
  useFetchProductsByDeveloper: jest.fn(),
}));
jest.mock('components/action-bar/action-bar-messages', () => () => null);
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

const pendingListing = {
  id: 1,
  chplProductNumber: '15.04.04.1234.ABCD.01.00.1.240101',
  developer: 'A Developer',
  product: 'A Product',
  version: '1.0',
  certificationDate: 1704067200000,
  status: 'UPLOAD_SUCCESS',
  errorCount: 0,
  warningCount: 0,
};

describe('the queue of listings to confirm', () => {
  beforeEach(() => {
    useFetchPendingListing.mockReturnValue(query({}));
    useRejectPendingListing.mockReturnValue({ mutate: jest.fn() });
  });

  it('shows the skeleton, not "No products currently in queue", while the queue loads', () => {
    useFetchPendingListings.mockReturnValue(query({ isLoading: true }));
    render(<ChplConfirmListings onProcess={jest.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading products in the process of upload');
    expect(screen.queryByText('No products currently in queue')).not.toBeInTheDocument();
  });

  it('still says the queue is empty once it loads with nothing in it', () => {
    useFetchPendingListings.mockReturnValue(query({ data: [], isSuccess: true }));
    render(<ChplConfirmListings onProcess={jest.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('No products currently in queue')).toBeInTheDocument();
  });

  it('shows the queue once it arrives', () => {
    useFetchPendingListings.mockReturnValue(query({ data: [pendingListing], isSuccess: true }));
    render(<ChplConfirmListings onProcess={jest.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText(pendingListing.chplProductNumber)).toBeInTheDocument();
  });
});

describe('the developer step', () => {
  const developer = { id: 2, name: 'Existing Developer' };

  it('shows the skeleton while the developers load', () => {
    useFetchDevelopers.mockReturnValue(query({ isLoading: true }));
    render(<ChplConfirmDeveloper developer={developer} listing={{}} dispatch={jest.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading developers');
  });

  it('offers the developers once they arrive', () => {
    useFetchDevelopers.mockReturnValue(query({ data: [developer], isSuccess: true }));
    render(<ChplConfirmDeveloper developer={developer} listing={{}} dispatch={jest.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Existing Developers')).toBeInTheDocument();
  });
});

describe('the product step', () => {
  it('shows the skeleton while the developer\'s products load', () => {
    useFetchProductsByDeveloper.mockReturnValue(query({ isInitialLoading: true, isLoading: true }));
    render(<ChplConfirmProduct developer={{ id: 2 }} product={{ id: 3, name: 'A Product' }} dispatch={jest.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading products');
  });

  it('does not wait on the products of a developer that is new', () => {
    useFetchProductsByDeveloper.mockReturnValue(query({ isLoading: true }));
    render(<ChplConfirmProduct developer={{}} product={{ name: 'A Product' }} dispatch={jest.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Create A New Product')).toBeInTheDocument();
  });

  it('opens on the select once the products arrive', () => {
    const product = { id: 3, name: 'A Product' };
    useFetchProductsByDeveloper.mockReturnValue(query({ data: { products: [product] }, isSuccess: true }));
    render(<ChplConfirmProduct developer={{ id: 2 }} product={product} dispatch={jest.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Select An Existing Product')).toBeInTheDocument();
  });
});

describe('comparing the uploaded developer', () => {
  const listing = { id: 1, developer: { name: 'Existing Developer' } };

  it('shows the skeleton while the uploaded developer loads', () => {
    useFetchUploadedDeveloper.mockReturnValue(query({ isLoading: true }));
    render(<ChplCompareUploadedAndSystemDevelopers listing={listing} dispatch={jest.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading uploaded developer');
  });

  it('shows the comparison once it arrives', () => {
    useFetchUploadedDeveloper.mockReturnValue(query({ data: { name: 'Uploaded Name' }, isSuccess: true }));
    render(<ChplCompareUploadedAndSystemDevelopers listing={listing} dispatch={jest.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Uploaded Name')).toBeInTheDocument();
  });
});
