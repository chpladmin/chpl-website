import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';

import * as angularReactHelper from '../../services/angular-react-helper';
import ChplUserView from './user-view';

const hocMock = {
  dispatch: jest.fn(),
};

const userMock = {
  fullName: 'full name',
  email: 'email@sample.com',
};

const dateUtilMock = {
  timestampToString: jest.fn(() => 'June 1, 2020'),
};

const authServiceMock = {
  canImpersonate: jest.fn(() => true),
};

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('DateUtil').mockReturnValue(dateUtilMock);
when(angularReactHelper.getAngularService).calledWith('authService').mockReturnValue(authServiceMock);

describe('the ChplUserView component', () => {
  beforeEach(async () => {
    render(
      <ChplUserView
        user={userMock}
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when taking actions', () => {
    it('should call the callback for edit', async () => {
      hocMock.dispatch.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Edit full name/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith(
          'edit',
          userMock,
        );
      });
    });

    it('should call the callback for impersonation', async () => {
      hocMock.dispatch.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Impersonate full name/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith(
          'impersonate',
          userMock,
        );
      });
    });
  });
});
