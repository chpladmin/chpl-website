import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplSvapSearchView from './svap-view';

import * as angularReactHelper from 'services/angular-react-helper';

const angularMock = {
  eventTrack: jest.fn(),
  getApiKey: () => 'fake api key',
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue(angularMock);
when(angularReactHelper.getAngularService).calledWith('API').mockReturnValue('fake key');
when(angularReactHelper.getAngularService).calledWith('authService').mockReturnValue(angularMock);

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
  ChplFilterPanel: () => <div>Panel</div>,
  ChplFilterSearchTerm: () => <div>Search Term</div>,
  useFilterContext: () => mockContext,
}));
/* eslint-enable react/display-name */

jest.mock('api/searchs', () => ({
  __esModule: true,
  useFetchSearch: () => mockApi,
}));

jest.mock('api/standards', () => ({
  __esModule: true,
  useFetchSvaps: () => mockApi,
}));

describe('the ChplSvapSearchView component', () => {
  afterEach(() => {
    cleanup();
  });

  it('has a title', async () => {
    render(
      <ChplSvapSearchView analytics={{ category: 'test' }} />,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SVAP Information');
    });
  });
});
