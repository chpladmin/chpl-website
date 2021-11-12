import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplUserCreate from './user-create';

const hocMock = {
  dispatch: jest.fn(),
};

describe('the ChplUserCreate component', () => {
  beforeEach(async () => {
    render(
      <ChplUserCreate
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when creating a user', () => {
    it('should call the callback', async () => {
      hocMock.dispatch.mockClear();
      userEvent.type(screen.getByLabelText(/Full Name/), 'full name');
      userEvent.type(screen.getByLabelText(/Email/), 'email@sample.com');
      userEvent.type(screen.getByLabelText(/^Password/), 'hopefullyThisIsAValidPassword654');
      userEvent.type(screen.getByLabelText(/Verify Password/), 'hopefullyThisIsAValidPassword654');
      userEvent.click(screen.getByRole('button', { name: /Create account/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith(
          'create',
          {
            email: 'email@sample.com',
            friendlyName: '',
            fullName: 'full name',
            password: 'hopefullyThisIsAValidPassword654',
            passwordVerify: 'hopefullyThisIsAValidPassword654',
            phoneNumber: '',
            title: '',
          },
        );
      });
    });
  });
});
