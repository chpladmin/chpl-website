import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplActivityView from './activity-view';

import * as angularReactHelper from 'services/angular-react-helper';

const angularMock = {
  eventTrack: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue(angularMock);

const mockContext = {
  queryString: jest.fn(() => 'queryString'),
};

const mockApi = {
  isLoading: true,
  data: {},
};

/* eslint-disable react/display-name */
jest.mock('components/filter', () => ({
  __esModule: true,
  ChplFilterChips: () => <div>Chips</div>,
  ChplFilterSearchBar: () => <div>Search Bar</div>,
  useFilterContext: () => mockContext,
}));
/* eslint-enable react/display-name */

jest.mock('api/questionable-activity', () => ({
  __esModule: true,
  useFetchActivity: () => mockApi,
}));

describe('the ChplActivityView component', () => {
  afterEach(() => {
    cleanup();
  });

  it('has a title', async () => {
    render(
      <ChplActivityView analytics={{ category: 'test' }} />,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Activity');
    });
  });
});
