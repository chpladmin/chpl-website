import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import ChplForceChangePassword from './force-change-password';

import { usePostNewPasswordRequired } from 'api/auth';

jest.mock('api/auth', () => ({
  usePostNewPasswordRequired: jest.fn(),
}));
jest.mock('axios-jwt', () => ({
  setAuthTokens: jest.fn(),
}));
jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: jest.fn() }),
}));
jest.mock('react-cookie', () => ({
  useCookies: () => [{}, jest.fn()],
}));
// Users being forced to change their password are not logged in yet, so there is no user in the store
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => selector({ userInfo: { user: undefined } }),
}));
jest.mock('services/analytics.service', () => ({
  eventTrack: jest.fn(),
}));

// Strong enough to pass on its own, so only the user name check can reject it
const USER_NAME = 'kq7.zrvw.plmx@example-health.org';
const STRONG_PASSWORD = 'tangerine-Glacier-41-orbit';

const renderView = () => render(
  <ChplForceChangePassword dispatch={() => {}} sessionId="session" userName={USER_NAME} />,
);

const choosePassword = (password) => {
  fireEvent.change(screen.getByLabelText(/^New Password/), { target: { name: 'newPassword', value: password } });
  fireEvent.change(screen.getByLabelText(/^Verify Password/), { target: { name: 'verificationPassword', value: password } });
  fireEvent.click(screen.getByRole('button', { name: /Confirm new Password/ }));
};

describe('forced password change', () => {
  let mutate;

  beforeEach(() => {
    mutate = jest.fn();
    usePostNewPasswordRequired.mockReturnValue({ mutate });
  });

  it('accepts a strong password', async () => {
    renderView();
    choosePassword(STRONG_PASSWORD);

    await waitFor(() => expect(mutate).toHaveBeenCalledWith({
      userName: USER_NAME,
      password: STRONG_PASSWORD,
      sessionId: 'session',
    }, expect.anything()));
  });

  it('rejects the user name as the password', async () => {
    renderView();
    choosePassword(USER_NAME);

    expect(await screen.findByText('Password is not strong enough')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });
});
