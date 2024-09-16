import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';

import * as angularReactHelper from '../../services/angular-react-helper';

import ChplLogin from './login';

const $analyticsMock = {
  eventTrack: jest.fn(() => {}),
};

const $rootScopeMock = {
  $broadcast: jest.fn(() => {}),
};

const $stateParamsMock = { };

const IdleMock = {
  watch: jest.fn(() => {}),
};

const authServiceMock = {
  getUserId: jest.fn(() => 'id'),
  saveCurrentUser: jest.fn(() => {}),
  saveToken: jest.fn(() => {}),
};

const mockApi = {
  isLoading: true,
  mutate: () => {},
  data: { },
};

jest.mock('api/auth', () => ({
  __esModule: true,
  usePostChangePassword: () => mockApi,
  usePostEmailResetPassword: () => mockApi,
  usePostLogin: () => mockApi,
  usePostResetPassword: () => mockApi,
}));

const networkServiceMock = {
  getUserById: jest.fn(() => Promise.resolve({ user: 'id' })),
  login: jest.fn(() => Promise.resolve({})),
};

const hocMock = {
  handleDispatch: jest.fn(() => {}),
};

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}));

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue($analyticsMock);
when(angularReactHelper.getAngularService).calledWith('$rootScope').mockReturnValue($rootScopeMock);
when(angularReactHelper.getAngularService).calledWith('$stateParams').mockReturnValue($stateParamsMock);
when(angularReactHelper.getAngularService).calledWith('Idle').mockReturnValue(IdleMock);
when(angularReactHelper.getAngularService).calledWith('authService').mockReturnValue(authServiceMock);
when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceMock);

describe('the ChplLogin component', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(async () => {
    render(
      <ChplLogin
        dispatch={hocMock.handleDispatch}
      />,
    );
  });

  describe('when rendering', () => {
    it('should show the warning banner', async () => {
      const item = screen.getByText(/This warning banner/i);

      await waitFor(() => {
        expect(item).not.toBe(null);
      });
    });
  });

  // ignored until mocking the react-query API is figured out
  xdescribe('when logging in', () => {
    it('should trigger a bunch of things', async () => {
      userEvent.type(screen.getByLabelText(/Email/), 'email');
      userEvent.type(screen.getByLabelText(/Password/), 'password');
      userEvent.click(screen.getByRole('button', { name: /Log In/i }));

      await waitFor(() => {
        // login should switch to the react-query version of the api/auth mock
        expect(networkServiceMock.login).toHaveBeenCalledWith({ userName: 'email', password: 'password' });
        expect(authServiceMock.saveToken).toHaveBeenCalled();
        expect(authServiceMock.getUserId).toHaveBeenCalled();
        expect(networkServiceMock.getUserById).toHaveBeenCalledWith('id');
        expect($analyticsMock.eventTrack).toHaveBeenCalledWith('Log In', { category: 'Authentication' });
        expect(authServiceMock.saveCurrentUser).toHaveBeenCalledWith({ user: 'id' });
        expect(IdleMock.watch).toHaveBeenCalled();
        expect($rootScopeMock.$broadcast).toHaveBeenCalledWith('loggedIn');
        expect(hocMock.handleDispatch).toHaveBeenCalledWith('loggedIn');
      });
    });
  });
});
