import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplRealWorldTestingCollectionPage from './real-world-testing';

const mockContext = {
  queryString: jest.fn(() => 'queryString'),
};

const mockApi = {
  isSuccess: false,
};

/* eslint-disable react/display-name */
jest.mock('components/filter', () => ({
  __esModule: true,
  ChplFilterChips: () => () => <div>Chips</div>,
  ChplFilterPanel: () => () => <div>Panel</div>,
  ChplFilterSearchTerm: () => () => <div>Search Term</div>,
  useFilterContext: () => mockContext,
}));
/* eslint-enable react/display-name */

jest.mock('api/collections', () => ({
  __esModule: true,
  useFetchRealWorldTestingCollection: () => mockApi,
}));

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
