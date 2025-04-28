import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplChangeRequest from './change-request';

import * as angularReactHelper from 'services/angular-react-helper';

const stateMock = {
  $go: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$state').mockReturnValue(stateMock);

const mock = {
  changeRequest: {
    statuses: [{
      id: 1,
      userPermission: { authority: 'chpl-onc' },
      statusChangeDateTime: '2022-03-21T04:25:32.000',
      changeRequestStatusType: { name: 'status by onc' },
      comment: 'onc comment',
    }],
    changeRequestType: { name: 'fake' },
    developer: { name: 'a developer' },
  },
  dispatch: jest.fn(() => {}),
};

const mockApi = {
  isLoading: true,
  data: { },
  mutate: () => {},
};

jest.mock('api/change-requests', () => ({
  __esModule: true,
  useFetchChangeRequest: () => mockApi,
  useFetchChangeRequestStatusTypes: () => mockApi,
  usePutChangeRequest: () => mockApi,
}));

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}));

xdescribe('the ChplChangeRequest component', () => {
  beforeEach(async () => {
    render(
      <ChplChangeRequest
        changeRequest={mock.changeRequest}
        dispatch={mock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should exist', () => {
    expect(screen).not.toBe(null);
  });
});
