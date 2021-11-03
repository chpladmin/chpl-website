import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplFilterChips from './filter-chips';

let mockValue;

jest.mock('./filter-context', () => ({
  __esModule: true,
  useFilterContext: () => mockValue,
}));

describe('the ChplFilterChips component', () => {
  beforeEach(() => {
    mockValue = {
      filters: [{
        key: 'key',
        display: 'display',
        values: [{
          selected: true,
          value: 'value',
        }],
      }],
      dispatch: jest.fn(() => {}),
    };
  });

  afterEach(() => {
    cleanup();
  });

  it('renders chips', async () => {
    render(
      <ChplFilterChips />,
    );

    await waitFor(() => {
      expect(screen.getByText('display: value')).toBeInTheDocument();
    });
  });

  it('does not renders chips for filters that are off', async () => {
    mockValue.filters[0].values[0].selected = false;
    render(
      <ChplFilterChips />,
    );

    await waitFor(() => {
      expect(screen.queryByText('display: value')).toBeNull();
    });
  });

  it('uses the dispatch function to toggle', async () => {
    render(
      <ChplFilterChips />,
    );

    userEvent.click(screen.getByText('display: value').nextSibling);

    await waitFor(() => {
      expect(mockValue.dispatch).toHaveBeenCalledWith(
        'toggle',
        mockValue.filters[0],
        mockValue.filters[0].values[0],
      );
    });
  });

  describe('when sorting', () => {
    it('sorts values inside filter categories', async () => {
      mockValue.filters[0].values = [
        ...mockValue.filters[0].values,
        { selected: true, value: 'whatever' },
        { selected: true, value: 'first' },
      ];

      render(
        <ChplFilterChips />,
      );

      await waitFor(() => {
        expect(screen.getByText('display: value')).toBeInTheDocument();
        expect(screen.getByText('display: value').parentElement.nextSibling).toHaveTextContent('display: whatever');
        expect(screen.getByText('display: value').parentElement.previousSibling).toHaveTextContent('display: first');
      });
    });

    it('sorts categories', async () => {
      mockValue.filters = [
        ...mockValue.filters,
        {
          key: 'third',
          display: 'third',
          values: [{
            selected: true,
            value: 'value',
          }],
        }, {
          key: 'first',
          display: 'first',
          values: [{
            selected: true,
            value: 'value',
          }],
        },
      ];

      render(
        <ChplFilterChips />,
      );

      await waitFor(() => {
        expect(screen.getByText('display: value')).toBeInTheDocument();
        expect(screen.getByText('display: value').parentElement.parentElement.nextSibling).toHaveTextContent('third: value');
        expect(screen.getByText('display: value').parentElement.parentElement.previousSibling).toHaveTextContent('first: value');
      });
    });
  });
});
