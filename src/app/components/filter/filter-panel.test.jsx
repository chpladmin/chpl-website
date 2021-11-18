import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplFilterPanel from './filter-panel';

let mockValue;

jest.mock('./filter-context', () => ({
  __esModule: true,
  useFilterContext: () => mockValue,
}));

describe('the ChplFilterPanel component', () => {
  beforeEach(() => {
    mockValue = {
      filters: [{
        key: 'key',
        display: 'display',
        values: [{
          selected: true,
          value: 'value',
          display: 'value',
        }],
      }],
      dispatch: jest.fn(() => {}),
    };
  });

  afterEach(() => {
    cleanup();
  });

  describe('mechanics', () => {
    it('renders a toggle button', async () => {
      render(
        <ChplFilterPanel />,
      );

      await waitFor(() => {
        expect(screen.getByText(/Advanced Search/)).toBeInTheDocument();
      });
    });

    it('toggles the panel', async () => {
      render(
        <ChplFilterPanel />,
      );

      userEvent.click(screen.getByText(/Advanced Search/));

      await waitFor(() => {
        expect(screen.getByText(/display/)).toBeInTheDocument();
      });
    });
  });

  describe('dispatching messages', () => {
    it('uses the dispatch function to toggle filters', async () => {
      render(
        <ChplFilterPanel />,
      );

      userEvent.click(screen.getByText(/Advanced Search/));
      userEvent.click(screen.getByText(/display/));
      userEvent.click(screen.getByText(/value/));

      await waitFor(() => {
        expect(mockValue.dispatch).toHaveBeenCalledWith(
          'toggle',
          mockValue.filters[0],
          mockValue.filters[0].values[0],
        );
      });
    });

    it('uses the dispatch function to reset a filter', async () => {
      render(
        <ChplFilterPanel />,
      );

      userEvent.click(screen.getByText(/Advanced Search/));
      userEvent.click(screen.getByText(/display/));
      userEvent.click(screen.getByText(/^reset$/i));

      await waitFor(() => {
        expect(mockValue.dispatch).toHaveBeenCalledWith(
          'resetFilter',
          mockValue.filters[0],
        );
      });
    });

    it('uses the dispatch function to clear a filter', async () => {
      render(
        <ChplFilterPanel />,
      );

      userEvent.click(screen.getByText(/Advanced Search/));
      userEvent.click(screen.getByText(/display/));
      userEvent.click(screen.getByText(/clear/i));

      await waitFor(() => {
        expect(mockValue.dispatch).toHaveBeenCalledWith(
          'clearFilter',
          mockValue.filters[0],
        );
      });
    });

    it('uses the dispatch function to resetAll filters', async () => {
      render(
        <ChplFilterPanel />,
      );

      userEvent.click(screen.getByText(/Advanced Search/));
      userEvent.click(screen.getByText(/reset all filters/i));

      await waitFor(() => {
        expect(mockValue.dispatch).toHaveBeenCalledWith(
          'resetAll',
          undefined,
        );
      });
    });
  });
});
