import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { when } from 'jest-when';

import * as angularReactHelper from '../../../services/angular-react-helper';

import ChplResourcesApi from './api';

jest.mock('swagger-ui-react', () => ({
  __esModule: true,
  default: jest.fn(() => 'swaggerUI'),
}));

jest.mock('components/util', () => ({
  __esModule: true,
  ChplLink: jest.fn(() => 'ChplLink'),
}));

const authServiceMock = {
  hasAnyRole: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('authService').mockReturnValue(authServiceMock);

describe('the ChplResourcesApi page', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(async () => {
    render(
      <ChplResourcesApi />,
    );
  });

  describe('when rendering', () => {
    it('should have a title', async () => {
      const item = screen.queryByText(/^CHPL API$/i);

      await waitFor(() => {
        expect(item).not.toBe(null);
      });
    });
  });
});
