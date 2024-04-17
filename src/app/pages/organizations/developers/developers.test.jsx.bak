import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplDevelopers from './developers';

import * as angularReactHelper from 'services/angular-react-helper';

const angularServiceMock = {
  $go: jest.fn(),
  getDisplayDateFormat: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$state').mockReturnValue(angularServiceMock);
when(angularReactHelper.getAngularService).calledWith('DateUtil').mockReturnValue(angularServiceMock);

const mockApi = {
  isLoading: true,
  data: [],
};

jest.mock('api/developer', () => ({
  __esModule: true,
  useFetchDevelopers: () => mockApi,
}));

describe('the ChplDevelopers component', () => {
  beforeEach(async () => {
    render(
      <ChplDevelopers />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when loading', () => {
    it('should have a title', async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('View Developers');
    });
  });
});
