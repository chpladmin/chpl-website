import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { when } from 'jest-when';

import * as angularReactHelper from '../../../services/angular-react-helper';
import ChplResourcesOverview from './overview';

const $analyticsMock = {
  eventTrack: jest.fn(), // shouldn't need to mock this; this call is only made in a dependent component, but I can't figure out how to mock that dependent component
};

const networkServiceMock = {
  getAcbs: jest.fn(() => Promise.resolve({
    status: 200,
    acbs: [],
  })),
  getAnnouncements: jest.fn(() => Promise.resolve({
    status: 200,
    announcements: [],
  })),
  getAtls: jest.fn(() => Promise.resolve({
    status: 200,
    atls: [],
  })),
};

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue($analyticsMock);
when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceMock);

describe('the ChplResourcesOverview page', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(async () => {
    render(
      <ChplResourcesOverview />,
    );
  });

  describe('when rendering', () => {
    it('should have a title', async () => {
      const item = screen.queryByText(/^CHPL Overview$/i);

      await waitFor(() => {
        expect(item).not.toBe(null);
      });
    });
  });
});
