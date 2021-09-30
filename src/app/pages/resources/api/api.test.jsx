import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { when } from 'jest-when';

import * as angularReactHelper from '../../../services/angular-react-helper';

import ChplResourcesApi from './api';

const $analyticsMock = {
  eventTrack: jest.fn(), // shouldn't need to mock this; this call is only made in a dependent component, but I can't figure out how to mock that dependent component
};

const authServiceMock = {
  hasAnyRole: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue($analyticsMock);
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
