import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplBannedDevelopersCollectionView from './banned-developers-view';

import * as angularReactHelper from 'services/angular-react-helper';

const angularMock = {
  eventTrack: jest.fn(),
  getApiKey: () => 'fake api key',
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue(angularMock);
when(angularReactHelper.getAngularService).calledWith('API').mockReturnValue('fakeMock');
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

jest.mock('api/collections', () => ({
  __esModule: true,
  useFetchBannedDevelopersCollection: () => mockApi,
  useFetchBannedDevelopersData: () => mockApi,
}));

describe('the ChplBannedDevelopersCollectionView component', () => {
  afterEach(() => {
    cleanup();
  });

  it('has a title', async () => {
    render(
      <ChplBannedDevelopersCollectionView analytics={{ category: 'test' }} />,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('API Information for 2015 Edition Products');
    });
  });
});
