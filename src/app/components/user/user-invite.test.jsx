import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplUserInvite from './user-invite';

const hocMock = {
  dispatch: jest.fn(),
};

const rolesMock = ['ROLE_ADMIN', 'ROLE_ONC'];

describe('the ChplUserInvite component', () => {
  beforeEach(async () => {
    render(
      <ChplUserInvite
        roles={rolesMock}
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when inviting a user', () => {
    it('should call the callback', async () => {
      hocMock.dispatch.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Open User Invitation dialog/i }));
      userEvent.type(screen.getByLabelText(/Email/), 'email@sample.com');
      userEvent.click(screen.getByRole('button', { name: /ROLE/ }));
      userEvent.click(screen.getByRole('option', { name: 'ROLE_ADMIN' }));
      userEvent.click(screen.getByRole('button', { name: /Send Invite/i }));

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith(
          'invite',
          {
            email: 'email@sample.com',
            role: 'ROLE_ADMIN',
          },
        );
      });
    });
  });
});
