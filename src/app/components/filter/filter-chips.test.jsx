import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { when } from 'jest-when';
import userEvent from '@testing-library/user-event';

import ChplFilterChips from './filter-chips';

import * as angularReactHelper from 'services/angular-react-helper';

const defaultFilter = { // this should be imported, but I don't know why it can't be
  getQuery: (filter) => `${filter.key}=${filter.values.sort((a, b) => (a.value < b.value ? -1 : 1)).map((v) => v.value).join(',')}`,
  getFilterDisplay: (filter) => filter.display,
  getValueDisplay: (value) => value.display,
  getValueEntry: () => {},
  sortValues: (filter, a, b) => (filter.getValueDisplay(a) < filter.getValueDisplay(b) ? -1 : 1),
};

const $analyticsMock = {
  eventTrack: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue($analyticsMock);

let mockValue;

jest.mock('./filter-context', () => ({
  __esModule: true,
  useFilterContext: () => mockValue,
}));

describe('the ChplFilterChips component', () => {
  beforeEach(() => {
    mockValue = {
      filters: [{
        ...defaultFilter,
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

  it('renders chips', async () => {
    render(
      <ChplFilterChips />,
    );

    await waitFor(() => {
      expect(screen.getByText('value')).toBeInTheDocument();
    });
  });

  it('does not renders chips for filters that are off', async () => {
    mockValue.filters[0].values[0].selected = false;
    render(
      <ChplFilterChips />,
    );

    await waitFor(() => {
      expect(screen.queryByText('value')).toBeNull();
    });
  });

  it('uses the dispatch function to toggle', async () => {
    render(
      <ChplFilterChips />,
    );

    userEvent.click(screen.getByText('value').nextSibling);

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
        { selected: true, value: 'whatever', display: 'whatever' },
        { selected: true, value: 'first', display: 'first' },
      ];

      render(
        <ChplFilterChips />,
      );

      await waitFor(() => {
        expect(screen.getByText('value')).toBeInTheDocument();
        expect(screen.getByText('value').parentElement.nextSibling).toHaveTextContent('whatever');
        expect(screen.getByText('value').parentElement.previousSibling).toHaveTextContent('first');
      });
    });

    it('sorts categories', async () => {
      mockValue.filters = [
        ...mockValue.filters,
        {
          ...defaultFilter,
          key: 'third',
          display: 'third',
          values: [{
            selected: true,
            value: 'value',
            display: 'value',
          }],
        }, {
          ...defaultFilter,
          key: 'first',
          display: 'a first',
          values: [{
            selected: true,
            value: 'value',
            display: 'value',
          }],
        },
      ];

      render(
        <ChplFilterChips />,
      );

      await waitFor(() => {
        expect(screen.getByText('display')).toBeInTheDocument();
        expect(screen.getByText('display').parentElement.parentElement.nextSibling).toHaveTextContent('third');
        expect(screen.getByText('display').parentElement.parentElement.previousSibling).toHaveTextContent('a first');
      });
    });
  });
});
