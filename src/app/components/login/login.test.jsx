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

const KeepaliveMock = {
  ping: jest.fn(() => {}),
};

const authServiceMock = {
  getUserId: jest.fn(() => 'id'),
  saveCurrentUser: jest.fn(() => {}),
};

const networkServiceMock = {
  getUserById: jest.fn(() => Promise.resolve({ user: 'id' })),
  login: jest.fn(() => Promise.resolve({})),
};

const hocMock = {
  handleDispatch: jest.fn(() => {}),
};

const toasterMock = {
  pop: jest.fn(),
};

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue($analyticsMock);
when(angularReactHelper.getAngularService).calledWith('$rootScope').mockReturnValue($rootScopeMock);
when(angularReactHelper.getAngularService).calledWith('$stateParams').mockReturnValue($stateParamsMock);
when(angularReactHelper.getAngularService).calledWith('Idle').mockReturnValue(IdleMock);
when(angularReactHelper.getAngularService).calledWith('Keepalive').mockReturnValue(KeepaliveMock);
when(angularReactHelper.getAngularService).calledWith('authService').mockReturnValue(authServiceMock);
when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceMock);
when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceMock);
when(angularReactHelper.getAngularService).calledWith('toaster').mockReturnValue(toasterMock);

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

  describe('when logging in', () => {
    it('should trigger a bunch of things', async () => {
      userEvent.type(screen.getByLabelText(/Email/), 'email');
      userEvent.type(screen.getByLabelText(/Password/), 'password');
      userEvent.click(screen.getByRole('button', { name: /Log In/i }));

      await waitFor(() => {
        expect(networkServiceMock.login).toHaveBeenCalledWith({ userName: 'email', password: 'password' });
        expect(authServiceMock.getUserId).toHaveBeenCalled();
        expect(networkServiceMock.getUserById).toHaveBeenCalledWith('id');
        expect($analyticsMock.eventTrack).toHaveBeenCalledWith('Log In', { category: 'Authentication' });
        expect(authServiceMock.saveCurrentUser).toHaveBeenCalledWith({ user: 'id' });
        expect(IdleMock.watch).toHaveBeenCalled();
        expect(KeepaliveMock.ping).toHaveBeenCalled();
        expect($rootScopeMock.$broadcast).toHaveBeenCalledWith('loggedIn');
        expect(hocMock.handleDispatch).toHaveBeenCalledWith('loggedIn');
      });
    });
  });
});
