import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplRealWorldTestingCollectionPage from './real-world-testing';

const mockContext = {
  queryString: jest.fn(() => 'queryString'),
};

const mockApi = {
  isSuccess: false,
}

jest.mock('./filter-context', () => ({
  __esModule: true,
  useFilterContext: () => mockContext,
}));

jest.mock('../../../api/collections', () => ({
  __esModule: true,
  useFetchRealWorldTestingCollection: () => mockApi,
}));

jest.mock('./filter-chips', () => () => <div>Chips</div>);
jest.mock('./filter-search-term', () => () => <div>Search Term</div>);
jest.mock('./filter-panel', () => () => <div>Panel</div>);

describe('the ChplRealWorldTestingCollectionPage component', () => {
  afterEach(() => {
    cleanup();
  });

  it('has a title', async () => {
    render(
      <ChplRealWorldTestingCollectionPage />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Collections Page/)).toBeInTheDocument();
    });
  });
});
