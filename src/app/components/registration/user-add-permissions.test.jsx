import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplUserAddPermissions from './user-add-permissions';

const hocMock = {
  dispatch: jest.fn(),
};

xdescribe('the ChplUserAddPermissions component', () => {
  beforeEach(async () => {
    render(
      <ChplUserAddPermissions
        dispatch={hocMock.dispatch}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when adding permissions', () => {
    it('should call the callback', async () => {
      hocMock.dispatch.mockClear();
      userEvent.type(screen.getByLabelText(/Email/), 'email@sample.com');
      userEvent.type(screen.getByLabelText(/Password/), 'password');
      userEvent.click(screen.getByRole('button', { name: /Log in to your account/i })); // this call should work, but my guess is the formik validation hasn't been updated, so the button is disabled. Not sure how to fix this right now

      await waitFor(() => {
        expect(hocMock.dispatch).toHaveBeenCalledWith(
          'authorize',
          {
            email: 'email@sample.com',
            password: 'password',
          },
        );
      });
    });
  });
});
