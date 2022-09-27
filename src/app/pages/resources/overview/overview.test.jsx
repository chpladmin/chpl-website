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

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue($analyticsMock);

const mockApi = {
  isLoading: true,
  data: { },
};

jest.mock('api/acbs', () => ({
  __esModule: true,
  useFetchAcbs: () => mockApi,
}));

jest.mock('api/announcements', () => ({
  __esModule: true,
  useFetchAnnouncements: () => mockApi,
}));

jest.mock('api/atls', () => ({
  __esModule: true,
  useFetchAtls: () => mockApi,
}));

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
