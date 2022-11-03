import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplComplaints from './complaints';

import * as angularReactHelper from 'services/angular-react-helper';
import { BreadcrumbContext } from 'shared/contexts';

const angularMock = {
  $analytics: {
    eventTrack: jest.fn(),
  },
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue(angularMock.$analytics);

const mock = {
  complaints: [],
};

const mockApi = {
  isLoading: true,
  data: { },
  mutate: () => {},
};

jest.mock('api/complaints', () => ({
  __esModule: true,
  useFetchComplaints: () => mockApi,
  usePostReportRequest: () => mockApi,
}));

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}));

const mockBreadcrumbs = {
  append: jest.fn(),
  display: jest.fn(),
  hide: jest.fn(),
};

describe('the ChplComplaints component', () => {
  beforeEach(async () => {
    render(
      <BreadcrumbContext.Provider value={mockBreadcrumbs}>
        <ChplComplaints
          bonusQuery=""
          canAdd
          disallowedFilters={[]}
        />
        ,
      </BreadcrumbContext.Provider>,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should exist', () => {
    expect(screen).not.toBe(null);
  });
});
